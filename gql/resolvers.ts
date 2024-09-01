import { isAfter, addMinutes } from 'date-fns'
import concertCategoryResolvers from 'src/resolvers/concertCategoryResolvers'
import concertTicketResolvers from 'src/resolvers/concertTicketResolvers'
import concertPosterResolvers from 'src/resolvers/concertPosterResolvers'
import concertResolvers from '../src/resolvers/concertResolvers'
import authResolvers from '../src/resolvers/authResolvers'
import { EmailAuthRequestService } from '../src/services'
import { Resolvers } from './resolvers-types'
import { sendEmail } from '../src/utils/mailer'
import userResolvers from '../src/resolvers/userResolvers'

const resolvers: Resolvers = {
  Query: {
    ...userResolvers.Query,
    ...concertResolvers.Query,
    ...concertCategoryResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
    ...concertResolvers.Mutation,
    ...concertCategoryResolvers.Mutation,
    ...concertTicketResolvers.Mutation,
    ...concertPosterResolvers.Mutation,
    createEmailAuthRequest: async (parent, args) => {
      const { email } = args.input
      const createdEmailAuthRequest = await EmailAuthRequestService.create({
        email,
      })
      await sendEmail({
        to: createdEmailAuthRequest.email,
        subject: 'Wamuseum 이메일 인증 번호',
        html: `Wamuseum의 이메일 인증 번호는 ${createdEmailAuthRequest.authcode}입니다. 3분내에 입력 해 주세요.`,
        smtpOptions: {
          service: process.env.MAILER_SERVICE,
          auth: {
            user: process.env.MAILER_EMAIL_ADDRESS,
            pass: process.env.MAILER_EMAIL_APP_PASSWORD,
          },
        },
      })
      return createdEmailAuthRequest
    },
    authenticateEmailAuthRequest: async (parent, args) => {
      const { email, authcode } = args.input
      const latest = await EmailAuthRequestService.getLatestByEmail(email)
      if (!latest) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '이메일 인증 요청을 다시 시도해주세요.',
        }
      }
      if (latest.authenticated) {
        return {
          __typename: 'HttpError',
          code: 409,
          message: '이미 인증 되었습니다.',
        }
      }
      if (
        isAfter(
          new Date(latest.createdAt),
          addMinutes(new Date(latest.createdAt), 3)
        )
      ) {
        return {
          __typename: 'HttpError',
          code: 410,
          message: '인증 시간이 만료되었습니다.',
        }
      }

      if (authcode === latest.authcode) {
        const result = await EmailAuthRequestService.updateAuthenticatedById(
          latest.id,
          true
        )
        return result
      }

      return {
        __typename: 'HttpError',
        code: 401,
        message: '유효하지 않은 인증번호 입니다.',
      }
    },
  },
}

export default resolvers

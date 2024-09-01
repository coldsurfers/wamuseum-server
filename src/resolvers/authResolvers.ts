import { GraphQLError } from 'graphql'
import { isAfter, addMinutes } from 'date-fns'
import { generateToken } from '../utils/generateToken'
import encryptPassword from '../utils/encryptPassword'
import { Resolvers } from '../../gql/resolvers-types'
import {
  AuthTokenService,
  EmailAuthRequestService,
  StaffService,
  UserService,
} from '../services'
import { sendEmail } from '../utils/mailer'

const authResolvers: Resolvers = {
  Mutation: {
    login: async (parent, args) => {
      const { email, password } = args.input
      const user = await UserService.getUserByEmail(email)
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { encrypted } = encryptPassword({
        plain: password,
        originalSalt: user.passwordSalt ?? undefined,
      })
      if (encrypted !== user.password) {
        return {
          __typename: 'HttpError',
          code: 401,
          message: '이메일이나 비밀번호가 일치하지 않습니다.',
        }
      }
      const authToken = await AuthTokenService.create({
        access_token: generateToken({
          id: user.id,
        }),
        refresh_token: generateToken({
          id: user.id,
        }),
        user_id: user.id,
      })
      return {
        __typename: 'UserWithAuthToken',
        user: {
          id: user.id,
          email: user.email,
          isAdmin: staff.isAuthorized,
          __typename: 'User',
        },
        authToken,
      }
    },
    logout: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const authToken = await AuthTokenService.findByUserId(user.id)
      if (!authToken) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      await AuthTokenService.delete({ id: authToken.id })
      return {
        __typename: 'User',
        id: user.id,
        email: user.email,
      }
    },
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

export default authResolvers

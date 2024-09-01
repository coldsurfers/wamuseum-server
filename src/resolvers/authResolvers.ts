import { GraphQLError } from 'graphql'
import { isAfter, addMinutes } from 'date-fns'
import { authorizeUser } from '../utils/authHelpers'
import { generateToken } from '../utils/generateToken'
import encryptPassword from '../utils/encryptPassword'
import { Resolvers } from '../../gql/resolvers-types'
import { AuthTokenService, EmailAuthRequestService } from '../services'
import { sendEmail } from '../utils/mailer'

const authResolvers: Resolvers = {
  Mutation: {
    login: async (parent, args, ctx) => {
      const { email, password } = args.input
      const { user: authorizedUser, staff: authorizedStaff } =
        await authorizeUser(ctx, {
          email,
          requiredRole: 'staff',
        })

      const { encrypted } = encryptPassword({
        plain: password,
        originalSalt: authorizedUser.passwordSalt ?? undefined,
      })
      if (encrypted !== authorizedUser.password) {
        return {
          __typename: 'HttpError',
          code: 401,
          message: '이메일이나 비밀번호가 일치하지 않습니다.',
        }
      }
      const authToken = await AuthTokenService.create({
        access_token: generateToken({
          id: authorizedUser.id ?? 0,
        }),
        refresh_token: generateToken({
          id: authorizedUser.id ?? 0,
        }),
        user_id: authorizedUser.id ?? 0,
      })
      const serializedUser = authorizedUser.serialize()
      return {
        __typename: 'UserWithAuthToken',
        user: {
          id: serializedUser.id,
          email: serializedUser.email,
          isAdmin: authorizedStaff?.isAuthorized,
          __typename: 'User',
        },
        authToken,
      }
    },
    logout: async (parent, args, ctx) => {
      const { user } = await authorizeUser(ctx, { requiredRole: 'staff' })
      const authToken = await AuthTokenService.findByUserId(user.id ?? 0)
      if (!authToken) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      await AuthTokenService.delete({ id: authToken.id })
      const serializedUser = user.serialize()
      return {
        __typename: 'User',
        id: serializedUser.id,
        email: serializedUser.email,
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
      return createdEmailAuthRequest.serialize()
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
      if (!latest.createdAt) {
        return {
          __typename: 'HttpError',
          code: 400,
          message: 'invalid createdAt value',
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

      if (!latest.id) {
        return {
          __typename: 'HttpError',
          code: 400,
          message: 'invalid id value',
        }
      }

      if (authcode === latest.authcode) {
        const result = await EmailAuthRequestService.updateAuthenticatedById(
          latest.id,
          true
        )
        return result.serialize()
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

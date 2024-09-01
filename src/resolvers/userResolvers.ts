import { CredentialsProviderSchema } from '@coldsurfers/zod-schema'
import { z } from 'zod'
import { authorizeUser } from 'src/utils/authHelpers'
import { Resolvers } from '../../gql/resolvers-types'
import { UserService } from '../services'
import { validateCreateUser } from '../utils/validate'
import encryptPassword from '../utils/encryptPassword'

const userResolvers: Resolvers = {
  Query: {
    me: async (parent, args, ctx) => {
      const { user: authorizedUser } = await authorizeUser(ctx, {
        requiredRole: 'staff',
      })
      return {
        __typename: 'User',
        id: authorizedUser.id,
        email: authorizedUser.email,
      }
    },
    user: async (parent, args, ctx) => {
      const { user: authorizedUser } = await authorizeUser(ctx, {
        requiredRole: 'staff',
      })
      return authorizedUser
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const { email, password, passwordConfirm } = args.input
      const validation = validateCreateUser({
        email,
        password,
        passwordConfirm,
      })
      if (!validation.success) {
        const error = validation.error.format()
        if (error.email) {
          return {
            __typename: 'HttpError',
            code: 400,
            message: '유효하지 않은 이메일 입니다.',
          }
        }
        if (error.password) {
          return {
            __typename: 'HttpError',
            code: 400,
            message:
              '패스워드는 최소 8자 이상, 최대 30자 이하의 영어 대소문자와 숫자를 포함하여 입력해주세요.',
          }
        }
        if (error.passwordConfirm) {
          return {
            __typename: 'HttpError',
            code: 400,
            message: '패스워드와 패스워드 확인이 일치하지 않습니다.',
          }
        }
      }

      const existing = await UserService.getUserByEmail(email)
      if (existing) {
        return {
          __typename: 'HttpError',
          code: 409,
          message: '이미 가입이 완료 된 이메일입니다',
        }
      }
      const { encrypted, salt } = encryptPassword({
        plain: args.input.password,
        originalSalt: undefined,
      })

      const createdUser = await UserService.createUser({
        email: args.input.email,
        password: encrypted,
        passwordSalt: salt,
        provider: 'credentials' satisfies z.TypeOf<
          typeof CredentialsProviderSchema
        >,
      })
      if (!createdUser.id) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: 'created.id is not existing',
        }
      }
      return createdUser
    },
  },
}

export default userResolvers

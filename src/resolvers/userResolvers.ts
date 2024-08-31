import { GraphQLError } from 'graphql'
import { CredentialsProviderSchema } from '@coldsurfers/zod-schema'
import { z } from 'zod'
import { Resolvers } from '../../gql/resolvers-types'
import { StaffService, UserService } from '../services'
import { validateCreateUser } from '../utils/validate'
import encryptPassword from '../utils/encryptPassword'

const userResolvers: Resolvers = {
  Query: {
    me: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
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
      const { isAuthorized: isAuthorizedStaff } = staff
      if (!isAuthorizedStaff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      return {
        __typename: 'User',
        id: user.id,
        email: user.email,
      }
    },
    user: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
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
      const searchedUser = await UserService.getUserById(args.id)
      if (!searchedUser || !searchedUser.id) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '해당 유저가 존재하지 않습니다.',
        }
      }
      return searchedUser
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

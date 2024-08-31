import { GraphQLError } from 'graphql'
import { generateToken } from '../utils/generateToken'
import encryptPassword from '../utils/encryptPassword'
import { Resolvers } from '../../gql/resolvers-types'
import { AuthTokenService, StaffService, UserService } from '../services'

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
  },
}

export default authResolvers

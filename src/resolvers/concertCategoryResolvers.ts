import { Resolvers } from 'gql/resolvers-types'
import { GraphQLError } from 'graphql'
import { ConcertCategoryService, StaffService, UserService } from '../services'

const concertCategoryResolvers: Resolvers = {
  Query: {
    concertCategory: async (parent, args, ctx) => {
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

      const concertCategory =
        await ConcertCategoryService.getConcertCategoryById(args.id)
      if (!concertCategory) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '해당하는 콘서트 카테고리가 없습니다.',
        }
      }
      return concertCategory
    },
    concertCategoryList: async (parent, args, ctx) => {
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
      const list = await ConcertCategoryService.getAllConcertCategories()
      return {
        list,
        __typename: 'ConcertCategoryList',
      }
    },
  },
  Mutation: {
    createConcertCategory: async (parent, args, ctx) => {
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

      const { title } = args.input
      const concertCategory = await ConcertCategoryService.create({ title })
      return concertCategory
    },
  },
}

export default concertCategoryResolvers

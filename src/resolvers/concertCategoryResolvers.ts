import { Resolvers } from 'gql/resolvers-types'
import { ConcertCategoryService } from '../services'
import { authorizeUser } from '../utils/authHelpers'

const concertCategoryResolvers: Resolvers = {
  Query: {
    concertCategory: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })

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
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const list = await ConcertCategoryService.getAllConcertCategories()
      return {
        list,
        __typename: 'ConcertCategoryList',
      }
    },
  },
  Mutation: {
    createConcertCategory: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })

      const { title } = args.input
      const concertCategory = await ConcertCategoryService.create({ title })
      return concertCategory
    },
  },
}

export default concertCategoryResolvers

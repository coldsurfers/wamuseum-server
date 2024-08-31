import { GraphQLError } from 'graphql'
import { ConcertService, StaffService, UserService } from '../services'
import { Resolvers } from '../../gql/resolvers-types'

const concertResolvers: Resolvers = {
  Query: {
    concert: async (parent, args, ctx) => {
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
      const concert = await ConcertService.getConcertById(args.id)

      if (!concert)
        return {
          __typename: 'HttpError',
          code: 404,
          message: '콘서트가 존재하지 않습니다.',
        }

      return concert
    },
    concertList: async (parent, args, ctx) => {
      const { page, limit, orderBy } = args
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
      const concerts = await ConcertService.getList({
        page,
        limit,
        orderBy: {
          createdAt: orderBy.createdAt as 'asc' | 'desc',
        },
      })
      const count = await ConcertService.getAllCount()
      return {
        __typename: 'ConcertListWithPagination',
        list: {
          __typename: 'ConcertList',
          list: concerts,
        },
        pagination: {
          __typename: 'Pagination',
          current: page,
          count: Math.ceil(count / limit),
        },
      }
    },
  },
}

export default concertResolvers

import { authorizeUser } from 'src/utils/authHelpers'
import { ConcertService } from '../services'
import { Resolvers } from '../../gql/resolvers-types'

const concertResolvers: Resolvers = {
  Query: {
    concert: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
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
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { page, limit, orderBy } = args
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
  Mutation: {
    createConcert: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const {
        concertCategoryId,
        artist,
        date,
        title,
        tickets,
        posterURLs,
        location,
      } = args.input
      const concert = await ConcertService.create({
        concertCategoryId,
        artist,
        location,
        date: new Date(date),
        title,
        tickets: tickets.map((ticket) => ({
          ...ticket,
          openDate: new Date(ticket.openDate),
        })),
        posters: posterURLs.map((url) => ({
          imageURL: url,
        })),
      })

      return concert
    },
    updateConcert: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const {
        id,
        artist,
        date,
        title,
        posterURLs,
        tickets,
        concertCategoryId,
        location,
      } = args.input
      const updated = await ConcertService.updateById(id, {
        artist,
        date: new Date(date),
        title,
        location,
        posters: posterURLs
          ? posterURLs.map((url) => ({
              imageURL: url,
            }))
          : undefined,
        tickets: tickets
          ? tickets.map((ticket) => ({
              ...ticket,
              openDate: new Date(ticket.openDate),
            }))
          : undefined,
        concertCategoryId,
      })

      return updated
    },
    removeConcert: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const existing = await ConcertService.getConcertById(args.input.id)
      if (!existing)
        return {
          __typename: 'HttpError',
          code: 404,
          message: '콘서트가 존재하지 않습니다.',
        }
      const removed = await ConcertService.deleteById(args.input.id)
      return {
        id: removed.id,
        __typename: 'RemovedConcert',
      }
    },
  },
}

export default concertResolvers

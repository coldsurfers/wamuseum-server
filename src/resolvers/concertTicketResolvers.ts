import { Resolvers } from 'gql/resolvers-types'
import { GraphQLError } from 'graphql'
import { ConcertTicketService, StaffService, UserService } from '../services'

const concertTicketResolvers: Resolvers = {
  Mutation: {
    updateConcertTicket: async (parent, args, ctx) => {
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
      const { id, openDate, seller, sellingURL } = args.input
      const updated = await ConcertTicketService.updateById(id, {
        openDate: openDate ? new Date(openDate) : undefined,
        seller: seller ?? undefined,
        sellingURL: sellingURL ?? undefined,
      })
      return updated
    },
  },
}

export default concertTicketResolvers

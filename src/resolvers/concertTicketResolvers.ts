import { Resolvers } from 'gql/resolvers-types'
import { authorizeUser } from 'src/utils/authHelpers'
import { ConcertTicketService } from '../services'

const concertTicketResolvers: Resolvers = {
  Mutation: {
    updateConcertTicket: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
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

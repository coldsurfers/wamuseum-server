import { Resolvers } from 'gql/resolvers-types'
import TicketDTO from '../dtos/TicketDTO'
import { authorizeUser } from '../utils/authHelpers'

const concertTicketResolvers: Resolvers = {
  Mutation: {
    updateConcertTicket: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { id, openDate, seller, sellingURL } = args.input
      const ticketDTO = new TicketDTO({
        id,
      })
      const updated = await ticketDTO.update({
        openDate: openDate ? new Date(openDate) : undefined,
        seller: seller ?? undefined,
        sellingURL: sellingURL ?? undefined,
      })
      return updated.serialize()
    },
  },
}

export default concertTicketResolvers

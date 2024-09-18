import ngeohash from 'ngeohash'
import { authorizeUser } from '../utils/authHelpers'
import { Resolvers } from '../../gql/resolvers-types'
import VenueDTO from '../dtos/VenueDTO'

const venueResolvers: Resolvers = {
  Mutation: {
    createVenue: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { lat, lng, name } = args.input
      const dto = new VenueDTO({
        lat,
        lng,
        name,
        geohash: ngeohash.encode(lat, lng, 12),
      })
      const created = await dto.create()
      return created.serialize()
    },
    createConcertVenue: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const venueDTO = new VenueDTO({
        id: args.input.venueId,
      })
      const connected = await venueDTO.connect(args.input.concertId)
      return connected.serialize()
    },
  },
}

export default venueResolvers

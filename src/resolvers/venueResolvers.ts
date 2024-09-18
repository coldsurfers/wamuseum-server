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
  },
}

export default venueResolvers

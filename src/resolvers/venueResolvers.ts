import ngeohash from 'ngeohash'
import SearchVenueDTO from '../dtos/SearchVenueDTO'
import { authorizeUser } from '../utils/authHelpers'
import { Resolvers } from '../../gql/resolvers-types'
import VenueDTO from '../dtos/VenueDTO'

const venueResolvers: Resolvers = {
  Query: {
    searchVenue: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { keyword } = args
      try {
        const dtos = await SearchVenueDTO.search(keyword)
        return {
          __typename: 'SearchedVenueList',
          list: dtos.map((dto) => dto.serialize()),
        }
      } catch (e) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: (e as any).toString(),
        }
      }
    },
    searchConcertVenue: async (parent, args, ctx) => {
      try {
        await authorizeUser(ctx, { requiredRole: 'staff' })
        const { keyword } = args
        const dtos = await VenueDTO.search(keyword)
        return {
          __typename: 'SearchedConcertVenueList',
          list: dtos.map((dto) => dto.serialize()),
        }
      } catch (e) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: (e as any).toString(),
        }
      }
    },
  },
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

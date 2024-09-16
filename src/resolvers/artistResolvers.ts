import { authorizeUser } from '../utils/authHelpers'
import { Resolvers } from '../../gql/resolvers-types'
import ArtistDTO from '../dtos/ArtistDTO'

const artistResolvers: Resolvers = {
  Query: {
    searchArtists: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const dtos = await ArtistDTO.searchByKeyword(args.keyword)

      return {
        __typename: 'ArtistList',
        list: dtos.map((dto) => dto.serialize()),
      }
    },
    concertArtists: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const dtos = await ArtistDTO.findListByConcertId(args.concertId)
      return {
        __typename: 'ArtistList',
        list: dtos.map((dto) => dto.serialize()),
      }
    },
  },
  Mutation: {
    createArtist: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const artistDTO = new ArtistDTO({
        name: args.input.artistName,
      })
      const created = await artistDTO.create()

      return created.serialize()
    },
    createConcertArtist: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { concertId, artistId } = args.input
      const dto = new ArtistDTO({
        id: artistId,
      })
      const connected = await dto.connect(concertId)
      return connected.serialize()
    },
  },
}

export default artistResolvers

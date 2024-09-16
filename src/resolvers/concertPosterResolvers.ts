import { Resolvers } from 'gql/resolvers-types'
import { GraphQLError } from 'graphql'
import { authorizeUser } from '../utils/authHelpers'
import PosterDTO from '../dtos/PosterDTO'

const concertPosterResolvers: Resolvers = {
  Query: {
    concertPoster: async (parent, args) => {
      const { concertId } = args
      const dtos = await PosterDTO.findByConcertId(concertId)

      return {
        __typename: 'PosterList',
        list: dtos.map((dto) => dto.serialize()),
      }
    },
  },
  Mutation: {
    createConcertPoster: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { concertId, imageURL } = args.input
      const posterDTO = new PosterDTO({
        imageURL,
      })
      const poster = await posterDTO.create({
        concertId,
      })
      if (!poster) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: 'Internal Server Error',
        }
      }
      return poster.serialize()
    },
    updateConcertPoster: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { id, imageURL } = args.input
      if (!imageURL) {
        throw new GraphQLError('invalid image url', {
          extensions: {
            code: 400,
          },
        })
      }
      const posterDTO = new PosterDTO({
        id,
      })
      const updated = await posterDTO.update({ imageURL })
      return updated.serialize()
    },
  },
}

export default concertPosterResolvers

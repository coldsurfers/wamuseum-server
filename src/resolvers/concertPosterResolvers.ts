import { Resolvers } from 'gql/resolvers-types'
import { GraphQLError } from 'graphql'
import { authorizeUser } from 'src/utils/authHelpers'
import { ConcertPosterService } from '../services'

const concertPosterResolvers: Resolvers = {
  Mutation: {
    createConcertPoster: async (parent, args, ctx) => {
      await authorizeUser(ctx, { requiredRole: 'staff' })
      const { concertId, imageURL } = args.input
      const poster = await ConcertPosterService.create({
        concertId,
        imageURL,
      })
      if (!poster) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: 'Internal Server Error',
        }
      }
      return poster
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
      const updated = await ConcertPosterService.updateImageURLById(
        id,
        imageURL
      )
      return updated
    },
  },
}

export default concertPosterResolvers

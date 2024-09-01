import { Resolvers } from 'gql/resolvers-types'
import { GraphQLError } from 'graphql'
import { ConcertPosterService, StaffService, UserService } from '../services'

const concertPosterResolvers: Resolvers = {
  Mutation: {
    createConcertPoster: async (parent, args, ctx) => {
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

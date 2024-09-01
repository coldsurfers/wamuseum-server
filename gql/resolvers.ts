import concertCategoryResolvers from 'src/resolvers/concertCategoryResolvers'
import concertTicketResolvers from 'src/resolvers/concertTicketResolvers'
import concertPosterResolvers from 'src/resolvers/concertPosterResolvers'
import concertResolvers from '../src/resolvers/concertResolvers'
import authResolvers from '../src/resolvers/authResolvers'
import { Resolvers } from './resolvers-types'
import userResolvers from '../src/resolvers/userResolvers'

const resolvers: Resolvers = {
  Query: {
    ...userResolvers.Query,
    ...concertResolvers.Query,
    ...concertCategoryResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
    ...concertResolvers.Mutation,
    ...concertCategoryResolvers.Mutation,
    ...concertTicketResolvers.Mutation,
    ...concertPosterResolvers.Mutation,
  },
}

export default resolvers

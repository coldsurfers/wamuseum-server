import { ApolloServer } from '@apollo/server'
import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { GraphqlContext } from 'gql/Context'
import typeDefs from 'gql/type-defs'
import resolvers from 'gql/resolvers'

export const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development',
})

fastify.register(
  async (instance, opts, done) => {
    const apollo = new ApolloServer<GraphqlContext>({
      typeDefs,
      resolvers,
      plugins: [fastifyApolloDrainPlugin(fastify)],
    })
    await apollo.start()
    await fastify.register(cors)

    await instance.route({
      url: '/graphql',
      method: ['POST', 'OPTIONS', 'GET'],
      handler: fastifyApolloHandler(apollo, {
        context: async (args) => ({
          token: args.headers.authorization,
        }),
      }),
    })
    done()
  },
  {
    prefix: '/api',
  }
)

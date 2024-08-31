import { ApolloServer } from '@apollo/server'

import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify'
import type {
  VercelApiHandler,
  VercelRequest,
  VercelResponse,
} from '@vercel/node'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import allowVercelCors from '../../src/utils/allowVercelCors'
import { connect, disconnect } from '../../src'
import { GraphqlContext } from '../../gql/Context'
import typeDefs from '../../gql/type-defs'
import resolvers from '../../gql/resolvers'

const fastify = Fastify({
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

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  await connect()
  await fastify.ready()
  fastify.server.emit('request', req, res)
  await disconnect()
}

export default allowVercelCors(handler)

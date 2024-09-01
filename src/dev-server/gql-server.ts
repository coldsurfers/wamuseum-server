import { ApolloServer } from '@apollo/server'
import cors from '@fastify/cors'

import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify'

import Fastify from 'fastify'

import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import dotenv from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'
import { StaffService, UserService } from '../services'
import { GraphqlContext } from '../../gql/Context'
import typeDefs from '../../gql/type-defs'
import resolvers from '../../gql/resolvers'

dotenv.config()

const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: {
    level: 'info',
  },
})

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.FSTVLLIFE_ORIGIN_KEY ?? '',
  },
})

async function main() {
  try {
    const apollo = new ApolloServer<GraphqlContext>({
      typeDefs,
      resolvers,
      plugins: [fastifyApolloDrainPlugin(fastify)],
    })
    await apollo.start()
    await fastify.register(cors)
    await fastify.route({
      url: '/api/graphql',
      method: ['POST', 'OPTIONS', 'GET'],
      handler: fastifyApolloHandler(apollo, {
        context: async (args) => ({
          token: args.headers.authorization,
        }),
      }),
    })
    await fastify.route({
      url: '/api/file-upload',
      method: 'GET',
      handler: async (req, rep) => {
        try {
          const { authorization } = req.headers
          const user = await UserService.getUserByAccessToken(
            authorization ?? ''
          )
          if (!user || !user.id) {
            return rep.status(401).send({})
          }
          const staff = await StaffService.getStaffByUserId(user.id)
          if (!staff) {
            return rep.status(403).send({})
          }
          const { filename, filetype } = req.query as {
            filename?: string
            filetype?: string
          }
          if (!filename || !filetype) return rep.status(400).send()
          const post = await createPresignedPost(s3Client, {
            Bucket: process.env.FSTVLLIFE_ORIGIN_B ?? '',
            Key: `billets/poster-thumbnails/${filename}` as string,
            Fields: {
              acl: 'public-read',
              'Content-Type': filetype,
            },
            Expires: 5, // seconds
            Conditions: [
              ['content-length-range', 0, 1048576 * 10], // up to 1 MB * 10 = 10 MB
            ],
          })
          return rep.status(200).send(post)
        } catch (e) {
          return rep.status(500).send()
        }
      },
    })

    await fastify.listen({ port: 3001 })
    fastify.log.info('server started', process.env.NODE_ENV)
  } catch (e) {
    fastify.log.error(e)
    process.exit(1)
  }
}

main()

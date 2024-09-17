import { RouteHandler } from 'fastify'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { z } from 'zod'
import { authorizeUser } from '../../src/utils/authHelpers'

const getPosterThumbnailsPresigned: RouteHandler<{
  Querystring: {
    filename: string
    filetype: string
  }
}> = async (req, rep) => {
  try {
    const querystringSchema = z.object({
      filename: z.string(),
      filetype: z.string(),
    })
    const queryValidation = querystringSchema.safeParse(req.query)
    if (!queryValidation.success) {
      return rep.status(400).send()
    }

    const { authorization } = req.headers
    await authorizeUser({ token: authorization }, { requiredRole: 'staff' })

    const { filename, filetype } = queryValidation.data

    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.FSTVLLIFE_ORIGIN_KEY ?? '',
      },
    })

    const post = await createPresignedPost(s3Client, {
      Bucket: process.env.FSTVLLIFE_ORIGIN_B ?? '',
      Key: `billets/poster-thumbnails/${filename}` as string,
      Fields: {
        acl: 'public-read',
        'Content-Type': filetype as string,
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
}

const getArtistProfileImagesPresigned: RouteHandler<{
  Querystring: {
    filename: string
    filetype: string
  }
}> = async (req, rep) => {
  try {
    const querystringSchema = z.object({
      filename: z.string(),
      filetype: z.string(),
    })
    const queryValidation = querystringSchema.safeParse(req.query)
    if (!queryValidation.success) {
      return rep.status(400).send()
    }

    const { authorization } = req.headers
    await authorizeUser({ token: authorization }, { requiredRole: 'staff' })

    const { filename, filetype } = queryValidation.data

    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.FSTVLLIFE_ORIGIN_KEY ?? '',
      },
    })

    const post = await createPresignedPost(s3Client, {
      Bucket: process.env.FSTVLLIFE_ORIGIN_B ?? '',
      Key: `billets/artist/profile-images/${filename}` as string,
      Fields: {
        acl: 'public-read',
        'Content-Type': filetype as string,
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
}

const FileUploadController = {
  getPosterThumbnailsPresigned,
  getArtistProfileImagesPresigned,
}

export default FileUploadController

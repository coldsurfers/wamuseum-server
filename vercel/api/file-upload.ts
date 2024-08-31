import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import allowVercelCors from '../../src/utils/allowVercelCors'
import { StaffService, UserService } from '../../src/services'

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  const { authorization } = req.headers

  const user = await UserService.getUserByAccessToken(authorization ?? '')
  if (!user) {
    res.status(401).send({})
    return
  }
  const staff = await StaffService.getStaffByUserId(user.id)
  if (!staff) {
    res.status(403).send({})
    return
  }

  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.FSTVLLIFE_ORIGIN_KEY ?? '',
    },
  })

  const post = await createPresignedPost(s3Client, {
    Bucket: process.env.FSTVLLIFE_ORIGIN_B ?? '',
    Key: `billets/poster-thumbnails/${req.query.filename}` as string,
    Fields: {
      acl: 'public-read',
      'Content-Type': req.query.filetype as string,
    },
    Expires: 5, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576 * 10], // up to 1 MB * 10 = 10 MB
    ],
  })

  res.status(200).json(post)
}

export default allowVercelCors(handler)

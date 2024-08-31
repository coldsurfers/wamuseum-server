import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'

const allowVercelCors =
  (fn: VercelApiHandler) => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    if (process.env.npm_lifecycle_event === 'debug') {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    } else {
      res.setHeader(
        'Access-Control-Allow-Origin',
        'https://billets-admin.coldsurf.io'
      )
    }

    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await fn(req, res)
  }

export default allowVercelCors

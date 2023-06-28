import aws from 'aws-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import { c } from '@/lib/utils'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION,
    })

    aws.config.update({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION,
      signatureVersion: 'v4',
    })

    const post = await s3.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Fields: {
        key: req.query.file,
        'content-type': req.query.content_type,
      },
      Expires: 60,
      Conditions: [
        ['content-length-range', 0, 4194304], // 4MB
      ],
    })

    return res.status(200).json(post)

  } catch (error) {
    console.log(error)
  }
}

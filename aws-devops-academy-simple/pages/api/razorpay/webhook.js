import prisma from '../../../lib/prisma'
import crypto from 'crypto'

export const config = {
  api: { bodyParser: false } // need raw body to verify signature
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  const buf = await new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk })
    req.on('end', () => resolve(data))
  })

  const signature = req.headers['x-razorpay-signature']
  const expected = crypto.createHmac('sha256', secret).update(buf).digest('hex')
  if (signature !== expected) return res.status(400).send('Invalid signature')

  const event = JSON.parse(buf)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const email = payment?.email || null

    // If email present, associate with user and create purchase
    if (email) {
      // ensure user exists
      let user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        user = await prisma.user.create({ data: { email } })
      }
      await prisma.purchase.create({
        data: {
          userId: user.id,
          orderId: payment.id,
          amount: payment.amount,
          currency: payment.currency
        }
      })
    }
  }

  res.json({ ok: true })
}

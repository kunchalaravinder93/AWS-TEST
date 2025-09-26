import razorpay from '../../../lib/razorpay'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const order = await razorpay.orders.create({
      amount: 49900, // ₹499 -> paise
      currency: 'INR',
      payment_capture: 1,
      notes: { product: 'AWS & DevOps Academy access' }
    })
    res.status(200).json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'order creation failed' })
  }
}

import Script from 'next/script'
import { useSession } from 'next-auth/react'

export default function Checkout() {
  const { data: session } = useSession()

  const startPayment = async () => {
    const res = await fetch('/api/razorpay/order', { method: 'POST' })
    const data = await res.json()
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: 'AWS & DevOps Academy',
      description: 'Course Access',
      order_id: data.id,
      handler: function (response) {
        // Razorpay returns payment_id & order_id & signature
        // but we rely on webhook to confirm & mark user paid
        alert('Payment initiated — you will get access shortly after verification.')
      },
      prefill: {
        name: session?.user?.name || '',
        email: session?.user?.email || ''
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-2xl mb-4">Buy Course — ₹499</h1>
      <p className="mb-4">Pay via UPI / PhonePe / GPay</p>
      <button onClick={startPayment} className="px-4 py-2 bg-green-600 text-white rounded">Pay ₹499</button>
      <p className="mt-6 text-sm">After successful payment webhook, system will auto-grant access to your account.</p>
    </div>
  )
}

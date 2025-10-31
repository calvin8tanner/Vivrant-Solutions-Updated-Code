import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

function buffer(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const sigHeader = req.headers['stripe-signature']
  if (!sigHeader || Array.isArray(sigHeader)) {
    return res.status(400).send('Missing stripe-signature header')
  }
  const buf: Buffer = await buffer(req)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sigHeader, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  switch(event.type){
    case 'checkout.session.completed':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      break
  }
  res.json({ received: true })
}

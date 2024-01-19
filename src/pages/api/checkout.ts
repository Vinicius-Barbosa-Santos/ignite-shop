// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../lib/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { priceId } = req.body

  if(req.method !== 'POST') {
    return res.status(405).json({error : 'Method not allowed.'})
  }

  if(!priceId) {
    res.status(400).json({error : 'Price not found.'})
  }

  const success_url = `http://localhost:3000/sucess?session_id={CHECKOUT_SESSION_ID}`
  const cancel_url = `http://localhost:3000/`

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: success_url,
    cancel_url: cancel_url,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ]
  })

  return res.status(201).json({
    checkoutUrl: checkoutSession.url
  })
}

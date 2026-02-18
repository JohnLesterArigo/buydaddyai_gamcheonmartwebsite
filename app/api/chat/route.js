
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { model, messages } = await req.json()

    // mag Send request to Cloudflare LLaMA 3 instruct
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/9f8a7826dc3f3275fb7a47f91ce02072/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        },
        body: JSON.stringify({ messages }),
      }
    )

    const data = await res.json()
    console.log('Cloudflare AI raw response:', JSON.stringify(data, null, 2))

    // The AI answer usually exists here hihi
    const aiText = data?.result?.response?.trim()

    if (!aiText) {
      console.warn('No AI text found in response')
      return NextResponse.json({ result: { response: 'AI returned empty response. Check payload or model.' } })
    }

    return NextResponse.json({ result: { response: aiText } })
  } catch (err) {
    console.error('API chat error:', err)
    return NextResponse.json({ result: { response: 'AI request failed.' } })
  }
}

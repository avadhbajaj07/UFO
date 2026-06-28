import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message, productName, productDesc } = await req.json()
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Server AI parameters not configured.' }, { status: 500 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: `You are an advanced UFO LABZ AI Lab Assistant, a premium sports nutrition specialist for a Swiss brand. Respond professionally and scientifically. You are assisting a client interested in the product: "${productName}". Short description: "${productDesc}". Recommend stack details.` 
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

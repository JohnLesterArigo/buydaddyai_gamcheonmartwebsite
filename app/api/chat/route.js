import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        headers: { 
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({ messages }),
      }
    );

    const data = await response.json();
    
    // Cloudflare returns { result: { response: "..." } }
    // We pass that exact structure back to the frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch AI" }, { status: 500 });
  }
}
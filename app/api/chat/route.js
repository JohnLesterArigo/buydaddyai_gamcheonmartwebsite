import { NextResponse } from "next/server";

export async function POST(req) {
  const sql = neon(process.env.POSTGRES_URL);

  const currentOrders = await sql`
  SELECT customer_name, status 
  FROM orders 
  WHERE status != 'Completed'
`;

const orderStatusContext = currentOrders.map(o => 
  `${o.customer_name}'s order is currently ${o.status}`
).join(". ");

// 3. Add this to your System Prompt
const systemPrompt = `
  You are the Gamcheon Mart Assistant. 
  CURRENT KITCHEN STATUS: ${orderStatusContext}.
  
  If a user asks about their order status (e.g., "Where is my order?" or "Is my food ready?"),
  check the status above. For example:
  - If status is 'Processing', tell them "It's currently in the kitchen being prepared!"
  - If status is 'Delivering', tell them "It's on the way to you now!"
`;
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
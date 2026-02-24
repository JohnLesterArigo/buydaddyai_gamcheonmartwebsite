import { neon } from '@neondatabase/serverless';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.POSTGRES_URL) {
       return NextResponse.json({ text: "Database configuration missing." }, { status: 500 });
    }

    const sql = neon(process.env.POSTGRES_URL);

    let products = [];
    let faqs = [];
    let orderStatusContext = "";
    
    try {
      const [productData, faqData, orders] = await Promise.all([
        sql`SELECT id, name, price, stock_quantity, is_best_seller, category FROM products`,
        sql`SELECT question, answer FROM ai_knowledge`,
        sql`SELECT customer_name, status FROM orders`
      ]);
      
      products = productData;
      faqs = faqData;
      orderStatusContext = orders.map(o => `${o.customer_name}: ${o.status}`).join(", ");
    } catch (dbError) {
      console.error("NEON CONNECTION FAILED:", dbError.message);
    }

    const ai_knowledge = faqs.map(f => `Question: ${f.question}\nAnswer: ${f.answer}`).join('\n\n');

    const productList = products.map(p => {
      let status = "Out of Stock";
      if (p.stock_quantity > 0) status = `${p.stock_quantity} in stock`;
      if (p.stock_quantity === -1 || p.category === 'Meals') status = "Freshly Prepared"; 
      return `- ${p.name} (ID: ${p.id}): ₱${p.price} (${status})`;
    }).join('\n');


    const systemPrompt = {
      role: "system",
      content: `Your name is Daddy, An AI Daddy Assistant for Gamcheon mart. located in digos city, Philippines. Greet with "Annyeong, Im your AI Daddy Assistant"

      KNOWLEDGE BASE (Answer questions ONLY using this data):
      ${ai_knowledge || "Location: Digos City, Philippines."}

      MANDATORY ORDER FLOW:
      1. Ask for Full Name, Delivery Address, and Payment Method (GCash/COD).
      2. Summarize the details and wait for the user to say "Confirm" or "Settle".
      3. ONLY THEN output the [ORDER_SIGNAL].

      SIGNAL STRUCTURE:
      [ORDER_SIGNAL: {"customer_name": "NAME", "address": "ADDRESS", "payment_method": "METHOD", "items": [{"id": 36, "name": "Jajangmyeon", "price": 190, "quantity": 1}], "total": 190}]

      INVENTORY:
      ${productList}


      CRITICAL RULES:
      - You are a high-precision calculator. Always multiply [Quantity] * [Price] for every item.
      - Sum all items to provide a final "Total: ₱[Amount]".
      - If an order exceeds current stock, inform the user but STILL provide the total for the requested amount.
      - Use ONLY the KNOWLEDGE BASE for store info. No hallucinations about Korea.
      - Dont Answer any Related to school stuff.
      - Avoing providing answers about essay, poem, math, science etc.
      - dont give brief summary outside store information.
      - dont give insight outside store stuff.
      - The [ORDER_SIGNAL] must be on its OWN LINE at the very end.
      - NEVER mention IDs (e.g., "ID: 20") in your natural conversation with the customer.
      - Ensure JSON is perfectly closed: ]}
      - TOTAL PRICE: Always format as "Total: ₱[Amount]" (e.g., Total: ₱190.00). Use the Philippine Peso symbol (₱).
      - ORDER SUMMARY: When summarizing before confirmation, use a clean bulleted list:  * [Quantity]x [Item Name] — ₱[Price]
      - CONFIRMATION STEP: You MUST ask the user to say "Confirm" or "Settle" before you generate the [ORDER_SIGNAL].
      - Decline non-store questions (homework, math, etc.).

      ORDER STATUS CONTEXT:
      ${orderStatusContext || "No orders found."}`
    };

    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        headers: { 
          "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ 
          messages: [systemPrompt, ...messages],
          temperature: 0,
          max_tokens: 2000,
          stream: false
        }),
      }
    );

    const data = await cfResponse.json();
    if (!data.success) return NextResponse.json({ text: "I'm having trouble thinking. Try again!" });

    return NextResponse.json({ text: data.result.response });

  } catch (error) {
    return NextResponse.json({ text: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless'; // Change this

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email'); // 📧 Get the email from the request
  const sql = neon(process.env.DATABASE_URL);

  try {
    let orders;
    if (email) {
      // ✅ Only get orders that match THIS specific email
      orders = await sql`SELECT * FROM orders WHERE user_email = ${email} ORDER BY created_at DESC`;
    } else {
      // 👑 Admin view: Get everything if no email is provided
      orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    }
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  // 1. Destructure the data coming from the frontend
  const { customer_name, user_email, phone_number, user_role, address, items, total_price } = body;
  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      INSERT INTO orders (
        customer_name, 
        user_email, 
        phone_number, -- 📝 Match this to image_622b5e
        user_role, 
        address,      -- 📝 Don't forget the address!
        items, 
        total_price, 
        status
      )
      VALUES (
        ${customer_name}, 
        ${user_email}, 
        ${phone_number}, 
        ${user_role}, 
        ${address}, 
        ${JSON.stringify(items)}, 
        ${total_price}, 
        'Pending'
      )
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order Insert Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { neon } from '@neondatabase/serverless'; // Fix 1: Use Neon
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL); // Fix 2: Initialize sql
  try {
    const rows = await sql`SELECT * FROM products ORDER BY id DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const body = await request.json();
    const { name, price, description, image_url, category, is_best_seller, stock_quantity } = body;

    await sql`
      INSERT INTO products (name, price, description, image_url, category, is_best_seller, stock_quantity)
      VALUES (${name}, ${price}, ${description}, ${image_url}, ${category}, ${is_best_seller || false}, ${stock_quantity})
    `;

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
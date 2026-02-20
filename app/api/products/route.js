export const dynamic = 'force-dynamic';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM products ORDER BY id DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, description, image_url, category, is_best_seller } = body;

    // We remove stock_quantity because it's not in your Neon screenshot
    await sql`
      INSERT INTO products (name, price, description, image_url, category, is_best_seller)
      VALUES (${name}, ${price}, ${description}, ${image_url}, ${category}, ${is_best_seller || false})
    `;

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
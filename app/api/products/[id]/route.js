import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// 1. HANDLE UPDATES (PATCH)
export async function PATCH(request, { params }) {
  try {
    // Await params for Next.js 16 compatibility
    const { id } = await params; 
    const body = await request.json();
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing in .env");
    }

    // ✅ Renamed to 'db' to avoid 'sql' naming conflicts
    const db = neon(process.env.DATABASE_URL);

    if (body.stock_quantity !== undefined) {
      // Handles RESTOCK
      await db`UPDATE products SET stock_quantity = ${Number(body.stock_quantity)} WHERE id = ${id}`;
    } 
    else if (body.is_best_seller !== undefined) {
      // Handles STAR BUTTON
      await db`UPDATE products SET is_best_seller = ${Boolean(body.is_best_seller)} WHERE id = ${id}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Backend PATCH Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. HANDLE DELETION (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params; 
    const db = neon(process.env.DATABASE_URL);

    // Using 'db' (neon) here instead of vercel/postgres for consistency
    await db`DELETE FROM products WHERE id = ${id}`;
    
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
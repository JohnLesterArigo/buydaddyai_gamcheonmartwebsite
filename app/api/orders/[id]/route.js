import { neon } from '@neondatabase/serverless';
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  // ✅ FIX: You must await params in the latest Next.js version
  const { id } = await params; 
  const orderId = Number(id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 🔄 Ensure this column matches your DB (usually 'id' or 'order_id')
    const result = await sql`
      DELETE FROM orders 
      WHERE id = ${orderId}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Order not found in database' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  // ✅ FIX: Also await params here
  const { id } = await params;
  const orderId = Number(id);

  try {
    const { status } = await request.json();
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      UPDATE orders 
      SET status = ${status} 
      WHERE id = ${orderId}
    `;

    return NextResponse.json({ message: 'Status updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
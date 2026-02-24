import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email'); // Filter by user email

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    const { rows } = await sql`
      SELECT * FROM orders WHERE user_email = ${email} ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
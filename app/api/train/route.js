import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { question, answer } = await req.json();
    const sql = neon(process.env.POSTGRES_URL);

    // This line saves it to the real database table
    await sql`INSERT INTO ai_knowledge (question, answer) VALUES (${question}, ${answer})`;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL);
  try {
    const data = await sql`SELECT * FROM ai_knowledge ORDER BY created_at DESC`;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
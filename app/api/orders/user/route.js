export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const { rows } = await sql`SELECT * FROM orders WHERE user_email = ${email} ORDER BY id DESC`;
  return NextResponse.json(rows);
}
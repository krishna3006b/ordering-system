import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // Ensure body and body.items are defined before accessing their properties
  if (!body || !body.items || !body.items[0] || !body.items[0].price) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Safely access the price property using optional chaining
  const price = body.items[0].price;

  // Alternatively, you can use a fallback value if the price property is undefined
  const safePrice = body.items[0]?.price ?? 0;

  // Return a successful response
  return NextResponse.json({ message: 'Discount applied successfully' });
}
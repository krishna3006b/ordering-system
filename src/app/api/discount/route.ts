import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  if (!body || !body.price) {
    return NextResponse.json({ error: 'Missing price in request body' }, { status: 400 });
  }

  // Rest of the code...
  const discount = calculateDiscount(body.price); // Assuming calculateDiscount is a function that calculates the discount
  return NextResponse.json({ discount });
}

function calculateDiscount(price: number) {
  // Implement the discount calculation logic here
  // For example:
  return price * 0.1;
}
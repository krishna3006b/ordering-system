import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { price } = body?.discount || {};

  if (!price) {
    return NextResponse.json({ error: 'Price is required' }, { status: 400 });
  }

  // Proceed with the discount calculation
  const discount = calculateDiscount(price);
  return NextResponse.json({ discount });
}

function calculateDiscount(price: number) {
  // Implement the discount calculation logic here
  return price * 0.1;
}
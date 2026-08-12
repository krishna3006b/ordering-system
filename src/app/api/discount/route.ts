import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { items } = body || {};
  const firstItem = items?.[0];

  if (!firstItem) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  const price = firstItem?.price || 0;

  // Proceed with the discount calculation using the safely accessed price
  const discount = calculateDiscount(price);

  return NextResponse.json({ discount });
}

// Example function to calculate discount
function calculateDiscount(price: number) {
  // Implement your discount calculation logic here
  return price * 0.1;
}
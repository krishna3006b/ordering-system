import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // Accessing properties with safe optional chaining
  const country = body?.customer?.address?.country;
  const shippingCost = body?.shippingCost;

  if (!country || !shippingCost) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Calculate shipping cost based on country
  let calculatedCost: number;
  switch (country) {
    case 'USA':
      calculatedCost = shippingCost * 1.1;
      break;
    case 'Canada':
      calculatedCost = shippingCost * 1.2;
      break;
    default:
      calculatedCost = shippingCost * 1.3;
  }

  return NextResponse.json({ calculatedCost });
}
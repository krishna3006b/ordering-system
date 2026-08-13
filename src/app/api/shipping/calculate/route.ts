import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { address } = body?.shipping || {};
  const { country } = address || {};

  if (!country) {
    return NextResponse.json({ error: 'Country is required' }, { status: 400 });
  }

  // Calculate shipping cost based on country
  const shippingCost = calculateShippingCost(country);

  return NextResponse.json({ shippingCost });
}

function calculateShippingCost(country: string) {
  // Implement shipping cost calculation logic based on country
  // For demonstration purposes, a fixed cost is returned
  return 10.99;
}
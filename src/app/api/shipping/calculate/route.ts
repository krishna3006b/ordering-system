import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  
  // Add null check for address object
  if (!body.address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }
  
  // Add null check for country property
  if (!body.address.country) {
    return NextResponse.json({ error: 'Country is required' }, { status: 400 });
  }
  
  // Rest of the code remains the same
  // Calculate shipping cost based on address and country
  const shippingCost = calculateShippingCost(body.address.country);
  
  return NextResponse.json({ shippingCost });
}

// Example function to calculate shipping cost
function calculateShippingCost(country: string) {
  // Implement logic to calculate shipping cost based on country
  return 10.99;
}
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // Safely access the 'customer' and 'address' properties using optional chaining
  const customerCountry = body.customer?.address?.country;

  if (!customerCountry) {
    // Return a 400 error if the 'country' property is missing or null
    return NextResponse.json({ error: 'Customer country is required' }, { status: 400 });
  }

  // Calculate shipping cost based on the customer's country
  const shippingCost = calculateShippingCost(customerCountry);

  return NextResponse.json({ shippingCost });
}

// Example function to calculate shipping cost based on the customer's country
function calculateShippingCost(country: string) {
  // Implement your shipping cost calculation logic here
  // For demonstration purposes, a fixed shipping cost is returned
  return 10.99;
}
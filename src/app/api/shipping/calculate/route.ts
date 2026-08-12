import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const address = body.address;
  const country = address?.country || 'Unknown';
  const city = address?.city || 'Unknown';
  const state = address?.state || 'Unknown';
  const zip = address?.zip || 'Unknown';

  // Calculate shipping cost based on address
  let shippingCost = 0;
  if (country === 'USA') {
    shippingCost = 10;
  } else if (country === 'Canada') {
    shippingCost = 20;
  } else {
    shippingCost = 30;
  }

  return NextResponse.json({
    shippingCost: shippingCost,
    address: {
      country: country,
      city: city,
      state: state,
      zip: zip,
    },
  });
}
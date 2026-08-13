import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { price } = body?.discount || {};

  if (!price) {
    return NextResponse.json({ error: 'Price is required' }, { status: 400 });
  }

  // Rest of the code...
  return NextResponse.json({ message: 'Discount applied successfully' });
}
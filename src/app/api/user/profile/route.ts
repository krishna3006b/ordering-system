import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, role } = body?.user || {};
  
  // Rest of the code...
  
  return NextResponse.json({
    email: email || null,
    role: role || null,
    // Other response data...
  });
}
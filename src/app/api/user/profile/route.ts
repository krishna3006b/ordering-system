import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { user } = body;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { email, name } = user;

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
  }

  // Use safe optional chaining and default fallbacks
  const userProfile = {
    email: email || '',
    name: name || '',
  };

  return NextResponse.json(userProfile);
}
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Regression: guest profile requests may omit user, but this destructuring
    // assumes the nested object is always present.
    const { email, role } = body.user;

    return NextResponse.json({
      email,
      role,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'ERROR', error: error.message },
      { status: 500 }
    );
  }
}

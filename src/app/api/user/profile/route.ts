// Primary Target File: src/app/api/user/profile/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Safe optional chaining and default fallbacks
    const { user } = body;
    const email = user?.email || null;
    const role = user?.role || null;

    return NextResponse.json({
      status: 'SUCCESS',
      email,
      role
    });
  } catch (error: any) {
    const errorMessage = error.message || "TypeError: Cannot destructure property 'email' of 'body.user' as it is null";
    const stackTrace = error.stack || "TypeError: Cannot destructure property 'email' of 'body.user' as it is null at POST (src/app/api/user/profile/route.ts:8:23)";
    console.error('User Profile API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/user/profile\`\n*Stack:* \`${stackTrace.split('\n')[0]} at POST (src/app/api/user/profile/route.ts:8)\`\n*Environment:* production\n*Deployment:* v1.8.3`
          })
        });
      } catch (e) {
        console.error('Failed to send Slack alert:', e);
      }
    }
    return NextResponse.json(
      { status: 'ERROR', error: errorMessage },
      { status: 500 }
    );
  }
}
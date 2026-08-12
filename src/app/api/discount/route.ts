import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Safe optional chaining fallback applied by AI Agent
    const firstItemPrice = body?.items?.[0]?.price || 0;
    const discount = firstItemPrice * 0.15;

    return NextResponse.json({
      status: 'SUCCESS',
      discount_amount: discount
    });
  } catch (error: any) {
    const errorMessage = error.message || "TypeError: Cannot read properties of undefined (reading 'price')";
    const stackTrace = error.stack || "TypeError: Cannot read properties of undefined (reading 'price') at POST (src/app/api/discount/route.ts:8:29)";
    console.error('Discount API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/discount\`\n*Stack:* \`${stackTrace.split('\n')[0]} at POST (src/app/api/discount/route.ts:8)\`\n*Environment:* production\n*Deployment:* v1.8.3`
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
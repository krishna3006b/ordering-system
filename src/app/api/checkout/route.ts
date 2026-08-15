import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Regression: guest checkout payloads no longer contain customer.address.
    // This direct access throws for guest orders and causes an HTTP 500 spike.
    const city = body.customer.address.city;

    return NextResponse.json({
      status: 'SUCCESS',
      transaction_id: 'tx_' + Math.floor(Math.random() * 1000000),
      city: city
    });
  } catch (error: any) {
    const errorMessage = error.message || "TypeError: Cannot read properties of null (reading 'address')";
    const stackTrace = error.stack || "TypeError: Cannot read properties of null (reading 'address') at POST (src/app/api/checkout/route.ts:9:33)";
    console.error('Checkout API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/checkout\`\n*Stack:* \`${stackTrace.split('\n')[0]} at POST (src/app/api/checkout/route.ts:9)\`\n*Environment:* production\n*Deployment:* v1.9.0`
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

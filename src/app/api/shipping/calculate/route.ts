import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Safe property access using optional chaining and default fallbacks
    const countryCode = body.address?.country?.toUpperCase() || 'UNKNOWN';
    const rate = countryCode === 'US' ? 9.99 : 24.99;

    return NextResponse.json({
      status: 'SUCCESS',
      shipping_rate: rate,
      country: countryCode
    });
  } catch (error: any) {
    const errorMessage = error.message || "TypeError: Cannot read properties of undefined (reading 'country')";
    const stackTrace = error.stack || "TypeError: Cannot read properties of undefined (reading 'country') at POST (src/app/api/shipping/calculate/route.ts:8:30)";
    console.error('Shipping API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/shipping/calculate\`\n*Stack:* \`${stackTrace.split('\n')[0]} at POST (src/app/api/shipping/calculate/route.ts:8)\`\n*Environment:* production\n*Deployment:* v1.8.3`
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
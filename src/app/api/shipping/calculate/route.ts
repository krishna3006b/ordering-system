import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Regression: shipping clients may send a missing address for pickup orders,
    // but this deployment assumes every request contains customer.address.
    const country = body.customer.address.country;
    const shippingCost = body.shippingCost;

    if (!country || !shippingCost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let calculatedCost: number;
    if (country === 'USA') {
      calculatedCost = shippingCost * 1.1;
    } else if (country === 'Canada') {
      calculatedCost = shippingCost * 1.2;
    } else {
      calculatedCost = shippingCost * 1.3;
    }

    return NextResponse.json({ calculatedCost });
  } catch (error: any) {
    const errorMessage = error.message || "TypeError: Cannot read properties of undefined (reading 'address')";
    const stackTrace = error.stack || "TypeError: Cannot read properties of undefined (reading 'address') at POST (src/app/api/shipping/calculate/route.ts:9:33)";
    console.error('Shipping API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/shipping/calculate\`\n*Stack:* \`${stackTrace.split('\n')[0]} at POST (src/app/api/shipping/calculate/route.ts:9)\`\n*Environment:* production\n*Deployment:* v1.9.2`
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

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.items || !body.items[0] || !body.items[0].price) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const price = body.items[0].price;

    // Regression: the checkout client began serializing numeric prices as strings.
    // This method call is valid for numbers but throws for the new API payload shape.
    const normalizedPrice = price.toFixed(2);

    return NextResponse.json({
      message: 'Discount applied successfully',
      normalizedPrice
    });
  } catch (error: any) {
    const errorMessage = error.message || 'TypeError: price.toFixed is not a function';
    const stackTrace = error.stack || 'TypeError: price.toFixed is not a function at POST (src/app/api/discount/route.ts:14:34)';
    console.error('Discount API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/discount\`\n*Stack:* \`${stackTrace.split('\n')[0]} at POST (src/app/api/discount/route.ts:14)\`\n*Environment:* production\n*Deployment:* v1.9.1`
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

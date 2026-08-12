import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Safe property access with optional chaining and default fallback
    const stock = body?.product?.stock_quantity || 0;

    return NextResponse.json({
      status: 'SUCCESS',
      in_stock: stock > 0,
      quantity: stock
    });
  } catch (error: any) {
    const errorMessage = error.message || "TypeError: Cannot read properties of null (reading 'stock_quantity')";
    const stackTrace = error.stack || "TypeError: Cannot read properties of null (reading 'stock_quantity') at POST (src/app/api/inventory/route.ts:8:24)";
    console.error('Inventory API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/inventory\`\n*Stack:* \`${stackTrace.split('\n')[0]} at POST (src/app/api/inventory/route.ts:8)\`\n*Environment:* production\n*Deployment:* v1.8.3`
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
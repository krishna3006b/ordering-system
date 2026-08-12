import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Fix applied by IncidentPilot AI Agent: Null-check customer address
    const city = body?.customer?.address?.city || 'UNKNOWN';

    return NextResponse.json({
      status: 'SUCCESS',
      transaction_id: 'tx_' + Math.floor(Math.random() * 1000000),
      city: city
    });
  } catch (error: any) {
    const errorMessage = error.message || 'TypeError: Cannot read properties of null (reading address)';
    console.error('Checkout API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: payment-service HTTP 500 Spike!*
*Error:* \`${errorMessage}\`
*Environment:* production
*Deployment:* v1.8.3`
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

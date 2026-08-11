import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🚨 BUG LOCATION: Direct property access on body.customer without null check.
    // When customer is null, this throws: TypeError: Cannot read properties of null (reading 'address')
    const city = body.customer.address.city;

    return NextResponse.json({
      status: 'SUCCESS',
      transaction_id: 'tx_' + Math.floor(Math.random() * 1000000),
      city: city
    });
  } catch (error: any) {
    const errorMessage = error.message || 'TypeError: Cannot read properties of null (reading address)';
    console.error('Checkout API Error:', errorMessage);

    // 1. Send Slack Webhook Alert
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: payment-service HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Environment:* production\n*Deployment:* v1.8.3`
          })
        });
      } catch (e) {
        console.error('Failed to send Slack alert:', e);
      }
    }

    // 2. Dispatch IncidentPilot AI Agent API
    const agentBackendUrl = process.env.AGENT_BACKEND_URL || 'http://localhost:8000/api/v1/alerts';
    try {
      await fetch(agentBackendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: 'payment-service',
          summary: errorMessage,
          severity: 'P1'
        })
      });
    } catch (e) {
      console.error('Failed to ping IncidentPilot Agent:', e);
    }

    return NextResponse.json(
      { status: 'ERROR', error: errorMessage },
      { status: 500 }
    );
  }
}

// Primary Target File: src/lib/payment-processor.ts
import { calculateOrderTax } from './tax-calculator';

export async function processOrderPayment(orderData: any) {
  const items = orderData?.items || [];
  const region = orderData?.region;

  // Calls tax calculation helper
  const taxInfo = calculateOrderTax(items, region);

  // Use safe optional chaining and fallback defaults
  const formattedTax = taxInfo?.amount?.toFixed(2) || '0.00';

  return {
    success: true,
    transaction_id: 'tx_ord_' + Math.floor(Math.random() * 1000000),
    tax_applied: formattedTax
  };
}


// Related Module File: src/app/api/order/process/route.ts
import { NextResponse } from 'next/server';
import { processOrderPayment } from '../../../../lib/payment-processor';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processOrderPayment(body);
    return NextResponse.json({ status: 'SUCCESS', result });
  } catch (error: any) {
    const errorMessage = error.message || "TypeError: Cannot read properties of null (reading 'amount')";
    const stackTrace = error.stack || "TypeError: Cannot read properties of null (reading 'amount') at processOrderPayment (src/lib/payment-processor.ts:11:25) at POST (src/app/api/order/process/route.ts:7:26)";
    console.error('Order Process API Error:', errorMessage);

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *PRODUCTION ALERT: ordering-system HTTP 500 Spike!*\n*Error:* \`${errorMessage}\`\n*Endpoint:* \`POST /api/order/process\`\n*Stack:* \`${stackTrace.split('\n')[0]} at processOrderPayment (src/lib/payment-processor.ts:11) at POST (src/app/api/order/process/route.ts:7)\`\n*Environment:* production\n*Deployment:* v1.8.3`
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
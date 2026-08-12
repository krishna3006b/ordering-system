import { calculateOrderTax } from './tax-calculator';

export async function processOrderPayment(orderData: any) {
  const items = orderData?.items || [];
  const region = orderData?.region;

  // Calls tax calculation helper
  const taxInfo = calculateOrderTax(items, region);

  // 🚨 BUG LOCATION: Direct dereference on taxInfo without checking if calculateOrderTax returned null
  const formattedTax = taxInfo.amount.toFixed(2);

  return {
    success: true,
    transaction_id: 'tx_ord_' + Math.floor(Math.random() * 1000000),
    tax_applied: formattedTax
  };
}

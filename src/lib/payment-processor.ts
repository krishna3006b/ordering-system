import { calculateOrderTax } from './tax-calculator';

export async function processOrderPayment(orderData: any) {
  const items = orderData?.items || [];
  const region = orderData?.region;

  const taxInfo = calculateOrderTax(items, region);

  // Regression: the tax service can legitimately return null when region is missing,
  // but this consumer assumes the result is always present.
  const formattedTax = taxInfo.amount.toFixed(2);

  return {
    success: true,
    transaction_id: 'tx_ord_' + Math.floor(Math.random() * 1000000),
    tax_applied: formattedTax
  };
}

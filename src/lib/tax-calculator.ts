export interface TaxResult {
  amount: number;
  rate: number;
}

export function calculateOrderTax(items: any[], region?: string): TaxResult | null {
  // 🚨 BUG: Returns null when region is missing instead of a fallback zero tax object
  if (!region) {
    return null;
  }
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const rate = region === 'CA' ? 0.08 : 0.05;
  return { amount: subtotal * rate, rate };
}

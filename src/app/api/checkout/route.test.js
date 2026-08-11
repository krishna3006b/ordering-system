const assert = require('assert');

// Simple test to verify checkout null-safety
function processCheckout(body) {
  // Safe implementation check
  const customer = body.customer || {};
  const address = customer.address || {};
  return address.city || 'UNKNOWN';
}

console.log("Running checkout unit tests...");
assert.strictEqual(processCheckout({ customer: { address: { city: 'New York' } } }), 'New York');
assert.strictEqual(processCheckout({ customer: null }), 'UNKNOWN');
console.log("ALL TESTS PASSED!");

# IncidentPilot Seeded Incident Benchmark

These branches intentionally contain isolated production-like regressions for IncidentPilot evaluation. Each incident branch starts from `main` so cases can be evaluated independently.

> Do not merge these benchmark branches into `main`. They are intentionally broken.

## Incident 01 — Guest Checkout Null Regression

**Branch:** `benchmark/incident-01-checkout-null`

**Commit:** `2cbfd2c6d2f774d2bface9139b876839050bedda`

**Trigger:** `POST /api/checkout`

**Payload:**

```json
{"customer": null}
```

**Observed symptom:** HTTP 500 / `Cannot read properties of null (reading 'address')`.

**Expected root cause:** Direct access to `body.customer.address.city` was introduced even though guest checkout requests may omit a customer/address.

**Expected fix:** Restore null-safe access and a safe city fallback without changing successful checkout behavior.

**Tests:** Basic null-safety + normal checkout.

**Capability:** Basic diagnosis, stack-trace localization, safe patch generation.

---

## Incident 02 — Cross-File Tax Null Regression

**Branch:** `benchmark/incident-02-tax-null-cross-file`

**Commit:** `4d015e26862c3c5e3ef455f7d1c7ac9a3df0d0ad`

**Trigger:** `POST /api/order/process`

**Payload:**

```json
{"items":[{"price":100}],"region":null}
```

**Observed symptom:** HTTP 500 caused by `taxInfo.amount` access.

**Expected root cause:** `tax-calculator.ts` legitimately returns `null` when region is missing, while `payment-processor.ts` assumes a non-null `TaxResult`.

**Expected fix:** Establish an explicit fallback/validation contract between tax calculation and payment processing.

**Tests:** Missing region + valid region.

**Capability:** Cross-file dependency traversal and contract reasoning.

---

## Incident 03 — Profile Null Destructuring

**Branch:** `benchmark/incident-03-profile-null`

**Commit:** `9118a3a156d0f53cbe358a720ce2ccdbabae559b`

**Trigger:** `POST /api/user/profile`

**Payload:**

```json
{"user":null}
```

**Observed symptom:** HTTP 500 from destructuring `body.user`.

**Expected root cause:** A guest/profile request can omit `user`, but the route assumes the nested object exists.

**Expected fix:** Safely handle an absent user while preserving the response contract.

**Capability:** Nested-object reasoning and defensive API handling.

---

## Incident 04 — Inventory Null Regression

**Branch:** `benchmark/incident-04-inventory-null`

**Commit:** `da6cccb4fb2f7be6f62ab79f249a78962eee10b5`

**Trigger:** `POST /api/inventory`

**Payload:**

```json
{"product":null}
```

**Observed symptom:** HTTP 500 / `Cannot read properties of null (reading 'stock_quantity')`.

**Expected root cause:** Direct access to `body.product.stock_quantity` replaced the previously defensive access.

**Expected fix:** Safely handle missing product data and preserve the inventory response contract.

**Capability:** Stack-trace diagnosis and minimal safe patching.

---

## Incident 05 — Discount API Contract Regression

**Branch:** `benchmark/incident-06-discount-contract`

**Commit:** `07dbf3f546ecb23f93b1ec74fa5afe2b1c64e64c`

**Trigger:** `POST /api/discount`

**Payload:**

```json
{"items":[{"price":"100"}]}
```

**Observed symptom:** HTTP 500 / `price.toFixed is not a function`.

**Expected root cause:** A client/API contract change serialized prices as strings, while the discount route assumes `price` is always a JavaScript number.

**Expected fix:** Normalize/validate the price representation at the API boundary before numeric formatting/calculation.

**Tests:** Numeric price + string price + invalid price.

**Capability:** API contract reasoning rather than simply adding optional chaining.

---

## Incident 06 — Shipping Address Regression

**Branch:** `benchmark/incident-07-shipping-address`

**Commit:** `4fcb4b87b2bb8ae907d8ea47426ff739cf3e3d16`

**Trigger:** `POST /api/shipping/calculate`

**Payload:**

```json
{"address":null,"shippingCost":10}
```

**Observed symptom:** HTTP 500 / missing `customer.address`.

**Expected root cause:** The shipping route assumes every request contains `customer.address`, even though pickup flows can omit an address.

**Expected fix:** Validate the request shape and handle pickup/no-address requests without turning them into server errors.

**Capability:** Request-contract reasoning and safe operational behavior.

---

## Evaluation Notes

For each branch, evaluate:

1. Did IncidentPilot retrieve the affected file/symbol in Top-K?
2. Did it identify the correct root cause?
3. Did it avoid modifying unrelated files?
4. Did the generated patch pass the sandbox tests?
5. Did it create a PR only after sandbox PASS?
6. How many tool calls and tokens were required?
7. How long did it take from incident receipt to PR?

These cases intentionally start simple. More difficult cases should be added separately for deployment regressions, misleading stack traces, historical-incident reuse, dependency traversal across multiple modules, and incidents where the correct action is escalation rather than a code change.

'use client';

import React, { useState } from 'react';
import { ShoppingBag, AlertTriangle, CheckCircle, ShieldAlert, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckout = async (simulateBug: boolean) => {
    setLoading(true);
    setResult(null);

    const payload = simulateBug
      ? { customer: null } // 🚨 Triggers Bug
      : { customer: { address: { city: 'San Francisco' } } }; // Normal flow

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult({ status: res.status, data });
    } catch (e: any) {
      setResult({ status: 500, data: { error: e.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">TechStore Checkout</h1>
              <p className="text-xs text-gray-400">Order System v1.8.3</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-mono">
            Live Demo App
          </span>
        </div>

        {/* Order Summary */}
        <div className="space-y-3 font-mono text-sm bg-gray-950/60 p-4 rounded-xl border border-gray-800">
          <div className="flex justify-between text-gray-300">
            <span>Wireless Headphones</span>
            <span>$120.00</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Ergonomic Mouse</span>
            <span>$45.00</span>
          </div>
          <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-white text-base">
            <span>Total</span>
            <span className="text-indigo-400">$165.00</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleCheckout(false)}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {loading ? 'Processing...' : 'Pay $165 (Normal Flow)'}
          </button>

          <button
            onClick={() => handleCheckout(true)}
            disabled={loading}
            className="w-full bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Simulate Guest Checkout (Triggers Bug & Slack Alert)
          </button>
        </div>

        {/* Status Result Display */}
        {result && (
          <div
            className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${
              result.status === 200
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                : 'bg-red-950/80 border-red-800 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {result.status === 200 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  HTTP 200 OK — Order Placed!
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  HTTP 500 Internal Server Error
                </>
              )}
            </div>
            <pre className="mt-2 text-[11px] overflow-x-auto bg-black/40 p-2 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>

            {result.status !== 200 && (
              <p className="text-[11px] text-red-300 font-sans mt-2 pt-1 border-t border-red-900">
                🚨 Slack Alert & IncidentPilot AI Agent Dispatched Automatically!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

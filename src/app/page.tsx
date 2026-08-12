'use client';

import React, { useState } from 'react';
import { ShoppingBag, AlertTriangle, CheckCircle, ShieldAlert, CreditCard, Tag, Package, User } from 'lucide-react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const triggerApi = async (endpoint: string, payload: any) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(endpoint, {
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
            onClick={() => triggerApi('/api/checkout', { customer: { address: { city: 'San Francisco' } } })}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {loading ? 'Processing...' : 'Pay $165 (Normal Flow)'}
          </button>

          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              🚨 AI Agent Test Bug Scenarios
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                onClick={() => triggerApi('/api/checkout', { customer: null })}
                disabled={loading}
                className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-medium py-2.5 px-3 rounded-xl flex items-center gap-2 transition disabled:opacity-50 text-xs text-left"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                1. Guest Checkout Bug
              </button>

              <button
                onClick={() => triggerApi('/api/discount', { items: [] })}
                disabled={loading}
                className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 font-medium py-2.5 px-3 rounded-xl flex items-center gap-2 transition disabled:opacity-50 text-xs text-left"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                2. Discount Calc Bug
              </button>

              <button
                onClick={() => triggerApi('/api/inventory', { product: null })}
                disabled={loading}
                className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 font-medium py-2.5 px-3 rounded-xl flex items-center gap-2 transition disabled:opacity-50 text-xs text-left"
              >
                <Package className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                3. Stock Check Bug
              </button>

              <button
                onClick={() => triggerApi('/api/user/profile', { user: null })}
                disabled={loading}
                className="bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 font-medium py-2.5 px-3 rounded-xl flex items-center gap-2 transition disabled:opacity-50 text-xs text-left"
              >
                <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                4. Profile Destructure Bug
              </button>
            </div>
          </div>
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
                  HTTP 200 OK — Success!
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

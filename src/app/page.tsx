'use client';

import React, { useState } from 'react';
import { Server, Activity, AlertTriangle, ShieldAlert, Tag, Package, User, Terminal, CheckCircle2, Zap, ArrowRight, Play, Database } from 'lucide-react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,-1)}] ${msg}`]);
  };

  const triggerApi = async (name: string, endpoint: string, payload: any) => {
    setActiveScenario(name);
    setLoading(true);
    setResult(null);
    addLog(`Initiating scenario: ${name}...`);
    addLog(`POST ${endpoint} Payload: ${JSON.stringify(payload)}`);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult({ status: res.status, data, endpoint });
      addLog(`Received HTTP ${res.status} from ${endpoint}`);
    } catch (e: any) {
      setResult({ status: 500, data: { error: e.message }, endpoint });
      addLog(`Network Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const scenarios = [
    {
      id: 'guest_checkout',
      name: 'Guest Checkout Bug',
      desc: 'Null customer payload causes missing property crash.',
      icon: <User className="w-4 h-4 text-zinc-400" />,
      color: 'hover:border-zinc-500',
      action: () => triggerApi('Guest Checkout Bug', '/api/checkout', { customer: null })
    },
    {
      id: 'discount_calc',
      name: 'Discount Calc Bug',
      desc: 'Empty items array throws divide-by-zero or map error.',
      icon: <Tag className="w-4 h-4 text-[#c8a951]" />,
      color: 'hover:border-[#c8a951]/50',
      action: () => triggerApi('Discount Calc Bug', '/api/discount', { items: [] })
    },
    {
      id: 'stock_check',
      name: 'Stock Check Bug',
      desc: 'Null product ID causes DB lookup failure.',
      icon: <Package className="w-4 h-4 text-emerald-400" />,
      color: 'hover:border-emerald-500/50',
      action: () => triggerApi('Stock Check Bug', '/api/inventory', { product: null })
    },
    {
      id: 'profile_destruct',
      name: 'Profile Destructure',
      desc: 'Undefined nested object destructuring crash.',
      icon: <Database className="w-4 h-4 text-blue-400" />,
      color: 'hover:border-blue-500/50',
      action: () => triggerApi('Profile Destructure', '/api/user/profile', { user: null })
    },
    {
      id: 'shipping_rate',
      name: 'Shipping Rate Bug',
      desc: 'Missing address fields cause calculation failure.',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      color: 'hover:border-purple-500/50',
      action: () => triggerApi('Shipping Rate Bug', '/api/shipping/calculate', { address: null })
    },
    {
      id: 'multi_file',
      name: 'Multi-File Sync Issue',
      desc: 'Complex bug spreading across Order -> Payment -> Tax lib.',
      icon: <Zap className="w-4 h-4 text-red-400" />,
      color: 'hover:border-red-500/80',
      action: () => triggerApi('Multi-File Sync Issue', '/api/order/process', { items: [{ price: 100 }], region: null })
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <Server className="w-5 h-5 text-zinc-400" />
            <h1 className="text-base font-semibold text-zinc-100 tracking-wide">TARGET APP TEST HARNESS</h1>
            <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded font-mono border border-zinc-700">
              v1.8.3
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-2">
            Isolated environment for simulating edge-case bugs and HTTP 500 spikes to test the IncidentPilot AI agent.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => triggerApi('Normal Checkout', '/api/checkout', { customer: { address: { city: 'San Francisco' } } })}
            disabled={loading}
            className="bg-[#c8a951] hover:bg-[#b09446] text-black font-semibold text-sm px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Run Normal Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Scenarios */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#c8a951]" />
              Simulated Failure Modes
            </h2>
            <span className="text-xs text-zinc-500 font-mono">6 Scenarios Available</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={s.action}
                disabled={loading}
                className={`text-left bg-zinc-900 border border-zinc-800 p-4 rounded-md transition-all group ${s.color} hover:bg-zinc-800/50 disabled:opacity-50`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                    {s.icon}
                  </div>
                  {activeScenario === s.name && loading && (
                    <span className="text-[10px] uppercase font-bold text-[#c8a951] animate-pulse">Running</span>
                  )}
                </div>
                <h3 className="font-semibold text-zinc-200 text-sm">{s.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Payload Monitor */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-md p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Payload Monitor</h2>
            <Activity className="w-4 h-4 text-zinc-500" />
          </div>
          
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-4 font-mono text-xs overflow-y-auto max-h-[300px]">
            {logs.length === 0 ? (
              <div className="text-zinc-600 italic">No network activity...</div>
            ) : (
              <div className="space-y-1">
                {logs.map((l, i) => (
                  <div key={i} className={`${l.includes('Network Error') || l.includes('HTTP 500') || l.includes('Error') ? 'text-red-400' : l.includes('HTTP 200') ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-md overflow-hidden">
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-mono text-zinc-400">Response Terminal</span>
          </div>
          {result && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
              result.status === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              HTTP {result.status}
            </span>
          )}
        </div>
        
        <div className="p-4 font-mono text-sm min-h-[150px] overflow-auto">
          {!result ? (
            <div className="text-zinc-600">Waiting for simulated trigger...</div>
          ) : result.status === 200 ? (
            <div className="text-emerald-400 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Success: Request processed seamlessly.</span>
              </div>
              <pre className="text-emerald-200/70 text-xs mt-2">{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-red-400 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Error: HTTP {result.status} triggered in <span className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">{result.endpoint}</span></span>
              </div>
              <pre className="text-red-200/70 text-xs mt-2">{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

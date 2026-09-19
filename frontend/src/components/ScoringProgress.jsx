import { useState, useEffect } from 'react';

/**
 * ScoringProgress — real-time progress indicator driven by SSE events
 * from the backend /score/stream endpoint.
 *
 * Props:
 *   isActive: boolean — whether scoring is in progress
 *   progress: object — map of completed event names from the SSE stream
 *     e.g. { monad_start: true, monad_done: true, crosschain_start: true, ... }
 */

const CHAINS = [
  { id: 'monad',    name: 'Monad',    short: 'MON',  color: '#836EF9', startEvent: 'bsc_start',        doneEvent: 'bsc_done',        icon: '⬡' },
  { id: 'ethereum', name: 'Ethereum', short: 'ETH',  color: '#627EEA', startEvent: 'crosschain_start', doneEvent: 'crosschain_done', icon: '◆' },
  { id: 'arbitrum', name: 'Arbitrum', short: 'ARB',  color: '#28A0F0', startEvent: 'crosschain_start', doneEvent: 'crosschain_done', icon: '▲' },
  { id: 'polygon',  name: 'Polygon',  short: 'POLY', color: '#8247E5', startEvent: 'crosschain_start', doneEvent: 'crosschain_done', icon: '⬟' },
  { id: 'optimism', name: 'Optimism', short: 'OP',   color: '#FF0420', startEvent: 'crosschain_start', doneEvent: 'crosschain_done', icon: '●' },
];

const STEPS = [
  {
    label: 'Querying Monad lending history...',
    sub: 'Reading on-chain borrow/repay events from Monad Testnet',
    doneEvent: 'bsc_done',
    icon: '🔗',
  },
  {
    label: 'Scanning cross-chain activity across 4 networks...',
    sub: 'Fetching DeFi transactions from ETH, ARB, POLY, OP via Allium',
    doneEvent: 'crosschain_done',
    icon: '🌐',
  },
  {
    label: 'Computing credit score via ML model...',
    sub: 'Running 12 financial risk factors through scoring engine',
    doneEvent: 'model_done',
    icon: '🧠',
  },
  {
    label: 'Publishing score on-chain to Monad...',
    sub: 'Writing final composite score to CreditOracle contract',
    doneEvent: 'push_done',
    icon: '⛓️',
  },
];

export default function ScoringProgress({ isActive, progress = {} }) {
  const [elapsed, setElapsed] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Generate random particles for the background effect
  useEffect(() => {
    if (!isActive) { setParticles([]); return; }
    const pts = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      dur: Math.random() * 3 + 2,
    }));
    setParticles(pts);
  }, [isActive]);

  if (!isActive) return null;

  let activeStepIdx = 0;
  for (let i = 0; i < STEPS.length; i++) {
    if (progress[STEPS[i].doneEvent]) activeStepIdx = i + 1;
  }
  if (progress.result) activeStepIdx = STEPS.length;

  const pct = Math.round((activeStepIdx / STEPS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Outer glow container */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0d0d0d 100%)',
          border: '1px solid rgba(131,110,249,0.25)',
          boxShadow: '0 0 60px rgba(131,110,249,0.12), 0 0 120px rgba(213,255,0,0.04)',
        }}
      >
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full opacity-30"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.id % 3 === 0 ? '#836EF9' : p.id % 3 === 1 ? '#d5ff00' : '#627EEA',
                animation: `float-particle ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Top accent bar */}
        <div
          className="h-1 w-full transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, #836EF9 0%, #d5ff00 ${pct}%, transparent ${pct}%)`,
          }}
        />

        <div className="relative p-8 md:p-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: '#d5ff00', boxShadow: '0 0 8px #d5ff00', animation: 'pulse 1.5s ease-in-out infinite' }}
                />
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#d5ff00' }}>
                  Live Analysis
                </span>
              </div>
              <h3
                className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white"
                style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}
              >
                Analyzing Wallet
              </h3>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Querying 5 blockchains in parallel · Running credit model
              </p>
            </div>

            {/* Timer */}
            <div
              className="flex flex-col items-end gap-1 px-4 py-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-3xl font-black font-mono text-white tabular-nums">{elapsed}s</span>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>elapsed</span>
            </div>
          </div>

          {/* Chain grid */}
          <div
            className="mb-8 p-5 rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Network Scan
            </p>
            <div className="flex items-stretch gap-3 flex-wrap md:flex-nowrap">
              {CHAINS.map((chain, idx) => {
                const isScanning = progress[chain.startEvent] && !progress[chain.doneEvent];
                const isDone = !!progress[chain.doneEvent];
                const isPending = !progress[chain.startEvent];

                return (
                  <div
                    key={chain.id}
                    className="flex-1 min-w-[80px] flex flex-col items-center gap-2 py-4 px-2 rounded-xl transition-all duration-500"
                    style={{
                      background: isDone
                        ? `${chain.color}15`
                        : isScanning
                        ? `${chain.color}08`
                        : 'transparent',
                      border: `1px solid ${isDone ? chain.color + '50' : isScanning ? chain.color + '30' : 'rgba(255,255,255,0.05)'}`,
                      transform: isScanning ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isDone ? `0 0 20px ${chain.color}20` : isScanning ? `0 0 12px ${chain.color}15` : 'none',
                    }}
                  >
                    {/* Chain icon/status */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500"
                      style={{
                        background: isDone ? `${chain.color}25` : isScanning ? `${chain.color}10` : 'rgba(255,255,255,0.03)',
                        color: isPending ? 'rgba(255,255,255,0.2)' : chain.color,
                      }}
                    >
                      {isDone ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isScanning ? (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: chain.color, animation: 'pulse 1s ease-in-out infinite' }}
                        />
                      ) : (
                        <span className="text-xs font-mono">{idx + 1}</span>
                      )}
                    </div>

                    {/* Chain name */}
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className="text-xs font-bold tracking-wide"
                        style={{ color: isPending ? 'rgba(255,255,255,0.25)' : chain.color }}
                      >
                        {chain.short}
                      </span>
                      <span
                        className="text-[9px] font-mono transition-all duration-300"
                        style={{ color: isDone ? '#d5ff00' : isScanning ? 'rgba(255,255,255,0.5)' : 'transparent' }}
                      >
                        {isDone ? '✓ done' : isScanning ? 'scanning' : '...'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Pipeline Progress
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: '#d5ff00' }}>
                {pct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #836EF9, #d5ff00)',
                  boxShadow: '0 0 10px rgba(213,255,0,0.4)',
                }}
              />
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const isComplete = i < activeStepIdx;
              const isCurrent = i === activeStepIdx && i < STEPS.length;

              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-500"
                  style={{
                    background: isCurrent
                      ? 'rgba(213,255,0,0.05)'
                      : isComplete
                      ? 'rgba(131,110,249,0.05)'
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isCurrent ? 'rgba(213,255,0,0.2)' : isComplete ? 'rgba(131,110,249,0.15)' : 'rgba(255,255,255,0.04)'}`,
                  }}
                >
                  {/* Status indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isComplete ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: '#836EF9', boxShadow: '0 0 12px rgba(131,110,249,0.5)' }}
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : isCurrent ? (
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: '#d5ff00' }}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: '#d5ff00', animation: 'pulse 1s ease-in-out infinite', boxShadow: '0 0 6px #d5ff00' }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full border-2"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{step.icon}</span>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: isComplete ? '#836EF9' : isCurrent ? '#ffffff' : 'rgba(255,255,255,0.25)',
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                    {(isComplete || isCurrent) && (
                      <p className="text-xs mt-1 ml-7" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {step.sub}
                      </p>
                    )}
                  </div>

                  {/* Status tag */}
                  {isComplete && (
                    <span
                      className="flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: 'rgba(131,110,249,0.15)', color: '#836EF9' }}
                    >
                      done
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      className="flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: 'rgba(213,255,0,0.12)', color: '#d5ff00' }}
                    >
                      running
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom note */}
          <div className="mt-6 text-center">
            <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Powered by Monad Testnet · {elapsed}s elapsed · Score will be written on-chain
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0px) scale(1); opacity: 0.2; }
          100% { transform: translateY(-15px) scale(1.5); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

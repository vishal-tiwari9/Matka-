export default function Header({ account, onConnect, onDisconnect, isConnecting, onReset }) {
  const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="p-4 md:p-6 pb-2">
      <header className="bg-bg-card border border-border rounded-full px-6 py-3 flex items-center justify-between shadow-lg max-w-7xl mx-auto">
        <button
        onClick={onReset}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        title="Return to home"
      >
        
        <div className="text-left flex flex-col justify-center">
          <h1 className="text-xl font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>
            Matka Protocol
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-text-muted font-medium mt-0.5">
            Onchain Credit Scoring & Undercollateralized Lending
          </p>
        </div>
      </button>

      <div className="flex items-center gap-3">
        {account ? (
          <>
            <span className="text-xs font-mono text-text-secondary bg-bg-primary px-4 py-2 rounded-full border border-border">
              {truncate(account)}
            </span>
            <button
              onClick={onDisconnect}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-accent text-black hover:bg-accent-bright transition-colors shadow-[0_0_15px_rgba(213,255,0,0.2)] disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
      </header>
    </div>
  );
}

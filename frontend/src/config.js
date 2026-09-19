// Credence Protocol — Frontend Configuration
// Contract addresses from Monad Testnet deployment

export const MONAD_TESTNET_CHAIN_ID = 10143;
export const MONAD_TESTNET_RPC = 'https://testnet-rpc.monad.xyz';

// ⚠ Update these after deploying contracts to Monad testnet
// Run: forge script script/DeployMonad.s.sol --rpc-url monad_testnet --broadcast
export const CONTRACTS = {
  registry: import.meta.env.VITE_REGISTRY_ADDRESS   || '0x0000000000000000000000000000000000000000',
  oracle:   import.meta.env.VITE_ORACLE_ADDRESS     || '0x0000000000000000000000000000000000000000',
  pool:     import.meta.env.VITE_POOL_ADDRESS       || '0x0000000000000000000000000000000000000000',
};

// Scoring API (FastAPI backend)
// In production: set VITE_API_URL to the deployed backend URL (e.g., https://credence-api.onrender.com)
// In development: empty string means Vite dev server proxies to localhost:8000
export const API_BASE = import.meta.env.VITE_API_URL || '';

// ENS resolution uses Ethereum mainnet (ENS is on L1)
// PublicNode's free Ethereum RPC — no API key, reliable for ENS
export const ENS_RPC = 'https://ethereum-rpc.publicnode.com';

// Monad Testnet network config for MetaMask
export const MONAD_TESTNET_NETWORK = {
  chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
  chainName: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: [MONAD_TESTNET_RPC],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

// Collateral ratio labels for display
export function getCollateralLabel(bps) {
  if (bps >= 15000) return { text: 'Standard DeFi', color: 'text-danger' };
  if (bps >= 12000) return { text: 'Improved', color: 'text-warning' };
  if (bps >= 10000) return { text: 'Competitive', color: 'text-yellow-400' };
  if (bps >= 8500)  return { text: 'Undercollateralized', color: 'text-accent' };
  return               { text: 'Premium', color: 'text-accent-bright' };
}

// Score color for gauge
export function getScoreColor(score) {
  if (score <= 30) return '#ef4444';
  if (score <= 60) return '#f59e0b';
  if (score <= 80) return '#10b981';
  return '#22c55e';
}

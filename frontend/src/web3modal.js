/**
 * Web3Modal configuration — provides the standard multi-wallet connection
 * modal (MetaMask, WalletConnect, Coinbase Wallet, Ledger, etc.)
 *
 * Network: Monad Testnet (Chain ID: 10143)
 */
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// WalletConnect Cloud project ID
// For production, register at https://cloud.walletconnect.com
// This is a public demo project ID — rate-limited but functional
const WALLETCONNECT_PROJECT_ID = '3e45b9ea29dd7b20e2e5e48e62e5e5d1';

const monadTestnet = {
  chainId: 10143,
  name: 'Monad Testnet',
  currency: 'MON',
  explorerUrl: 'https://testnet.monadexplorer.com',
  rpcUrl: 'https://testnet-rpc.monad.xyz',
};

const metadata = {
  name: 'Matka Protocol',
  description: 'Onchain Credit Scoring & Undercollateralized Lending on Monad',
  
  icons: [],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,    // auto-detect installed wallets
  enableInjected: true,   // MetaMask and other injected wallets
  enableCoinbase: true,   // Coinbase Wallet
});

createWeb3Modal({
  ethersConfig,
  chains: [monadTestnet],
  defaultChain: monadTestnet,
  projectId: WALLETCONNECT_PROJECT_ID,
  enableAnalytics: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#836EF9',           // Monad purple
    '--w3m-border-radius-master': '2px',
  },
});

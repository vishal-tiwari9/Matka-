# 🏺 Matka Protocol

**Unlocking Capital Efficiency in DeFi through On-chain Reputation and ZK-Proofs.**

Matka Protocol is a decentralized credit scoring oracle and undercollateralized lending platform built natively on **Monad**. By leveraging a machine-learning model trained on over 115,000 on-chain wallets and integrating off-chain Zero-Knowledge (ZK) attestations, we reduce the standard DeFi collateral requirement from 150% down to as low as 75%.

---

## 🔗 Live Deployments & Links

- **Live Application:** [https://matka-protocol.vercel.app/](https://matka-protocol.vercel.app/)
- **Backend API (Render):** [https://matka-1kr0.onrender.com](https://matka-1kr0.onrender.com)
- **GitHub Repository:** [vishal-tiwari9/Matka-](https://github.com/vishal-tiwari9/Matka-)

### Monad Testnet Smart Contracts
| Contract | Address |
|----------|---------|
| **OffchainAttestationRegistry** | `0x6B598D7dFD781e1604083Ee2a0e054d1Ef8587cf` |
| **CreditOracle** | `0xc0525BB82fEC7226dfC69fc6Be97F61162EB966E` |
| **LendingPool** | `0xA9A25451A6d760cFb0A21fAe3fbcD1be96f8f441` |

*(RPC URL: `https://testnet-rpc.monad.xyz`)*

---

## 🚨 The Core Problem: The 150% Collateral Trap

Currently, decentralized finance (DeFi) operates entirely on **pawn-shop economics**. Because blockchains are pseudonymous, protocols cannot trust borrowers. To compensate for this lack of trust, lending protocols (like Aave or Compound) require severe **overcollateralization**, typically around **150%**.

If a small business or an individual wants to borrow $1,000 to cover immediate expenses, they must lock up $1,500 of their own capital as collateral. This creates massive issues:
1. **Capital Inefficiency:** Billions of dollars are locked away in smart contracts doing nothing, rather than being deployed into the economy.
2. **Exclusionary:** It completely prices out users who actually need credit. Only "whales" who already hold massive amounts of crypto can participate efficiently.
3. **No Concept of Reputation:** A user who has flawlessly repaid 100 loans over 3 years gets the exact same borrowing terms as a brand-new wallet created 5 minutes ago.

## 💡 Our Solution: Matka Protocol

Matka introduces true trust and reputation to DeFi. We generate a **Composite Credit Score** for any wallet, allowing our lending pool to offer dynamic, undercollateralized terms to trustworthy borrowers. Instead of a flat 150% collateral ratio, highly rated users can borrow at a **75% collateral ratio**.

---

## ⚙️ The Engine: On-Chain Machine Learning

To determine creditworthiness without human bias, we trained a robust Logistic Regression machine learning model.

### Model Performance & Analytics
Our model was trained on a massive dataset of **115,687 wallets** mapped to Sybil-resistant activity and lending protocol behaviors (specifically, analyzing wallets that were cleanly managing loans versus those getting liquidated).

| Metric | Score | Note |
|--------|-------|------|
| **AUC-ROC (5-fold CV)** | **0.8182** | Excellent predictive power for default risk |
| **Precision** | 0.9508 | Extremely low false-positive rate for risk |
| **Recall** | 0.7208 | Effectively identifies true non-defaulters |
| **F1 Score** | 0.8200 | Balanced accuracy |
| **Training samples** | 115,687 | Highly representative dataset |
| **Positive class rate** | 86.3% | Target variable: Not liquidated |
| **Feature columns** | 24 | Post one-hot encoding |
| **Intercept** | +0.6724 | Baseline model intercept |

### How We Selected the Score Factors
Through extensive feature engineering and regularization, we isolated the specific on-chain behaviors that statistically correlate with safe, reliable borrowing. We extract these factors across multiple chains (Monad, Ethereum, Arbitrum, Polygon, Optimism).

Here is the exact breakdown of the factors our model uses to score a wallet in real-time, and their mathematical impact (coefficients) on the final score. 
*(Note: Negative impact means a reduction in risk/lower probability of default, thus increasing the credit score)*:

| Factor | Description / Value Bin | Impact (Coefficient) |
|--------|-------------------------|----------------------|
| **Borrowing protocol activity** | Consistent DeFi lending engagement (5-14 days) | `-1.054` (Huge score boost) |
| **Repayment consistency ratio** | Balanced repayment habits (1.1 - 2.0 ratio) | `-0.536` (Large score boost) |
| **Stablecoin allocation** | Holding 5%-50% portfolio in stablecoins | `-0.172` (Moderate boost) |
| **Cross-chain DEX activity** | 1 to 100 swaps across chains | `-0.062` (Minor boost) |
| **Recent accumulation trend** | No recent asset accumulation (0 trend) | `+0.225` (Increases risk/lowers score) |
| **Cross-chain bridge experience**| Bridged 1 time only | `+0.144` (Increases risk) |
| **Blockchain networks used** | Active on exactly 4 networks | `+0.067` (Increases risk) |
| **Loan repayment count** | 10+ loan repayments | `+0.042` (Slight risk increase*) |
| **Cross-chain TX volume** | 101 to 1000 total transactions | `+0.012` (Minor risk increase) |
| **Distinct assets borrowed** | 1 specific asset type | `Baseline (0)` |
| **Portfolio value (USD)** | $0 to $10 total wallet value | `Baseline (0)` |

*\*Note: Some counter-intuitive coefficients (like high repayment counts slightly increasing risk) occur due to the model identifying behaviors of highly leveraged yield-farmers, rather than standard retail users.*

---

## 🛡️ Pillar 2: Off-Chain ZK Attestations

On-chain history is incredibly useful, but it isn't the whole picture. Matka allows users to cryptographically prove their real-world financial health using **Zero-Knowledge Proofs (ZKPs)**.

- Users verify their traditional credit score (like FICO), real-world credit utilization, or off-chain payment history—**without doxxing their identity or SSN.**
- The proof is submitted to the `OffchainAttestationRegistry` on Monad.
- The `CreditOracle` merges the on-chain ML score with the off-chain ZK score to produce the final **Composite Credit Score**.

By building natively on **Monad Testnet**, Matka takes advantage of parallel execution. This allows our Oracle to update scores and handle high-frequency liquidations efficiently without the massive gas spikes seen on Ethereum L1.

---

## 🏗️ Architecture Stack

- **Frontend:** React, Vite, TailwindCSS (Deep Slate / Neon UI), Ethers.js v6 (Deployed on Vercel)
- **Backend / ML Pipeline:** Python, FastAPI, scikit-learn, Uvicorn (Deployed on Render)
- **Smart Contracts:** Solidity, Foundry (Deployed on Monad Testnet)
- **Data Indexing:** Parallel multi-chain fetching via Etherscan v2 APIs

---

## 🚀 Local Setup & Development

### 1. Backend (Python API)
```bash
cd pipeline
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt
python api.py
```
*The API will run on http://localhost:8000*

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*The app will run on http://localhost:3000*

### 3. Smart Contracts (Foundry)
```bash
cd contracts
forge build
# To deploy to Monad Testnet:
forge script script/DeployMonad.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key <your_pk>
```

---
*Built with ❤️ for the Hackathon.*

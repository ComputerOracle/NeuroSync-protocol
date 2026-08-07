<div align="center">

# 🧠 NeuroSync Protocol

**Verifiable Sleep Science & Cryptographic Habit Layers on Stellar Soroban**

[![Stellar](https://img.shields.io/badge/Stellar-Soroban_v21-black?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Random_Forest-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[Live Demo](#) • [Video Walkthrough](#) • [Architecture](#️-system-architecture) • [Smart Contracts](#-deployed-smart-contract-infrastructure) • [Quickstart](#-getting-started)

</div>

---

## 🌟 Overview

**NeuroSync Protocol** bridges off-chain biometric sleep telemetry with on-chain cryptographic rewards on the Stellar network. Users log daily sleep parameters—including duration, heart rate variability (HRV), resting heart rate (RHR), step count, and stress indices. 

An off-chain **Machine Learning Oracle** validates the biometric integrity using a trained Scikit-Learn Random Forest classifier, generates an Ed25519 cryptographic signature, and submits the proof through a **Gas Master Relayer**. The relayer sponsors all Stellar transaction fees (0 XLM cost to the user), executing streak recording and `$NSYNC` token distributions on Soroban smart contracts.

---

## 📸 Interactive Visual Showcase

<details open>
<summary><b>📱 1. Dashboard & Biometrics Ingestion (Dark / Light Mode)</b></summary>
<br/>

| Dark Mode UI | Light Mode UI |
| :---: | :---: |
| ![Dashboard Dark](docs/assets/dashboard-dark.png) | ![Dashboard Light](docs/assets/dashboard-light.png) |

> **Key Capabilities**: Real-time oracle status telemetry, automatic Freighter wallet truncation, interactive sleep metric inputs, and zero-gas execution badges.

</details>

<details>
<summary><b>🎁 2. Rewards Portal & On-Chain Claiming</b></summary>
<br/>

![Rewards Portal](docs/assets/rewards-portal.png)

> **Key Capabilities**: Real-time calculation of pending `$NSYNC` allocations based on active consecutive streaks, streak multiplier tier breakdown (+10%/day), and direct execution of on-chain token claims.

</details>

<details>
<summary><b>📊 3. Analytics & Biometric Ledger</b></summary>
<br/>

![Analytics & Ledger](docs/assets/analytics-insights.png)

> **Key Capabilities**: Historical daily telemetry breakdown, sleep efficiency scoring trends, circadian phase tracking, and fully searchable/sortable cryptographic proof records.

</details>

---

## 🏗️ System Architecture

```text
                              +---------------------------------------+
                              |         User Device (Freighter)       |
                              +---------------------------------------+
                                                  |
                                     1. Submit Sleep Telemetry
                                                  v
                              +---------------------------------------+
                              |     FastAPI Machine Learning Oracle   |
                              |    (Scikit-Learn RF Classifier)       |
                              +---------------------------------------+
                                                  |
                              2. Validate Telemetry & Compute Score
                              3. Sign Payload with Ed25519 Secret
                                                  v
                              +---------------------------------------+
                              |       Gas Master Relayer Service      |
                              |  (Sponsors XLM Transaction Gas Fee)   |
                              +---------------------------------------+
                                                  |
                                 4. Submit Fee-Bumped XDR Envelope
                                                  v
+-----------------------------------------------------------------------------------+
|                                Stellar Testnet Soroban                            |
|                                                                                   |
|   +-----------------------+     Cross-Contract Call     +---------------------+   |
|   |   neurosync-core      | --------------------------> |  reward_distributor |   |
|   | (Verifies Signature & |                             | (Calculates Streak  |   |
|   |  Updates Ledger)      |                             |  Bonus & Mints)     |   |
|   +-----------------------+                             +---------------------+   |
|                                                                    |              |
|                                                                    v              |
|                                                         +---------------------+   |
|                                                         |    nsync-token      |   |
|                                                         |  (Transfers $NSYNC) |   |
|                                                         +---------------------+   |
+-----------------------------------------------------------------------------------+
```

<details>
<summary><b>🔍 Deep Dive: End-to-End Cryptographic Execution Flow</b></summary>

1. **Biometric Scoring**: The user submits sleep parameters ($8.0\text{h}$ sleep, $65\text{bpm}$ RHR, $3/10$ stress, $8,000$ steps) via Next.js.
2. **Oracle Attestation**: The Python backend evaluates the parameters against `sleep_quality_model.pkl`. If valid, it computes a SHA-256 shard digest and signs it using `ORACLE_SECRET`.
3. **Gasless Fee-Bumping**: The client constructs a Soroban invocation transaction. The FastAPI relayer wraps the inner envelope in a `FeeBumpTransaction` sponsored by `RELAYER_SECRET`, eliminating XLM requirement for the user.
4. **On-Chain Verification**: The `neurosync-core` Soroban contract receives the payload and signature, executing native `env.crypto().ed25519_verify()`.
5. **Epoch & Streak Calculation**: Anchored strictly to `env.ledger().timestamp()` to prevent client clock manipulation. If valid, a cross-contract call executes `RewardDistributor::set_streak` to accrue `$NSYNC` rewards.

</details>

---

## 🧮 Mathematical & Algorithmic Foundations

### 1. Machine Learning Score Canonicalization
Let $V = [d, h, r, s, t]$ represent the biometric feature vector submitted by the client:
- $d$: Sleep Duration (hours, $0.0 \le d \le 24.0$)
- $h$: Heart Rate Variability (HRV ms, $0 \le h \le 200$)
- $r$: Resting Heart Rate (RHR bpm, $30 \le r \le 150$)
- $s$: Step Count ($0 \le s \le 100,000$)
- $t$: Self-Reported Stress Level ($1 \le t \le 10$)

The Oracle model outputs a quality prediction $Q(V) \in [1.0, 10.0]$:
$$Q(V) = \text{RandomForestClassifier}(V)$$

### 2. Day Epoch Calculation
The on-chain ledger timestamp $T_{\text{ledger}}$ is converted to an absolute epoch day index:
$$E(T_{\text{ledger}}) = \lfloor \frac{T_{\text{ledger}}}{86400} \rfloor$$

### 3. Streak Progression & Expiration Rules
Let $\Delta T = T_{\text{ledger}} - T_{\text{last}}$ be the time delta since the user's previous verified submission:
- **Valid Consecutive Day**: If $86,400 \le \Delta T \le 172,800$, streak increments: $S_{n} = S_{n-1} + 1$.
- **Same Day Re-Submission**: If $\Delta T < 86,400$, the submission is logged into history without incrementing the daily reward streak.
- **Streak Expiration**: If $\Delta T > 172,800$, the streak resets to 1: $S_{n} = 1$.

### 4. Linear Anabolic Rewards ($NSYNC)
$$\text{Reward} = (50 + \text{Streak} \times 5) \text{ \$NSYNC}$$
Daily active habit streaks scale rewards dynamically while maintaining strict day-epoch double-claim protections ($86,400\text{s}$ window).

---

## ⚡ Key Features

- **🛡️ Zero-Gas User Experience**: Native Stellar fee-bump transactions sponsored by the backend relayer allow users without XLM balances to log telemetry and interact on-chain.
- **🤖 On-Chain Cryptographic Machine Learning Verification**: Biometric data is evaluated off-chain via ML and validated on-chain inside Soroban WASM through native Ed25519 signature checks.
- **🔥 Linear Anabolic Rewards ($NSYNC)**: Dynamic habit streak scaling with epoch protections.
- **🌗 Complete Dark/Light Parity**: Dynamic glassmorphic UI built with Tailwind CSS, supporting seamless theme toggling and live network status indicators.

---

## 📜 Deployed Smart Contract Infrastructure

All smart contracts are compiled to `wasm32v1-none` and deployed to **Stellar Testnet**:

| Contract Name | Contract Identifier (ID) | Standard / Role | Explorer Direct Link |
| :--- | :--- | :--- | :--- |
| **`neurosync-core`** | `CDJ47A6P6PWCG7ZQYO3BNEQ6FLFOTSRRENEH2V5TVXDBEET7YBL4JNWG` | Core State & Ed25519 Verification | [View on StellarExpert](https://stellar.expert/explorer/testnet/contract/CDJ47A6P6PWCG7ZQYO3BNEQ6FLFOTSRRENEH2V5TVXDBEET7YBL4JNWG) |
| **`reward_distributor`** | `CC42VJLNLOCRSJHX3VXSVR3KOZG2YGFNT6TUEF2DV6TXYS6FGYMESQ3V` | Streak Logic & Reward Distribution | [View on StellarExpert](https://stellar.expert/explorer/testnet/contract/CC42VJLNLOCRSJHX3VXSVR3KOZG2YGFNT6TUEF2DV6TXYS6FGYMESQ3V) |
| **`nsync-token`** | `CCBJ36QQMCTII5O3NLCUMEU2O3T2WZAM6ZYUNT4WOHGGMOS2R7JSAHDT` | SEP-41 Fungible Token ($NSYNC, 7 Decimals) | [View on StellarExpert](https://stellar.expert/explorer/testnet/contract/CCBJ36QQMCTII5O3NLCUMEU2O3T2WZAM6ZYUNT4WOHGGMOS2R7JSAHDT) |

---

## 🖥️ Smart Contract Specifications (`lib.rs`)

### 1. `neurosync-core`
- `initialize(admin: Address, reward_distributor: Address)`: Binds core contract admin and distributor router.
- `submit_shard(user: Address, metrics_payload: Bytes, signature: Bytes)`: Verifies Ed25519 signature against `metrics_payload`, reads `env.ledger().timestamp()`, and invokes `reward_distributor`.
- `get_streak(user: Address) -> StreakData`: Returns active streak count, last timestamp, and total submitted shards.

### 2. `reward_distributor`
- `claim_rewards(user: Address) -> u128`: Calculates unallocated tokens for active epoch, mints/transfers `$NSYNC` tokens, and records claim status under `DataKey::ClaimRecord(user, day_epoch)`.
- `set_streak(user: Address, streak_count: u32)`: Invoked exclusively by `neurosync-core` via cross-contract authorization.

---

## ⚡ API Endpoint Reference (`FastAPI Relayer`)

### `POST /api/v1/submit-proof`
Evaluates sleep telemetry, signs oracle attestation payload, and submits fee-bumped XDR to Soroban RPC.

**Request Body:**
```json
{
  "user_address": "GBX...YOUR_STELLAR_ADDRESS",
  "sleep_duration": 8.0,
  "hrv_ms": 65,
  "resting_hr": 58,
  "steps": 9500,
  "stress_level": 3
}
```

**Response Payload:**
```json
{
  "status": "success",
  "tx_hash": "a1b2c3d4...",
  "sleep_score": 8.85,
  "oracle_signature": "0x9f8e7d...",
  "sponsored": true
}
```

### `GET /api/v1/participants`
Returns indexed leaderboard participants and active streak stats across all registered wallets.

---

## 📂 Repository Directory Layout

```text
NeuroSync/
├── contracts/                        # Soroban Rust Smart Contracts
│   ├── neurosync-core/               # Main Verification & State Contract
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── reward_distributor/           # Streak Logic & Distribution Router
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   └── token/                        # SEP-41 $NSYNC Token Implementation
│       ├── src/lib.rs
│       └── Cargo.toml
├── api/                              # Python FastAPI Relayer & Oracle
│   ├── index.py                      # FastAPI Routes & App Entrypoint
│   ├── relayer.py                    # Stellar SDK Fee-Bump Transaction Logic
│   ├── model.py                      # Random Forest ML Inference Wrapper
│   └── sleep_quality_model.pkl       # Trained Model Weights
├── frontend/                         # Next.js Web3 Application
│   ├── src/
│   │   ├── app/                      # App Router (Dashboard, Rewards, Analytics, Docs, Leaderboard)
│   │   ├── components/               # React Glassmorphic Components
│   │   ├── context/                  # WalletContext & Freighter Provider
│   │   └── utils/                    # Stellar SDK & Soroban RPC Wrappers
│   ├── public/                       # Assets & Static Branding
│   └── package.json
├── docs/                             # Documentation & Screenshot Assets
│   └── assets/                       # UI Screenshots for README Showcase
│       ├── analytics-insights.png
│       ├── dashboard-dark.png
│       ├── dashboard-light.png
│       └── rewards-portal.png
├── Dockerfile                        # Multi-stage Docker Container for Backend Relayer
├── requirements.txt                  # Python Backend Dependencies
├── Cargo.toml                        # Rust Workspace Manifest
└── README.md                         # Protocol Documentation
```

---

## 🛡️ Security Audit & Hardening Record

| Issue Identified | Root Cause | Implemented Resolution | Status |
| :--- | :--- | :--- | :---: |
| **Client Timestamp Spoofing** | Contract accepted `current_timestamp` parameter from client | Replaced with `env.ledger().timestamp()` on-chain | 🟢 Fixed |
| **Subprocess Execution Crash** | Relayer called local `/home/.../stellar` CLI binary | Replaced with native Python `stellar-sdk` async calls | 🟢 Fixed |
| **Soroban Storage Retention** | Keys expired after default ~31-day window | Integrated `extend_ttl(172_800, 518_400)` calls | 🟢 Fixed |
| **Parameter Length Mismatch** | Frontend passed 4 args to updated 3-arg contract | Updated `ScVal` builder in `src/utils/stellar.ts` | 🟢 Fixed |
| **1970 Date Parsing Bug** | `new Date(timestamp)` received raw seconds | Converted seconds to milliseconds (`timestamp * 1000`) | 🟢 Fixed |

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **Python**: `v3.10` or higher
- **Rust**: `1.78.0` with `wasm32v1-none` compilation target
- **Stellar CLI**: Installed locally

<details>
<summary><b>🔧 1. Backend Relayer & ML Oracle Setup</b></summary>

```bash
# Navigate to repository root
cd NeuroSync

# Create virtual environment & activate
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI relayer server
uvicorn api.index:app --reload --port 8000
```

</details>

<details>
<summary><b>💻 2. Next.js Web Frontend Setup</b></summary>

```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Run Next.js development server
npm run dev
```

Open `http://localhost:3000` in your browser.

</details>

<details>
<summary><b>🦀 3. Smart Contract Compilation & Test Suite</b></summary>

```bash
# Compile all workspace contracts to WASM target
cargo build --target wasm32v1-none --release

# Run Rust unit test suite
cargo test
```

</details>

---

## 🔐 Environment Variables Specification

### Frontend Environment (`frontend/.env.local`)

```env
NEXT_PUBLIC_GAS_MASTER_URL=http://localhost:8000
NEXT_PUBLIC_CONTRACT_ID=CDJ47A6P6PWCG7ZQYO3BNEQ6FLFOTSRRENEH2V5TVXDBEET7YBL4JNWG
NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ID=CC42VJLNLOCRSJHX3VXSVR3KOZG2YGFNT6TUEF2DV6TXYS6FGYMESQ3V
NEXT_PUBLIC_TOKEN_CONTRACT_ID=CCBJ36QQMCTII5O3NLCUMEU2O3T2WZAM6ZYUNT4WOHGGMOS2R7JSAHDT
```

### Backend Relayer Environment (`.env`)

```env
ORACLE_SECRET=S...   # Ed25519 Secret Key for ML Signatures
RELAYER_SECRET=S...  # Stellar Keypair Secret for Gas Sponsoring
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
```

---

## 🐳 Docker Deployment Guide

To deploy the Python FastAPI Oracle & Gas Master Relayer to containerized hosts (Render, Railway, Fly.io, or AWS App Runner):

```bash
# Build production Docker image
docker build -t neurosync-relayer .

# Launch container with environment configuration
docker run -d -p 8000:8000 \
  -e ORACLE_SECRET="S..." \
  -e RELAYER_SECRET="S..." \
  -e SOROBAN_RPC_URL="https://soroban-testnet.stellar.org:443" \
  neurosync-relayer
```

---

## 🗺️ Protocol Roadmap

- [x] **Phase 1: Core Protocol Infrastructure**: Soroban Rust contracts, Scikit-Learn ML oracle, and zero-gas relayer.
- [x] **Phase 2: User Interface & Analytics**: Glassmorphic Next.js frontend, multi-page app architecture, and biometrics ledger.
- [x] **Phase 3: Testnet Hardening & Verification**: Security audit fixes, storage TTL extensions, and native Python SDK refactoring.
- [ ] **Phase 4: Mainnet Deployment**: Deploy WASM binaries to Stellar Mainnet, fund mainnet relayer treasury, and audit token distribution limits.
- [ ] **Phase 5: Hardware Integration**: Wearable device SDK connectors (Oura Ring, Apple HealthKit, Garmin, Whoop) and Zero-Knowledge biometrics proofs (zk-SNARKs).

---

## 📄 License

NeuroSync Protocol is open-source software released under the MIT License.

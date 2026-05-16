<div align="center">

# Blockplot Backend

**NestJS API server for the Blockplot Soroban permissioned RWA tokenization protocol.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet.svg)](LICENSE)
[![NestJS](https://img.shields.io/badge/NestJS-v10-red)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-blue)](https://stellar.org)

</div>

---

## Overview

`blockplot-backend` is the off-chain API layer of the Blockplot Soroban protocol. It bridges user-facing applications and KYC providers with on-chain Soroban smart contracts, handling:

- **Identity & KYC management** — submission, admin approval, and revocation of wallet identities
- **Asset registry** — metadata and lifecycle management for tokenized real-world assets
- **Yield tracking** — off-chain accounting for reward deposits, allocation, and claims
- **Blockchain integration** — indexing Soroban contract events and relaying transactions

Built with [NestJS](https://nestjs.com) for a modular, scalable TypeScript architecture.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        blockplot-backend                          │
│                                                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐    │
│   │  /identity  │  │   /assets   │  │       /yield         │    │
│   │             │  │             │  │                      │    │
│   │ KYC submit  │  │ Create      │  │ Deposit rewards      │    │
│   │ Approve     │  │ List assets │  │ Allocate to holders  │    │
│   │ Revoke      │  │ Get by ID   │  │ Claim rewards        │    │
│   └──────┬──────┘  └──────┬──────┘  └──────────┬───────────┘    │
│          │                │                     │                │
│          └────────────────┴─────────────────────┘                │
│                           │                                      │
│                  ┌────────▼────────┐                             │
│                  │  Soroban Layer  │                             │
│                  │  (future)       │                             │
│                  │  Contract calls │                             │
│                  │  Event indexing │                             │
│                  └─────────────────┘                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Modules

### `IdentityModule` — `/identity`

Manages KYC/AML verification lifecycle for wallet addresses.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/identity/submit` | Submit KYC data for a wallet |
| `GET` | `/identity/:walletAddress` | Get identity status |
| `PATCH` | `/identity/:walletAddress/approve` | Approve and verify a wallet (admin) |
| `PATCH` | `/identity/:walletAddress/revoke` | Revoke a wallet's verified status (admin) |

**Identity states:** `pending` → `verified` → `revoked`

**Example — Submit KYC**

```bash
curl -X POST http://localhost:3000/identity/submit \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "GABC...XYZ", "kycData": {"name": "Alice", "country": "US"}}'
```

**Example — Approve**

```bash
curl -X PATCH http://localhost:3000/identity/GABC...XYZ/approve
```

---

### `AssetsModule` — `/assets`

Manages metadata and configuration for tokenized real-world assets.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/assets` | Register a new tokenized asset |
| `GET` | `/assets` | List all assets |
| `GET` | `/assets/:id` | Get a single asset by ID |

**Example — Create asset**

```bash
curl -X POST http://localhost:3000/assets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lagos Commercial Tower A",
    "totalSupply": 1000000,
    "ownerCap": 100000,
    "priceUsd": 1
  }'
```

---

### `YieldModule` — `/yield`

Handles off-chain reward accounting: deposits, per-holder allocation, and claiming.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/yield/:assetId/deposit` | Deposit yield into an asset pool |
| `GET` | `/yield/:assetId/claimable/:walletAddress` | Get claimable amount for a holder |
| `POST` | `/yield/:assetId/claim/:walletAddress` | Claim rewards for a holder |

**Example — Deposit yield**

```bash
curl -X POST http://localhost:3000/yield/asset-id-123/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000}'
```

**Allocation formula:**
```
claimable = totalDeposited × (allocationBps / 10_000)
```

---

## Repository Structure

```
blockplot-backend/
├── src/
│   ├── assets/
│   │   ├── assets.controller.ts      # REST endpoints for asset management
│   │   ├── assets.module.ts
│   │   └── assets.service.ts         # In-memory asset registry
│   ├── identity/
│   │   ├── identity.controller.ts    # KYC submit, approve, revoke endpoints
│   │   ├── identity.module.ts
│   │   └── identity.service.ts       # Identity state machine
│   ├── yield/
│   │   ├── yield.controller.ts       # Deposit, claimable, claim endpoints
│   │   ├── yield.module.ts
│   │   └── yield.service.ts          # Yield pool accounting
│   ├── app.module.ts                 # Root module wiring all feature modules
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                       # Bootstrap — listens on PORT env var
├── test/
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install & run

```bash
git clone https://github.com/Stellar-Land/blockplot-backend.git
cd blockplot-backend
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run start:prod
```

### Run tests

```bash
npm run test          # unit tests
npm run test:e2e      # end-to-end tests
npm run test:cov      # coverage report
```

---

## Environment Variables

Create a `.env` file at the root and configure:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `STELLAR_NETWORK` | `testnet` | Stellar network to connect to |
| `SOROBAN_RPC_URL` | — | Soroban RPC endpoint |
| `BLOCKPLOT_ID_CONTRACT` | — | Deployed BlockplotID contract address |
| `FRACTIONAL_ASSET_CONTRACT` | — | Deployed FractionalAsset contract address |
| `PUBLIC_SALE_CONTRACT` | — | Deployed PublicSale contract address |
| `YIELD_DISTRIBUTOR_CONTRACT` | — | Deployed YieldDistributor contract address |
| `ADMIN_SECRET_KEY` | — | Admin signing key (never commit) |
| `DATABASE_URL` | — | Postgres connection string (future) |

---

## Roadmap

- [ ] Persist data in PostgreSQL with Prisma ORM
- [ ] JWT auth for admin-only endpoints
- [ ] Soroban event indexer — sync on-chain state to database
- [ ] KYC provider integration (Synaps, Fractal, Persona)
- [ ] WebSocket gateway for real-time portfolio updates
- [ ] Notification service (email / webhook on KYC approval)
- [ ] Governance module — proposals and vote tallying
- [ ] Swagger/OpenAPI auto-generated docs
- [ ] Docker Compose setup with Postgres and Redis

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Follow NestJS module conventions — one module per domain
4. Add tests alongside new functionality
5. Open a PR with a clear description

---

## License

[MIT](LICENSE) © Stellar-Land / Blockplot

---
name: aegis-onchain-protection
description: >
  Pay a few cents in USDC to get autonomous on-chain protection: Aave liquidation
  guard or a scheduled Uniswap V3 DCA strategy. No account, no signup, no polling
  — a Reactive Contract watches the trigger and acts on a fixed cadence.
base_url: https://aegis-agents-nu.vercel.app
network: Base Sepolia (eip155:84532), testnet only
---

# Aegis — autonomous on-chain protection, paid for over x402

You are an AI agent (or an agent framework) that can hold a wallet and sign
EIP-3009 authorizations. This document is everything you need to buy a
protection service from Aegis without reading the source.

## What you're buying

| Service | `id` | What it does | Price |
|---|---|---|---|
| Aave Liquidation Protection | `aave-protection` | Watches an Aave health factor. When it drops below your threshold, supplies collateral and/or repays debt on your behalf. | $0.25/day |
| DCA Strategy | `dca-strategy` | Periodic USDC → WETH swaps on Uniswap V3, sized and scheduled by you. | $0.20/day |

Both are checked roughly every 12 minutes by a Reactive Contract on Reactive
Network (Lasna testnet) — not a cron job you run, not a bot someone else
operates. Once your config is live, you do nothing else unless you want to
pause, resume, or cancel it.

## The flow, in order

1. **Discover.** `GET /api/services` — no payment needed. Confirms current
   pricing and duration limits before you commit to anything.
2. **Quote (optional).** `POST /api/quote` with `{ "service": "...", "durationSeconds": N }`
   to get the exact USDC cost before paying.
3. **Pay and register.** `POST /api/protect/liquidation` or `POST /api/dca/activate`
   with your parameters. The server responds `402 Payment Required` with an
   x402 challenge (network, asset, amount, `payTo`). Sign an EIP-3009
   `transferWithAuthorization` for that amount and retry the same request
   with the payment header attached. On success you get back a `configId`
   and a transaction hash — your config already exists on-chain.
4. **Grant spending allowance** (DCA only, or Aave debt-repayment mode): the
   response's `nextSteps` names the Callback Contract address and the token
   it needs to pull from you. Either send a normal `ERC20.approve()`
   yourself, or if the token supports EIP-2612, sign a permit and hand it to
   `POST /api/approve/permit` — the server relays it on-chain for you, free.
5. **Do nothing.** The Reactive Contract is already subscribed. It fires a
   callback on its own cadence (~12 min) and acts if your trigger condition
   is met. You can check in any time via the status endpoints below, but
   there is nothing to poll or re-arm.
6. **Manage.** Pause, resume, or cancel your config whenever you want —
   these calls are free, no new payment required.

## Minimal example: Aave protection, 1 hour, curl

```bash
# 1. See what's on offer
curl https://aegis-agents-nu.vercel.app/api/services

# 2. Attempt the paid call — expect 402 back with the exact payment terms
curl -i -X POST https://aegis-agents-nu.vercel.app/api/protect/liquidation \
  -H "Content-Type: application/json" \
  -d '{
    "protectedUser": "0xYourWalletAddress",
    "protectionType": 0,
    "healthFactorThreshold": "1500000000000000000",
    "targetHealthFactor": "2000000000000000000",
    "duration": 3600
  }'

# 3. Sign the EIP-3009 authorization from the 402 challenge, retry with the
#    payment header attached (see @x402/fetch or your framework's x402
#    client — this is standard x402, nothing Aegis-specific).
```

The full field-by-field reference, every endpoint, every response shape:
**[`/openapi.yaml`](https://aegis-agents-nu.vercel.app/openapi.yaml)**.

## Things worth knowing before you pay

- **This is testnet.** Base Sepolia + Reactive Lasna. USDC, ETH, and REACT
  here have no real value — get testnet USDC from `faucet.circle.com`.
- **`protectionType`**: `0` = collateral deposit, `1` = debt repayment,
  `2` = both. Debt repayment needs `debtAsset` approved; collateral needs
  `collateralAsset` approved.
- **Duration** is 1 hour to 30 days (`3600` to `2592000` seconds). Price
  scales linearly plus a 20% gas buffer.
- **Multi-config is fine.** One agent can hold several active configs per
  service — nothing here is one-per-wallet.
- **Check `GET /health` first** if a call fails oddly — it reports whether
  each service's Reactive Contract is currently funded. An underfunded RC
  means the trigger check won't run even though your config exists.

## Status endpoints (all free, no payment)

| Endpoint | Returns |
|---|---|
| `GET /api/status/config/:configId` | Full Aave protection config state |
| `GET /api/status/health/:userAddress` | Current Aave health factor for an address |
| `GET /api/status/configs` | All active Aave protection config IDs |
| `GET /api/dca/config/:configId` | Full DCA config state, swaps executed so far |
| `GET /api/dca/user/:userAddress` | Your DCA config IDs |
| `GET /api/dca/configs` | All active DCA config IDs |

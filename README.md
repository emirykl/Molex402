# Molex402

An open-source **x402 facilitator** and **Proof-Carrying Bazaar** for Stellar.

Stellar already has working x402 settlement — the Apache-2.0
[`@x402/stellar`](https://www.npmjs.com/package/@x402/stellar) package and a live facilitator both
exist. What it does not have is a **Bazaar**: a native discovery layer where an agent with no prior
integration can find a paid service, understand its price, and pay for it.

Molex402 fills that gap, and adds the piece catalogs leave out: proof that the service you paid for
is the service you actually received. A payment can settle correctly and still deliver nothing,
deliver twice, or deliver something other than what was priced. Molex402 binds every settled payment
to exactly one verified service effect.

**Status: active development.** This is a Stellar Community Fund #45 submission to the
[RFP Track](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track) request for an
*x402 Facilitator with Bazaar discovery support*.

Site: **https://emirykl.github.io/Molex402**

## What it ships

| Component | What it does |
|---|---|
| **Proof-Carrying Bazaar** | Automatic cataloging from settled payments. `/discovery/resources` and `/discovery/search` over HTTP endpoints and MCP tools as first-class resource types, with natural-language search, structured filters and cursor pagination. Every listing carries a versioned security profile — last tested, which checks passed, and a link to the evidence. |
| **Facilitator** | `/supported`, `/verify` and `/settle` on testnet and pubnet, for the `exact` and `upto` schemes. Non-custodial, fee-sponsored so agents never need XLM. Hosted, self-hosted and embedded-library deployment modes. |
| **MolexGuard** | Framework-agnostic seller middleware. Holds the paid handler behind settlement finality and a durable state machine, so one payment produces at most one committed service effect — even under 1,000 concurrent replays of the same payment header. |
| **MolexScope** | Black-box attack suite that tests facilitators and resource servers from the outside: replay, header/cache confusion, verify–settle races, fee abuse, catalog poisoning. Turns "secure" from a claim into a reproducible signed artifact. |
| **Agent-facing MCP server** | Search → inspect → pay → verify, split into deterministic tools an agent runtime can call. No tool ever asks for a private key. |
| **`upto` scheme for Stellar** | Minimal immutable Soroban settlement contract — no admin, no upgrade path, no custody — plus spec and implementation contributed upstream and coordinated with the x402 TSC. |

Built **on** `@x402/stellar` rather than reimplementing verify and settle, as the RFP asks.

## Design commitments

- **Permissive licensing.** Apache-2.0 throughout. No AGPL in the runtime or transitive dependency
  path; CI enforces this and every release publishes an SPDX SBOM.
- **Non-custodial.** The facilitator never holds payer funds. It validates signatures and submits.
- **No admin keys on chain.** The `upto` settlement contract has no admin, no upgrade entry point
  and no configurable recipient. An incident is handled by removing the contract from the
  facilitator allowlist, not by upgrading it.
- **Evidence over assertion.** Every security claim ships with a reproducible test artifact.

## Repository layout

```
backend/     facilitator, Bazaar catalog + search, MolexGuard, MCP server
frontend/    operator and seller console
docs/        project site (GitHub Pages)
```

## Prior work

Molex402 is built by the team behind [**Beaver402**](https://github.com/emirykl/Beaver402), a
two-party proof-of-intent system for agent payments over Stellar x402, which won a **$5,000 Stellar
Instawards grant**. A merchant signs a challenge describing the paid request, the buyer independently
reconstructs it, and a Soroban smart account authorizes settlement only when every security-critical
field agrees.

It covers the ground this RFP asks for — payment infrastructure, an MCP server, and a deployed
Soroban contract — with on-chain evidence:

| What | Evidence |
|---|---|
| Deployed Soroban contract | [`CBPE37HQ…JZTX2S`](https://stellar.expert/explorer/testnet/contract/CBPE37HQ6CHIKB7F3OFU2BIDAQOLB3QZD2DAO5Y6F6DKUSHLW2JZTX2S) |
| A payment both parties agreed on | [`19d9c4e4`](https://stellar.expert/explorer/testnet/tx/19d9c4e4f519e4ab9971c394a6338d9a82b83287f3e90d648ef3e15c49a1219a) |
| An owner action authorized by passkey | [`61e6485c`](https://stellar.expert/explorer/testnet/tx/61e6485c8ef7df96b92ada8c79687acc69d8ea1b5d307d952d9b9efcab259b48) |

## License

Apache-2.0. See [LICENSE](LICENSE).

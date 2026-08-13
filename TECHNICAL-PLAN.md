# Molex402 Technical Plan

An open source x402 facilitator and discovery Bazaar for Stellar.

Prepared for the Stellar Community Fund #45 RFP Track, in response to the request for an
*x402 Facilitator with Bazaar discovery support*.

| | |
|---|---|
| Networks | `stellar:testnet` and `stellar:pubnet` |
| Schemes | `exact` and `upto`, x402 version 2 |
| Built on | [`@x402/stellar`](https://www.npmjs.com/package/@x402/stellar), Apache 2.0 |
| Licence | Apache 2.0, no AGPL in the runtime or the dependency path |
| Site | https://molex402.vercel.app |

---

## 1. What this is

Stellar can already settle x402 payments. The `@x402/stellar` package works and a facilitator
runs on both testnet and mainnet. What Stellar does not have is a Bazaar, meaning a native
discovery layer where an agent with no prior integration can find a paid service, understand
what it costs, and pay for it. Stellar's own directory of x402 projects currently lists no
discovery service at all.

Molex402 closes that gap. It also addresses the part that catalogs routinely leave out. A
settled payment proves that money moved. It does not prove that the paid work ran, that it ran
only once, or that it ran for the request that was actually paid for. Retries and race
conditions can result in paying twice or delivering twice.

### 1.1 The three components that make this different

| Component | What it does | Why it matters |
|---|---|---|
| **MolexGuard** | Request fingerprint, pessimistic lock, settlement finality gate and one time execution, protecting the boundary between payment and service | Blocks not only duplicate settlement but also the attack where one payment is used to obtain more than one service response |
| **MolexScope** | Tests facilitators and resource servers from the outside as a black box, covering replay, header and cache confusion, verify and settle races, fee abuse and catalog poisoning | Turns a security claim into a versioned, repeatable behavioural artifact rather than a paragraph in a document |
| **Evidence carrying Bazaar** | Each listing records the time it was last tested, the suite version, which checks passed or failed, and a link to the evidence | An agent can select a service on runtime behaviour, not only on price and self description |

In one line: others let an agent find a service and settle a payment. Molex402 binds the
discovered terms to the settlement, and proves that each payment produced exactly one
transactional or idempotent service effect.

### 1.2 What success looks like

Success is the presence of all of the following together.

1. A canonical, unmodified x402 client makes `exact` and `upto` payments on both networks with
   no fork and no patch.
2. `/supported`, `/verify` and `/settle` conform to the official wire format, and every invalid
   response carries a machine readable code and a non empty reason.
3. HTTP and MCP resources are catalogued automatically from settlement. Two discovery endpoints
   and an agent facing MCP server are running.
4. The `upto` scheme specification and implementation are contributed upstream to x402,
   coordinated with the TSC, and merged before the work is called complete.
5. A durable transaction hash, a conformance report and reproduction commands are published for
   each network and scheme pair.
6. MolexGuard does not run the protected handler before settlement finality. Under a strict
   transactional fixture, one thousand parallel requests carrying the same payment produce one
   settlement and at most one committed effect.
7. MolexScope results are attached to Bazaar listings as a versioned security profile, and
   agents can filter on a strict profile.
8. Permissive licence cleanliness, a security report, a third party Audit Bank review, a clean
   room self host, and two genuine end to end integrations.

---

## 2. RFP compliance matrix

Status *Covered* means the item is bound to a design, a deliverable and an acceptance criterion
in this plan. Actual compliance of the code is proven by the artifacts in the evidence column.

### 2.1 Facilitator

| RFP item | How this plan answers it | Acceptance evidence | Status |
|---|---|---|---|
| x402 v2, testnet and pubnet | Two network configuration on `@x402/stellar` | Stock client end to end plus four transaction hashes | Covered |
| `/verify`, `/settle`, `/supported` | Standard wire surface, OpenAPI as an explanatory layer only | Golden wire fixture and contract tests | Covered |
| Full auth entry binding | Invocation, asset, amount or cap, recipient, network, nonce and expiry all matched | Negative test matrix | Covered |
| Auth entries, not pre signed transactions | The buyer signs only Soroban auth entries. The facilitator assembles the invocation and submits as fee sponsor | Wallet and facilitator captured end to end | Covered |
| Replay and ledger expiry | Official payment identifier, request fingerprint, durable state machine and on chain auth expiry | Replay, restart and cross resource tests | Covered |
| `signatureExpirationLedger` | `latestLedger + ceil(maxTimeoutSeconds / 5)`, about 12 ledgers at the 60 second default | Boundary and expiry tests | Covered |
| Classic and custom token auth | The SAC path and the custom token `__check_auth` path are tested separately | Two token type fixtures | Covered |
| Trustlines | Payer and recipient trustline preflight, onboarding and `op_no_trust` recovery | Two network quickstart end to end | Covered |
| SEP-41, USDC default, 7 decimals | Asset registry, amounts held as base unit integers, floating point prohibited | USDC plus a second SEP-41 token | Covered |
| Fee sponsorship | Permissive channel account and fee bump submitter, capability advertised | `extra.areFeesSponsored=true` and the transaction envelope | Covered |
| Non custodial | The facilitator never holds payer funds. It validates signatures and submits | Threat model and key flow review | Covered |
| Free testnet, transparent mainnet fee | Testnet at no cost, a published hosted operator fee, self host platform fee of zero | Pricing and configuration document | Covered |
| Caller auth, metering, rate limits | Public testnet needs no API key, anonymous rate limiting applies. Mainnet uses API key or JWT with quota and usage export. All configurable | Keyless testnet end to end, 429 and rate limit tests | Covered |
| Hosted, self host and embedded | Hosted endpoint, Docker Compose and Kubernetes, and a resource server library mode | Three deployment smoke tests | Covered |
| Resource limits and burst throughput | Simulation budgets, fee ceilings, channel account pool, lease and stuck sequence recovery | Load, soak and failover report | Covered |
| Secure delivery after payment | MolexGuard refuses to run the protected handler before settlement finality. The strict profile requires a transactional outbox or idempotency downstream | One thousand parallel replays produce one settlement and at most one committed effect | Above the RFP |

### 2.2 Bazaar, search and MCP

| RFP item | How this plan answers it | Acceptance evidence | Status |
|---|---|---|---|
| `/discovery/resources` | `type`, `payTo`, `network`, `extensions`, `limit`, `offset` | Contract and pagination tests | Covered |
| `/discovery/search` | Natural language query, structured filters, cursor pagination, `partialResults` | Golden query evaluation set | Covered |
| Real ranking and a quality measure | Full text search and trigram baseline, field weights, optional local embedding rerank | nDCG@10, Recall@10, MRR and latency report | Covered |
| Automatic cataloging | Validated upsert from the Bazaar extension of the PaymentPayload after successful settlement | Settlement to catalog end to end | Covered |
| HTTP and MCP as first class | Separate schema and normalisation, shared payment options | At least two HTTP and two MCP fixtures | Covered |
| Correct MCP identity | Resource identity is `resource.url` plus `input.toolName`. Network and `payTo` belong to `accepts[]` | Deduplication and collision tests | Covered |
| Integrity and soft drop | Authority binding, schema limits, unsafe optional metadata dropped at field level | Poisoning corpus report | Covered |
| `routeTemplate` safety | Percent decode to a fixed point, Unicode normalise, segment check, canonicalise after traversal | Encoded traversal tests | Covered |
| `EXTENSION-RESPONSES` header | `success`, `processing` or `rejected`, with a rejection code and a non null reason | Wire fixtures and seller visibility end to end | Covered |
| Specification drift tracking | Weekly upstream watcher, fixture pinning, conformance updated for the life of the grant | CI drift job and changelog | Covered |
| Ecosystem interoperability | Cross conformance suite against at least one external facilitator and the stock SDK | Interoperability matrix | Covered |
| Seller helpers | HTTP middleware, MCP wrapper, validator CLI, a readable description for every route and tool parameter | Example repository, schema lint and a one hour developer experience test | Covered |
| Off chain index default | PostgreSQL catalog. An on chain registry is out of scope | Architecture and cost decision record | Covered |
| Agent facing MCP | Search, inspect, then pay and retry, split into deterministic tools | Stock MCP client end to end | Covered |
| Evidence carrying Bazaar | Listings carry the suite version, test time, pass and fail results and an evidence URL | `securityProfile=strict` filter end to end | Above the RFP |

### 2.3 Scheme, security, conformance and expected outputs

| RFP item | How this plan answers it | Acceptance evidence | Status |
|---|---|---|---|
| `exact` and `upto` | Two schemes. `upto` is an immutable, recipient bound, single use Soroban settlement contract | Transaction hash per network and scheme, plus contract ID and WASM hash | Covered |
| `upto` upstream and TSC | Specification pull request, implementation pull request, public design notes and TSC checkpoints | Merged upstream pull request at the finish | Covered |
| `upto` contract and trust model | A minimal contract with no admin, no upgrade and no custody. Payer authorises facilitator, token, recipient, cap, request digest, nonce and expiry. The actual amount chosen by the authorised facilitator is bounded by the contract | Audit Bank scope, property, fuzz and misuse tests | Covered |
| Smart account spending policies | A wallet policy enforcing scheme, asset, recipient, per call cap, rolling budget and expiry limits | Custom `__check_auth` policy end to end | Covered |
| Batch and auth capture deferrable | Out of scope for the grant. API versioning allows a later addition | Scope statement | Covered |
| Permissive OSI, no AGPL | Apache 2.0, dependency licence gate in CI, AGPL transitive path prohibited | SBOM and licence scan | Covered |
| No OpenZeppelin dependency | No OpenZeppelin code or dependency. It may be called as an external endpoint for interoperability testing only | Dependency tree and clean room build | Covered |
| Official end to end, literal payload | Golden wire fixtures including the required `payload:{transaction}` shape, upstream x402 end to end suite on both networks | Captured wire set and raw CI logs | Covered |
| Security and Audit Bank | Settlement, auth validation and the discovery trust boundary. Third party review before mainnet production | Security report with resolved findings, plus the Audit Bank artifact | Covered |
| Cross layer integrity | A request, offer, settlement and response digest chain alongside the official payment identifier and the offer and receipt extensions | Independent `verify_interaction` evidence | Above the RFP |
| Front running resistance | Signed invocation and envelope bound to recipient, asset, cap or amount, network, nonce and expiry. An observed payload cannot be redirected | Mempool and observer adversarial tests | Covered |
| 99 percent uptime and degraded paths | Service level objectives, dependency timeouts, read only discovery, `partialResults`, queue and retry | Dashboard and failure drills | Covered |
| Role based documentation, under one hour | Seller, buyer and agent, and operator guides, plus a live testnet quickstart | Clean user timing test | Covered |
| Two end to end integrations | One HTTP resource and one MCP tool, with different seller flows | Live URL, demo and transaction hashes | Covered |
| Maintenance plan | A minimum of twelve months of security and critical fixes, specification drift and uptime ownership | Named owner, calendar and issue service level agreement | Covered |

---

## 3. System architecture

```
Agent / Buyer            Seller + MolexGuard          Facilitator Gateway
stock x402 client   ->   HTTP route or MCP tool  <->  /supported /verify /settle
stock MCP client         request lock                 auth, metering, rate limits
                         one time execution

@x402/stellar core       UptoSettlement               Stellar + Submitter
exact adapter            immutable Soroban            testnet / pubnet, SEP-41
canonical wire           cap, recipient,              fee bump, RPC quorum
auth entry simulation    request, nonce               and failover

              finalised settlement + signed evidence

MolexScope               Bazaar                       Discovery + MCP
black box attack suite   PostgreSQL, search           search, inspect, security
reproducible evidence    security profile, audit      pay, verify interaction

Integrity evidence       Operations                   Security boundary
request, offer,          OpenTelemetry, metrics       secret store, redaction
transaction and          backups, runbooks            licence and SBOM gates
response digest
```

### 3.1 The secure transaction flow

| Step | What happens |
|---|---|
| 1. Discover | The agent searches the Bazaar and filters on the security profile |
| 2. Bind | A signed offer is bound to a request fingerprint |
| 3. Reserve | A pessimistic lock is taken on the payment |
| 4. Verify | The auth entry is checked against the requirements. No funds move |
| 5. Settle | The transaction reaches Stellar finality, with fees sponsored |
| 6. Execute | The protected handler runs exactly once |
| 7. Prove | Signed integrity evidence is returned |

### 3.2 Architectural decisions

| Decision | Choice | Reasoning and trade off |
|---|---|---|
| Runtime | TypeScript, Node.js LTS, Fastify | Direct compatibility with the official x402 packages, schema first request handling |
| Payment core | `@x402/core` and `@x402/stellar` | Wire compatibility is preserved and no private protocol fork appears |
| Transaction submitter | An Apache or MIT compatible local module | No AGPL dependency, and channel account and fee bump behaviour stays under our control |
| Catalog | PostgreSQL, with Redis optional for queue and cache | Off chain by default, easy to self host, consistent constraints |
| Search | Postgres full text search and trigram, optional local embeddings | A deterministic, explainable baseline with no mandatory language model |
| On chain contract | A minimal immutable `UptoSettlement` | Recipient and single use guarantees move out of the facilitator database and into Soroban authorization. No admin, no upgrade, no custody |
| Delivery integrity | MolexGuard resource server middleware | Places the protected handler behind settlement finality and a durable state machine without forking the core x402 wire |
| Security evidence | MolexScope and versioned evidence | Publishes a repeatable test result instead of an assertion of being secure |
| Deployment | Hosted, Docker Compose, Kubernetes, embedded library | Matches the managed, self host and resource server usage the RFP describes |

---

## 4. Facilitator and wire contract

### 4.1 `/supported`

The response advertises scheme and network combinations and the fee sponsorship state in a form
the client can read. The official schema version is pinned as a fixture and validated in CI
against the upstream schema.

```json
{
  "kinds": [
    {"x402Version": 2, "scheme": "exact", "network": "stellar:testnet",
     "extra": {"areFeesSponsored": true}},
    {"x402Version": 2, "scheme": "upto",  "network": "stellar:testnet",
     "extra": {"areFeesSponsored": true}},
    {"x402Version": 2, "scheme": "exact", "network": "stellar:pubnet",
     "extra": {"areFeesSponsored": true}},
    {"x402Version": 2, "scheme": "upto",  "network": "stellar:pubnet",
     "extra": {"areFeesSponsored": true}}
  ]
}
```

### 4.2 `/verify`, where no funds move

1. `x402Version`, scheme, CAIP-2 network and the PaymentRequirements schema are validated.
2. The official Stellar form of the wire payload is decoded, including the literal
   `payload:{transaction}` field where required.
3. The auth invocation is bound to exactly the expected contract and function call. Asset,
   payer, `payTo`, amount or cap, nonce and ledger expiry are compared.
4. The SAC and classic asset path, and the `__check_auth` behaviour of a custom SEP-41 token,
   are validated separately.
5. Trustline, balance, simulation, resource limits and auth expiry are checked. Verification
   never submits a transaction.

### 4.3 `/settle`, idempotent economic effect and finality

1. The verification result is rebound to the request hash, scheme and requirements. A stale
   verification is not accepted.
2. The official payment identifier and the normalised request fingerprint are written to durable
   storage before transaction assembly. The same identifier arriving with a different fingerprint
   returns `409 PAYMENT_BINDING_CONFLICT`.
3. A pessimistic row or advisory lock brings the parallel settlement and service execution paths
   of the same payment under a single state transition.
4. A channel account sequence reservation and a fee bump sponsor envelope are produced. The
   signer only signs within the permitted network, contract and limit policy.
5. After RPC submission and ledger finality a standard settlement response is returned. A failed
   response carries a code such as `AUTH_EXPIRED`, `AMOUNT_MISMATCH`,
   `PAYMENT_BINDING_CONFLICT` or `RPC_UNAVAILABLE`, together with a non empty reason.
6. A successful settlement triggers a Bazaar ingestion event. A metadata failure never reverses
   the payment result, and the catalog outcome is reported separately in the extension response.

### 4.4 MolexGuard, single and bound service delivery after payment

MolexGuard is not a facilitator endpoint. It is a framework agnostic security middleware that
attaches to the seller resource server. It does not change core x402 wire compatibility. It
controls when, and how many times, the protected business handler may run.

1. The state machine `ISSUED, RESERVED, SETTLING, FINALIZED, EXECUTED, DELIVERED` is held
   transaction safe in PostgreSQL.
2. `RESERVED` is written before the verify or settle call, so two processes or pods cannot run
   the handler for the same payment concurrently.
3. If settlement is not final the protected handler does not run and no paid response is
   returned. On an RPC timeout the state stays `SETTLING`. A retry does not create a new
   execution until transaction hash recovery or polling resolves the outcome.
4. When the same payment identifier and the same fingerprint arrive again, the previously
   delivered response is returned from a safe cache. A different fingerprint always returns 409.
5. Paid responses carry `Cache-Control: private, no-store` and a `Vary` appropriate to the
   payment headers. More than one payment header, or conflicting ones, is rejected, and reverse
   proxy behaviour is normalised.
6. The official signed offer and receipt artifacts are preserved. A `molex-integrity` extension
   signs `paymentId`, `requestDigest`, `offerDigest`, `settlementTx`, `responseDigest`, `grantId`
   and the profile version with a separate JWS key.

Read only and deterministic responses are returned from a durable response store without
re running. For services with side effects, the strict one time profile requires that the same
payment effect is committed inside a PostgreSQL transaction or outbox, or that the downstream
service enforces Molex's `grantId` as a persistent idempotency key. A listing that does not
carry this integration is marked as settlement gated only and does not claim single execution.

**Limit of the claim.** Integrity evidence proves the binding of the delivered bytes to a
specific request and settlement. It is not claimed to prove that the response is semantically
correct or of good quality.

### 4.5 Stellar specific production controls

- Amounts are handled as 7 decimal base unit integers. Floating point is prohibited.
- Any SEP-41 token is supported. USDC is the default in the test fixtures and at least one
  custom token is included.
- The buyer signs a Stellar auth entry. It never signs a pre signed transaction envelope. The
  facilitator assembles the invocation, applies a fee bump and submits. Wallet examples show
  auth entry signing support explicitly.
- `signatureExpirationLedger` is derived as the current ledger plus
  `ceil(maxTimeoutSeconds / 5)`. The default `maxTimeoutSeconds=60` is roughly 12 ledgers. The
  client and the facilitator validate the ledger bound rather than wall clock, and the auth
  entry is not cached between requests.
- Payer and recipient onboarding checks the classic trustline required for the payment asset in
  advance. USDC testnet and mainnet quickstarts include trustline creation, faucet funding and
  `op_no_trust` recovery.
- The single account sequence bottleneck is solved with a channel account pool. There is a per
  account mutex, a lease and stuck sequence recovery.
- Resource limits are taken from simulation and bounded by a maximum CPU, memory and fee tenant
  policy.
- The `UptoSettlement` contract instance and code TTL are monitored, with a restore and bump
  alarm before archival. The Bazaar catalog and the security evidence index remain off chain.

---

## 5. The secure `upto` scheme and its immutable Soroban contract

`upto` allows the buyer to authorise an upper limit for a single request and the seller to
settle its actual usage within that limit. Molex402 does not leave this to a SEP-41 allowance or
to the facilitator database alone. A minimal `UptoSettlement` contract enforces the destination
and the single use property of the payment inside Soroban authorization semantics.

### 5.1 Contract security model

| Area | On chain guarantee | Acceptance test |
|---|---|---|
| Authorisation scope | `payer.require_auth_for_args`. Facilitator, token, recipient, cap, request digest, nonce and expiry all fall inside the buyer signed auth scope | Mutating any bound field individually causes authorization to be rejected |
| Actual amount | The actual amount is not pre signed by the buyer. The facilitator bound by the buyer selects it and approves it with its own auth. The contract enforces `0 <= actualAmount <= cap` | Unauthorised caller, zero, partial, maximum and cap plus one cases |
| Single use | Host nonce and auth semantics together with explicit payment nonce consumption prevent a second use of the same authorisation | Sequential, parallel and restart replay rejection |
| Non custodial | The contract holds no persistent balance. It transfers from payer to recipient within a single invocation | Contract balance is zero after both success and failure |
| Governance risk | There is no admin, no upgrade entry point, no arbitrary call and no configurable recipient | Specification and ABI inspection, plus an immutable WASM hash |
| Expiry | The auth expiration ledger and the contract deadline are checked together | Boundary ledger and expired settlement tests |

### 5.2 Proposed contract interface

```rust
settle_upto(
  payer: Address,
  facilitator: Address,
  token: Address,
  pay_to: Address,
  max_amount: i128,
  actual_amount: i128,
  request_digest: BytesN<32>,
  payment_nonce: BytesN<32>,
  valid_until_ledger: u32
) -> SettlementEvent
```

The contract requires payer authorisation for every security critical argument except the actual
amount, and requires facilitator authorisation for the request, nonce and actual amount. It
takes the maximum amount atomically from the payer, pays the real amount to the recipient,
returns the difference of `max_amount - actual_amount` within the same invocation, consumes the
nonce and emits a settlement event. No path, whether it succeeds or reverts, leaves a persistent
balance in the contract. Metering accuracy is the responsibility of the off chain seller. The
contract enforces the authorised settler, the cap, the recipient and the single use bounds, not
the correctness of the measurement.

- The payer auth tree commits to partial arguments for the root `settle_upto` call and internally
  authorises only the payer to contract maximum token transfer. Recipient and refund transfers
  from the contract's own balance are authorised with `authorize_as_current_contract`.
- `UsedNonce(payment_nonce)` is held in fine grained temporary storage with a TTL that carries at
  least to the explicit `valid_until_ledger` bound. Security does not rely on the TTL. The
  deadline is checked on every call and an expired auth is already rejected by the host.
- The hosted facilitator settles only allowlisted SEP-41 and SAC token addresses and pinned
  contract ID and WASM hashes. Arbitrary token contract exhaustion and griefing risk is managed
  fail closed with simulation and fee ceilings.
- The contract contains no unbounded loop, uses negative and overflow checks on all amounts, and
  typed errors. Critical auth tests do not settle for `mock_all_auths`. The exact `env.auths()`
  tree snapshot is held as an assertion.

**Immutable incident model.** The contract has no admin, no upgrade and no pause. On a suspected
vulnerability the hosted facilitator removes the contract ID from the `/supported` allowlist,
MolexGuard stops new payments fail closed, and a newly audited WASM is deployed to a separate
address. Since the contract never holds user funds there is no migration balance.

### 5.3 Smart account spending policy composition

For agents using a custom account, a `__check_auth` policy permits only known `UptoSettlement`
contract IDs, permitted facilitators, token contracts, `payTo`, a per call cap, a daily or
rolling total budget and `signatureExpirationLedger` bounds. A policy rejection returns
`POLICY_BUDGET_EXCEEDED`, `POLICY_RECIPIENT_DENIED`, `POLICY_CONTRACT_MISMATCH` or
`POLICY_EXPIRED`. The classic keypair path, while it has no rolling budget policy, still benefits
from the contract's recipient, cap, nonce and expiry guarantees.

### 5.4 Upstream contribution and coordination plan

1. **Week 1.** A design issue with the x402 TSC, the SDF x402 owners and the wallet and auth entry
   signing teams, covering contract arguments, wire fields, actual amount semantics, error
   taxonomy and compatibility.
2. **Weeks 2 to 4.** A specification pull request for `scheme_upto_stellar.md`, the contract
   interface, the threat model and the test vectors.
3. **Weeks 5 to 10.** The Soroban contract, `@x402/stellar` client, server and facilitator
   adapters, smart account policy helpers and cross network fixtures.
4. **Weeks 11 to 16.** TSC review changes, interoperability and security tests.
5. **Final gate.** The RFP is not marked complete until the specification and the implementation
   are merged upstream. A local branch is a development artifact only.

If the TSC ratifies different semantics, the contract or the wire fields are revised through a
public architecture decision record. The security guarantees of recipient binding, cap, expiry
and single use are not weakened. The contract reaches mainnet only after the Audit Bank review
and the remediation of all critical and high findings.

**Out of grant but forward compatible.** Batch settlement and auth capture are not required
within this scope. A versioned scheme adapter and the idempotency model allow them to be added
later without breaking the wire.

---

## 6. The Bazaar: catalog, integrity, security profile and search

### 6.1 Data model and correct resource identity

- **HTTP resource key.** Normalised origin, percent decoded canonical `routeTemplate` and HTTP
  method.
- **MCP resource key.** `resource.url` plus `extensions.bazaar.info.input.toolName`.
- **Payment options.** Scheme, network, asset, amount or cap, `payTo`, timeout and extra are
  separate `accepts[]` rows. They do not participate in resource identity.
- **Audit trail.** First and last seen, metadata hash, settlement hash, the reason for acceptance,
  soft drop or rejection, and the specification version.
- **Security profile.** A versioned record kept separately from the listing, containing the suite
  version, test time, endpoint fingerprint, check results, evidence digest and URL, and expiry.

### 6.2 Catalog integrity pipeline

1. Body size, nesting and array limits are applied. Unknown large fields are rejected without
   being parsed.
2. `resource.url` must be absolute HTTPS, except in a localhost test profile. `iconUrl` follows a
   scheme, host, IP and redirect policy, and the catalog never has to fetch an icon server side.
3. `$ref` and `$id` may only be fragments within the same document. Remote schema resolution is
   disabled.
4. `routeTemplate` first passes through a repeated percent decode to a fixed point, is Unicode
   normalised, and `..`, encoded slash, backslash and traversal are rejected.
5. Echo metadata is bound to the settled requirements and the verified resource origin and
   `payTo`. The fact that a payment was made does not automatically grant authority to metadata.
6. Unsafe optional fields are soft dropped at field level. A violation of core identity or
   authority makes the whole catalog event `rejected`.
7. The primary onboarding path is always automatic cataloging from the PaymentPayload discovery
   extension. Manual registration is only a secondary operator or debug path. The normal seller
   flow requires no extra registration step after payment.

### 6.3 Discovery APIs

```
GET /discovery/resources
  ?type=http|mcp&payTo=G...&network=stellar:testnet
  &extensions=bazaar&limit=20&offset=0

GET /discovery/search
  ?query=weather+data+under+one+cent&type=http
  &network=stellar:testnet&securityProfile=strict
  &limit=20&cursor=eyJ...

GET /discovery/resources/{resourceId}/security
GET /discovery/resources/{resourceId}/evidence/{runId}

{
  "items": [...],
  "nextCursor": "eyJ..." | null,
  "partialResults": false,
  "warnings": [],
  "securityProfile": {"status":"verified","suite":"molex-scope/1",
                      "grantMode":"transactional|idempotent|settlement-gated"}
}
```

Offset pagination is preserved on `/resources` for RFP compliance. Search results use a signed
opaque cursor to reduce the risk of duplicates and skips under a changing score ordering. If the
search index or the reranker is partially unavailable the service falls back to the lexical
baseline and returns HTTP 200 with `partialResults: true` and a machine readable warning.

### 6.4 Ranking quality plan

| Measure | Target | How it is measured |
|---|---|---|
| nDCG@10 | No regression against a versioned baseline, at least 0.75 at the finish | At least 100 intent queries, two assessors and adjudication |
| Recall@10 | At least 0.85 | A known relevant resource set |
| Zero result rate | Under 5 percent on evaluation queries that have a suitable result | CI regression suite |
| Latency | p95 under 500 ms on a 100k item catalog baseline | Warm and cold load profiles |

The evaluation set covers short queries, natural language, spelling errors, filter conflicts, MCP
tool names and price or network intents. Personal user queries are never added automatically to
training data. They are not used for model improvement without opt in and anonymisation.

### 6.5 Evidence carrying behaviour

Every new listing first appears as `discovered` and is not considered safe for agent auto pay.
When the MolexScope non destructive test profile completes the status becomes `verified`. If
endpoint behaviour or the signature and contract fingerprint changes it falls to `degraded` or
`quarantined`. Operator delisting authority does not erase the evidence history.

| Status | Meaning | Agent behaviour |
|---|---|---|
| `discovered` | Schema and authority checks passed, no runtime security test yet | Listable, outside strict auto pay |
| `verified` | Passed the mandatory checks of the current MolexScope suite, and the grant mode is published | Enters `securityProfile=strict` results, transactional or idempotent grant mode only |
| `degraded` | Previously verified behaviour changed, or the evidence has aged out | Warning, and a manual decision is required |
| `quarantined` | Replay, cache leak, binding or unsafe metadata test failed | Auto pay is blocked |
| `revoked` | Removed from publication under operator abuse or legal policy | Out of search results, audit trail retained |

The security profile does not make organic ranking purchasable. It is a pass or fail filter and an
explainable fact. Settlement volume and self reported metadata are not used as a trust score.

---

## 7. The agent facing MCP server and SDK helpers

The MCP server is not a wrapper around a list endpoint. It divides the agent's payment process
into deterministic, auditable steps. No tool ever requests a private key. Signing remains with
the buyer wallet or client.

| MCP tool | Input | Output and behaviour |
|---|---|---|
| `search_resources` | Query, filters, cursor, limit | Ranked Bazaar items, `nextCursor`, `partialResults`, warnings |
| `get_resource` | Resource identity | Canonical metadata, `accepts` options, integrity state |
| `get_security_profile` | Resource identity | Suite version, test time, pass and fail checks, evidence links |
| `prepare_payment` | Resource, selected accepts, max amount | Deterministic PaymentRequirements and the payload to be signed |
| `execute_paid_request` | Resource request and the wallet produced signature | The 402 retry, the response, the canonical receipt and Molex integrity evidence. No secret key |
| `get_payment_status` | Request or payment identifier | Pending, final or failed, with a transaction hash and a non null reason |
| `verify_interaction` | Offer, receipt, Molex evidence | Signature, signer authority, and request, transaction and response digest matching |
| `explain_rejection` | Error or evidence identifier | A machine readable explanation of which security rule failed and why |

Tool JSON schemas are fixed. Every failure returns `{code, reason, retryable, details?}`. The MCP
transport supports stdio and streamable HTTP. The search, inspect, pay and retry test is repeated
in CI and on live testnet with a stock MCP client.

### 7.1 Seller and buyer helpers

- **Seller HTTP middleware with MolexGuard.** Produces PaymentRequirements, the official payment
  identifier, the offer and receipt extensions, Bazaar metadata and the 402 response. Places the
  protected handler behind a durable state machine and finality.
- **Seller MCP wrapper.** Produces Bazaar metadata from the tool schema and checks each input
  parameter for a description and an example.
- **Validator CLI.** Lints metadata, schema, URL and identity, and flags missing or meaningless
  parameter descriptions before settlement.
- **Buyer and agent helper.** Provides accepts selection, max spend, request fingerprint, smart
  account policy, wallet auth entry callback, paid retry, canonical receipt and Molex integrity
  evidence validation.
- **Two end to end integrations.** One HTTP data API and one MCP tool. Both offer testnet and
  pubnet proof, a live catalog record and a short demonstration.

---

## 8. Security, privacy and licence boundaries

| Threat | Control | Evidence |
|---|---|---|
| Forged catalog metadata | Settlement requirements plus origin and `payTo` authority binding | Adversarial poisoning corpus |
| Replay and double settlement | Payment identifier, request fingerprint, pessimistic lock, and for `upto` an on chain nonce and single use | Sequential, parallel, restart and cross resource replay |
| Duplicate service grant | Settlement finality gated `FINALIZED` to `EXECUTED` compare and set, with a transactional outbox or downstream idempotency in the strict profile | 1000 concurrent requests, at most one committed effect |
| Verify passes but settle fails | The protected handler runs only after finalised settlement, with pending recovery and a fail closed timeout | RPC timeout, expired auth and forced settlement failure |
| Header, proxy and cache confusion | A single canonical payment header, duplicate rejection, proxy normalisation, `private, no-store` and a correct `Vary` | nginx and CDN integration and leakage suite |
| Front running and redirection | Signed auth and envelope bound to the exact invocation, network, asset, recipient, amount or cap, nonce and expiry | Observed payload redirect and replay tests |
| SSRF and URL abuse | IP literal, loopback, link local, private, redirect and DNS rebinding policy | URL fuzz suite |
| Schema bombs | Size, depth and node limits, no remote references, bounded validator | CPU and memory budget tests |
| Signer compromise | Least privilege signer policy, secret manager, rotation, and no withdrawal authority | Key flow review and a rotation drill |
| Signer authority spoofing | Offer and receipt JWS keys bound to the resource origin via did:web, DNS or an on chain binding, kept separate from the payment address | Unauthorised but valid signature rejection |
| RPC and supply chain | Failover, pinned lockfile, provenance, SBOM, signature and checksum | Failover drill and dependency report |
| Search prompt and HTML injection | Metadata is not executable content, JSON encoded, and never HTML rendered | XSS and injection tests |
| Abuse and denial of service | Tenant quotas, body and query cost limits, database timeouts, queue backpressure | Load and abuse report |
| Sponsor fee amplification | Simulation first, fee and resource ceilings, a minimum economic amount, pre settlement revalidation and a circuit breaker | Zero value, expired and CPU heavy adversarial suite |

### 8.1 The MolexScope black box security profile

MolexScope tests both Molex402 and externally permitted x402 deployments with controlled
mutations derived from protocol compliant templates. Testnet is the default. Mainnet tests remain
non destructive and within an explicit opt in boundary. Each run produces a signed evidence bundle
containing the target URL, suite and commit version, network, payload digest, HTTP outcome,
transaction outcome and the oracle decision.

| Test family | Example mutation | Success criterion |
|---|---|---|
| Authorisation correctness | Network, scheme, token, recipient, amount or cap, signer, nonce, expiry | Every mismatch fails closed in verify and settle |
| Execution safety | Zero value, expired or stale proof, resource fee ceiling, unexpected auth tree | No unsafe or economically meaningless submission |
| Payment to service correspondence | Same payment with a different route, body or operation identifier | 409, no second execution and no second response |
| Concurrency and idempotency | 1000 parallel requests with the same header, a transactional fixture and a process restart | One settlement, at most one committed effect |
| HTTP edge safety | Duplicate header, alias header, proxy merge, CDN caching | Ambiguous request rejected, no paid content leak |
| Discovery integrity | Route traversal, SSRF icon, schema bomb, forged origin or `payTo` | Rejected or soft dropped, with an explainable result |

### 8.2 Licence policy

The contract, SDK and service code developed by this repository and project is Apache 2.0. CI
scans direct and transitive dependency licences, blocks any AGPL, GPL or unclear licence from
merging into the runtime path, and publishes an SPDX SBOM on every release.

**OpenZeppelin boundary.** Because of the AGPL 3.0 path of the OpenZeppelin Relayer and its x402
facilitator plugin and SDK, none of these become a code base, library, container or mandatory
runtime dependency of this RFP delivery. If desired they may be used as an external endpoint in
interoperability testing only. The self host product runs independently of them.

### 8.3 Data protection and user tracking

- The facilitator builds no profile beyond the account and transaction data required for the
  payment. A private key or seed is never taken or logged.
- Hosted rate limit identity is HMAC hashed. Raw IP addresses are not kept in application logs.
  Security logs default to 30 days and metrics aggregate at 90 days, both operator configurable.
- Using search queries for product development is disabled by default. Opt in, PII redaction and
  anonymisation are required.
- Self host telemetry is off by default. It is stated explicitly in the documentation that public
  chain transaction data is permanent on chain.

---

## 9. Reliability, deployment and operations

### 9.1 Service level objectives and degraded behaviour

| Area | Target | Degraded behaviour |
|---|---|---|
| Hosted availability | Monthly at least 99.0 percent | Read only catalog, health status and retry after |
| `/verify` latency | p95 under 300 ms excluding RPC | RPC failover, typed retryable error |
| `/settle` acceptance latency | p95 under 2 s plus ledger finality | Idempotent pending status, status polling |
| Discovery list | p95 under 250 ms | Replica or cache, stale age header |
| Search | p95 under 500 ms | Lexical fallback and `partialResults: true` |
| Grant integrity | Duplicate execution rate of zero, pre finality grants of zero | Fail closed, pending recovery and status polling |
| Security evidence freshness | Strict profile within 24 hours, or until the deployment fingerprint changes | Expired profile degraded, outside strict auto pay |
| Recovery | RPO at most 15 minutes, RTO at most 60 minutes | Point in time recovery backup and a documented restore drill |

### 9.2 Deployment forms

- **Hosted testnet.** A free public endpoint requiring no API key, with anonymous rate limiting
  by HMAC hashed IP and abuse signal, open limit headers and a frictionless quickstart.
- **Hosted mainnet.** API key or JWT tenancy, configurable quota, metering and an operator fee.
  Caller auth can be fully disabled or changed by a self hoster.
- **Self host.** Pinned Docker images, a Docker Compose quickstart, migrations, secret templates,
  health checks and an upgrade guide.
- **Kubernetes.** Optional production manifests, a PodDisruptionBudget, probes and horizontal
  scale.
- **Embedded self facilitation.** A library mode in which the resource server can use the verify
  and settle adapter in the same process, with no mandatory dependency on an external hosted
  service.

The operations runbook covers key rotation, channel account refill and recovery, database backup
and restore, failed and pending transactions, RPC outage, testnet reset, incident communication
and rollback. The dashboard shows request, verify and settle rates, error codes, chain finality,
queue depth, channel availability, catalog rejections, search latency and quality, and service
level objective burn rate.

---

## 10. Conformance and acceptance evidence

### 10.1 The mandatory conformance package

1. The official stock x402 client, with no client fork and no Molex specific code path.
2. Four independent end to end runs: testnet with `exact`, testnet with `upto`, pubnet with
   `exact`, pubnet with `upto`.
3. For each run, the request and response fixture, package and commit version, network, asset,
   amount, timestamp and a durable transaction hash.
4. Scheme and network assertions inside `/supported`, together with `extra.areFeesSponsored`.
5. The official `payload:{transaction}` shape in the wire payload fixture, validated against the
   upstream schema.
6. For every invalid case, an HTTP status, a machine readable code and a non empty reason.
7. The official end to end suite of the upstream x402 repository, at a pinned commit, passing in
   a clean environment on both `stellar:testnet` and `stellar:pubnet`. Raw CI logs are attached to
   the report.
8. A stock MCP client completing search, inspect, prepare, wallet sign, paid retry and receipt.
9. A cross conformance matrix against at least one external facilitator or resource
   implementation.
10. Validation of the official payment identifier and the offer and receipt extensions with stock
    extension utilities, showing that core payment compatibility is not broken while the Molex
    specific integrity extension is present.
11. The MolexGuard strict profile end to end: discover, security profile, signed offer, request
    bind, finalised settle, single execute, signed evidence, and independent verification.

### 10.2 Test matrix

| Suite | Coverage | Final threshold |
|---|---|---|
| Unit, property and fuzz | Amount and cap, XDR and auth, nonce, URL and template, schema limits | 100 percent of critical branches, with a mutation score report |
| Wire conformance | 3 endpoints, 2 networks, 2 schemes, response and error shapes | All normative fixtures pass |
| Token auth | SAC, classic and custom `__check_auth` | Positive and negative cases |
| Wallet, expiry and trustline | Auth entry signing, `maxTimeoutSeconds` to ledger expiry, payer and recipient trustlines, smart account budget policy | Stock wallet and helper end to end, plus `op_no_trust` recovery |
| Bazaar integrity | Forged identity, SSRF, refs, encoded traversal, duplicate poisoning | 100 percent of the known corpus blocked or soft dropped |
| Upto contract | Exact auth tree, recipient, cap, request, nonce and expiry, authorised facilitator, zero, partial and maximum, replay, TTL, arbitrary token and resource bounds, no custody, admin or upgrade | Unit, property, fuzz, snapshot and mutation, plus testnet and pubnet contract and WASM evidence |
| Atomic grant gate | Pre finality grant, cross resource replay, transactional counter and outbox, downstream service idempotency, 1000 concurrent duplicates, crash recovery | Zero early grants, one settlement, at most one committed effect in the strict fixture |
| HTTP edge safety | Duplicate and alias payment header, proxy merge, CDN cache leak | Ambiguous requests rejected, protected body leak of zero |
| Integrity evidence | Offer, request, payment, transaction and response digests, signer authorization and rotation | All tamper tests rejected |
| MolexScope profile | Black box authorization, execution, replay, HTTP edge and discovery tests | A versioned evidence bundle and the Bazaar strict filter |
| Search quality | A versioned intent set and structured filters | nDCG and Recall targets |
| Load and soak | Parallel verify and settle, channel accounts, catalog and search | No sequence collision, service level objectives met |
| Chaos and recovery | RPC, database, queue, process restart, stale sequence | No duplicate economic effect, RTO and RPO met |
| Clean room developer experience | A new developer self hosts and lists a seller | Under one hour, using only published documentation |

---

## 11. Deliverables and the 22 week schedule

Dates are relative to the grant start. Every deliverable requires a public repository artifact and
reproducible evidence, not a demonstration alone.

### Tranche 0, award activation, week 0

Under the SCF structure this payment opens automatically on award approval and is not treated as a
separate milestone acceptance. The inception work below starts in the first two weeks after the
award and is included in the Delivery 1 evidence package.

- A public repository under Apache 2.0, a contribution and security policy, CI, a dependency
  licence gate and an SBOM.
- Final architecture decision records, and hosted, self host and embedded deployment skeletons.
- An x402 TSC `upto` contract and design issue, a review calendar and a draft specification pull
  request.
- The MolexGuard state machine and request fingerprint architecture decision record, the
  MolexScope ethics and test policy, and the threat model.
- Golden wire fixtures, the conformance and security harness skeleton, and the testnet
  environment.

### Delivery 1, facilitator MVP, `exact` conformance and the MolexGuard core, weeks 1 to 6

- `/supported`, `/verify` and `/settle` on `@x402/stellar`, with SAC, classic and custom auth.
- A permissive channel account and fee bump submitter, fee sponsorship, pre settlement
  revalidation, and auth, metering and rate limits.
- MolexGuard seller middleware: the official payment identifier, request fingerprint, PostgreSQL
  state machine, pessimistic lock, finality gate and same request cached response.
- Stock client end to end for `exact` on testnet and pubnet, with two transaction hashes.
- On testnet, 1000 concurrent replays, cross resource binding and settle failure tests, Docker
  Compose, health and metrics, and a basic runbook.

**Acceptance.** A public release, two `exact` transaction hashes, captured wire fixtures, a live
testnet endpoint, a raw test log showing that in a strict transactional fixture the same payment
across 1000 parallel requests produces one settlement and at most one committed effect, and proof
that a settle failure case delivers zero paid body.

### Delivery 2, the Bazaar, MCP, MolexScope and secure `upto`, weeks 7 to 14

- Secure Bazaar ingestion, HTTP and MCP identity, soft drop, extension responses, security profile
  states and an off chain evidence index.
- `/discovery/resources`, `/discovery/search`, the security and evidence endpoints, the strict
  filter, cursors, `partialResults` and the quality evaluation.
- The agent facing MCP server and seller and buyer helpers, `get_security_profile`,
  `verify_interaction` and two testnet integrations.
- The immutable `UptoSettlement` contract, smart account policy helpers, a testnet end to end, the
  contract ID and WASM hash, and specification and implementation pull requests upstream.
- MolexScope authorization, execution, replay, header and cache, and discovery test families, and
  a signed evidence bundle.
- Alongside the official offer and receipt, the `molex-integrity` extension and an independent
  verifier, plus adversarial security, search and interoperability interim reports.

**Acceptance.** A live Bazaar and MCP demonstration, testnet `upto` transaction, contract and WASM
evidence, pull request links, a MolexScope report, a strict security profile filter end to end,
and two recorded runs of discover, verify profile, pay, receive and verify evidence.

### Delivery 3, mainnet, upstream merge and production acceptance, weeks 15 to 22

- After the Audit Bank review and findings remediation, a mainnet production tag, the
  `UptoSettlement` pubnet deployment, four payment hashes and 2 by 2 conformance, with the final
  report carrying a permanent list of the contract and WASM hashes.
- The `upto` specification and implementation merged upstream, with TSC decisions taken into the
  release.
- Two live end to end integrations, production MolexGuard and integrity evidence, a role based
  contribution to the Stellar documentation, and a clean room developer experience test under one
  hour.
- The Audit Bank review of the settlement path, auth entry validation, the `upto` contract, the
  atomic grant gate and discovery and evidence integrity, with all findings remediated.
- Load, chaos and failover, proxy and CDN cache, duplicate grant and security profile drift
  reports, and a 99 percent service level objective dashboard.
- A production hosted endpoint, a self host release, a backup and restore drill, and an incident
  and maintenance handover.

**Acceptance.** A tagged release, upstream merge links, the Audit Bank artifact, the final
conformance report, public dashboards and a status page, integration links and third party
reproduction evidence.

---

## 12. Business model and sustainability

### 12.1 Fee model

- **Testnet.** Verification and settlement are free. Rate limiting exists against abuse.
- **Self host.** The Molex402 platform fee is zero. The operator pays only chain, RPC and
  infrastructure cost.
- **Hosted mainnet.** A proposed starting model of 0.25 percent per settlement with a maximum of
  0.05 dollars. The rate, the minimum and maximum, and the sponsorship policy are configurable
  and not hard coded. Chain cost is transparent in `/supported` and the pricing document, and
  there is no hidden spread.
- **Enterprise.** A fixed monthly capacity and service level plan. Protocol behaviour and catalog
  ordering are never changed in favour of a paying party.

Prices are validated against real cost measurement before launch. Changes are published on a
versioned pricing page with at least 30 days notice. If sponsored placement ever exists in search
ranking it is separated from the organic score. There is no sponsored ranking in the version one
grant delivery.

### 12.2 Maintenance after the grant

- A minimum of 12 months after the final release: critical security fixes triaged within 48
  hours, a plan for high severity issues within 5 business days, and a monthly specification
  drift review.
- A public issue tracker, a security disclosure address, a release cadence and a deprecation
  policy.
- Hosted revenue funds RPC, monitoring and maintainer capacity. Self host and the core protocol
  remain open source.

---

## 13. Documentation, upstream and community

| Role | Documentation path | Acceptance |
|---|---|---|
| Seller | MolexGuard middleware, MCP wrapper, Bazaar metadata, payment identifier, offer and receipt, and parameter descriptions | A strict profile live catalog record from scratch in under one hour |
| Buyer and agent | Discovery, security profile, accepts selection, wallet signing, max spend, paid retry and evidence verification | Stock core plus a Molex strict end to end |
| Operator | Hosted, self host and embedded, keys, channels, quotas, security scans, evidence retention, backup and incidents | Clean room deploy plus a recovery and security drift drill |
| Protocol contributor | The `upto` specification and contract, the auth argument trust model, smart account policy, fixtures and conformance | Upstream merge and TSC sign off |

The documentation information architecture is organised around the reader's question of what they
are building, in the manner of the Algorand x402 developer hub the RFP references. Relevant parts
are offered to the Stellar Developer Docs as a pull request. Throughout the grant a public status
update is published every two weeks, covering acceptance criteria, demonstration and pull request
links, metrics, risks and the target for the following two weeks. A critical blocker or a scope
change is not concealed, and decision records are kept public.

### 13.1 The evidence standard for the two end to end integrations

- **Integration A.** A genuine HTTP resource server, with Bazaar auto catalog, search, `exact` and
  `upto` payment and a paid response.
- **Integration B.** A genuine MCP server and tool, with tuple identity, an MCP discovery server,
  a wallet callback and a paid tool result.
- Each carries a repository and owner, live testnet and pubnet endpoints, transaction hashes, a
  catalog identity, a demonstration and independent reproduction steps.
- A partner name is used only where there is written confirmation or a link. Claiming a logo or a
  partnership without confirmation is prohibited.

---

## 14. Definition of done

- [ ] An Apache 2.0 repository with no AGPL runtime or transitive path, and a release SBOM.
- [ ] `/supported`, `/verify` and `/settle` built on `@x402/stellar` and compatible with the stock
      client.
- [ ] Testnet and pubnet by `exact` and `upto`, four end to end runs and four durable transaction
      hashes published.
- [ ] `extra.areFeesSponsored`, the official payload shape and non null rejection reasons proven in
      the conformance report.
- [ ] SAC, classic and custom `__check_auth`, and replay, expiry, trustline and resource limit
      tests passed.
- [ ] A public testnet running free and without an API key, and mainnet caller auth, metering, rate
      limit and fee policy configurable.
- [ ] `signatureExpirationLedger` derived from `maxTimeoutSeconds`, and payer and recipient
      trustline onboarding and wallet auth entry signing examples working.
- [ ] The `upto` specification and implementation merged upstream, the immutable contract's
      recipient, cap, request, nonce and expiry binding, the contract ID and WASM hash, and the
      smart account policy public and TSC approved.
- [ ] Bazaar auto catalog, HTTP and MCP identity, integrity, soft drop and encoded traversal tests
      passed.
- [ ] The catalog outcome returned to the seller in the `EXTENSION-RESPONSES` header with
      `success`, `processing` or `rejected`, a code and a non null reason.
- [ ] `/discovery/resources` with all filters and offset, and `/discovery/search` with a cursor,
      `partialResults` and the quality targets, working.
- [ ] The agent facing MCP server completing search, pay and retry with a stock client.
- [ ] The MolexGuard strict profile delivering no paid body before settlement finality, and in a
      transactional or idempotent fixture 1000 parallel replays producing one settlement and at
      most one committed effect.
- [ ] Molex integrity evidence alongside the official payment identifier and the offer and receipt
      extensions, with the request, offer, payment, transaction and response digests verifiable by
      an independent verifier.
- [ ] The MolexScope black box suite running authorization, execution, replay, HTTP edge and
      discovery tests, and publishing a signed evidence bundle.
- [ ] The Bazaar publishing `discovered`, `verified`, `degraded`, `quarantined` and `revoked`
      states and the `securityProfile=strict` filter.
- [ ] Seller, buyer and agent and operator helpers and role documentation letting a clean room user
      create a live Bazaar record in under one hour.
- [ ] Two genuine end to end integrations published with a live URL, repository, demonstration,
      catalog identity and transaction evidence.
- [ ] The Audit Bank review and remediation complete before the mainnet production tag, and the
      `upto` contract, atomic grant gate, front running, cache and header, conformance, load and
      interoperability reports public.
- [ ] A hosted 99 percent service level objective, degraded paths, monitoring, backup and restore,
      and the incident runbook validated.
- [ ] Maintenance owners, the 12 month plan, the business model and a two weekly community update
      history in place.

---

## 15. What exists at the end of the phases

At the end of 22 weeks Molex402 is not only a facilitator endpoint or a search demonstration. What
emerges is an end to end open source layer in which a seller publishes a paid service, an agent
selects a service according to security evidence, payment happens gaslessly on Stellar, the
transactional or idempotent service effect of the strict profile is made singular, and every
interaction can be verified independently.

| Phase | The working product that appears | The foundation it carries to the next phase |
|---|---|---|
| Weeks 1 to 6 | A testnet and pubnet `exact` facilitator, stock client wire compatibility, fee sponsorship, durable settlement, and the first MolexGuard one time execution middleware | A trustworthy payment and a payment to service state machine |
| Weeks 7 to 10 | The immutable `UptoSettlement` contract, cap, recipient, request, nonce and expiry binding, testnet deployment and upstream adapters | A shared security base for both fixed and usage based pricing |
| Weeks 7 to 14 | HTTP and MCP auto catalog, search, the strict security filter, MolexScope black box tests, signed interaction evidence and the agent facing MCP | The agent evaluating risk before paying, not merely paying |
| Weeks 15 to 22 | Mainnet deployments, Audit Bank remediation, hosted and self host releases, two live integrations, service level objectives, dashboards, runbooks and an independent reproduction package | A product that can be operated after the grant and set up by other teams |

### 15.1 How the final product works from the user's perspective

1. **The seller publishes a service.** It adds MolexGuard middleware to an HTTP route or an MCP
   tool and declares the price, the Stellar network, the USDC recipient, the input and output
   schema and the Bazaar metadata.
2. **The first payment creates the catalog record.** The facilitator validates the Bazaar
   extension and moves the resource to `discovered` under its canonical identity.
3. **MolexScope tests the behaviour.** Request binding, settlement finality, duplicate grant,
   header and cache, auth correctness and metadata safety are tested. A successful evidence bundle
   makes the listing `verified`.
4. **The agent finds a safe service.** It states its need and its budget over MCP and filters for
   `securityProfile=strict` services only. It can see the price and the payment details in
   advance.
5. **The payment is prepared.** The seller returns a signed offer. A payment identifier and a
   request fingerprint are produced. A fixed amount is signed for `exact`, and a maximum cap and a
   request digest for `upto`. The buyer signs only a Stellar auth entry and does not need to hold
   XLM.
6. **The facilitator settles.** Auth and requirements are re simulated and validated, the
   facilitator sponsors the fee and sends the transaction to Stellar. The `upto` contract enforces
   that the actual amount is inside the cap, that the recipient is fixed and that the nonce is
   used only once.
7. **MolexGuard delivers once.** The protected handler runs only after ledger finality and, with a
   durable compare and set, exactly once. A parallel retry receives the same response, and a
   different request fingerprint is rejected.
8. **The agent verifies the evidence.** Using the canonical receipt it checks that the offer,
   request, payment, transaction and response digests inside the Molex integrity evidence match.
   The result and the evidence can be retained for later audit or dispute.

### 15.2 Concrete artifacts delivered

| Artifact | Content | User |
|---|---|---|
| Molex Facilitator | `/supported`, `/verify` and `/settle`, `exact` and `upto`, testnet and pubnet, fee sponsorship | Seller and operator |
| `UptoSettlement` contract | An immutable Soroban WASM, specification, test vectors, deployment identities and events | Protocol, wallet and facilitator teams |
| `@molex402/guard` | Seller middleware, request fingerprint, the atomic grant gate, cache and header policy and the evidence issuer | HTTP and MCP service developers |
| MolexScope CLI and runner | The black box security suite, a machine readable result and a signed evidence bundle | Operator, reviewer and ecosystem |
| The Bazaar | Auto catalog, list, search, security and evidence APIs and the profile lifecycle | Agents and buyers |
| Molex MCP server | Search, inspect, prepare, execute, status, security profile and interaction verification tools | Agent runtimes |
| SDK, helpers and examples | Seller HTTP and MCP wrappers, the buyer helper, the validator and two genuine end to end integrations | Developers |
| Production package | Docker and Kubernetes, migrations, dashboards, runbooks, SBOM, conformance, security and audit reports | Self host and hosted operators |

### 15.3 The boundary of the final product and an honest claim of success

Molex402 validates the binding between the payment and the delivered response bytes, the
transactional or idempotent service effect behaviour of the strict profile, and Stellar
settlement. An exactly once claim is not made for external side effects that are not integrated
with the MolexGuard transactional outbox or a persistent idempotency key. Those services are shown
as settlement gated. Neither is it claimed on its own that a seller's answer is factually correct
or commercially good. That requires a domain specific oracle, a validator or a dispute mechanism.
Batch settlement, long lived payment channels, a proof of correct computation through a trusted
execution environment or zero knowledge, and a general purpose reputation token are all outside
this grant scope.

**The final statement of success.** When Molex402 is complete, an agent will be able to discover a
Stellar priced HTTP or MCP service it has never integrated with, using security evidence, make an
`exact` or `upto` USDC payment without needing XLM, receive exactly one committed effect under the
strict transactional or idempotent profile, and independently verify the chain of offer, request,
settlement and response.

---

## 16. Official references

- [SCF Build Award, RFP Track](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track)
- [SCF budget and deliverable guidelines](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)
- [x402 on Stellar](https://developers.stellar.org/docs/build/agentic-payments/x402)
- [Built on Stellar x402 facilitators](https://developers.stellar.org/docs/build/agentic-payments/x402/built-on-stellar)
- [`@x402/stellar` on npm](https://www.npmjs.com/package/@x402/stellar)
- [x402 protocol](https://www.x402.org)
- [OpenZeppelin x402 facilitator guide, referenced for the licence boundary](https://docs.openzeppelin.com/relayer/guides/stellar-x402-facilitator-guide)

This document is the conversion of the RFP requirements accessible on 13 August 2026 into a
technical plan. Because the upstream x402 and Bazaar schemas may change, a version pin and a
weekly drift job apply throughout the implementation. The current fields, deadline and eligibility
provisions in the application form are to be re verified from the official SCF page at the moment
of submission.

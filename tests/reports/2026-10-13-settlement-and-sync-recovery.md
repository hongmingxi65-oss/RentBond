# Public settlement and projection recovery — 2026-10-13 MYT

## Confirmed user-owned transactions

The user completed two fictional Monad testnet leases. Independent read-only RPC observations are preserved in `2026-10-13-public-settlement-state.json` at block 70,451,662. No agent wallet signature or public transaction was submitted.

| Lease | Tenant withdrawn | Landlord withdrawn | Unallocated / claimable |
| --- | ---: | ---: | --- |
| 90a35fb5-033c-4c5d-b616-d75e1fe207ed | 1,000 MockUSD | 0 | All zero |
| b8b669ef-fe16-491f-aa4e-2383647afdd6 | 900 MockUSD | 100 MockUSD | All zero |

The second lease tested an accepted 100 MockUSD deduction, a disputed 200 MockUSD deduction, withdrawal of 700/100 undisputed funds, then dual-service timeout and the tenant's remaining 200 withdrawal. Active case phase is 5 (Finalized). This is evidence for the timeout route, not evidence that either resolver submitted an award. Screenshots alone were not used to infer the underlying event sequence.

## Defect and fix

Factory indexing already respected Monad's 100-block log-query limit. Escrow indexing still requested up to 1,000 blocks in one RPC call. Those requests failed, rolling back both event insertion and case projection. Production checkpoints were stuck at 70,421,117 and 70,432,630; the cases table was empty despite the user's successful transactions.

`chain.ts` now splits escrow event requests into inclusive ranges of at most 100 blocks on chain 10143 (1,000 elsewhere). It returns only after every range succeeds, preserving atomic checkpoint semantics. No roles, beneficiaries, contract rules, deadlines or ACL checks changed.

The client now reports a non-JSON upstream response as an ApiError retaining its HTTP status, and preserves the existing idempotency key for retry. This improves diagnosis; it does not prove that every upstream timeout is eliminated.

## Validation

From `apps/web`:

- `node --test src/server/tests/escrow-log-ranges.test.mjs src/features/live/client.test.mjs src/server/tests/live-chain.test.mjs src/server/tests/worker-runtime.test.mjs`: 19 passed, 0 failed.
- `npm run typecheck`: passed.
- New RPC tests check the 100-block boundary and rejection of a failed intermediate page without returning a partial batch.
- Existing local-EVM and worker tests cover fallback ACL, reorg/restart and deadline behavior. These are local tests, not additional public-wallet acceptance.

## Recovery observations

An initial worker-only overlay on release 76df627 was deployed to Azure. Subsequent read-only database checks showed the escrow checkpoints advancing to 70,431,117 and 70,441,630, recovered `CaseOpened` at block 70,441,301, and a stored case for the second lease. Recovery was still catching up at this intermediate observation.

Code release: `d714d0ea4377c6daf332ac4c414ee413b9718903`, parent `76df627e0713a92c420ef18d44a6840b5c829a43`, in hongmingxi65-oss/RentBond. Final deployment and catch-up results are recorded below when verified.

## Remaining boundaries

A finalized case is not currently assigned to an active resolver; an empty resolver list after finalization is expected. Resolver access uses the assigned-case route, not blanket access to `/leases/:id`.

Public primary/fallback award submission, independent-device account recovery, off-host restore and independent review remain unverified. MetaMask's hostname BLOCK classification was observed earlier; successful transactions do not establish why it was classified or clear that finding. Database synchronization still holds the existing global transaction lock while performing RPC work; lock contention is a residual operational risk, not silently declared fixed.

## Verified final release

- Vercel production deployment `4D8nWN4GdM66MTt91gqG91uZJJTF`: Ready / Current, commit d714d0e, 40-second build; canonical domain rentbond.vercel.app. See `vercel-production-d714d0e.jpg`.
- Azure source downloaded from the exact d714d0e GitHub archive. Image `rentbond-app:d714d0e`, ID `8cb7c9a75126`, built from the existing 76df627 image plus the two changed runtime source files and a fresh Next.js build. Web, API-worker and chain-worker all switched successfully; database/storage/quarantine/scanner/RPC health checks all true.
- Active compose override: `/opt/rentbond/releases/compose-d714d0e.yaml`, with the original Azure base compose and env file. Rollback is the previous 76df627 override plus `compose-escrow-log-fix-20261013.yaml`; no volumes, credentials or schema were changed.
- Final database observation: second lease checkpoint 70,454,278; case 1 phase 5 (Finalized); tenant withdrawn 900 / landlord 100 and all credits/unallocated zero. First lease checkpoint 70,446,117 already includes its full 1,000 withdrawal and zero remaining balances; it was still advancing through later empty blocks. No recent worker error output at this observation.
- Recovered withdrawal hashes: first full refund `0x4b3c131a21039da7b0c3f8628f094ca6bb5edd15136c78e24b1f107f3217f605`; second tenant 700 `0x7938eddff447b581cd180052abe8298e88ed55e4d89a9b82c5de7d514d9eef9c`; landlord 100 `0xf12c1645c12fb64470f6528c5e01b373db553afbf92e6e26144acc7f57baca2b`; final tenant 200 `0x6578c952efdcd46dc2213040dd3a7821fd8a028d848529eecb6420fff6da224c`.
- ServiceTimedOut was recovered at block 70,447,976, transaction `0xdf1238f509a8a815e464a533181c5a84718d3b87a90ef1374bd7c98ecee0376c`.
- Raw database verification: `2026-10-13-production-sync.txt`; public RPC state: `2026-10-13-public-settlement-state.json`; local test output: `2026-10-13-sync-regression.log` and `2026-10-13-typecheck.log`.

Post-release canonical API regression passed: `RENTBOND_TEST_BASE_URL=https://rentbond.vercel.app RENTBOND_TEST_PUBLIC_ORIGIN=https://rentbond.vercel.app node src/server/tests/http.integration.mjs --public-testnet`. Temporary-account SIWE, cross-lease ACL, private PNG upload, clean scanning, submit, automatic export, unchanged ZIP fixture, account-bound download, logout and post-logout denial all passed. No user account or on-chain transaction was used; disposable fictional API test records remain. Output: `2026-10-13-public-http.txt`.

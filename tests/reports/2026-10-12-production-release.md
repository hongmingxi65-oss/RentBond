# Production patch release — 2026-10-12

Canonical URL: https://rentbond.vercel.app/
Released source: `76df627e0713a92c420ef18d44a6840b5c829a43` (squash merge of https://github.com/hongmingxi65-oss/RentBond/pull/1).

## Release evidence

- PR head `03e6430b1dd451b697aed4a6e93b3aa1963b208e`: all six CI jobs, Scaffold checks and Staging configuration completed successfully before merge.
- Vercel project rentbond under hongmingxi65-5497: production deployment `dpl_7w2KLGgaHwUu6oTTY9iazrzRiRDf`, Ready, Current, canonical domain assigned, build duration 1m18s. Build logs confirm Next.js 15.5.27.
- [Vercel deployment](https://vercel.com/hongmingxi65-5497/rentbond/7w2KLGgaHwUu6oTTY9iazrzRiRDf); [screenshot](vercel-production-76df627.jpg).
- Azure built isolated source `/opt/rentbond/releases/76df627` from the exact release commit. Build exited 0; image `rentbond-app:76df627` (`b4d853795f06`). Existing working checkout and credentials were retained.
- New-image preflight passed PostgreSQL, 24 private tables with RLS, isolated private storage/quarantine, clean-fixture acceptance and EICAR rejection by ClamAV.
- Web, API worker and chain worker were switched to the new image and independently reported Next.js 15.5.27. Local health returned database/storage/quarantine/scanner/RPC true. `WORKER_EXECUTE=false` remains in effect.
- Public frontend homepage and /leases returned 200; unauthenticated session returned 401. No role wallet or chain transaction was signed.

## Post-release public API check

`RENTBOND_TEST_BASE_URL=https://rentbond.vercel.app RENTBOND_TEST_PUBLIC_ORIGIN=https://rentbond.vercel.app node src/server/tests/http.integration.mjs --public-testnet` (from apps/web) exited 0 after cutover. Health, temporary-account SIWE, cross-lease ACL, private upload, scanner processing, automatic export queue, unchanged ZIP fixture, account-bound download and logout passed. Fictional draft/file/export records remain under disposable test accounts. This does not cover MetaMask/Mera device UI or chain transactions.

## Operations and rollback

The active compose command uses the existing `.env.azure` and `compose.azure.yaml` under `/opt/rentbond/repo/infra/staging`, plus `/opt/rentbond/releases/compose-76df627.yaml`. Operators must include this override for future restarts, otherwise the base file still references the older images.

Rollback override `/opt/rentbond/releases/rollback-76df627.yaml` pins all three previous container image IDs. Use it instead of the release override with `docker compose ... up -d --no-deps --wait web api-worker chain-worker`. No database migration, volume deletion or credential replacement was performed. The cutover script was configured to roll back automatically if health/version verification failed; this release succeeded without rollback.

## Remaining acceptance

MetaMask malicious-site classification remains unexplained and was not bypassed. Full public user-device funding, settlement and withdrawal acceptance, independent security review and off-host backups remain outstanding. Dependency audit and service checks do not establish a false positive or complete security audit. No FR/SC/AT/TS is promoted to Verified.

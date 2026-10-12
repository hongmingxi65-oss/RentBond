# Public read-only demo — 2026-10-13 MYT

User authorized publication of a read-only presentation of the two fictional testnet leases. Added `/demo`, a static server-rendered page with scoped CSS, historical outcomes, native expandable receipt lists, public explorer links and a downloadable public-chain snapshot. Added navigation and homepage entry points. No API, private-file ACL, role authorization, wallet signing code, contract or deadline changed.

Published data is limited to scenario summaries and already-public contract/transaction data. No original uploaded document, invite token, credential or private lease API response is published. The snapshot is pinned to block 70,451,662 (2026-10-12 17:00:59 UTC), clearly identified as historical. Cases are finalized and cannot be taken over. Public actual resolver-award tests remain incomplete.

Validation: `npm run typecheck --prefix apps/web` and `npm run build --prefix apps/web` succeeded; build lists `/demo` as static. An initial local server launch hit an environment network-interface discovery error; explicit loopback hostname succeeded. Anonymous local HTTP checks passed for page/JSON, both rendered outcomes, conservation and zero remaining balances, no action forms, and homepage entry. React review: static server components, no new hooks or fetch waterfalls, native keyboard-operable details, semantic headings/navigation and responsive scoped CSS.

Production source commit: `e5128f949061e2ced7fa36bd084a81d3d973e839` in `hongmingxi65-oss/RentBond` main. Vercel deployment `GYuQe9evKCVPyB58Vx6UGL4wA25k` reached Ready / Production. Canonical verified URL: https://rentbond.vercel.app/demo . Backend remains d714d0e; no backend deployment was needed.

Anonymous production browser checks passed: both outcomes visible, both native receipt panels expand, recorded JSON downloads, and Create your own lease reaches the normal Account & recovery gate. Demo leases navigation returns to the public page without authentication. Screenshot: `2026-10-13-public-demo.jpg`.

Submission instructions are in `docs/contest/preset-demo-access.md`. These are completed read-only presets; interactive roles and actual resolver awards are not provided by this page.

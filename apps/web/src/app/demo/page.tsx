import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import styles from './demo.module.css';

export const metadata = {
  title: 'Demo leases | RentBond',
  description: 'Explore two completed fictional RentBond leases on Monad Testnet. Read-only settlement records, with public transaction evidence. No wallet required.',
};

const explorer = 'https://testnet.monadexplorer.com';
const transactions = [
  { title: 'Tenant withdrew the undisputed 700', amount: '700 MockUSD', hash: '0x7938eddff447b581cd180052abe8298e88ed55e4d89a9b82c5de7d514d9eef9c', block: '70,439,699' },
  { title: 'Landlord withdrew the accepted deduction', amount: '100 MockUSD', hash: '0xf12c1645c12fb64470f6528c5e01b373db553afbf92e6e26144acc7f57baca2b', block: '70,440,526' },
  { title: 'Remaining dispute entered the case process', amount: '200 MockUSD disputed', hash: '0x872f647d01c8737a431fa8e06ed8e78601e524428e67f3f3db29d1ba547cf0e6', block: '70,441,301' },
  { title: 'Fallback service timeout was recorded', amount: 'Timeout exit', hash: '0xdf1238f509a8a815e464a533181c5a84718d3b87a90ef1374bd7c98ecee0376c', block: '70,447,976' },
  { title: 'Tenant withdrew the remaining 200', amount: '200 MockUSD', hash: '0x6578c952efdcd46dc2213040dd3a7821fd8a028d848529eecb6420fff6da224c', block: '70,448,734' },
];

function ChainLink({ hash, label }: { hash: string; label: string }) {
  return <a className={styles.chainLink} href={`${explorer}/tx/${hash}`} target="_blank" rel="noopener noreferrer">{label} <span aria-hidden="true">↗</span><span className={styles.srOnly}> (opens in a new tab)</span></a>;
}

function Balances({ tenant, landlord }: { tenant: string; landlord: string }) {
  return <dl className={styles.balances}>
    <div><dt>Tenant withdrawn</dt><dd>{tenant}<small>MockUSD</small></dd></div>
    <div><dt>Landlord withdrawn</dt><dd>{landlord}<small>MockUSD</small></dd></div>
    <div><dt>Remaining in escrow</dt><dd>0<small>MockUSD</small></dd></div>
  </dl>;
}

export default function DemoPage() {
  return <div className={styles.page}>
    <div className={styles.network}>Monad Testnet · Chain 10143 · MockUSD has no cash value</div>
    <header className={styles.header}>
      <Link href="/" aria-label="RentBond home"><BrandLogo /></Link>
      <nav aria-label="Demo navigation"><a href="#partial-refund">Partial refund</a><a href="#full-refund">Full refund</a><Link href="/leases/new" className="btn">Create your own lease</Link></nav>
    </header>
    <main id="main" className={styles.main}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>PUBLIC DEMO · NO SIGN-IN REQUIRED</p>
        <h1>One dispute.<br /><em>Not the whole deposit.</em></h1>
        <p className={styles.lede}>Explore two completed test leases, from deductions to withdrawals. These are recorded Monad Testnet outcomes from fictional scenarios.</p>
        <div className={styles.notice}><strong>Read-only, completed leases</strong><span>No wallet connection or signature is needed. These records do not expire and cannot be replayed or taken over.</span></div>
      </section>

      <section id="partial-refund" className={styles.case} aria-labelledby="partial-title">
        <div className={styles.caseHeading}><div><p className={styles.eyebrow}>DEMO 01 · PARTIAL REFUND + TIMEOUT EXIT</p><h2 id="partial-title">Keep the dispute to 200.</h2></div><span className={styles.badge}>Settled · fully withdrawn</span></div>
        <p>A 1,000 MockUSD deposit. The tenant accepted a fictional 100 MockUSD cleaning deduction and disputed a fictional 200 MockUSD damage deduction.</p>
        <Balances tenant="900" landlord="100" />
        <p className={styles.balanceNote}>900 + 100 = the original 1,000 MockUSD deposit. Both parties’ claimable balances and the unallocated balance are zero.</p>
        <ol className={styles.steps}>
          <li><span>01</span><div><h3>Review each deduction</h3><p>The tenant accepted 100 and disputed 200. Each response was confirmed separately.</p></div></li>
          <li><span>02</span><div><h3>Withdraw the undisputed funds</h3><p>After the claim window closed, 700 was allocated to the tenant and 100 to the landlord. Each party then withdrew their share; 200 remained in dispute.</p></div></li>
          <li><span>03</span><div><h3>Use the timeout exit</h3><p>The primary and fallback service deadlines passed without an award. The timeout route returned the remaining 200 to the tenant, who withdrew it.</p></div></li>
        </ol>
        <div className={styles.boundary}><strong>What this case demonstrates</strong><p>Partial release and the dual-service timeout exit. Neither resolver submitted an award in this case; this is not a demonstration of a resolver deciding the dispute.</p></div>
        <details className={styles.evidence}>
          <summary>Inspect the five key transactions</summary>
          <ul className={styles.txList}>{transactions.map(tx => <li key={tx.hash}><div><h3>{tx.title}</h3><p>{tx.amount} · Block {tx.block}</p></div><ChainLink hash={tx.hash} label="View transaction" /></li>)}</ul>
          <p>Escrow contract <a className={styles.address} href={`${explorer}/address/0x3a174209a824fc8b6b96472d6b107378ffcc7da6`} target="_blank" rel="noopener noreferrer">0x3a174209a824fc8b6b96472d6b107378ffcc7da6 ↗</a></p>
        </details>
      </section>

      <section id="full-refund" className={styles.case} aria-labelledby="full-title">
        <div className={styles.caseHeading}><div><p className={styles.eyebrow}>DEMO 02 · FULL REFUND</p><h2 id="full-title">No deductions. Full return.</h2></div><span className={styles.badge}>Settled · fully withdrawn</span></div>
        <p>The first test lease completed checkout with no submitted deductions. After the claim window closed, the tenant’s full deposit was allocated and withdrawn.</p>
        <Balances tenant="1,000" landlord="0" />
        <p className={styles.balanceNote}>Original deposit: 1,000 MockUSD. Nothing remains unallocated or claimable.</p>
        <details className={styles.evidence}><summary>Inspect the full-refund transaction</summary><p><ChainLink hash="0x4b3c131a21039da7b0c3f8628f094ca6bb5edd15136c78e24b1f107f3217f605" label="View 1,000 MockUSD withdrawal" /> · Block 70,428,946</p><p>Escrow contract <a className={styles.address} href={`${explorer}/address/0x17864b27b439AADd045C494d72147E6B99CBeC63`} target="_blank" rel="noopener noreferrer">0x17864b27b439AADd045C494d72147E6B99CBeC63 ↗</a></p></details>
      </section>

      <section className={styles.tryIt} aria-labelledby="try-title"><div><p className={styles.eyebrow}>READY TO TRY THE WORKFLOW?</p><h2 id="try-title">Create a new test lease.</h2><p>Use separate landlord and tenant accounts on Monad Testnet. Start with a landlord draft, select an available verified test service, invite the tenant, and review the terms before funding.</p><p>Transactions need test MON for fees and the deposit needs MockUSD. Availability is not guaranteed. Resolver actions are restricted to the service’s assigned addresses; creating a lease does not give you those roles.</p><Link href="/leases/new" className="btn btn-primary">Start a new lease</Link></div><aside><h3>Before you start</h3><ul><li>These demo wallets are not shared.</li><li>New leases have their own deadlines.</li><li>Funding, deduction responses and withdrawals each require confirmation.</li><li>Upload fictional test materials only.</li></ul></aside></section>
      <footer className={styles.footer}><p><strong>Evidence snapshot</strong> · 12 October 2026, 17:00:59 UTC · Block 70,451,662</p><p>This page is a curated historical snapshot, not a live account balance. Only public contract data and fictional scenario summaries are published; private documents remain private.</p><a href="/demo/settlement-snapshot.json" download>Download the recorded chain snapshot (JSON)</a><span aria-hidden="true"> · </span><Link href="/">Back to RentBond</Link></footer>
    </main>
  </div>;
}

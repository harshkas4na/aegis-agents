/**
 * landing.ts — the human-facing console page served at GET /.
 *
 * Aegis is built agent-first (OpenAPI spec, skills.md, JSON everywhere) — but a
 * human landing on the bare Vercel URL deserves more than a blank screen. This
 * is a single self-contained HTML string: no build step, no external assets,
 * safe to serve straight out of the same serverless function as the API.
 */

export function renderLanding(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Aegis — agents pay for autonomous on-chain protection</title>
<meta name="description" content="x402 × Reactive Smart Contracts. AI agents pay in USDC; a Reactive Contract watches a threshold and acts, on a fixed cadence, with no bot and no human in the loop." />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0A0D12;
    --surface:#12161D;
    --surface-2:#171C24;
    --border:#232A33;
    --ink:#EDEFF2;
    --ink-dim:#8991A0;
    --ink-faint:#5B6472;
    --accent:#E8A33D;
    --accent-dim:#B98330;
    --safe:#4FA97E;
    --danger:#D4634A;
    --radius:10px;
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;}
  body{
    background:var(--bg);
    color:var(--ink);
    font-family:'IBM Plex Sans',system-ui,sans-serif;
    line-height:1.55;
    -webkit-font-smoothing:antialiased;
  }
  body::before{
    content:"";
    position:fixed;inset:0;
    background:
      radial-gradient(1200px 600px at 15% -10%, rgba(232,163,61,0.06), transparent 60%),
      radial-gradient(900px 500px at 100% 0%, rgba(79,169,126,0.04), transparent 55%);
    pointer-events:none;
    z-index:0;
  }
  .wrap{position:relative;z-index:1;max-width:1040px;margin:0 auto;padding:0 24px 96px;}
  a{color:var(--accent);text-decoration:none;}
  a:hover{text-decoration:underline;}
  a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
  code,.mono{font-family:'IBM Plex Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums;}

  /* ── Header / status bar ─────────────────────────────────────────── */
  header{
    display:flex;align-items:center;justify-content:space-between;
    padding:28px 0 20px;
    border-bottom:1px solid var(--border);
    margin-bottom:44px;
    gap:16px;flex-wrap:wrap;
  }
  .wordmark{
    font-family:'Big Shoulders Display',sans-serif;
    font-weight:800;
    font-size:28px;
    letter-spacing:0.02em;
    text-transform:uppercase;
    color:var(--ink);
    display:flex;align-items:center;gap:10px;
  }
  .wordmark .glyph{
    width:22px;height:22px;
    border:2px solid var(--accent);
    border-radius:5px 5px 5px 2px;
    position:relative;
    flex:none;
  }
  .wordmark .glyph::after{
    content:"";position:absolute;inset:4px;
    background:var(--accent);border-radius:2px;
  }
  #status-pill{
    display:flex;align-items:center;gap:8px;
    font-family:'IBM Plex Mono',monospace;
    font-size:12px;letter-spacing:0.04em;
    color:var(--ink-dim);
    padding:6px 12px;
    border:1px solid var(--border);
    border-radius:999px;
    background:var(--surface);
  }
  .dot{width:7px;height:7px;border-radius:50%;background:var(--ink-faint);flex:none;}
  .dot.live{background:var(--safe);box-shadow:0 0 0 0 rgba(79,169,126,0.5);animation:pulse 2.4s ease-out infinite;}
  .dot.degraded{background:var(--accent);}
  .dot.down{background:var(--danger);}
  @media (prefers-reduced-motion: reduce){ .dot.live{animation:none;} }
  @keyframes pulse{
    0%{box-shadow:0 0 0 0 rgba(79,169,126,0.45);}
    70%{box-shadow:0 0 0 8px rgba(79,169,126,0);}
    100%{box-shadow:0 0 0 0 rgba(79,169,126,0);}
  }

  /* ── Hero ─────────────────────────────────────────────────────────── */
  .hero h1{
    font-family:'Big Shoulders Display',sans-serif;
    font-weight:700;
    font-size:clamp(34px,5.4vw,56px);
    line-height:1.02;
    letter-spacing:0.005em;
    margin:0 0 18px;
    text-wrap:balance;
    max-width:18ch;
  }
  .hero h1 em{color:var(--accent);font-style:normal;}
  .hero p{
    color:var(--ink-dim);
    font-size:17px;
    max-width:62ch;
    margin:0 0 28px;
  }
  .hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px;}
  .btn{
    font-family:'IBM Plex Mono',monospace;
    font-size:13px;
    padding:11px 18px;
    border-radius:6px;
    border:1px solid var(--border);
    color:var(--ink);
    background:var(--surface);
    cursor:pointer;
    transition:border-color .15s ease, color .15s ease;
  }
  .btn:hover{border-color:var(--ink-faint);text-decoration:none;}
  .btn.primary{
    background:var(--accent);
    border-color:var(--accent);
    color:#1A1200;
    font-weight:500;
  }
  .btn.primary:hover{background:#f0ae4d;border-color:#f0ae4d;}

  /* ── Section scaffolding ──────────────────────────────────────────── */
  section{margin-top:72px;}
  .eyebrow{
    font-family:'IBM Plex Mono',monospace;
    font-size:11px;letter-spacing:0.12em;text-transform:uppercase;
    color:var(--ink-faint);
    margin:0 0 10px;
  }
  h2{
    font-family:'Big Shoulders Display',sans-serif;
    font-weight:700;
    font-size:26px;letter-spacing:0.01em;
    margin:0 0 6px;
    text-wrap:balance;
  }
  .section-sub{color:var(--ink-dim);font-size:15px;margin:0 0 28px;max-width:60ch;}

  /* ── Service cards ────────────────────────────────────────────────── */
  .services{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  @media (max-width:720px){.services{grid-template-columns:1fr;}}
  .gauge{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:var(--radius);
    padding:22px;
    display:flex;flex-direction:column;gap:14px;
  }
  .gauge-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
  .gauge h3{font-size:17px;font-weight:600;margin:0;color:var(--ink);}
  .pill{
    font-family:'IBM Plex Mono',monospace;
    font-size:10.5px;letter-spacing:0.06em;text-transform:uppercase;
    padding:3px 8px;border-radius:4px;
    background:rgba(79,169,126,0.12);
    color:var(--safe);
    border:1px solid rgba(79,169,126,0.28);
    white-space:nowrap;
  }
  .gauge p.desc{color:var(--ink-dim);font-size:13.5px;margin:0;}
  .gauge .row{display:flex;justify-content:space-between;font-size:13px;padding-top:10px;border-top:1px solid var(--border);}
  .gauge .row + .row{border-top:none;padding-top:0;}
  .gauge .row .k{color:var(--ink-faint);}
  .gauge .row .v{font-family:'IBM Plex Mono',monospace;color:var(--ink);}
  .gauge .price{font-family:'Big Shoulders Display',sans-serif;font-size:30px;color:var(--accent);font-weight:700;}
  .gauge .price small{font-family:'IBM Plex Sans';font-size:13px;color:var(--ink-faint);font-weight:400;margin-left:4px;}

  /* ── Flow track ───────────────────────────────────────────────────── */
  .flow{
    display:flex;
    border:1px solid var(--border);
    border-radius:var(--radius);
    overflow-x:auto;
    background:var(--surface);
  }
  .flow-step{
    flex:1 1 0;min-width:150px;
    padding:20px 18px;
    border-right:1px solid var(--border);
    position:relative;
  }
  .flow-step:last-child{border-right:none;}
  .flow-num{
    font-family:'IBM Plex Mono',monospace;
    font-size:11px;color:var(--accent);
    margin-bottom:8px;
  }
  .flow-step h4{margin:0 0 6px;font-size:14px;font-weight:600;color:var(--ink);}
  .flow-step p{margin:0;font-size:12.5px;color:var(--ink-dim);}

  /* ── Quickstart ───────────────────────────────────────────────────── */
  .quickstart{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  @media (max-width:780px){.quickstart{grid-template-columns:1fr;}}
  .panel{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:var(--radius);
    padding:22px;
  }
  .panel h3{margin:0 0 6px;font-size:15px;font-weight:600;}
  .panel p{margin:0 0 14px;color:var(--ink-dim);font-size:13.5px;}
  pre{
    background:var(--bg);
    border:1px solid var(--border);
    border-radius:6px;
    padding:14px 16px;
    overflow-x:auto;
    margin:0;
  }
  pre code{font-size:12.5px;color:#B7E4C9;line-height:1.6;}
  .panel .links{display:flex;flex-direction:column;gap:10px;margin-top:4px;}
  .panel .links a{font-family:'IBM Plex Mono',monospace;font-size:13px;display:flex;align-items:center;gap:8px;}
  .panel .links a::before{content:"→";color:var(--ink-faint);}

  /* ── Footer ───────────────────────────────────────────────────────── */
  footer{
    margin-top:80px;
    padding-top:22px;
    border-top:1px solid var(--border);
    display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;
    color:var(--ink-faint);
    font-family:'IBM Plex Mono',monospace;
    font-size:12px;
  }
  footer a{color:var(--ink-dim);}
  .testnet-flag{
    color:var(--accent-dim);
  }
</style>
</head>
<body>
<div class="wrap">

  <header>
    <div class="wordmark"><span class="glyph"></span>Aegis</div>
    <div id="status-pill"><span class="dot" id="status-dot"></span><span id="status-text">checking server…</span></div>
  </header>

  <div class="hero">
    <h1>Agents pay in USDC.<br>A contract <em>watches</em>.<br>Nothing sleeps.</h1>
    <p>Aegis is an x402 × Reactive Smart Contracts marketplace. An AI agent sends a few cents in USDC and gets a Reactive Contract that watches a threshold — an Aave health factor, a swap schedule — and acts the moment it's crossed. No bot, no keeper, no human on call.</p>
    <div class="hero-actions">
      <a class="btn primary" href="/openapi.yaml">OpenAPI spec</a>
      <a class="btn" href="/skills.md">skills.md for agents</a>
      <a class="btn" href="https://github.com/harshkas4na/aegis-agents" target="_blank" rel="noopener">Source on GitHub</a>
    </div>
  </div>

  <section id="services">
    <div class="eyebrow">Live catalog</div>
    <h2>Two services, priced by the second</h2>
    <p class="section-sub">Pulled live from <code>/api/services</code> on this deployment — what you see is what a paying agent sees.</p>
    <div class="services" id="services-grid">
      <div class="gauge">
        <div class="gauge-top"><h3>Aave Liquidation Protection</h3><span class="pill">live</span></div>
        <p class="desc">Monitors an Aave health factor; supplies collateral or repays debt the moment it drops below your threshold.</p>
        <div class="price">$0.25<small>/ day</small></div>
        <div class="row"><span class="k">Trigger</span><span class="v">HF &lt; threshold</span></div>
        <div class="row"><span class="k">Check interval</span><span class="v">~12 min</span></div>
      </div>
      <div class="gauge">
        <div class="gauge-top"><h3>DCA Strategy (Uniswap V3)</h3><span class="pill">live</span></div>
        <p class="desc">Periodic USDC → WETH swaps, sized and scheduled by you, executed autonomously via the Reactive Network.</p>
        <div class="price">$0.20<small>/ day</small></div>
        <div class="row"><span class="k">Trigger</span><span class="v">CRON tick + interval elapsed</span></div>
        <div class="row"><span class="k">Check interval</span><span class="v">~12 min</span></div>
      </div>
    </div>
  </section>

  <section id="flow">
    <div class="eyebrow">Mechanism</div>
    <h2>One payment, six steps, zero polling</h2>
    <p class="section-sub">Everything after step 2 happens without the agent's wallet signing anything else.</p>
    <div class="flow">
      <div class="flow-step"><div class="flow-num">01</div><h4>Discover</h4><p>Agent reads <code>/api/services</code> for pricing and limits.</p></div>
      <div class="flow-step"><div class="flow-num">02</div><h4>Pay (x402)</h4><p>POST returns <code>402</code>; agent signs EIP-3009, retries, USDC settles on Base Sepolia.</p></div>
      <div class="flow-step"><div class="flow-num">03</div><h4>Config on-chain</h4><p>Server writes the config to a Callback Contract and funds the Reactive Contract's gas.</p></div>
      <div class="flow-step"><div class="flow-num">04</div><h4>RC subscribes</h4><p>The Reactive Contract on Lasna picks up the event, subscribes to a CRON topic.</p></div>
      <div class="flow-step"><div class="flow-num">05</div><h4>Tick</h4><p>Every ~12 minutes the RC fires a callback back to Base Sepolia — rain or shine.</p></div>
      <div class="flow-step"><div class="flow-num">06</div><h4>Act</h4><p>The Callback Contract checks state and, if the threshold's crossed, acts on-chain.</p></div>
    </div>
  </section>

  <section id="quickstart">
    <div class="eyebrow">Get started</div>
    <h2>For a person, and for an agent</h2>
    <p class="section-sub">Same API either way — this just points you at the right door.</p>
    <div class="quickstart">
      <div class="panel">
        <h3>Try it from a terminal</h3>
        <p>See the live catalog, no wallet required:</p>
        <pre><code>curl https://aegis-agents-nu.vercel.app/api/services</code></pre>
      </div>
      <div class="panel">
        <h3>Wire it into an agent</h3>
        <p>Start with the skill card, then the full spec:</p>
        <div class="links">
          <a href="/skills.md">/skills.md — how an agent should call this</a>
          <a href="/openapi.yaml">/openapi.yaml — full endpoint reference</a>
          <a href="/health">/health — current RC funding status</a>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <span><span class="testnet-flag">● TESTNET</span> — Base Sepolia + Reactive Lasna. No real funds move.</span>
    <a href="https://github.com/harshkas4na/aegis-agents" target="_blank" rel="noopener">github.com/harshkas4na/aegis-agents</a>
  </footer>

</div>

<script>
(async () => {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  try {
    const res = await fetch('/health');
    const data = await res.json();
    if (data.status === 'ok') {
      dot.className = 'dot live';
      text.textContent = 'both services live';
    } else if (data.status === 'degraded') {
      dot.className = 'dot degraded';
      text.textContent = 'degraded — check /health';
    } else {
      dot.className = 'dot down';
      text.textContent = 'server error';
    }
  } catch {
    dot.className = 'dot down';
    text.textContent = 'unreachable';
  }

  try {
    const res = await fetch('/api/services');
    const { services } = await res.json();
    const grid = document.getElementById('services-grid');
    if (Array.isArray(services) && services.length) {
      grid.innerHTML = services.map(svc => \`
        <div class="gauge">
          <div class="gauge-top"><h3>\${svc.name}</h3><span class="pill">\${svc.status}</span></div>
          <p class="desc">\${svc.description}</p>
          <div class="price">\${svc.pricing.perDay}<small>/ day</small></div>
          <div class="row"><span class="k">Trigger</span><span class="v">\${svc.trigger}</span></div>
          <div class="row"><span class="k">1 day / 7 days</span><span class="v">\${svc.pricing.example1Day} / \${svc.pricing.example7Days}</span></div>
        </div>
      \`).join('');
    }
  } catch {
    /* static fallback cards already in the page — fine to leave them */
  }
})();
</script>
</body>
</html>`;
}

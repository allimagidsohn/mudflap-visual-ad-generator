<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mudflap Visual Ad Generator</title>
<style>
  :root {
    --navy: #021E70;
    --navy-dark: #000854;
    --blue: #0432BA;
    --blue-light: #4878FF;
    --green: #00BA7F;
    --green-dark: #00885D;
    --orange: #FE9738;
    --white: #FFFFFF;
    --gray-100: #F5F8FC;
    --gray-200: #EAF4FF;
    --gray-500: #546E7A;
    --gray-900: #02152A;
    --font: 'Segoe UI', system-ui, sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font); background: var(--gray-100); color: var(--gray-900); min-height: 100vh; }

  header {
    background: var(--navy-dark);
    padding: 14px 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  header h1 { color: white; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }

  .layout {
    display: grid;
    grid-template-columns: 370px 1fr;
    height: calc(100vh - 52px);
  }

  .panel {
    background: white;
    overflow-y: auto;
    border-right: 1px solid #e0e8f0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--gray-500);
    margin-bottom: 8px;
  }

  textarea {
    width: 100%;
    border: 1.5px solid #dde6f0;
    border-radius: 8px;
    padding: 10px 12px;
    font-family: var(--font);
    font-size: 13px;
    resize: vertical;
    min-height: 80px;
    color: var(--gray-900);
    outline: none;
    line-height: 1.5;
    transition: border-color 0.2s;
  }
  textarea:focus { border-color: var(--blue-light); }
  textarea::placeholder { color: #aab8cc; }

  input[type="text"] {
    width: 100%;
    border: 1.5px solid #dde6f0;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: var(--font);
    font-size: 13px;
    color: var(--gray-900);
    outline: none;
    transition: border-color 0.2s;
  }
  input[type="text"]:focus { border-color: var(--blue-light); }
  input[type="text"]::placeholder { color: #aab8cc; }

  .field-hint { font-size: 11px; color: #8ea0b5; margin-top: 5px; line-height: 1.4; }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    border: 1.5px solid #dde6f0;
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
    background: white;
    color: var(--gray-900);
    font-family: var(--font);
    user-select: none;
    transition: all 0.15s;
  }
  .chip:hover { border-color: var(--blue-light); color: var(--blue); }
  .chip.selected { background: var(--blue); border-color: var(--blue); color: white; font-weight: 600; }
  .chip.selected-green { background: var(--green); border-color: var(--green); color: white; font-weight: 600; }

  .assets-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .asset-thumb {
    border: 2px solid #dde6f0;
    border-radius: 8px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #f8fafc;
    padding: 6px;
    transition: all 0.15s;
    position: relative;
    overflow: hidden;
    flex-direction: column;
    gap: 2px;
  }
  .asset-thumb:hover { border-color: var(--blue-light); background: #eaf4ff; }
  .asset-thumb.selected { border-color: var(--green); background: #e8faf4; }
  .asset-thumb svg { width: 70%; height: 70%; }
  .asset-label { font-size: 9px; color: var(--gray-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }

  .stat-badge {
    display: inline-flex; align-items: center; gap: 4px;
    border: 1.5px solid #dde6f0; border-radius: 8px; padding: 5px 9px;
    font-size: 11px; cursor: pointer; background: white;
    transition: all 0.15s; font-family: var(--font);
  }
  .stat-badge:hover { border-color: var(--green); }
  .stat-badge.selected { border-color: var(--green); background: #e8faf4; color: var(--green-dark); font-weight: 600; }
  .stat-badge .val { font-weight: 700; font-size: 12px; }
  .stats-grid { display: flex; flex-wrap: wrap; gap: 5px; }

  .divider { border: none; border-top: 1px solid #edf2f7; }

  .gen-btn {
    background: var(--blue); color: white; border: none; border-radius: 8px;
    padding: 13px 20px; font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: var(--font); transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: auto;
  }
  .gen-btn:hover:not(:disabled) { background: var(--navy); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(4,50,186,0.25); }
  .gen-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Preview */
  .preview { background: #edf0f5; display: flex; flex-direction: column; overflow: hidden; }

  .preview-toolbar {
    background: white; border-bottom: 1px solid #e0e8f0;
    padding: 10px 20px; display: flex; align-items: center; gap: 8px;
  }
  .fmt-btn {
    border: 1.5px solid #dde6f0; border-radius: 7px; padding: 6px 14px;
    font-size: 12px; font-weight: 600; cursor: pointer; background: white;
    font-family: var(--font); transition: all 0.15s; color: var(--gray-900);
  }
  .fmt-btn:hover { border-color: var(--blue-light); }
  .fmt-btn.active { background: var(--navy-dark); border-color: var(--navy-dark); color: white; }
  .fmt-dims { font-size: 11px; color: var(--gray-500); margin-left: auto; }

  .preview-area {
    flex: 1; overflow: auto; display: flex; align-items: center;
    justify-content: center; padding: 28px;
  }

  .ad-wrapper {
    border-radius: 10px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.14);
    overflow: hidden;
    position: relative;
  }

  .preview-footer {
    background: white; border-top: 1px solid #e0e8f0;
    padding: 10px 20px; display: flex; align-items: center; justify-content: space-between;
  }
  .preview-info { font-size: 12px; color: var(--gray-500); }

  .dl-btn {
    background: var(--navy-dark); color: white; border: none; border-radius: 7px;
    padding: 9px 18px; font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: var(--font); transition: all 0.15s;
  }
  .dl-btn:hover { background: var(--blue); }
  .dl-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 14px; color: #8ea0b5; text-align: center;
  }
  .empty-state p { font-size: 13px; line-height: 1.5; max-width: 200px; }

  .loading-ring {
    width: 44px; height: 44px; border: 4px solid #dde6f0;
    border-top-color: var(--blue); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>

<header>
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
    <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="#00BA7F"/>
    <path d="M50 14 L86 50 L50 86 L14 50 Z" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <polygon points="50,32 44,50 56,50" fill="white"/>
    <rect x="47" y="50" width="6" height="10" fill="white"/>
  </svg>
  <h1>Mudflap · Visual Ad Generator</h1>
</header>

<div class="layout">

  <div class="panel">

    <div>
      <div class="section-label">What to communicate</div>
      <textarea id="message" placeholder="e.g. Fleet managers can save up to $1/gal on diesel with no credit check and no hidden fees"></textarea>
      <div class="field-hint">The key claim or benefit you want this ad to land.</div>
    </div>

    <hr class="divider">

    <div>
      <div class="section-label">Call to action</div>
      <div class="chips" id="cta-chips">
        <div class="chip" data-value="Apply for the card">Apply for the card</div>
        <div class="chip" data-value="Download the app">Download the app</div>
        <div class="chip" data-value="Go to website">Go to website</div>
        <div class="chip" data-value="Download the playbook">Download the playbook</div>
        <div class="chip" data-value="Calculate your savings">Calculate your savings</div>
        <div class="chip" data-value="Share with a friend">Share with a friend</div>
        <div class="chip" data-value="Follow on social">Follow on social</div>
        <div class="chip" data-value="No CTA">No CTA</div>
      </div>
    </div>

    <hr class="divider">

    <div>
      <div class="section-label">Funnel stage</div>
      <div class="chips" id="funnel-chips">
        <div class="chip selected" data-value="Awareness">Awareness</div>
        <div class="chip" data-value="Consideration">Consideration</div>
        <div class="chip" data-value="Conversion">Conversion</div>
        <div class="chip" data-value="Retargeting">Retargeting</div>
      </div>
    </div>

    <hr class="divider">

    <div>
      <div class="section-label">Layout style</div>
      <div class="chips" id="layout-chips">
        <div class="chip selected" data-value="Bold">Bold</div>
        <div class="chip" data-value="Clean">Clean</div>
        <div class="chip" data-value="Stat-forward">Stat-forward</div>
        <div class="chip" data-value="Minimal">Minimal</div>
      </div>
    </div>

    <hr class="divider">

    <div>
      <div class="section-label">Brand assets to include</div>
      <div class="assets-grid" id="assets-grid">

        <div class="asset-thumb selected" data-asset="logo">
          <svg viewBox="0 0 80 80" fill="none"><path d="M40 4 L76 40 L40 76 L4 40 Z" fill="#00BA7F"/><path d="M40 12 L68 40 L40 68 L12 40 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/><polygon points="40,28 34,46 46,46" fill="white"/><rect x="37" y="46" width="6" height="9" fill="white"/></svg>
          <div class="asset-label">Logo</div>
        </div>

        <div class="asset-thumb" data-asset="truck-front">
          <svg viewBox="0 0 80 60" fill="none"><rect x="10" y="18" width="60" height="32" rx="4" fill="#0432BA"/><rect x="14" y="22" width="24" height="18" rx="2" fill="#4878FF"/><rect x="14" y="22" width="24" height="9" rx="2" fill="#92BEFF" opacity="0.7"/><rect x="42" y="26" width="24" height="20" rx="2" fill="#021E70"/><circle cx="22" cy="52" r="5" fill="#02152A"/><circle cx="22" cy="52" r="3" fill="#546E7A"/><circle cx="58" cy="52" r="5" fill="#02152A"/><circle cx="58" cy="52" r="3" fill="#546E7A"/><rect x="6" y="30" width="7" height="5" rx="2" fill="#FFAE00"/><rect x="67" y="30" width="7" height="5" rx="2" fill="#FFAE00"/></svg>
          <div class="asset-label">Truck Front</div>
        </div>

        <div class="asset-thumb" data-asset="truck-side">
          <svg viewBox="0 0 100 52" fill="none"><rect x="38" y="6" width="57" height="32" rx="3" fill="#0432BA"/><rect x="4" y="12" width="36" height="26" rx="3" fill="#021E70"/><rect x="6" y="14" width="18" height="15" rx="2" fill="#4878FF" opacity="0.8"/><rect x="6" y="14" width="18" height="7" rx="2" fill="#92BEFF" opacity="0.6"/><circle cx="20" cy="44" r="6" fill="#02152A"/><circle cx="20" cy="44" r="3.5" fill="#455A64"/><circle cx="55" cy="44" r="6" fill="#02152A"/><circle cx="55" cy="44" r="3.5" fill="#455A64"/><circle cx="75" cy="44" r="6" fill="#02152A"/><circle cx="75" cy="44" r="3.5" fill="#455A64"/><rect x="0" y="24" width="6" height="6" rx="1" fill="#FFAE00"/></svg>
          <div class="asset-label">Truck Side</div>
        </div>

        <div class="asset-thumb" data-asset="fuel-pump">
          <svg viewBox="0 0 60 80" fill="none"><rect x="8" y="8" width="34" height="58" rx="4" fill="#00BA7F"/><rect x="12" y="12" width="26" height="18" rx="2" fill="white" opacity="0.9"/><text x="25" y="24" text-anchor="middle" font-size="9" fill="#00885D" font-weight="bold" font-family="sans-serif">$3.95</text><rect x="16" y="34" width="18" height="22" rx="2" fill="#00885D"/><path d="M42 18 Q52 18 52 28 L52 46" stroke="#021E70" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="52" cy="48" r="4" fill="#021E70"/><rect x="4" y="66" width="42" height="6" rx="2" fill="#021E70"/></svg>
          <div class="asset-label">Fuel Pump</div>
        </div>

        <div class="asset-thumb" data-asset="fuel-card">
          <svg viewBox="0 0 90 58" fill="none"><rect x="2" y="6" width="86" height="52" rx="6" fill="#0432BA"/><path d="M2 6 Q45 28 88 6" fill="#4878FF" opacity="0.25"/><path d="M2 34 Q45 54 88 34" fill="#00BA7F" opacity="0.18"/><rect x="8" y="14" width="20" height="14" rx="2" fill="#FFAE00" opacity="0.9"/><text x="45" y="27" text-anchor="middle" font-size="8" fill="white" font-weight="bold" font-family="sans-serif">MUDFLAP</text><text x="45" y="40" text-anchor="middle" font-size="7" fill="rgba(255,255,255,0.65)" font-family="sans-serif">•••• •••• •••• 4567</text><text x="74" y="52" text-anchor="middle" font-size="8" fill="white" font-weight="600" font-family="sans-serif">VISA</text></svg>
          <div class="asset-label">Fuel Card</div>
        </div>

        <div class="asset-thumb" data-asset="network">
          <svg viewBox="0 0 70 60" fill="none"><rect width="70" height="60" fill="#EAF4FF" rx="4"/><circle cx="14" cy="18" r="3" fill="#0432BA"/><circle cx="34" cy="10" r="3" fill="#0432BA"/><circle cx="56" cy="16" r="3" fill="#0432BA"/><circle cx="22" cy="36" r="3" fill="#00BA7F"/><circle cx="46" cy="30" r="3" fill="#00BA7F"/><circle cx="60" cy="44" r="3" fill="#0432BA"/><circle cx="9" cy="48" r="3" fill="#0432BA"/><line x1="14" y1="18" x2="34" y2="10" stroke="#4878FF" stroke-width="1" opacity="0.5"/><line x1="34" y1="10" x2="56" y2="16" stroke="#4878FF" stroke-width="1" opacity="0.5"/><line x1="22" y1="36" x2="46" y2="30" stroke="#00BA7F" stroke-width="1" opacity="0.5"/><line x1="46" y1="30" x2="60" y2="44" stroke="#00BA7F" stroke-width="1" opacity="0.5"/></svg>
          <div class="asset-label">Network</div>
        </div>

        <div class="asset-thumb" data-asset="savings-badge">
          <svg viewBox="0 0 70 50" fill="none"><rect x="2" y="2" width="66" height="46" rx="8" fill="#00BA7F"/><text x="35" y="22" text-anchor="middle" font-size="15" fill="white" font-weight="bold" font-family="sans-serif">$1/gal</text><text x="35" y="38" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.85)" font-family="sans-serif">savings off</text></svg>
          <div class="asset-label">Stat Badge</div>
        </div>

        <div class="asset-thumb" data-asset="diamond-shape">
          <svg viewBox="0 0 60 60" fill="none"><rect width="60" height="60" fill="#021E70" rx="4"/><path d="M30 6 L54 30 L30 54 L6 30 Z" fill="none" stroke="#4878FF" stroke-width="1.5" opacity="0.5"/><path d="M30 14 L46 30 L30 46 L14 30 Z" fill="none" stroke="#00BA7F" stroke-width="1" opacity="0.4"/><circle cx="30" cy="30" r="4" fill="#00BA7F" opacity="0.6"/></svg>
          <div class="asset-label">BG Pattern</div>
        </div>

        <div class="asset-thumb" data-asset="piggy-bank">
          <svg viewBox="0 0 70 65" fill="none"><ellipse cx="35" cy="40" rx="24" ry="18" fill="#5CD3AD"/><circle cx="48" cy="30" r="8" fill="#5CD3AD"/><circle cx="51" cy="28" r="2.5" fill="white"/><ellipse cx="50" cy="37" rx="4" ry="2.5" fill="#00885D"/><path d="M20 37 Q15 44 18 50 L14 56 L22 54" stroke="#00885D" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 54 L32 59 L38 54 M40 54 L46 59 L52 54" stroke="#00885D" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="30" y="18" width="10" height="15" rx="2" fill="#FFAE00"/><path d="M35 14 L35 18 M32 15.5 L35 18 L38 15.5" stroke="#FFAE00" stroke-width="2" stroke-linecap="round"/></svg>
          <div class="asset-label">Savings</div>
        </div>

      </div>
    </div>

    <hr class="divider">

    <div>
      <div class="section-label">Key stat to highlight</div>
      <div class="stats-grid" id="stats-grid">
        <div class="stat-badge" data-value="Up to $1/gal off"><span class="val">$1/gal</span>&nbsp;off</div>
        <div class="stat-badge" data-value="Over $1 billion saved"><span class="val">$1B+</span>&nbsp;saved</div>
        <div class="stat-badge" data-value="94% recommend Mudflap"><span class="val">94%</span>&nbsp;recommend</div>
        <div class="stat-badge" data-value="3,600+ in-network fuel stops"><span class="val">3,600+</span>&nbsp;stops</div>
        <div class="stat-badge" data-value="515,000+ drivers"><span class="val">515K+</span>&nbsp;drivers</div>
        <div class="stat-badge" data-value="No credit check required"><span class="val">Zero</span>&nbsp;credit check</div>
        <div class="stat-badge" data-value="No hidden fees ever"><span class="val">No</span>&nbsp;hidden fees</div>
        <div class="stat-badge" data-value="24/7 live US-based support"><span class="val">24/7</span>&nbsp;support</div>
      </div>
    </div>

    <hr class="divider">

    <div>
      <div class="section-label">Background / visual direction</div>
      <input type="text" id="bg-prompt" placeholder="e.g. open highway at dusk, aerial fuel stop, fleet on I-80…">
      <div class="field-hint">Optional scene or mood — Claude will use this to style the background.</div>
    </div>

    <button class="gen-btn" id="gen-btn" onclick="generate()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Generate visual →
    </button>

  </div>

  <!-- Preview -->
  <div class="preview">

    <div class="preview-toolbar">
      <button class="fmt-btn active" onclick="setFormat('square', this)">Square 1:1</button>
      <button class="fmt-btn" onclick="setFormat('story', this)">Story 9:16</button>
      <button class="fmt-btn" onclick="setFormat('landscape', this)">Landscape 1.91:1</button>
      <span class="fmt-dims" id="fmt-dims">1080 × 1080</span>
    </div>

    <div class="preview-area" id="preview-area">
      <div class="empty-state" id="empty-state">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none"><path d="M32 4 L60 32 L32 60 L4 32 Z" stroke="#ccd5e0" stroke-width="3" fill="none"/><circle cx="32" cy="32" r="5" fill="#ccd5e0"/></svg>
        <p>Fill in what to communicate, pick your CTA, and hit Generate</p>
      </div>
    </div>

    <div class="preview-footer">
      <span class="preview-info" id="preview-info">Ready</span>
      <button class="dl-btn" id="dl-btn" onclick="downloadPNG()" disabled>Download PNG</button>
    </div>

  </div>
</div>

<script>
// ─── State ───
let currentSVG = null;
let selectedCTA = null;
let selectedFunnel = 'Awareness';
let selectedLayout = 'Bold';
let selectedAssets = new Set(['logo']);
let selectedStat = null;
let currentFormat = 'square';

const FORMATS = {
  square:    { w: 1080, h: 1080, label: '1080 × 1080', vw: 420, vh: 420 },
  story:     { w: 1080, h: 1920, label: '1080 × 1920', vw: 252, vh: 448 },
  landscape: { w: 1920, h: 1080, label: '1920 × 1080', vw: 560, vh: 315 },
};

// Chip handlers
document.getElementById('cta-chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  document.querySelectorAll('#cta-chips .chip').forEach(x => x.classList.remove('selected'));
  c.classList.add('selected');
  selectedCTA = c.dataset.value;
});
document.getElementById('funnel-chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  document.querySelectorAll('#funnel-chips .chip').forEach(x => x.classList.remove('selected'));
  c.classList.add('selected');
  selectedFunnel = c.dataset.value;
});
document.getElementById('layout-chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  document.querySelectorAll('#layout-chips .chip').forEach(x => x.classList.remove('selected'));
  c.classList.add('selected');
  selectedLayout = c.dataset.value;
});
document.getElementById('assets-grid').addEventListener('click', e => {
  const t = e.target.closest('.asset-thumb'); if (!t) return;
  const k = t.dataset.asset;
  if (selectedAssets.has(k)) { selectedAssets.delete(k); t.classList.remove('selected'); }
  else { selectedAssets.add(k); t.classList.add('selected'); }
});
document.getElementById('stats-grid').addEventListener('click', e => {
  const b = e.target.closest('.stat-badge'); if (!b) return;
  if (b.classList.contains('selected')) { b.classList.remove('selected'); selectedStat = null; }
  else { document.querySelectorAll('.stat-badge').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); selectedStat = b.dataset.value; }
});

function setFormat(fmt, btn) {
  currentFormat = fmt;
  document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('fmt-dims').textContent = FORMATS[fmt].label;
  if (currentSVG) renderSVG(currentSVG);
}

// ─── SVG renderer from spec ───
function buildSVG(spec, fmt) {
  const { w, h } = fmt;
  const isStory = h > w;
  const isLandscape = w > h;

  // Color scheme
  const schemes = {
    'navy-green':    { bg1: '#021E70', bg2: '#000854', accent: '#00BA7F', text: '#FFFFFF', sub: 'rgba(255,255,255,0.82)', badge: '#00BA7F' },
    'blue-white':    { bg1: '#0432BA', bg2: '#021E70', accent: '#00BA7F', text: '#FFFFFF', sub: 'rgba(255,255,255,0.82)', badge: '#FE9738' },
    'dark-gradient': { bg1: '#02152A', bg2: '#021E70', accent: '#00BA7F', text: '#FFFFFF', sub: 'rgba(255,255,255,0.75)', badge: '#00BA7F' },
    'green-accent':  { bg1: '#021E70', bg2: '#0432BA', accent: '#00BA7F', text: '#FFFFFF', sub: 'rgba(255,255,255,0.82)', badge: '#FE9738' },
  };
  const s = schemes[spec.colorScheme] || schemes['navy-green'];

  // Scale helpers
  const fs = (base) => Math.round(base * (w / 1080));
  const px = (v) => Math.round(v * (w / 1080));
  const py = (v) => Math.round(v * (h / 1080));

  const pad = px(72);
  const midX = w / 2;

  // Build elements
  let els = [];

  // ── Background ──
  els.push(`<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${s.bg1}"/>
      <stop offset="100%" stop-color="${s.bg2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>`);

  els.push(`<rect width="${w}" height="${h}" fill="url(#bg)"/>`);

  // Diagonal accent shape
  if (selectedLayout !== 'Minimal') {
    const diagX = isLandscape ? w * 0.55 : w * 0.62;
    els.push(`<polygon points="${diagX},0 ${w},0 ${w},${h} ${diagX - px(180)},${h}" fill="rgba(255,255,255,0.04)"/>`);
  }

  // Large diamond bg element
  if (selectedAssets.has('diamond-shape')) {
    const ds = px(560);
    const dx = isLandscape ? w * 0.78 : w * 0.82;
    const dy = isStory ? h * 0.35 : h * 0.5;
    els.push(`<polygon points="${dx},${dy - ds/2} ${dx + ds/2},${dy} ${dx},${dy + ds/2} ${dx - ds/2},${dy}" fill="rgba(72,120,255,0.12)" stroke="rgba(72,120,255,0.2)" stroke-width="${px(2)}"/>`);
  }

  // ── Logo (top left) ──
  if (selectedAssets.has('logo')) {
    const lsz = px(52);
    const lx = pad;
    const ly = py(52);
    els.push(`<g transform="translate(${lx},${ly})">
      <polygon points="${lsz/2},0 ${lsz},${lsz/2} ${lsz/2},${lsz} 0,${lsz/2}" fill="#00BA7F"/>
      <polygon points="${lsz/2},0 ${lsz},${lsz/2} ${lsz/2},${lsz} 0,${lsz/2}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="${px(2)}"/>
      <polygon points="${lsz/2},${lsz*0.28} ${lsz*0.38},${lsz*0.58} ${lsz*0.62},${lsz*0.58}" fill="white"/>
      <rect x="${lsz*0.44}" y="${lsz*0.58}" width="${lsz*0.12}" height="${lsz*0.18}" fill="white"/>
    </g>
    <text x="${lx + lsz + px(12)}" y="${ly + lsz * 0.67}" font-family="'Segoe UI',sans-serif" font-size="${fs(22)}" font-weight="700" fill="white" letter-spacing="1">MUDFLAP</text>`);
  }

  // ── Badge (top right) ──
  if (spec.badgeText) {
    const btw = px(160); const bth = py(52);
    const btx = w - pad - btw; const bty = py(48);
    els.push(`<rect x="${btx}" y="${bty}" width="${btw}" height="${bth}" rx="${px(6)}" fill="${s.badge}"/>
    <text x="${btx + btw/2}" y="${bty + bth * 0.65}" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="${fs(20)}" font-weight="800" fill="${s.bg2}">${spec.badgeText}</text>`);
  }

  // ── Main content area ──
  const contentY = isStory ? py(200) : py(160);
  const contentW = isLandscape ? w * 0.52 : w - pad * 2;

  // Stat-forward layout
  if (selectedLayout === 'Stat-forward' && spec.stat) {
    const statY = contentY + py(80);
    els.push(`<text x="${pad}" y="${statY}" font-family="'Segoe UI',sans-serif" font-size="${fs(140)}" font-weight="900" fill="${s.accent}" opacity="0.95">${spec.stat}</text>`);
    if (spec.statLabel) {
      els.push(`<text x="${pad}" y="${statY + py(60)}" font-family="'Segoe UI',sans-serif" font-size="${fs(28)}" fill="${s.sub}">${spec.statLabel}</text>`);
    }
    // Headline below stat
    const hlY = statY + py(140);
    els.push(wrapText(spec.headline, pad, hlY, contentW, fs(44), 'white', '800', w));
    if (spec.subheadline) {
      els.push(wrapText(spec.subheadline, pad, hlY + py(100), contentW, fs(26), s.sub, '400', w));
    }
  } else {
    // Bold / Clean / Minimal
    const hlY = contentY + py(20);
    els.push(wrapText(spec.headline, pad, hlY, contentW, fs(selectedLayout === 'Minimal' ? 52 : 62), 'white', '800', w));
    const subY = hlY + py(selectedLayout === 'Bold' ? 150 : 120);
    if (spec.subheadline) {
      els.push(wrapText(spec.subheadline, pad, subY, contentW, fs(28), s.sub, '400', w));
    }
    // Stat below sub
    if (spec.stat && selectedLayout !== 'Minimal') {
      const stY = subY + py(100);
      els.push(`<text x="${pad}" y="${stY}" font-family="'Segoe UI',sans-serif" font-size="${fs(72)}" font-weight="900" fill="${s.accent}">${spec.stat}</text>`);
      if (spec.statLabel) {
        els.push(`<text x="${pad}" y="${stY + py(44)}" font-family="'Segoe UI',sans-serif" font-size="${fs(22)}" fill="${s.sub}">${spec.statLabel}</text>`);
      }
    }
  }

  // ── Asset illustrations ──
  const assetX = isLandscape ? w * 0.56 : w - px(320);
  const assetY = isStory ? h * 0.42 : h * 0.32;
  const assetSz = isLandscape ? px(380) : px(300);

  if (selectedAssets.has('truck-side')) {
    els.push(drawTruckSide(assetX, assetY, assetSz, assetSz * 0.52));
  } else if (selectedAssets.has('truck-front')) {
    els.push(drawTruckFront(assetX + assetSz*0.1, assetY, assetSz * 0.8, assetSz * 0.6));
  } else if (selectedAssets.has('fuel-pump')) {
    els.push(drawFuelPump(assetX + assetSz*0.2, assetY, assetSz * 0.5, assetSz * 0.7));
  } else if (selectedAssets.has('fuel-card')) {
    els.push(drawFuelCard(assetX, assetY + assetSz*0.15, assetSz, assetSz * 0.62));
  } else if (selectedAssets.has('piggy-bank')) {
    els.push(drawPiggy(assetX + assetSz*0.1, assetY, assetSz * 0.8, assetSz * 0.8));
  } else if (selectedAssets.has('network')) {
    els.push(drawNetwork(assetX, assetY, assetSz, assetSz * 0.75));
  } else if (selectedAssets.has('savings-badge')) {
    els.push(drawStatBadge(assetX + assetSz*0.1, assetY + assetSz*0.1, assetSz * 0.8, assetSz * 0.55, spec.stat || '$1/gal', 'savings off', s.accent, s.bg2));
  }

  // ── Proof line ──
  if (spec.proof && selectedLayout !== 'Minimal') {
    const proofY = isStory ? h * 0.82 : h * 0.78;
    els.push(`<text x="${pad}" y="${proofY}" font-family="'Segoe UI',sans-serif" font-size="${fs(20)}" fill="rgba(255,255,255,0.6)" font-style="italic">${spec.proof}</text>`);
  }

  // ── CTA Button ──
  if (selectedCTA && selectedCTA !== 'No CTA') {
    const ctaLabel = spec.cta || selectedCTA;
    const btnW = px(340); const btnH = py(72);
    const btnX = pad; const btnY = h - py(100) - btnH;
    els.push(`<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="${px(10)}" fill="${s.accent}"/>
    <text x="${btnX + btnW/2}" y="${btnY + btnH * 0.63}" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="${fs(24)}" font-weight="700" fill="${s.bg1}">${ctaLabel}</text>`);
  }

  // Shine overlay
  els.push(`<rect width="${w}" height="${py(200)}" fill="url(#shine)"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${els.join('\n')}</svg>`;
}

// Text wrapper
function wrapText(text, x, y, maxW, fontSize, fill, weight, canvasW) {
  if (!text) return '';
  const charsPerLine = Math.floor(maxW / (fontSize * 0.55));
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + word).length > charsPerLine && line) { lines.push(line.trim()); line = ''; }
    line += word + ' ';
  }
  if (line.trim()) lines.push(line.trim());
  return lines.map((l, i) =>
    `<text x="${x}" y="${y + i * Math.round(fontSize * 1.25)}" font-family="'Segoe UI',sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${fill}">${l}</text>`
  ).join('\n');
}

// Asset draw functions
function drawTruckSide(x, y, w, h) {
  const s = w/100;
  return `<g transform="translate(${x},${y})">
    <rect x="${38*s}" y="${6*s}" width="${57*s}" height="${32*s}" rx="${3*s}" fill="#0432BA"/>
    <rect x="${4*s}" y="${12*s}" width="${36*s}" height="${26*s}" rx="${3*s}" fill="#021E70"/>
    <rect x="${6*s}" y="${14*s}" width="${18*s}" height="${15*s}" rx="${2*s}" fill="#4878FF" opacity="0.8"/>
    <rect x="${6*s}" y="${14*s}" width="${18*s}" height="${7*s}" rx="${2*s}" fill="#92BEFF" opacity="0.6"/>
    <rect x="${40*s}" y="${8*s}" width="${52*s}" height="${5*s}" fill="#4878FF" opacity="0.3"/>
    <circle cx="${20*s}" cy="${44*s}" r="${6*s}" fill="#02152A"/>
    <circle cx="${20*s}" cy="${44*s}" r="${3.5*s}" fill="#455A64"/>
    <circle cx="${55*s}" cy="${44*s}" r="${6*s}" fill="#02152A"/>
    <circle cx="${55*s}" cy="${44*s}" r="${3.5*s}" fill="#455A64"/>
    <circle cx="${75*s}" cy="${44*s}" r="${6*s}" fill="#02152A"/>
    <circle cx="${75*s}" cy="${44*s}" r="${3.5*s}" fill="#455A64"/>
    <rect x="0" y="${24*s}" width="${6*s}" height="${6*s}" rx="${1*s}" fill="#FFAE00"/>
  </g>`;
}

function drawTruckFront(x, y, w, h) {
  const s = w/80;
  return `<g transform="translate(${x},${y})">
    <rect x="${10*s}" y="${8*s}" width="${60*s}" height="${42*s}" rx="${4*s}" fill="#0432BA"/>
    <rect x="${14*s}" y="${12*s}" width="${24*s}" height="${20*s}" rx="${2*s}" fill="#4878FF"/>
    <rect x="${14*s}" y="${12*s}" width="${24*s}" height="${10*s}" rx="${2*s}" fill="#92BEFF" opacity="0.7"/>
    <rect x="${42*s}" y="${16*s}" width="${24*s}" height="${24*s}" rx="${2*s}" fill="#021E70"/>
    <circle cx="${20*s}" cy="${54*s}" r="${6*s}" fill="#02152A"/>
    <circle cx="${20*s}" cy="${54*s}" r="${3.5*s}" fill="#455A64"/>
    <circle cx="${60*s}" cy="${54*s}" r="${6*s}" fill="#02152A"/>
    <circle cx="${60*s}" cy="${54*s}" r="${3.5*s}" fill="#455A64"/>
    <rect x="${4*s}" y="${24*s}" width="${8*s}" height="${6*s}" rx="${2*s}" fill="#FFAE00"/>
    <rect x="${68*s}" y="${24*s}" width="${8*s}" height="${6*s}" rx="${2*s}" fill="#FFAE00"/>
  </g>`;
}

function drawFuelPump(x, y, w, h) {
  const s = w/40;
  return `<g transform="translate(${x},${y})">
    <rect x="${4*s}" y="${2*s}" width="${30*s}" height="${52*s}" rx="${4*s}" fill="#00BA7F"/>
    <rect x="${8*s}" y="${6*s}" width="${22*s}" height="${16*s}" rx="${2*s}" fill="white" opacity="0.9"/>
    <text x="${19*s}" y="${17*s}" text-anchor="middle" font-family="sans-serif" font-size="${8*s}" fill="#00885D" font-weight="bold">$3.95</text>
    <rect x="${10*s}" y="${26*s}" width="${18*s}" height="${20*s}" rx="${2*s}" fill="#00885D"/>
    <path d="M${34*s} ${10*s} Q${44*s} ${10*s} ${44*s} ${20*s} L${44*s} ${36*s}" stroke="#021E70" stroke-width="${3*s}" stroke-linecap="round" fill="none"/>
    <circle cx="${44*s}" cy="${38*s}" r="${4*s}" fill="#021E70"/>
    <rect x="0" y="${54*s}" width="${38*s}" height="${5*s}" rx="${2*s}" fill="#021E70"/>
  </g>`;
}

function drawFuelCard(x, y, w, h) {
  const s = w/90;
  return `<g transform="translate(${x},${y})">
    <rect x="${2*s}" y="${2*s}" width="${86*s}" height="${52*s}" rx="${6*s}" fill="#0432BA"/>
    <path d="M${2*s} ${2*s} Q${45*s} ${24*s} ${88*s} ${2*s}" fill="#4878FF" opacity="0.25"/>
    <path d="M${2*s} ${32*s} Q${45*s} ${52*s} ${88*s} ${32*s}" fill="#00BA7F" opacity="0.18"/>
    <rect x="${8*s}" y="${10*s}" width="${20*s}" height="${14*s}" rx="${2*s}" fill="#FFAE00" opacity="0.9"/>
    <text x="${45*s}" y="${25*s}" text-anchor="middle" font-family="sans-serif" font-size="${7*s}" fill="white" font-weight="bold">MUDFLAP</text>
    <text x="${45*s}" y="${38*s}" text-anchor="middle" font-family="sans-serif" font-size="${6*s}" fill="rgba(255,255,255,0.65)">•••• •••• •••• 4567</text>
    <text x="${74*s}" y="${50*s}" text-anchor="middle" font-family="sans-serif" font-size="${7*s}" fill="white" font-weight="600">VISA</text>
  </g>`;
}

function drawPiggy(x, y, w, h) {
  const s = w/70;
  return `<g transform="translate(${x},${y})">
    <ellipse cx="${35*s}" cy="${42*s}" rx="${25*s}" ry="${20*s}" fill="#5CD3AD"/>
    <circle cx="${48*s}" cy="${30*s}" r="${9*s}" fill="#5CD3AD"/>
    <circle cx="${51*s}" cy="${27*s}" r="${3*s}" fill="white"/>
    <ellipse cx="${50*s}" cy="${38*s}" rx="${4*s}" ry="${3*s}" fill="#00885D"/>
    <path d="M${20*s} ${38*s} Q${14*s} ${46*s} ${17*s} ${52*s} L${12*s} ${58*s} L${20*s} ${55*s}" stroke="#00885D" stroke-width="${2*s}" fill="none" stroke-linecap="round"/>
    <path d="M${28*s} ${57*s} L${34*s} ${62*s} L${40*s} ${57*s}" stroke="#00885D" stroke-width="${2*s}" fill="none" stroke-linecap="round"/>
    <rect x="${30*s}" y="${16*s}" width="${10*s}" height="${16*s}" rx="${2*s}" fill="#FFAE00"/>
    <path d="M${35*s} ${12*s} L${35*s} ${16*s} M${32*s} ${13.5*s} L${35*s} ${16*s} L${38*s} ${13.5*s}" stroke="#FFAE00" stroke-width="${2*s}" stroke-linecap="round"/>
  </g>`;
}

function drawNetwork(x, y, w, h) {
  const s = w/70;
  const pts = [{cx:14,cy:18},{cx:34,cy:10},{cx:56,cy:16},{cx:22,cy:36},{cx:46,cy:30},{cx:60,cy:44},{cx:9,cy:48}];
  const lines = [[0,1],[1,2],[3,4],[4,5],[0,3],[2,5]];
  return `<g transform="translate(${x},${y})">
    ${lines.map(([a,b]) => `<line x1="${pts[a].cx*s}" y1="${pts[a].cy*s}" x2="${pts[b].cx*s}" y2="${pts[b].cy*s}" stroke="#4878FF" stroke-width="${1.5*s}" opacity="0.4"/>`).join('')}
    ${pts.map((p,i) => `<circle cx="${p.cx*s}" cy="${p.cy*s}" r="${4*s}" fill="${i < 3 ? '#0432BA' : '#00BA7F'}" opacity="0.9"/>`).join('')}
  </g>`;
}

function drawStatBadge(x, y, w, h, val, label, bg, textCol) {
  return `<g transform="translate(${x},${y})">
    <rect width="${w}" height="${h}" rx="${Math.round(w*0.1)}" fill="${bg}"/>
    <text x="${w/2}" y="${h*0.45}" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="${Math.round(w*0.22)}" font-weight="900" fill="${textCol}">${val}</text>
    <text x="${w/2}" y="${h*0.75}" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="${Math.round(w*0.11)}" fill="${textCol}" opacity="0.8">${label}</text>
  </g>`;
}

// ─── Generate ───
async function generate() {
  const message = document.getElementById('message').value.trim();
  if (!message) { document.getElementById('message').focus(); return; }

  const bgPrompt = document.getElementById('bg-prompt').value.trim();
  const btn = document.getElementById('gen-btn');
  btn.disabled = true;
  btn.innerHTML = '<div style="width:16px;height:16px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite"></div> Generating…';

  document.getElementById('preview-area').innerHTML = '<div class="empty-state"><div class="loading-ring"></div><p>Building your ad…</p></div>';
  document.getElementById('preview-info').textContent = 'Generating copy…';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        cta: selectedCTA,
        stage: selectedFunnel,
        layout: selectedLayout,
        stat: selectedStat,
        assets: [...selectedAssets],
        bgPrompt,
        prompt: message, // legacy compat
      })
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);
    const spec = await res.json();
    if (spec.error) throw new Error(JSON.stringify(spec.error));

    const fmt = FORMATS[currentFormat];
    currentSVG = buildSVG(spec, fmt);
    renderSVG(currentSVG);
    document.getElementById('dl-btn').disabled = false;
    document.getElementById('preview-info').textContent = `${fmt.label} · Ready to download`;

  } catch (err) {
    document.getElementById('preview-area').innerHTML = `<div class="empty-state"><p style="color:#e53e3e">Generation failed: ${err.message}<br><br>Try again or simplify your description.</p></div>`;
    document.getElementById('preview-info').textContent = 'Error — try again';
  }

  btn.disabled = false;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Generate visual →';
}

function renderSVG(svg) {
  const fmt = FORMATS[currentFormat];
  const scale = Math.min(fmt.vw / fmt.w, fmt.vh / fmt.h);
  const dw = Math.round(fmt.w * scale);
  const dh = Math.round(fmt.h * scale);
  let disp = svg.replace(/width="\d+"/, `width="${dw}"`).replace(/height="\d+"/, `height="${dh}"`);
  document.getElementById('preview-area').innerHTML = `<div class="ad-wrapper" style="width:${dw}px;height:${dh}px;">${disp}</div>`;
}

async function downloadPNG() {
  if (!currentSVG) return;
  const fmt = FORMATS[currentFormat];
  const btn = document.getElementById('dl-btn');
  btn.textContent = 'Preparing…'; btn.disabled = true;

  const fullSVG = currentSVG.replace(/width="\d+"/, `width="${fmt.w}"`).replace(/height="\d+"/, `height="${fmt.h}"`);
  const blob = new Blob([fullSVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = fmt.w; canvas.height = fmt.h;
    canvas.getContext('2d').drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob(png => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(png);
      a.download = `mudflap-ad-${currentFormat}-${Date.now()}.png`;
      a.click();
      btn.textContent = 'Download PNG'; btn.disabled = false;
    }, 'image/png');
  };
  img.onerror = () => {
    // fallback: SVG download
    const a = document.createElement('a');
    a.href = url; a.download = `mudflap-ad-${currentFormat}.svg`; a.click();
    btn.textContent = 'Download PNG'; btn.disabled = false;
  };
  img.src = url;
}

document.getElementById('message').addEventListener('keydown', e => { if (e.key === 'Enter' && e.metaKey) generate(); });
</script>
</body>
</html>

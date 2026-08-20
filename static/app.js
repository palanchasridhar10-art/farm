/* ─── Farmer Market AI — Dashboard JavaScript ─── */

const API = '/api/v1';
let historyChart = null;
let forecastChart = null;

// ─── 33 OFFICIAL TELANGANA RYTHU BAZARS METADATA ───
const RYTHU_BAZARS = {
  "adilabad": { name: "Rythu Bazar, Adilabad town (CCI Area)", location: "Near Adilabad town / CCI area, Adilabad" },
  "bhadradri-kothagudem": { name: "Rythu Bazar, Kothagudem town", location: "Kothagudem town, Bhadradri Kothagudem" },
  "hanamkonda": { name: "Rythu Bazar, Excise Colony, Hanumakonda", location: "Excise Colony Main Road, Hanumakonda – 506001" },
  "hyderabad": { name: "Rythu Bazar, Mehdipatnam, Hyderabad", location: "Mehdipatnam–Banjara Hills Road, Royal Colony, Mehdipatnam, Hyderabad – 500006" },
  "jagtial": { name: "Rythu Bazar, Jagtial town", location: "Jagtial town, Jagtial District" },
  "jangaon": { name: "Rythu Bazar, Jangaon town", location: "Jangaon town, Jangaon District" },
  "jayashankar-bhupalpally": { name: "Rythu Bazar, Bhupalpally town", location: "Bhupalpally town, Jayashankar Bhupalpally" },
  "jogulamba-gadwal": { name: "Rythu Bazar, Gadwal town", location: "Gadwal town, Jogulamba Gadwal" },
  "kamareddy": { name: "Rythu Bazar, Kamareddy town", location: "Kamareddy town, Kamareddy District" },
  "karimnagar": { name: "Rythu Bazar, Karimnagar city", location: "Karimnagar city, Karimnagar District" },
  "khammam": { name: "Integrated Rythu Bazar, NSP Camp, Khammam", location: "NSP Camp, Khammam, Telangana" },
  "komaram-bheem-asifabad": { name: "Rythu Bazar, Asifabad town", location: "Asifabad town, Kumuram Bheem Asifabad" },
  "mahabubabad": { name: "Rythu Bazar, Mahabubabad town", location: "Mahabubabad town, Mahabubabad District" },
  "mahabubnagar": { name: "Rythu Bazar, Mahabubnagar town", location: "Mahabubnagar town, Mahabubnagar District" },
  "mancherial": { name: "Rythu Bazar, Mancherial town", location: "Mancherial town, Mancherial District" },
  "medak": { name: "Rythu Bazar, Medak town", location: "Medak town, Medak District" },
  "medchal-malkajgiri": { name: "Rythu Bazar, Bowenpally", location: "Bowenpally / Secunderabad area, Medchal–Malkajgiri" },
  "mulugu": { name: "Rythu Bazar, Mulugu town", location: "Mulugu town, Mulugu District" },
  "nagarkurnool": { name: "Rythu Bazar, Nagarkurnool town", location: "Nagarkurnool town, Nagarkurnool District" },
  "nalgonda": { name: "Rythu Bazar, Beet Market, Nalgonda", location: "Beet Market, Hyderabad Road, Nalgonda – 508001" },
  "narayanpet": { name: "Rythu Bazar, Narayanpet town", location: "Narayanpet town, Narayanpet District" },
  "nirmal": { name: "Rythu Bazar, Nirmal town", location: "Nirmal town, Nirmal District" },
  "nizamabad": { name: "Rythu Bazar, Nizamabad city", location: "Nizamabad city, Nizamabad District" },
  "peddapalli": { name: "Rythu Bazar, Peddapalli town", location: "Peddapalli town, Peddapalli District" },
  "rajanna-sircilla": { name: "Rythu Bazar, Sircilla town", location: "Sircilla town, Rajanna Sircilla" },
  "rangareddy": { name: "Rythu Bazar, Vanasthalipuram", location: "Vanasthalipuram, Hyderabad – 500070, Rangareddy" },
  "sangareddy": { name: "Rythu Bazar, Sangareddy town", location: "Sangareddy town, Sangareddy District" },
  "siddipet": { name: "Rythu Bazar, Siddipet town", location: "Siddipet town, Siddipet District" },
  "suryapet": { name: "Rythu Bazar, Suryapet town", location: "Suryapet town, Suryapet District" },
  "vikarabad": { name: "Rythu Bazar, Vikarabad town", location: "Vikarabad town, Vikarabad District" },
  "wanaparthy": { name: "Rythu Bazar, Wanaparthy town", location: "Wanaparthy town, Wanaparthy District" },
  "warangal": { name: "Rythu Bazar, Shambunipet, Warangal", location: "Shambunipet, Warangal, Telangana" },
  "yadadri-bhuvanagiri": { name: "Rythu Bazar, Bhongir town", location: "Bhongir town, Yadadri Bhuvanagiri" },
};

// ─── SELECTORS ───
const selDistrict = document.getElementById('sel-district');
const selMarket   = document.getElementById('sel-market');
const selCommodity = document.getElementById('sel-commodity');
const selLang      = document.getElementById('sel-lang');

selDistrict.addEventListener('change', async () => {
  await loadMarketsForDistrict(selDistrict.value);
  updateActiveBanner();
  loadAll();
});
selMarket.addEventListener('change', () => {
  updateActiveBanner();
  loadAll();
});
selCommodity.addEventListener('change', loadAll);
if (selLang) {
  selLang.addEventListener('change', () => {
    const chatLang = document.getElementById('chat-lang');
    if (chatLang) chatLang.value = selLang.value;
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', async () => {
  await initDistricts();
  await loadMarketsForDistrict(selDistrict.value);
  updateActiveBanner();
  loadAll();
});

function updateActiveBanner() {
  const dSlug = selDistrict.value;
  const selectedText = selMarket.options[selMarket.selectedIndex]?.text || '';
  const meta = RYTHU_BAZARS[dSlug];

  const titleEl = document.getElementById('bazar-banner-title');
  const addrEl  = document.getElementById('bazar-banner-address');

  if (titleEl) {
    titleEl.textContent = selectedText || meta?.name || 'Rythu Bazar';
  }
  if (addrEl) {
    if (meta && (selectedText.toLowerCase().includes('rythu') || !selectedText)) {
      addrEl.textContent = `📍 ${meta.location}`;
    } else {
      const dName = selDistrict.options[selDistrict.selectedIndex]?.text || dSlug;
      addrEl.textContent = `📍 ${selectedText}, ${dName} District, Telangana`;
    }
  }
}

async function initDistricts() {
  try {
    const res = await fetch(`${API}/districts`);
    const districts = await res.json();
    if (Array.isArray(districts) && districts.length > 0) {
      const currentVal = selDistrict.value || 'nalgonda';
      selDistrict.innerHTML = districts
        .map(d => `<option value="${d.slug}" ${d.slug === currentVal ? 'selected' : ''}>${d.name}</option>`)
        .join('');
      if ([...selDistrict.options].some(o => o.value === currentVal)) {
        selDistrict.value = currentVal;
      }
    }
  } catch (e) {
    console.warn('Using pre-rendered district options', e);
  }
}

async function loadMarketsForDistrict(districtSlug) {
  selMarket.innerHTML = '<option value="">⏳ Loading Rythu Bazars...</option>';
  selMarket.disabled = true;
  try {
    const res = await fetch(`${API}/markets?district=${encodeURIComponent(districtSlug)}`);
    const markets = await res.json();
    if (Array.isArray(markets) && markets.length > 0) {
      selMarket.innerHTML = markets
        .map((m, i) => `<option value="${m.slug}" ${i === 0 ? 'selected' : ''}>${m.name}</option>`)
        .join('');
      selMarket.disabled = false;
    } else {
      const fallback = RYTHU_BAZARS[districtSlug];
      if (fallback) {
        selMarket.innerHTML = `<option value="rythu-bazar" selected>${fallback.name}</option>`;
        selMarket.disabled = false;
      } else {
        selMarket.innerHTML = '<option value="">No markets found</option>';
      }
    }
  } catch (e) {
    console.warn('Markets load failed, using fallback', e);
    const fallback = RYTHU_BAZARS[districtSlug];
    if (fallback) {
      selMarket.innerHTML = `<option value="rythu-bazar" selected>${fallback.name}</option>`;
      selMarket.disabled = false;
    } else {
      selMarket.innerHTML = '<option value="">—</option>';
    }
  }
}

async function loadAll() {
  const commodity = selCommodity.value;
  const district  = selDistrict.value;
  const market    = selMarket.value;
  loadLatestPrice(commodity, district, market);
  loadHistory(commodity, district, market);
  loadForecast(commodity, district, market);
  loadComparison(commodity);
}

// ─── LATEST PRICE ───
async function loadLatestPrice(commodity, district, market) {
  try {
    let url = `${API}/prices/latest?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      document.getElementById('kpi-price').textContent = 'N/A';
      document.getElementById('kpi-market').textContent = json.error;
      return;
    }
    const d = json.data, m = json.meta;
    document.getElementById('kpi-price').textContent = `₹${Number(d.modal_price).toLocaleString('en-IN')}`;
    document.getElementById('kpi-market').textContent = `🏪 ${d.market} • ${m.observation_date}`;
    document.getElementById('kpi-range').textContent = `₹${Number(d.min_price).toLocaleString('en-IN')} – ₹${Number(d.max_price).toLocaleString('en-IN')}`;
    document.getElementById('kpi-unit').textContent = d.unit || 'INR/quintal';

    const trendPct = d.trend_7d_pct || 0;
    document.getElementById('kpi-trend').textContent = `${trendPct >= 0 ? '+' : ''}${trendPct.toFixed(1)}%`;
    document.getElementById('kpi-trend-label').innerHTML = `<span class="kpi-trend ${trendPct > 0 ? 'up' : trendPct < 0 ? 'down' : 'stable'}">${d.trend_label}</span>`;

    const freshnessEl = document.getElementById('freshness-badge');
    if (freshnessEl) freshnessEl.textContent = m.freshness_label || '🟢 Verified e-NAM Feed';
  } catch (e) {
    document.getElementById('kpi-price').textContent = 'Error';
  }
}


// ─── HISTORY CHART ───
async function loadHistory(commodity, district, market) {
  try {
    let url = `${API}/prices/history?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&days=30`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    const series = json.series || [];
    if (!series.length) return;

    const labels = series.map(s => s.date.slice(5));
    const modal = series.map(s => s.modal_price);
    const minP = series.map(s => s.min_price);
    const maxP = series.map(s => s.max_price);

    if (historyChart) historyChart.destroy();
    const ctx = document.getElementById('chart-history').getContext('2d');
    historyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Modal Price', data: modal, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: false, tension: 0.3, pointRadius: 1 },
          { label: 'Min', data: minP, borderColor: 'rgba(59,130,246,0.4)', borderDash: [4,4], fill: false, tension: 0.3, pointRadius: 0 },
          { label: 'Max', data: maxP, borderColor: 'rgba(168,85,247,0.4)', borderDash: [4,4], fill: false, tension: 0.3, pointRadius: 0 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#8b95a8', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: '#5a6478', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: '#5a6478', callback: v => '₹'+v.toLocaleString('en-IN') }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
      },
    });
  } catch (e) { console.error('History chart error:', e); }
}

// ─── FORECAST CHART ───
async function loadForecast(commodity, district, market) {
  try {
    let url = `${API}/forecast?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&horizon=7`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    const forecasts = json.forecasts || [];
    if (!forecasts.length) { document.getElementById('kpi-forecast').textContent = 'N/A'; return; }

    const obs = json.current_observation || {};
    const labels = ['Now', ...forecasts.map(f => `+${f.horizon_days}d`)];
    const pred = [obs.modal_price || null, ...forecasts.map(f => f.predicted_price)];
    const lower = [obs.min_price || null, ...forecasts.map(f => f.lower_bound)];
    const upper = [obs.max_price || null, ...forecasts.map(f => f.upper_bound)];

    const f7 = forecasts.find(f => f.horizon_days === 7) || forecasts[forecasts.length - 1];
    document.getElementById('kpi-forecast').textContent = `₹${Number(f7.predicted_price).toLocaleString('en-IN')}`;
    document.getElementById('kpi-confidence').textContent = `${json.confidence_label || 'Medium'} confidence • ML estimate`;

    if (forecastChart) forecastChart.destroy();
    const ctx = document.getElementById('chart-forecast').getContext('2d');
    forecastChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Predicted', data: pred, borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: false, tension: 0.3, pointRadius: 3 },
          { label: 'Lower Bound', data: lower, borderColor: 'rgba(59,130,246,0.3)', borderDash: [4,4], fill: false, tension: 0.3, pointRadius: 0 },
          { label: 'Upper Bound', data: upper, borderColor: 'rgba(245,158,11,0.3)', borderDash: [4,4], fill: '-1', backgroundColor: 'rgba(168,85,247,0.05)', tension: 0.3, pointRadius: 0 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#8b95a8', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: '#5a6478' }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: '#5a6478', callback: v => '₹'+v.toLocaleString('en-IN') }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
      },
    });
  } catch (e) { console.error('Forecast chart error:', e); }
}

// ─── COMPARISON TABLE ───
async function loadComparison(commodity) {
  try {
    const res = await fetch(`${API}/compare?commodity=${encodeURIComponent(commodity)}`);
    const json = await res.json();
    const comps = json.comparisons || [];
    const tbody = document.getElementById('compare-body');
    if (!comps.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#5a6478;">No data</td></tr>'; return; }
    tbody.innerHTML = comps.map(c => {
      const rankClass = c.rank <= 3 ? `rank-${c.rank}` : '';
      const confClass = c.confidence === 'High' ? 'confidence-high' : c.confidence === 'Low' ? 'confidence-low' : 'confidence-medium';
      return `<tr>
        <td><span class="rank-badge ${rankClass}">${c.rank}</span></td>
        <td><strong>${c.district}</strong></td>
        <td>${c.market}</td>
        <td><strong>₹${Number(c.current_modal_price).toLocaleString('en-IN')}</strong></td>
        <td>₹${Number(c.forecast_7d).toLocaleString('en-IN')}</td>
        <td><span class="confidence-badge ${confClass}">${c.confidence}</span></td>
      </tr>`;
    }).join('');
  } catch (e) { console.error('Comparison error:', e); }
}

// ─── CHAT ───
function toggleChat() {
  document.getElementById('chat-overlay').classList.toggle('active');
}

function appendMsg(text, role) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  div.appendChild(bubble);
  const container = document.getElementById('chat-messages');
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

async function sendChat(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return false;
  appendMsg(text, 'user');
  input.value = '';
  try {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, language: document.getElementById('chat-lang').value }),
    });
    const data = await res.json();
    appendMsg(data.answer || 'No response.', 'bot');
  } catch (e) { appendMsg('Connection error. Please try again.', 'bot'); }
  return false;
}

function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  document.getElementById('chat-overlay').classList.add('active');
  sendChat(new Event('submit'));
}

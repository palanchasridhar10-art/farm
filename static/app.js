/* ─── Farmer Market AI — Dashboard JavaScript ─── */

const API = '/api/v1';
let historyChart = null;
let forecastChart = null;

// ─── SELECTORS ───
const selDistrict = document.getElementById('sel-district');
const selCommodity = document.getElementById('sel-commodity');

selDistrict.addEventListener('change', loadAll);
selCommodity.addEventListener('change', loadAll);

// ─── INIT ───
document.addEventListener('DOMContentLoaded', async () => {
  await initDistricts();
  loadAll();
});

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

async function loadAll() {
  const commodity = selCommodity.value;
  const district = selDistrict.value;
  loadLatestPrice(commodity, district);
  loadHistory(commodity, district);
  loadForecast(commodity, district);
  loadComparison(commodity);
}

// ─── LATEST PRICE ───
async function loadLatestPrice(commodity, district) {
  try {
    const res = await fetch(`${API}/prices/latest?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}`);
    const json = await res.json();
    if (json.error) {
      document.getElementById('kpi-price').textContent = 'N/A';
      document.getElementById('kpi-market').textContent = json.error;
      return;
    }
    const d = json.data, m = json.meta;
    document.getElementById('kpi-price').textContent = `₹${Number(d.modal_price).toLocaleString('en-IN')}`;
    document.getElementById('kpi-market').textContent = `${d.market} • ${m.observation_date}`;
    document.getElementById('kpi-range').textContent = `₹${Number(d.min_price).toLocaleString('en-IN')} – ₹${Number(d.max_price).toLocaleString('en-IN')}`;
    document.getElementById('kpi-unit').textContent = d.unit || 'INR/quintal';

    const trendPct = d.trend_7d_pct || 0;
    document.getElementById('kpi-trend').textContent = `${trendPct >= 0 ? '+' : ''}${trendPct.toFixed(1)}%`;
    document.getElementById('kpi-trend-label').innerHTML = `<span class="kpi-trend ${trendPct > 0 ? 'up' : trendPct < 0 ? 'down' : 'stable'}">${d.trend_label}</span>`;

    document.getElementById('freshness-badge').textContent = m.freshness_label || '🟢 Verified';
  } catch (e) {
    document.getElementById('kpi-price').textContent = 'Error';
  }
}

// ─── HISTORY CHART ───
async function loadHistory(commodity, district) {
  try {
    const res = await fetch(`${API}/prices/history?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&days=30`);
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
async function loadForecast(commodity, district) {
  try {
    const res = await fetch(`${API}/forecast?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&horizon=7`);
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

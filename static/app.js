/* ─── Farmer Market AI — Dashboard JavaScript ─── */

const API = '/api/v1';
let historyChart = null;
let forecastChart = null;

// ─── 33 OFFICIAL TELANGANA RYTHU BAZARS METADATA & AREAS ───
const DISTRICT_RYTHU_BAZARS = {
  "adilabad": {
    area: "Near Adilabad town / CCI area",
    display: "📍 CCI Area / Town — Rythu Bazar, Adilabad",
    name: "Rythu Bazar, Adilabad town (CCI Area)",
    location: "Near Adilabad town / CCI area, Adilabad",
    slug: "rythu-bazar-adilabad-town-cci-area"
  },
  "bhadradri-kothagudem": {
    area: "Kothagudem town",
    display: "📍 Kothagudem Town — Rythu Bazar",
    name: "Rythu Bazar, Kothagudem town",
    location: "Kothagudem town, Bhadradri Kothagudem",
    slug: "rythu-bazar-kothagudem-town"
  },
  "hanamkonda": {
    area: "Excise Colony",
    display: "📍 Excise Colony — Rythu Bazar, Hanumakonda",
    name: "Rythu Bazar, Excise Colony, Hanumakonda",
    location: "Excise Colony Main Road, Hanumakonda – 506001",
    slug: "rythu-bazar-excise-colony-hanumakonda"
  },
  "hyderabad": {
    area: "Mehdipatnam",
    display: "📍 Mehdipatnam — Rythu Bazar, Hyderabad",
    name: "Rythu Bazar, Mehdipatnam, Hyderabad",
    location: "Mehdipatnam–Banjara Hills Road, Royal Colony, Mehdipatnam, Hyderabad – 500006",
    slug: "rythu-bazar-mehdipatnam-hyderabad"
  },
  "jagtial": {
    area: "Jagtial town",
    display: "📍 Jagtial Town — Rythu Bazar",
    name: "Rythu Bazar, Jagtial town",
    location: "Jagtial town, Jagtial District",
    slug: "rythu-bazar-jagtial-town"
  },
  "jangaon": {
    area: "Jangaon town",
    display: "📍 Jangaon Town — Rythu Bazar",
    name: "Rythu Bazar, Jangaon town",
    location: "Jangaon town, Jangaon District",
    slug: "rythu-bazar-jangaon-town"
  },
  "jayashankar-bhupalpally": {
    area: "Bhupalpally town",
    display: "📍 Bhupalpally Town — Rythu Bazar",
    name: "Rythu Bazar, Bhupalpally town",
    location: "Bhupalpally town, Jayashankar Bhupalpally",
    slug: "rythu-bazar-bhupalpally-town"
  },
  "jogulamba-gadwal": {
    area: "Gadwal town",
    display: "📍 Gadwal Town — Rythu Bazar",
    name: "Rythu Bazar, Gadwal town",
    location: "Gadwal town, Jogulamba Gadwal",
    slug: "rythu-bazar-gadwal-town"
  },
  "kamareddy": {
    area: "Kamareddy town",
    display: "📍 Kamareddy Town — Rythu Bazar",
    name: "Rythu Bazar, Kamareddy town",
    location: "Kamareddy town, Kamareddy District",
    slug: "rythu-bazar-kamareddy-town"
  },
  "karimnagar": {
    area: "Karimnagar city",
    display: "📍 Karimnagar City — Rythu Bazar",
    name: "Rythu Bazar, Karimnagar city",
    location: "Karimnagar city, Karimnagar District",
    slug: "rythu-bazar-karimnagar-city"
  },
  "khammam": {
    area: "NSP Camp",
    display: "📍 NSP Camp — Integrated Rythu Bazar, Khammam",
    name: "Integrated Rythu Bazar, NSP Camp, Khammam",
    location: "NSP Camp, Khammam, Telangana",
    slug: "integrated-rythu-bazar-nsp-camp-khammam"
  },
  "komaram-bheem-asifabad": {
    area: "Asifabad town",
    display: "📍 Asifabad Town — Rythu Bazar",
    name: "Rythu Bazar, Asifabad town",
    location: "Asifabad town, Kumuram Bheem Asifabad",
    slug: "rythu-bazar-asifabad-town"
  },
  "mahabubabad": {
    area: "Mahabubabad town",
    display: "📍 Mahabubabad Town — Rythu Bazar",
    name: "Rythu Bazar, Mahabubabad town",
    location: "Mahabubabad town, Mahabubabad District",
    slug: "rythu-bazar-mahabubabad-town"
  },
  "mahabubnagar": {
    area: "Mahabubnagar town",
    display: "📍 Mahabubnagar Town — Rythu Bazar",
    name: "Rythu Bazar, Mahabubnagar town",
    location: "Mahabubnagar town, Mahabubnagar District",
    slug: "rythu-bazar-mahabubnagar-town"
  },
  "mancherial": {
    area: "Mancherial town",
    display: "📍 Mancherial Town — Rythu Bazar",
    name: "Rythu Bazar, Mancherial town",
    location: "Mancherial town, Mancherial District",
    slug: "rythu-bazar-mancherial-town"
  },
  "medak": {
    area: "Medak town",
    display: "📍 Medak Town — Rythu Bazar",
    name: "Rythu Bazar, Medak town",
    location: "Medak town, Medak District",
    slug: "rythu-bazar-medak-town"
  },
  "medchal-malkajgiri": {
    area: "Bowenpally",
    display: "📍 Bowenpally — Rythu Bazar, Medchal–Malkajgiri",
    name: "Rythu Bazar, Bowenpally",
    location: "Bowenpally / Secunderabad area, Medchal–Malkajgiri",
    slug: "rythu-bazar-bowenpally"
  },
  "mulugu": {
    area: "Mulugu town",
    display: "📍 Mulugu Town — Rythu Bazar",
    name: "Rythu Bazar, Mulugu town",
    location: "Mulugu town, Mulugu District",
    slug: "rythu-bazar-mulugu-town"
  },
  "nagarkurnool": {
    area: "Nagarkurnool town",
    display: "📍 Nagarkurnool Town — Rythu Bazar",
    name: "Rythu Bazar, Nagarkurnool town",
    location: "Nagarkurnool town, Nagarkurnool District",
    slug: "rythu-bazar-nagarkurnool-town"
  },
  "nalgonda": {
    area: "Beet Market",
    display: "📍 Beet Market — Rythu Bazar, Nalgonda",
    name: "Rythu Bazar, Beet Market, Nalgonda",
    location: "Beet Market, Hyderabad Road, Nalgonda – 508001",
    slug: "rythu-bazar-beet-market-nalgonda"
  },
  "narayanpet": {
    area: "Narayanpet town",
    display: "📍 Narayanpet Town — Rythu Bazar",
    name: "Rythu Bazar, Narayanpet town",
    location: "Narayanpet town, Narayanpet District",
    slug: "rythu-bazar-narayanpet-town"
  },
  "nirmal": {
    area: "Nirmal town",
    display: "📍 Nirmal Town — Rythu Bazar",
    name: "Rythu Bazar, Nirmal town",
    location: "Nirmal town, Nirmal District",
    slug: "rythu-bazar-nirmal-town"
  },
  "nizamabad": {
    area: "Nizamabad city",
    display: "📍 Nizamabad City — Rythu Bazar",
    name: "Rythu Bazar, Nizamabad city",
    location: "Nizamabad city, Nizamabad District",
    slug: "rythu-bazar-nizamabad-city"
  },
  "peddapalli": {
    area: "Peddapalli town",
    display: "📍 Peddapalli Town — Rythu Bazar",
    name: "Rythu Bazar, Peddapalli town",
    location: "Peddapalli town, Peddapalli District",
    slug: "rythu-bazar-peddapalli-town"
  },
  "rajanna-sircilla": {
    area: "Sircilla town",
    display: "📍 Sircilla Town — Rythu Bazar",
    name: "Rythu Bazar, Sircilla town",
    location: "Sircilla town, Rajanna Sircilla",
    slug: "rythu-bazar-sircilla-town"
  },
  "rangareddy": {
    area: "Vanasthalipuram",
    display: "📍 Vanasthalipuram — Rythu Bazar, Rangareddy",
    name: "Rythu Bazar, Vanasthalipuram",
    location: "Vanasthalipuram, Hyderabad – 500070, Rangareddy",
    slug: "rythu-bazar-vanasthalipuram"
  },
  "sangareddy": {
    area: "Sangareddy town",
    display: "📍 Sangareddy Town — Rythu Bazar",
    name: "Rythu Bazar, Sangareddy town",
    location: "Sangareddy town, Sangareddy District",
    slug: "rythu-bazar-sangareddy-town"
  },
  "siddipet": {
    area: "Siddipet town",
    display: "📍 Siddipet Town — Rythu Bazar",
    name: "Rythu Bazar, Siddipet town",
    location: "Siddipet town, Siddipet District",
    slug: "rythu-bazar-siddipet-town"
  },
  "suryapet": {
    area: "Suryapet town",
    display: "📍 Suryapet Town — Rythu Bazar",
    name: "Rythu Bazar, Suryapet town",
    location: "Suryapet town, Suryapet District",
    slug: "rythu-bazar-suryapet-town"
  },
  "vikarabad": {
    area: "Vikarabad town",
    display: "📍 Vikarabad Town — Rythu Bazar",
    name: "Rythu Bazar, Vikarabad town",
    location: "Vikarabad town, Vikarabad District",
    slug: "rythu-bazar-vikarabad-town"
  },
  "wanaparthy": {
    area: "Wanaparthy town",
    display: "📍 Wanaparthy Town — Rythu Bazar",
    name: "Rythu Bazar, Wanaparthy town",
    location: "Wanaparthy town, Wanaparthy District",
    slug: "rythu-bazar-wanaparthy-town"
  },
  "warangal": {
    area: "Shambunipet",
    display: "📍 Shambunipet — Rythu Bazar, Warangal",
    name: "Rythu Bazar, Shambunipet, Warangal",
    location: "Shambunipet, Warangal, Telangana",
    slug: "rythu-bazar-shambunipet-warangal"
  },
  "yadadri-bhuvanagiri": {
    area: "Bhongir town",
    display: "📍 Bhongir Town — Rythu Bazar",
    name: "Rythu Bazar, Bhongir town",
    location: "Bhongir town, Yadadri Bhuvanagiri",
    slug: "rythu-bazar-bhongir-town"
  }
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
  const meta = DISTRICT_RYTHU_BAZARS[dSlug];

  const titleEl = document.getElementById('bazar-banner-title');
  const addrEl  = document.getElementById('bazar-banner-address');

  if (titleEl) {
    titleEl.textContent = meta ? `${meta.name} (${meta.area})` : (selectedText || 'Rythu Bazar');
  }
  if (addrEl) {
    if (meta) {
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
  const meta = DISTRICT_RYTHU_BAZARS[districtSlug];
  // Instantly populate with specific Rythu Bazar Area (Zero loading delay)
  const defaultOption = meta
    ? `<option value="${meta.slug}" selected>${meta.display}</option>`
    : `<option value="" selected>📍 Primary Rythu Bazar</option>`;
  
  selMarket.innerHTML = defaultOption;
  selMarket.disabled = false;
  updateActiveBanner();

  try {
    const res = await fetch(`${API}/markets?district=${encodeURIComponent(districtSlug)}`);
    const markets = await res.json();
    if (Array.isArray(markets) && markets.length > 0) {
      let optionsHtml = '';
      markets.forEach((m, idx) => {
        const isRythu = m.name.toLowerCase().includes('rythu');
        let label = m.name;
        if (isRythu && meta) {
          label = meta.display;
        } else if (!isRythu) {
          label = `🏢 ${m.name}`;
        }
        optionsHtml += `<option value="${m.slug}" ${idx === 0 ? 'selected' : ''}>${label}</option>`;
      });
      selMarket.innerHTML = optionsHtml;
    }
  } catch (e) {
    console.warn('Markets fetch fallback to local dictionary', e);
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
          {
            label: 'Modal Price (₹)',
            data: modal,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.12)',
            fill: true,
            tension: 0.3,
            borderWidth: 2.5,
            pointRadius: 2,
            pointBackgroundColor: '#16a34a',
          },
          {
            label: 'Min Price (₹)',
            data: minP,
            borderColor: 'rgba(2, 132, 199, 0.6)',
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            borderWidth: 1.5,
            pointRadius: 0,
          },
          {
            label: 'Max Price (₹)',
            data: maxP,
            borderColor: 'rgba(217, 119, 6, 0.6)',
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            borderWidth: 1.5,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#14532d',
              font: { size: 11, weight: '600', family: 'Plus Jakarta Sans' },
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: '#14532d',
            titleColor: '#fef08a',
            bodyColor: '#ffffff',
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            ticks: { color: '#547363', font: { size: 10, weight: '500' } },
            grid: { color: 'rgba(22, 101, 52, 0.06)' },
          },
          y: {
            ticks: {
              color: '#547363',
              font: { size: 10, weight: '500' },
              callback: v => '₹' + v.toLocaleString('en-IN'),
            },
            grid: { color: 'rgba(22, 101, 52, 0.06)' },
          },
        },
      },
    });
  } catch (e) {
    console.error('History chart error:', e);
  }
}

// ─── FORECAST CHART ───
async function loadForecast(commodity, district, market) {
  try {
    let url = `${API}/forecast?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&horizon=7`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    const forecasts = json.forecasts || [];
    if (!forecasts.length) {
      document.getElementById('kpi-forecast').textContent = 'N/A';
      return;
    }

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
          {
            label: 'Predicted Price (₹)',
            data: pred,
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            fill: false,
            tension: 0.3,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#7c3aed',
          },
          {
            label: 'Lower Bound (₹)',
            data: lower,
            borderColor: 'rgba(2, 132, 199, 0.5)',
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            borderWidth: 1.5,
            pointRadius: 0,
          },
          {
            label: 'Upper Bound (₹)',
            data: upper,
            borderColor: 'rgba(217, 119, 6, 0.5)',
            borderDash: [4, 4],
            fill: '-1',
            backgroundColor: 'rgba(124, 58, 237, 0.04)',
            tension: 0.3,
            borderWidth: 1.5,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#14532d',
              font: { size: 11, weight: '600', family: 'Plus Jakarta Sans' },
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: '#14532d',
            titleColor: '#fef08a',
            bodyColor: '#ffffff',
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            ticks: { color: '#547363', font: { size: 10, weight: '500' } },
            grid: { color: 'rgba(22, 101, 52, 0.06)' },
          },
          y: {
            ticks: {
              color: '#547363',
              font: { size: 10, weight: '500' },
              callback: v => '₹' + v.toLocaleString('en-IN'),
            },
            grid: { color: 'rgba(22, 101, 52, 0.06)' },
          },
        },
      },
    });
  } catch (e) {
    console.error('Forecast chart error:', e);
  }
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

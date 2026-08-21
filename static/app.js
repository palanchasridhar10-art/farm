/* ─── Farmer Market AI — Dashboard JavaScript ─── */

const API = '/api/v1';
let historyChart = null;
let forecastChart = null;

// ─── OFFICIAL TELANGANA RYTHU BAZARS METADATA & AREAS ───
// Updated with exact market names, addresses & landmarks (district-wise)
const DISTRICT_RYTHU_BAZARS = {
  "adilabad": {
    area: "Gandhi Chowk, Mahalaxmiwada",
    display: "📍 Gandhi Chowk — Adilabad Rythu Bazar / Vegetable Market",
    name: "Adilabad Rythu Bazar / Vegetable Market",
    location: "Vegetable Market, Gandhi Chowk, Mahalaxmiwada, Adilabad, Telangana 504001",
    landmark: "Opp. Sagar Supermarket, Vinayak Chowk Road, Opp. Rythu Bazar, Ponnar, Ravindra Nagar Colony, Adilabad 504001",
    slug: "adilabad-rythu-bazar-vegetable-market",
    markets: [
      { name: "Adilabad Rythu Bazar / Vegetable Market", location: "Vegetable Market, Gandhi Chowk, Mahalaxmiwada, Adilabad, Telangana 504001", landmark: "Opp. Sagar Supermarket, Vinayak Chowk Road, Opp. Rythu Bazar, Ponnar, Ravindra Nagar Colony, Adilabad 504001", slug: "adilabad-rythu-bazar-vegetable-market" }
    ]
  },
  "bhadradri-kothagudem": {
    area: "Coolie Lane, Kothagudem",
    display: "📍 Coolie Lane — Kothagudem Rythu Bazar",
    name: "Kothagudem Rythu Bazar",
    location: "Rythu Bazar Road, Coolie Lane, Kothagudem, Telangana 507101",
    landmark: "HJ38+PFQ, Coolie Lane, Bhadradri Kothagudem, Telangana 507101",
    slug: "kothagudem-rythu-bazar",
    markets: [
      { name: "Kothagudem Rythu Bazar", location: "Rythu Bazar Road, Coolie Lane, Kothagudem, Telangana 507101", landmark: "HJ38+PFQ, Coolie Lane, Bhadradri Kothagudem, Telangana 507101", slug: "kothagudem-rythu-bazar" },
      { name: "Yellandu Rythu Bazar", location: "Yellandu Road, Basthi Number 2, Yellandu, Telangana 507123", landmark: "Basthi Number 2, Yellandu", slug: "yellandu-rythu-bazar" }
    ]
  },
  "hanamkonda": {
    area: "Ramnagar, Hanamkonda",
    display: "📍 Ramnagar — Hanamkonda Rythu Bazar",
    name: "Hanamkonda Rythu Bazar",
    location: "NGO Colony Road, Depo Road, Near Old Bus Depot, Hanamkonda, Ramnagar, Warangal, Telangana 506001",
    landmark: "Near Old Bus Depot, Ramnagar",
    slug: "hanamkonda-rythu-bazar",
    markets: [
      { name: "Enumamula Rythu Bazar / Grain Market", location: "Sundaraiah Nagar, Grain Market, Enumamula, Warangal, Telangana 506006", landmark: "Enumamula Grain Market", slug: "enumamula-rythu-bazar-grain-market" },
      { name: "Balasamudram Rythu Bazar", location: "2H45+6J6, Balasamudram, Hanamkonda, Telangana 506001", landmark: "Balasamudram", slug: "balasamudram-rythu-bazar" },
      { name: "Hanamkonda Rythu Bazar", location: "NGO Colony Road, Depo Road, Near Old Bus Depot, Hanamkonda, Ramnagar, Warangal, Telangana 506001", landmark: "Near Old Bus Depot, Ramnagar", slug: "hanamkonda-rythu-bazar" }
    ]
  },
  "warangal": {
    area: "Enumamula, Warangal",
    display: "📍 Enumamula — Grain Market, Warangal",
    name: "Enumamula Rythu Bazar / Grain Market",
    location: "Sundaraiah Nagar, Grain Market, Enumamula, Warangal, Telangana 506006",
    landmark: "Enumamula Grain Market",
    slug: "enumamula-rythu-bazar-grain-market",
    markets: [
      { name: "Enumamula Rythu Bazar / Grain Market", location: "Sundaraiah Nagar, Grain Market, Enumamula, Warangal, Telangana 506006", landmark: "Enumamula Grain Market", slug: "enumamula-rythu-bazar-grain-market" },
      { name: "Balasamudram Rythu Bazar", location: "2H45+6J6, Balasamudram, Hanamkonda, Telangana 506001", landmark: "Balasamudram", slug: "balasamudram-rythu-bazar" },
      { name: "Hanamkonda Rythu Bazar", location: "NGO Colony Road, Depo Road, Near Old Bus Depot, Hanamkonda, Ramnagar, Warangal, Telangana 506001", landmark: "Near Old Bus Depot, Ramnagar", slug: "hanamkonda-rythu-bazar" }
    ]
  },
  "hyderabad": {
    area: "Malakpet Gunj, Hyderabad",
    display: "📍 Malakpet Gunj — Malakpet Rythu Bazar",
    name: "Malakpet Rythu Bazar",
    location: "9GF3+MVH, Malakpet Gunj Road, Akbarbagh, Malakpet, Hyderabad, Telangana 500036",
    landmark: "Malakpet Gunj",
    slug: "malakpet-rythu-bazar",
    markets: [
      { name: "Malakpet Rythu Bazar", location: "9GF3+MVH, Malakpet Gunj Road, Akbarbagh, Malakpet, Hyderabad, Telangana 500036", landmark: "Malakpet Gunj", slug: "malakpet-rythu-bazar" },
      { name: "Gudimalkapur Rythu Bazar", location: "9CMP+H5X, Alluri Sitarama Raju Nagar, Kanaka Durga Colony, Gudimalkapur, Hyderabad, Telangana 500006", landmark: "Kanaka Durga Colony, Gudimalkapur", slug: "gudimalkapur-rythu-bazar" },
      { name: "Gudimalkapur Vegetable Market", location: "Vegetable Market, Alluri Sitarama Raju Nagar, Kanaka Durga Colony, Gudimalkapur, Hyderabad, Telangana 500006", landmark: "Gudimalkapur Vegetable Market", slug: "gudimalkapur-vegetable-market" }
    ]
  },
  "jagtial": {
    area: "Brahma Wada, Jagtial",
    display: "📍 Brahma Wada — Jagtial Rythu Bazar",
    name: "Jagtial Rythu Bazar",
    location: "QWW8+6V8, Brahma Wada, Jagtial, Telangana 505327",
    landmark: "Brahma Wada",
    slug: "jagtial-rythu-bazar",
    markets: [
      { name: "Jagtial Rythu Bazar", location: "QWW8+6V8, Brahma Wada, Jagtial, Telangana 505327", landmark: "Brahma Wada", slug: "jagtial-rythu-bazar" },
      { name: "Jagtial Vegetable Market", location: "Tower Circle, Jagtial, Telangana 505327", landmark: "Tower Circle", slug: "jagtial-vegetable-market" },
      { name: "Korutla Rythu Bazar", location: "RPH8+6Q2, Korutla, Telangana 505326", landmark: "Korutla", slug: "korutla-rythu-bazar" }
    ]
  },
  "jangaon": {
    area: "Vegetable Market Street, Jangaon",
    display: "📍 Vegetable Market Street — Jangaon Vegetable Market",
    name: "Jangaon Vegetable Market",
    location: "P5F4+V42, Vegetable Market Street, Jangaon, Telangana 506167",
    landmark: "Jangaon Vegetable Market",
    slug: "jangaon-vegetable-market",
    markets: [
      { name: "Jangaon Vegetable Market", location: "P5F4+V42, Vegetable Market Street, Jangaon, Telangana 506167", landmark: "Jangaon Vegetable Market", slug: "jangaon-vegetable-market" },
      { name: "Jangaon Grain Market", location: "P5J5+P6, Jangaon-Chitakodur Road, Near Railway Station, Jangaon, Telangana 506167", landmark: "Near Jangaon Railway Station", slug: "jangaon-grain-market" }
    ]
  },
  "jayashankar-bhupalpally": {
    area: "Subash Colony, Bhupalpally",
    display: "📍 Subash Colony — Bhupalpally Rythu Bazar",
    name: "Bhupalpally Rythu Bazar",
    location: "CVQ7+C6Q, Subash Colony, Bhupalpally, Telangana 506169",
    landmark: "Subash Colony",
    slug: "bhupalpally-rythu-bazar",
    markets: [
      { name: "Bhupalpally Rythu Bazar", location: "CVQ7+C6Q, Subash Colony, Bhupalpally, Telangana 506169", landmark: "Subash Colony", slug: "bhupalpally-rythu-bazar" }
    ]
  },
  "jogulamba-gadwal": {
    area: "Momin Mohalla, Gadwal",
    display: "📍 Momin Mohalla — Gadwal Rythu Bazar",
    name: "Gadwal Rythu Bazar",
    location: "6QMX+X92, Momin Mohalla, Gadwal, Telangana 509125",
    landmark: "Momin Mohalla",
    slug: "gadwal-rythu-bazar",
    markets: [
      { name: "Gadwal Rythu Bazar", location: "6QMX+X92, Momin Mohalla, Gadwal, Telangana 509125", landmark: "Momin Mohalla", slug: "gadwal-rythu-bazar" },
      { name: "Gadwal Vegetable Market", location: "6RP7+F86, Housing Board Colony, Gadwal, Telangana 509125", landmark: "Housing Board Colony", slug: "gadwal-vegetable-market" }
    ]
  },
  "kamareddy": {
    area: "Lachapet, Kamareddy",
    display: "📍 Lachapet — Kamareddy Rythu Bazar",
    name: "Kamareddy Rythu Bazar",
    location: "88FR+WJX, Lachapet, Kamareddy, Telangana 503111",
    landmark: "Lachapet",
    slug: "kamareddy-rythu-bazar",
    markets: [
      { name: "Kamareddy Rythu Bazar", location: "88FR+WJX, Lachapet, Kamareddy, Telangana 503111", landmark: "Lachapet", slug: "kamareddy-rythu-bazar" },
      { name: "Kamareddy Vegetable Market", location: "88GJ+X9V, Sri Ram Nagar Colony, Ashok Nagar, Kamareddy, Telangana 503111", landmark: "Sri Ram Nagar Colony, Ashok Nagar", slug: "kamareddy-vegetable-market" },
      { name: "Padmajiwadi Vegetable Market", location: "Padmajiwadi X Road, Kamareddy, Telangana 503111", landmark: "Padmajiwadi X Road", slug: "padmajiwadi-vegetable-market" }
    ]
  },
  "karimnagar": {
    area: "Saraswathi Nagar, Karimnagar",
    display: "📍 Saraswathi Nagar — Karimnagar Rythu Bazar",
    name: "Karimnagar Rythu Bazar",
    location: "C4WP+7Q5, Saraswathi Nagar, Karimnagar, Telangana 505001",
    landmark: "Saraswathi Nagar",
    slug: "karimnagar-rythu-bazar",
    markets: [
      { name: "Karimnagar Rythu Bazar", location: "C4WP+7Q5, Saraswathi Nagar, Karimnagar, Telangana 505001", landmark: "Saraswathi Nagar", slug: "karimnagar-rythu-bazar" },
      { name: "Karimnagar Vegetable Market", location: "Islampura, Ashoknagar, Karimnagar, Telangana 505001", landmark: "Islampura, Ashoknagar", slug: "karimnagar-vegetable-market" },
      { name: "Sipada Rao Fruit Market", location: "Sipada Rao Fruit Market, Kisan Nagar, Karimnagar, Telangana 505001", landmark: "Kisan Nagar", slug: "sipada-rao-fruit-market" }
    ]
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

  // Instantly populate from local markets array (zero loading delay)
  if (meta && meta.markets && meta.markets.length > 0) {
    const optionsHtml = meta.markets.map((m, idx) => {
      const isRythu = m.name.toLowerCase().includes('rythu') || m.name.toLowerCase().includes('vegetable') || m.name.toLowerCase().includes('grain') || m.name.toLowerCase().includes('fruit');
      const emoji = isRythu ? '📍' : '🏢';
      return `<option value="${m.slug}" ${idx === 0 ? 'selected' : ''}>${emoji} ${m.name}</option>`;
    }).join('');
    selMarket.innerHTML = optionsHtml;
  } else if (meta) {
    selMarket.innerHTML = `<option value="${meta.slug}" selected>${meta.display}</option>`;
  } else {
    selMarket.innerHTML = `<option value="" selected>📍 Primary Rythu Bazar</option>`;
  }
  selMarket.disabled = false;
  updateActiveBanner();

  try {
    const res = await fetch(`${API}/markets?district=${encodeURIComponent(districtSlug)}`);
    const markets = await res.json();
    if (Array.isArray(markets) && markets.length > 0) {
      let optionsHtml = '';
      markets.forEach((m, idx) => {
        const isRythu = m.name.toLowerCase().includes('rythu') || m.name.toLowerCase().includes('vegetable') || m.name.toLowerCase().includes('grain') || m.name.toLowerCase().includes('fruit');
        const emoji = isRythu ? '📍' : '🏢';
        optionsHtml += `<option value="${m.slug}" ${idx === 0 ? 'selected' : ''}>${emoji} ${m.name}</option>`;
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


// ─── TAB SWITCHER ───
function switchTab(tab) {
  ['history', 'forecast'].forEach(t => {
    document.getElementById(`panel-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
  });
}

// ─── PRICE SUMMARY BAR ───
function updatePriceSummary(series) {
  if (!series || !series.length) return;
  const latest = series[series.length - 1];
  const first  = series[0];

  const fmt = v => v != null ? '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '—';

  document.getElementById('ps-min').textContent   = fmt(latest.min_price);
  document.getElementById('ps-modal').textContent = fmt(latest.modal_price);
  document.getElementById('ps-max').textContent   = fmt(latest.max_price);

  // Trend vs 7 days ago
  const weekAgo = series[Math.max(0, series.length - 8)];
  if (weekAgo && weekAgo.modal_price && latest.modal_price) {
    const pct = ((latest.modal_price - weekAgo.modal_price) / weekAgo.modal_price * 100).toFixed(1);
    const arrow = pct > 0 ? '▲' : pct < 0 ? '▼' : '━';
    const sign  = pct > 0 ? '+' : '';
    document.getElementById('ps-trend').textContent = `${arrow} ${sign}${pct}%`;
    document.getElementById('ps-trend').style.color = pct > 0 ? '#15803d' : pct < 0 ? '#b91c1c' : '#0369a1';
    document.getElementById('ps-trend-label').textContent = '7-day change';
  }
}

// ─── HISTORY CHART (Clean Area Chart — Modal only + faint min/max band) ───
async function loadHistory(commodity, district, market) {
  try {
    let url = `${API}/prices/history?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&days=30`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    const series = json.series || [];
    if (!series.length) return;

    // Update price summary bar
    updatePriceSummary(series);

    // Show every 5th date label to avoid clutter
    const labels  = series.map((s, i) => (i % 5 === 0 || i === series.length - 1) ? s.date.slice(5) : '');
    const modal   = series.map(s => s.modal_price);
    const minP    = series.map(s => s.min_price);
    const maxP    = series.map(s => s.max_price);

    if (historyChart) historyChart.destroy();
    const ctx = document.getElementById('chart-history').getContext('2d');

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, 280);
    grad.addColorStop(0, 'rgba(22, 163, 74, 0.22)');
    grad.addColorStop(1, 'rgba(22, 163, 74, 0.01)');

    historyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Modal Price (₹)',
            data: modal,
            borderColor: '#16a34a',
            backgroundColor: grad,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: series.map((_, i) => i === series.length - 1 ? 6 : 0),
            pointHoverRadius: 6,
            pointBackgroundColor: '#16a34a',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            order: 1,
          },
          {
            label: 'Max Price (₹)',
            data: maxP,
            borderColor: 'rgba(217, 119, 6, 0.4)',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            order: 2,
          },
          {
            label: 'Min Price (₹)',
            data: minP,
            borderColor: 'rgba(2, 132, 199, 0.4)',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            order: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#14532d',
            bodyColor: '#334155',
            borderColor: 'rgba(22, 163, 74, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            callbacks: {
              title: ctx => `📅 ${series[ctx[0].dataIndex]?.date || ''}`,
              label: ctx => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#78a88c',
              font: { size: 11, weight: '600' },
              maxRotation: 0,
            },
            border: { display: false },
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(22, 101, 52, 0.06)', drawBorder: false },
            ticks: {
              color: '#78a88c',
              font: { size: 11, weight: '600' },
              callback: v => '₹' + Number(v).toLocaleString('en-IN', {maximumFractionDigits: 0}),
              maxTicksLimit: 6,
            },
            border: { display: false },
          },
        },
      },
    });
  } catch (e) {
    console.error('History chart error:', e);
  }
}

// ─── FORECAST CHART (Clean Bar Chart — easy to read day-by-day) ───
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

    const obs    = json.current_observation || {};
    const labels = ['Today', ...forecasts.map(f => `+${f.horizon_days}d`)];
    const pred   = [obs.modal_price || null, ...forecasts.map(f => f.predicted_price)];
    const lower  = [obs.min_price  || null, ...forecasts.map(f => f.lower_bound)];
    const upper  = [obs.max_price  || null, ...forecasts.map(f => f.upper_bound)];

    const f7 = forecasts.find(f => f.horizon_days === 7) || forecasts[forecasts.length - 1];
    document.getElementById('kpi-forecast').textContent = `₹${Number(f7.predicted_price).toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('kpi-confidence').textContent = `${json.confidence_label || 'Medium'} confidence • ML estimate`;

    if (forecastChart) forecastChart.destroy();
    const ctx = document.getElementById('chart-forecast').getContext('2d');

    // Color bars: green if same/above today, red if below
    const todayPrice = obs.modal_price || pred[0] || 0;
    const barColors = pred.map((v, i) => {
      if (i === 0) return 'rgba(22, 163, 74, 0.75)';  // today = green
      return v >= todayPrice ? 'rgba(22, 163, 74, 0.65)' : 'rgba(220, 38, 38, 0.6)';
    });
    const barBorders = pred.map((v, i) => {
      if (i === 0) return '#15803d';
      return v >= todayPrice ? '#15803d' : '#dc2626';
    });

    forecastChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Predicted Price (₹)',
            data: pred,
            backgroundColor: barColors,
            borderColor: barBorders,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            order: 1,
          },
          {
            label: 'Upper Bound (₹)',
            data: upper,
            type: 'line',
            borderColor: 'rgba(217, 119, 6, 0.7)',
            borderDash: [5, 4],
            borderWidth: 1.5,
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(217, 119, 6, 0.7)',
            order: 0,
          },
          {
            label: 'Lower Bound (₹)',
            data: lower,
            type: 'line',
            borderColor: 'rgba(2, 132, 199, 0.7)',
            borderDash: [5, 4],
            borderWidth: 1.5,
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(2, 132, 199, 0.7)',
            order: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#14532d',
            bodyColor: '#334155',
            borderColor: 'rgba(124, 58, 237, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#78a88c', font: { size: 12, weight: '700' } },
            border: { display: false },
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(22, 101, 52, 0.06)' },
            ticks: {
              color: '#78a88c',
              font: { size: 11, weight: '600' },
              callback: v => '₹' + Number(v).toLocaleString('en-IN', {maximumFractionDigits: 0}),
              maxTicksLimit: 6,
            },
            border: { display: false },
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

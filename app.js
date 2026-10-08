// ── CITIES INTEL DATA ──
    const CITIES = {
      'dehradun':[30.3165,78.0322],'haridwar':[29.9457,78.1642],'rishikesh':[30.0869,78.2676],
      'nainital':[29.3919,79.4542],'mussoorie':[30.4598,78.0644],'roorkee':[29.8543,77.8880],
      'delhi':[28.6139,77.2090],'new delhi':[28.6139,77.2090],'mumbai':[19.0760,72.8777],
      'lucknow':[26.8467,80.9462],'varanasi':[25.3176,82.9739],'agra':[27.1767,78.0081],
      'jaipur':[26.9124,75.7873],'kanpur':[26.4499,80.3319],'prayagraj':[25.4358,81.8463],
      'allahabad':[25.4358,81.8463],'meerut':[28.9845,77.7064],'mathura':[27.4924,77.6737],
      'aligarh':[27.8974,78.0880],'bareilly':[28.3670,79.4304],'moradabad':[28.8386,78.7733],
      'auraiya':[26.4651,79.5135],'gorakhpur':[26.7606,83.3732],'patna':[25.5941,85.1376],
      'chandigarh':[30.7333,76.7794],'shimla':[31.1048,77.1734],'amritsar':[31.6340,74.8723],
      'ludhiana':[30.9009,75.8573],'bhopal':[23.2599,77.4126],'indore':[22.7196,75.8577],
      'nagpur':[21.1458,79.0882],'pune':[18.5204,73.8567],'hyderabad':[17.3850,78.4867],
      'bengaluru':[12.9716,77.5946],'bangalore':[12.9716,77.5946],'chennai':[13.0827,80.2707],
      'kolkata':[22.5726,88.3639],'ahmedabad':[23.0225,72.5714],'surat':[21.1702,72.8311],
      'kochi':[9.9312,76.2673],'visakhapatnam':[17.6868,83.2185],
      'thiruvananthapuram':[8.5241,76.9366],'coimbatore':[11.0168,76.9558],
      'muzaffarnagar':[29.4727,77.7085],'saharanpur':[29.9680,77.5552],
      'vijayawada':[16.5062,80.6480],
      'tirupati':[13.6288,79.4192],
      'guntur':[16.3067,80.4365],
      'nellore':[14.4426,79.9865],
      'itanagar':[27.0844,93.6053],
      'tawang':[27.5861,91.8594],
      'pasighat':[28.0662,95.3260],
      'naharlagun':[27.1047,93.6952],
      'bomdila':[27.2645,92.4246],
      'guwahati':[26.1445,91.7362],
      'dibrugarh':[27.4728,94.9120],
      'silchar':[24.8333,92.7789],
      'jorhat':[26.7509,94.2037],
      'tezpur':[26.6528,92.7926],
      'gaya':[24.7914,85.0002],
      'muzaffarpur':[26.1209,85.3647],
      'bhagalpur':[25.2425,86.9842],
      'darbhanga':[26.1542,85.8918],
      'raipur':[21.2514,81.6296],
      'bilaspur':[22.0797,82.1409],
      'durg':[21.1904,81.2849],
      'korba':[22.3595,82.7501],
      'jagdalpur':[19.0748,82.0080],
      'panaji':[15.4909,73.8278],
      'margao':[15.2832,73.9862],
      'vasco da gama':[15.3860,73.8278],
      'mapusa':[15.5937,73.8140],
      'ponda':[15.4020,74.0060],
      'vadodara':[22.3072,73.1812],
      'rajkot':[22.3039,70.8022],
      'bhavnagar':[21.7645,72.1519],
      'gandhinagar':[23.2156,72.6369],
      'gurugram':[28.4595,77.0266],
      'faridabad':[28.4089,77.3178],
      'panipat':[29.3909,76.9635],
      'ambala':[30.3782,76.7767],
      'hisar':[29.1492,75.7217],
      'shimla':[31.1048,77.1734],
      'dharamshala':[32.2190,76.3234],
      'manali':[32.2396,77.1887],
      'solan':[30.9045,77.0967],
      'mandi':[31.7080,76.9314],
      'ranchi':[23.3441,85.3096],
      'jamshedpur':[22.8046,86.2029],
      'dhanbad':[23.7957,86.4304],
      'bokaro':[23.6693,86.1511],
      'deoghar':[24.4764,86.6913],
      'mysuru':[12.2958,76.6394],
      'mangaluru':[12.9141,74.8560],
      'hubballi':[15.3647,75.1240],
      'belagavi':[15.8497,74.4977],
      'thiruvananthapuram':[8.5241,76.9366],
      'kochi':[9.9312,76.2673],
      'kozhikode':[11.2588,75.7804],
      'thrissur':[10.5276,76.2144],
      'kollam':[8.8932,76.6141],
      'gwalior':[26.2183,78.1828],
      'jabalpur':[23.1815,79.9864],
      'ujjain':[23.1765,75.7885],
      'sagar':[23.8388,78.7378],
      'nashik':[19.9975,73.7898],
      'aurangabad':[19.8762,75.3433],
      'thane':[19.2183,72.9781],
      'kolhapur':[16.7050,74.2433],
      'imphal':[24.8170,93.9368],
      'thoubal':[24.6382,94.0100],
      'bishnupur':[24.6297,93.7698],
      'ukhrul':[25.0968,94.3614],
      'shillong':[25.5788,91.8933],
      'tura':[25.5146,90.2029],
      'jowai':[25.4451,92.2038],
      'nongpoh':[25.9060,91.8833],
      'aizawl':[23.7271,92.7176],
      'lunglei':[22.8897,92.7393],
      'champhai':[23.4747,93.3258],
      'kolasib':[24.2239,92.6787],
      'kohima':[25.6751,94.1086],
      'dimapur':[25.9044,93.7266],
      'mokokchung':[26.3220,94.5180],
      'tuensang':[26.2670,94.8244],
      'bhubaneswar':[20.2961,85.8245],
      'cuttack':[20.4625,85.8830],
      'rourkela':[22.2604,84.8536],
      'berhampur':[19.3150,84.7941],
      'sambalpur':[21.4669,83.9812],
      'jalandhar':[31.3260,75.5762],
      'patiala':[30.3398,76.3869],
      'bathinda':[30.2110,74.9455],
      'pathankot':[32.2746,75.6521],
      'jodhpur':[26.2389,73.0243],
      'udaipur':[24.5854,73.7125],
      'kota':[25.2138,75.8648],
      'ajmer':[26.4499,74.6399],
      'bikaner':[28.0229,73.3119],
      'gangtok':[27.3389,88.6065],
      'namchi':[27.1667,88.3500],
      'gyalshing':[27.2875,88.2640],
      'mangan':[27.5096,88.5347],
      'singtam':[27.2340,88.5010],
      'madurai':[9.9252,78.1198],
      'tiruchirappalli':[10.7905,78.7047],
      'salem':[11.6643,78.1460],
      'tirunelveli':[8.7139,77.7567],
      'erode':[11.3410,77.7172],
      'warangal':[17.9689,79.5941],
      'nizamabad':[18.6725,78.0941],
      'karimnagar':[18.4386,79.1288],
      'khammam':[17.2473,80.1514],
      'agartala':[23.8315,91.2868],
      'udaipur-tripura':[23.5333,91.4833],
      'dharmanagar':[24.3765,92.1733],
      'kailashahar':[24.3316,92.0039],
      'belonia':[23.2510,91.4540],
      'gaya-up':[25.3176,82.9739],
      'meerut':[28.9845,77.7064],
      'bareilly':[28.3670,79.4304],
      'gorakhpur':[26.7606,83.3732],
      'noida':[28.5355,77.3910],
      'haldwani':[29.2183,79.5130],
      'roorkee':[29.8543,77.8880],
      'mussoorie':[30.4598,78.0644],
      'almora':[29.5971,79.6591],
      'siliguri':[26.7271,88.3953],
      'durgapur':[23.5204,87.3119],
      'asansol':[23.6739,87.1480],
      'howrah':[22.5958,88.2636],
      'darjeeling':[27.0410,88.2663],
      'port blair':[11.6234,92.7265],
      'diglipur':[13.2667,93.0000],
      'mayabunder':[12.9216,92.8957],
      'silvassa':[20.2763,73.0083],
      'daman':[20.3974,72.8328],
      'diu':[20.7144,70.9874],
      'srinagar':[34.0837,74.7973],
      'jammu':[32.7266,74.8570],
      'anantnag':[33.7311,75.1487],
      'baramulla':[34.1980,74.3636],
      'kathua':[32.3694,75.5250],
      'leh':[34.1526,77.5771],
      'kargil':[34.5539,76.1349],
      'kavaratti':[10.5669,72.6420],
      'agatti':[10.8500,72.1833],
      'minicoy':[8.2833,73.0500],
      'puducherry':[11.9416,79.8083],
      'karaikal':[10.9254,79.8380],
      'mahe':[11.7000,75.5333],
      'yanam':[16.7333,82.2167],
      'chandigarh':[30.7333,76.7794],
    };

    // ── STATS AND INTEL HTML TEMPLATE ──
    const STATS_HTML = `
      <div class="border border-zinc-800/80 rounded-2xl bg-zinc-900/35 overflow-hidden">
        <div class="px-4 py-3.5 border-b border-zinc-800/70 flex items-center justify-between">
          <div>
            <p class="text-[9px] uppercase tracking-[0.18em] text-zinc-500 font-bold">Intelligence stack</p>
            <p class="text-xs text-zinc-200 mt-1">Signals powering the road layer</p>
          </div>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.55)]"></span>
        </div>
        <div class="divide-y divide-zinc-800/60">
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-[10px] text-zinc-300">Satellite imagery</span>
            <span class="font-mono-lux text-[9px] text-zinc-500">INPUT</span>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-[10px] text-zinc-300">Computer vision</span>
            <span class="font-mono-lux text-[9px] text-zinc-500">AI / CV</span>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-[10px] text-zinc-300">Road observations</span>
            <span class="font-mono-lux text-[9px] text-zinc-500">VERIFIED</span>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-[10px] text-zinc-300">Routing graph</span>
            <span class="font-mono-lux text-[9px] text-zinc-500">NETWORK</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-zinc-900/40 border border-zinc-800/70 rounded-xl p-4">
          <p class="font-serif-lux italic text-white text-[19px]">FEED</p>
          <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Alert feed</p>
        </div>
        <div class="bg-zinc-900/40 border border-zinc-800/70 rounded-xl p-4">
          <p class="font-serif-lux italic text-white text-lg">MODEL</p>
          <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Detection layer</p>
        </div>
      </div>
      <div class="border border-zinc-800/60 rounded-xl p-4 bg-zinc-900/20">
        <div class="flex items-center justify-between mb-3">
          <p class="text-[9px] uppercase tracking-[0.18em] text-zinc-500 font-bold">AI pipeline</p>
          <span class="font-mono-lux text-[8px] text-emerald-400">PROCESS</span>
        </div>
        <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1">
          <div class="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-center">
            <div class="text-[9px] text-zinc-200 font-semibold">Satellite</div>
            <div class="text-[7px] text-zinc-600 mt-1">INPUT</div>
          </div>
          <span class="text-zinc-700 text-[10px]">→</span>
          <div class="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-center">
            <div class="text-[9px] text-zinc-200 font-semibold">CNN</div>
            <div class="text-[7px] text-zinc-600 mt-1">VISION</div>
          </div>
          <span class="text-zinc-700 text-[10px]">→</span>
          <div class="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-center">
            <div class="text-[9px] text-zinc-200 font-semibold">Change</div>
            <div class="text-[7px] text-zinc-600 mt-1">DETECT</div>
          </div>
          <span class="text-zinc-700 text-[10px]">→</span>
          <div class="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-center">
            <div class="text-[9px] text-zinc-200 font-semibold">Road graph</div>
            <div class="text-[7px] text-zinc-600 mt-1">NETWORK</div>
          </div>
        </div>
      </div>
      <div class="border border-zinc-800/60 rounded-xl bg-zinc-900/20 overflow-hidden">
        <div class="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
          <div><p class="text-[9px] uppercase tracking-[0.18em] text-zinc-500 font-bold">Observation filters</p><p class="text-xs text-zinc-200 mt-1">Control the verified road layer · approved data only</p></div>
          <div class="flex items-center gap-2">
            <span class="obs-layer-dot w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
            <span data-live-status="true" aria-live="polite" class="obs-layer-status font-mono-lux text-[8px] text-zinc-500">LOADING</span>
            <span class="font-mono-lux text-[8px] text-zinc-500"><span class="obs-visible-count">0</span> VISIBLE · <span class="obs-returned-count">0</span> RETURNED <span class="obs-summary-count text-zinc-600">· 0 GROUPS</span> <span class="obs-view-note hidden" title="The API returned the maximum number of observations for this viewport.">LIMIT</span></span><button type="button" class="obs-layer-retry hidden text-[8px] uppercase tracking-[.12em] font-bold text-zinc-400 hover:text-white transition-colors" title="Retry verified observation layer"><span class="obs-layer-error hidden text-[8px] text-rose-400 ml-2">SERVICE ERROR</span>RETRY</button>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="grid grid-cols-2 gap-1.5">
            <label class="block"><span class="text-[8px] uppercase tracking-wider text-zinc-600 font-bold">Observation type</span><select class="obs-filter-type mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-zinc-600"><option value="all">All types</option><option value="construction">Construction</option><option value="missing">Missing road</option><option value="new">Newly detected</option><option value="widen">Widening</option><option value="surface">Surface condition</option></select></label>
            <label class="block"><span class="text-[8px] uppercase tracking-wider text-zinc-600 font-bold">Source</span><select class="obs-filter-source mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-[10px] text-zinc-300 focus:outline-none focus:border-zinc-600"><option value="all">All sources</option></select></label>
          </div>
          <label class="block"><div class="flex items-center justify-between"><span class="text-[8px] uppercase tracking-wider text-zinc-600 font-bold">Minimum confidence</span><span class="font-mono-lux text-[9px] text-zinc-400"><span class="obs-filter-confidence-value">0%</span></span></div><input class="obs-filter-confidence mt-2 w-full accent-cyan-400" type="range" min="0" max="100" step="5" value="0"></label>
          <button type="button" class="obs-filter-reset w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 text-[9px] uppercase tracking-wider font-bold text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors">Reset filters</button>
        </div>
      </div>
      <div class="border border-zinc-800/60 rounded-xl bg-zinc-900/20 overflow-hidden">
        <div class="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
          <div>
            <p class="text-[9px] uppercase tracking-[0.18em] text-zinc-500 font-bold">Road observation key</p>
            <p class="text-xs text-zinc-200 mt-1">Verified signals shown on the map</p>
          </div>
          <span class="font-mono-lux text-[8px] text-zinc-500">LEGEND</span>
        </div>
        <div class="p-4 grid grid-cols-2 gap-2">
          <div class="flex items-center gap-2 text-[9px] text-zinc-400"><span class="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>Construction</div>
          <div class="flex items-center gap-2 text-[9px] text-zinc-400"><span class="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>Missing road</div>
          <div class="flex items-center gap-2 text-[9px] text-zinc-400"><span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>Newly detected</div>
          <div class="flex items-center gap-2 text-[9px] text-zinc-400"><span class="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>Widening</div>
          <div class="flex items-center gap-2 text-[9px] text-zinc-400"><span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>Surface condition</div>
          <div class="text-[8px] text-zinc-600 leading-relaxed">Only approved observations are displayed.</div>
        </div>
      </div>
      <div class="border border-zinc-800/60 rounded-xl bg-zinc-900/20 overflow-hidden">
        <div class="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
          <div>
            <p class="text-[9px] uppercase tracking-[0.18em] text-zinc-500 font-bold">Road change intelligence</p>
            <p class="text-xs text-zinc-200 mt-1">Temporal evidence only — no synthetic change data</p>
          </div>
          <span class="temporal-change-status font-mono-lux text-[8px] text-zinc-600">AWAITING DATA</span>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[9px] uppercase tracking-wider text-zinc-600 font-bold">Comparison window</p>
              <p class="temporal-change-window text-[11px] text-zinc-300 mt-1">No approved temporal observations</p>
            </div>
            <span class="temporal-change-count font-serif-lux italic text-white text-lg">0</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
              <p class="text-[8px] uppercase tracking-wider text-zinc-600 font-bold">Change signals</p>
              <p class="temporal-change-signals text-[10px] text-zinc-300 mt-1">0 verified</p>
            </div>
            <div class="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
              <p class="text-[8px] uppercase tracking-wider text-zinc-600 font-bold">Detection</p>
              <p class="temporal-change-detection text-[10px] text-zinc-300 mt-1">Awaiting verified data</p>
            </div>
          </div>
          <p class="text-[9px] leading-relaxed text-zinc-600">
            The timeline activates only when approved observations contain verified temporal metadata such as baseline/comparison years or a detection timestamp.
          </p>
        </div>
      </div>
      <div class="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 text-[10px] text-zinc-500 leading-relaxed">
        <p class="font-semibold text-zinc-300 mb-1">Coverage integrity</p>
        Road-data completeness is not yet measured by this prototype. Metrics will appear only after verified road observations are connected.
      </div>`;
    
    document.getElementById('stats-content').innerHTML = STATS_HTML;
    document.getElementById('m-stats-content').innerHTML = STATS_HTML;

    // ── GLOBAL MAP CONFIGS & HOOKS ──
    let map, tile, routeLines = [], markers = [], locMarker = null;
    let sidebarOpen = true, sheetOpen = false;
    const isMobile = () => window.innerWidth <= 640;

    // Initialize Map Instance
    map = L.map('map', { zoomControl: false, attributionControl: true, preferCanvas: true, minZoom: 1, worldCopyJump: false, maxBounds: [[-85, -180], [85, 180]], maxBoundsViscosity: 1 }).setView([22, 78], 5);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 120 }).addTo(map);

    function updateMapContext() {
      const zoom = map.getZoom();
      const el = document.getElementById('map-zoom-value');
      if (el) el.textContent = String(zoom);
    }

    function resetMapView() {
      clearTimeout(earthTransitionTimer);
      setEarthOverview(true);
      if (earthGlobe) {
        earthGlobe.controls().autoRotate = true;
        earthGlobe.pointOfView({ lat: 22, lng: 78, altitude: 2.15 }, 900);
      }
      map.flyTo([22, 78], 5, { duration: 0.9 });
      document.getElementById('map')?.focus({ preventScroll: true });
    }

    // Initial tile layer setup
    tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '&copy; Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, and the GIS User Community'
    }).addTo(map);
    setTimeout(() => map.invalidateSize(), 300);
    function updateMapIntelligenceHUD() {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const zoomEl = document.getElementById('map-hud-zoom');
      const scopeEl = document.getElementById('map-hud-scope');
      if (zoomEl) zoomEl.textContent = `Z${zoom}`;
      if (scopeEl) scopeEl.textContent = `${center.lat.toFixed(2)}° N · ${center.lng.toFixed(2)}° E · verified scope`;
    }
    map.on('moveend zoomend', updateMapIntelligenceHUD);

    // World-scale fallback: once the road map reaches its global limit,
    // return to the real 3D Earth instead of showing repeated flat worlds.
    map.on('zoomend', () => {
      if (!earthGlobe || !earthGlobeEl || !earthOverviewActive) {
        if (earthGlobe && map.getZoom() <= 1) {
          setEarthOverview(true);
          earthGlobe.controls().autoRotate = true;
          earthGlobe.pointOfView({ lat: 22, lng: 78, altitude: 2.15 }, 650);
        }
        return;
      }
    });

    updateMapIntelligenceHUD();
    // ── TRUE EARTH OVERVIEW ──
    // Keep Leaflet as the authoritative road/detail engine, but use a real
    // WebGL globe for the world-scale entry state and location transitions.
    const earthGlobeEl = document.getElementById('earth-globe');
    let earthGlobe = null;
    let earthOverviewActive = true;
    let earthTransitionTimer = null;

    function setEarthOverview(active) {
      earthOverviewActive = active;
      if (!active) earthGlobe?.controls().autoRotate && null;
      earthGlobeEl?.classList.toggle('is-visible', active);
      earthGlobeEl?.setAttribute('aria-hidden', active ? 'false' : 'true');
      document.getElementById('map')?.classList.toggle('globe-overview', false);
      if (active) {
        setTimeout(() => map?.invalidateSize(), 50);
      }
    }

    function initEarthGlobe() {
      if (!earthGlobeEl || typeof window.Globe !== 'function') {
        setEarthOverview(false);
        return;
      }
      earthGlobeEl.classList.add('is-loading');
      earthGlobe = window.Globe()(earthGlobeEl)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .showAtmosphere(true)
        .atmosphereColor('#6aa9ff')
        .atmosphereAltitude(0.14)
        .enablePointerInteraction(true)
        .width(earthGlobeEl.clientWidth)
        .height(earthGlobeEl.clientHeight)
        .pointOfView({ lat: 22, lng: 78, altitude: 2.15 }, 0);

      earthGlobe.controls().autoRotate = true;
      earthGlobe.controls().autoRotateSpeed = 0.28;
      earthGlobe.controls().enableZoom = true;

      const resizeGlobe = () => {
        if (!earthGlobe || !earthGlobeEl) return;
        earthGlobe.width(earthGlobeEl.clientWidth).height(earthGlobeEl.clientHeight);
      };
      window.addEventListener('resize', resizeGlobe, { passive: true });
      setEarthOverview(true);
      setTimeout(() => earthGlobeEl.classList.remove('is-loading'), 900);
    }

    function showEarthThenZoom(coords, zoom, name) {
      const target = { lat: Number(coords[0]), lng: Number(coords[1]) };
      clearTimeout(earthTransitionTimer);
      setEarthOverview(true);

      // Cinematic navigation: settle on the destination first, then hand off
      // to the detailed road map. The two engines overlap briefly so the
      // transition feels like one continuous journey rather than a jump.
      if (earthGlobe) {
        earthGlobe.controls().autoRotate = false;
        earthGlobe.pointOfView(
          { lat: target.lat, lng: target.lng, altitude: 1.85 },
          1450
        );
      }

      earthTransitionTimer = setTimeout(() => {
        setEarthOverview(false);
        map.invalidateSize();
        map.stop();
        map.flyTo(coords, zoom, {
          duration: 2.25,
          easeLinearity: 0.12
        });
        placeMarker(coords, name);
      }, 1350);
    }

    function updateGlobeOverview() {
      if (earthOverviewActive) return;
      document.getElementById('map')?.classList.remove('globe-overview');
    }
    map.on('resize', updateGlobeOverview);
    setTimeout(initEarthGlobe, 0);


    // ── HEXAGONAL ROAD INTELLIGENCE GRID ──
    // Visual hex cells replace the old square-cell presentation.
    // Cells are rendered in screen space so the hexagons stay perfectly regular.
    let hexGridLayer = L.layerGroup();
    let hexGridTimer = null;

    function clearHexGrid() {
      hexGridLayer.clearLayers();
    }

    function redrawHexGrid() {
      clearTimeout(hexGridTimer);
      hexGridTimer = setTimeout(() => {
        if (!map || !hexGridLayer) return;
        if (map.getZoom() < 7) { clearHexGrid(); return; }

        const size = Math.max(30, Math.min(44, 30 + (map.getZoom() - 5) * 1.6));
        const width = map.getSize().x;
        const height = map.getSize().y;
        const stepX = Math.sqrt(3) * size;
        const stepY = 1.5 * size;
        const pixelBounds = map.getPixelBounds();
        const minX = pixelBounds.min.x - stepX * 2;
        const maxX = pixelBounds.max.x + stepX * 2;
        const minY = pixelBounds.min.y - size * 2;
        const maxY = pixelBounds.max.y + size * 2;

        const polygons = [];
        let row = 0;

        for (let y = minY; y <= maxY; y += stepY, row++) {
          const xOffset = (row % 2) ? stepX / 2 : 0;

          for (let x = minX + xOffset; x <= maxX; x += stepX) {
            const center = L.point(x, y);
            const vertices = [];

            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 180) * (60 * i - 30);
              const point = L.point(
                center.x + size * Math.cos(angle),
                center.y + size * Math.sin(angle)
              );
              const latLng = map.unproject(point, map.getZoom());
              vertices.push([latLng.lat, latLng.lng]);
            }

            polygons.push(L.polygon(vertices, {
              color: '#ffffff',
              weight: 0.7,
              opacity: 0.09,
              fill: false,
              interactive: false
            }));
          }
        }

        polygons.forEach(polygon => polygon.addTo(hexGridLayer));
      }, 80);
    }

    // Hex grid is kept in code for internal geospatial analysis, but is never rendered to end users.

    // ── VERIFIED ROAD OBSERVATIONS ──
    let observationLayers = [];
    let observationLoadTimer = null;
    let observationRequestId = 0;
    let observationAbortController = null;
    let observationSummaryRequestId = 0;
    let observationSummaryAbortController = null;
    let roadChangeRequestId = 0;
    let roadChangeAbortController = null;
    let lastLoadedObservationViewportKey = '';
    let routeAbortController = null;

    function clearObservationLayers() {
      observationLayers.forEach(layer => map.removeLayer(layer));
      observationLayers = [];
      selectedObservationLayer = null;
      document.getElementById('road-intel-overlay')?.classList.add('hidden');
    }

    function selectObservationLayer(layer) {
      if (selectedObservationLayer && selectedObservationLayer !== layer) {
        selectedObservationLayer.setStyle({ weight: 2, opacity: 1, fillOpacity: 0.88 });
        selectedObservationLayer.getElement()?.classList.remove('road-intel-selected');
      }
      selectedObservationLayer = layer;
      layer.setStyle({ weight: 3.5, opacity: 1, fillOpacity: 1 });
      layer.bringToFront();
      layer.getElement()?.classList.add('road-intel-selected');
    }

      function observationPresentation(type) {
        const key = String(type || '').toLowerCase();
        if (key.includes('construction')) return { label: 'Construction', color: '#f97316' };
        if (key.includes('missing')) return { label: 'Missing road', color: '#fb7185' };
        if (key.includes('new') || key.includes('detected')) return { label: 'Newly detected', color: '#34d399' };
        if (key.includes('widen')) return { label: 'Widening', color: '#22d3ee' };
        if (key.includes('surface') || key.includes('condition')) return { label: 'Surface condition', color: '#f59e0b' };
        return { label: String(type || 'Road observation').replace(/_/g, ' '), color: '#f59e0b' };
      }

      function provenanceRow(label, value) {
      return '<div class="flex items-center justify-between gap-4 py-2 border-b border-zinc-900 last:border-0"><span class="intel-kicker">'+escapeHTML(label)+'</span><span class="font-mono-lux text-[8px] text-zinc-300 text-right">'+escapeHTML(value ?? 'N/A')+'</span></div>';
    }

    async function enrichObservationProvenance(observation) {
        if (!observation || !observation.id) return;
        try {
          const response = await fetch('/api/observations/' + encodeURIComponent(String(observation.id)), {
            headers: { 'Accept': 'application/json' }
          });
          if (!response.ok) return;
          const payload = await response.json();
          if (payload.api_version !== 'observation-detail-v1' || !payload.observation) return;
          const detail = payload.observation;
          const overlay = document.getElementById('road-intel-overlay');
          if (!overlay) return;
          let review = document.getElementById('road-intel-review');
          if (!review) {
            review = document.createElement('p');
            review.id = 'road-intel-review';
            review.className = 'text-[10px] text-zinc-500 mt-2 pt-2 border-t border-zinc-800';
            review.setAttribute('aria-live', 'polite');
            review.textContent = 'Loading provenance…';
            const note = document.getElementById('road-intel-note');
            (note?.parentElement || overlay).appendChild(review);
          }
          review.textContent = detail.reviewed_at
            ? 'Reviewed · ' + new Date(detail.reviewed_at).toLocaleString('en-IN')
            : 'Approved record · review timestamp unavailable';
        } catch {}
      }

      function showRoadIntelligence(observation, presentation, confidence, confidenceText, source, observedAt) {
        const overlay = document.getElementById('road-intel-overlay');
        if (!overlay) return;
        document.getElementById('road-intel-dot').style.backgroundColor = presentation.color;
        document.getElementById('road-intel-type').textContent = presentation.label;
        document.getElementById('road-intel-id').textContent = observation.id ? 'ID ' + String(observation.id).slice(0, 8) : 'Verified observation';
        document.getElementById('road-intel-confidence').textContent = confidenceText + ' score';
        document.getElementById('road-intel-confidence-value').textContent = confidenceText;
        document.getElementById('road-intel-source').textContent = source;
        document.getElementById('road-intel-observed').textContent = observedAt;
        const bar = document.getElementById('road-intel-confidence-bar');
        bar.style.width = Number.isFinite(confidence) ? `${Math.max(0, Math.min(100, confidence * 100))}%` : '0%';
        bar.style.backgroundColor = presentation.color;
        const note = document.getElementById('road-intel-note');
        const rawNote = observation.metadata && typeof observation.metadata.note === 'string' ? observation.metadata.note.trim() : '';
        if (rawNote) {
          note.textContent = String(rawNote).slice(0, 500);
          note.classList.remove('hidden');
        } else {
          note.textContent = '';
          note.classList.add('hidden');
        }
        overlay.classList.remove('hidden');
      }

    let observationRecords = [];
    let selectedObservationLayer = null;
    let lastObservationLoadAt = null;
    let observationViewportKey = '';

    function setObservationLoadMeta() {
      const stamp = lastObservationLoadAt
        ? lastObservationLoadAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : '—';
      document.querySelectorAll('.obs-layer-meta').forEach(el => {
        el.textContent = observationViewportKey ? `Approved viewport · ${stamp}` : 'Viewport · waiting';
      });
    }


    function setObservationLayerStatus(state) {
      document.getElementById('observation-status-strip')?.setAttribute('data-state', state);
      const config = {
        loading: { label: 'LOADING', dot: 'bg-amber-400', text: 'text-amber-400' },
        live: { label: 'VERIFIED', dot: 'bg-emerald-400', text: 'text-emerald-400' },
        empty: { label: 'NO DATA', dot: 'bg-zinc-600', text: 'text-zinc-500' },
        error: { label: 'UNAVAILABLE', dot: 'bg-rose-400', text: 'text-rose-400' }
      }[state] || { label: 'UNKNOWN', dot: 'bg-zinc-600', text: 'text-zinc-500' };

      document.querySelectorAll('.obs-layer-status').forEach(el => {
        el.textContent = config.label;
        el.className = 'obs-layer-status font-mono-lux text-[8px] ' + config.text;
      });
      document.querySelectorAll('.obs-layer-dot').forEach(el => {
        el.className = 'obs-layer-dot w-1.5 h-1.5 rounded-full ' + config.dot;
      });
      document.querySelectorAll('.obs-layer-retry').forEach(el => {
        el.classList.toggle('hidden', state !== 'error');
      });
      document.querySelectorAll('.obs-layer-error').forEach(el => {
        el.classList.toggle('hidden', state !== 'error');
      });
    }

    document.querySelectorAll('.obs-layer-retry').forEach(button => {
      button.addEventListener('click', () => {
        button.disabled = true;
        button.textContent = 'RETRYING…';
        loadObservationsInView().finally(() => {
          button.disabled = false;
          button.textContent = 'RETRY';
        });
      });
    });

    function updateObservationStatus(count, state='READY') {
      const countEl = document.getElementById('obs-status-count');
      const stateEl = document.getElementById('obs-status-state');
      const dot = document.getElementById('obs-status-dot');
      if (!countEl || !stateEl || !dot) return;
      countEl.textContent = Number.isFinite(count) ? String(count) : '--';
      stateEl.textContent = state;
      dot.className = 'w-1.5 h-1.5 rounded-full ' + (state === 'READY' ? 'bg-emerald-400' : state === 'NO DATA' ? 'bg-amber-400' : 'bg-rose-400');
    }

    function applyObservationFilters() {
      const typeValues = Array.from(document.querySelectorAll('.obs-filter-type')).map(el => el.value);
      const sourceValues = Array.from(document.querySelectorAll('.obs-filter-source')).map(el => el.value);
      const confidenceValues = Array.from(document.querySelectorAll('.obs-filter-confidence')).map(el => Number(el.value));
      const typeFilter = typeValues.find(Boolean) || 'all';
      const sourceFilter = sourceValues.find(Boolean) || 'all';
      const minConfidence = confidenceValues.length ? Math.max(...confidenceValues) : 0;
      let visible = 0;
      observationRecords.forEach(record => {
        const matchesType = typeFilter === 'all' || record.typeKey.includes(typeFilter);
        const matchesSource = sourceFilter === 'all' || record.source.toLowerCase() === sourceFilter.toLowerCase();
        const matchesConfidence = !Number.isFinite(record.confidence) || record.confidence >= minConfidence / 100;
        const show = matchesType && matchesSource && matchesConfidence;

        if (show) {
          const selected = selectedObservationLayer === record.layer;
          record.layer.setStyle({
            weight: selected ? 3.5 : 2,
            opacity: 1,
            fillOpacity: selected ? 1 : 0.88
          });
          record.layer.getElement()?.classList.toggle('road-intel-selected', selected);
          record.layer.bringToFront();
          visible++;
        } else {
          record.layer.setStyle({ opacity: 0, fillOpacity: 0 });
          if (selectedObservationLayer === record.layer) {
            selectedObservationLayer = null;
            record.layer.getElement()?.classList.remove('road-intel-selected');
            document.getElementById('road-intel-overlay')?.classList.add('hidden');
          }
        }
      });
      document.querySelectorAll('.obs-visible-count').forEach(el => { el.textContent = String(visible); });
      document.querySelectorAll('.obs-filter-confidence-value').forEach(label => { label.textContent = (confidenceValues.length ? Math.max(...confidenceValues) : 0) + '%'; });
    }

    function bindObservationFilters() {
      document.querySelectorAll('.obs-filter-type, .obs-filter-source, .obs-filter-confidence').forEach(el => {
        el.addEventListener('input', () => {
          const value = el.value;
          const selector = el.classList.contains('obs-filter-type') ? '.obs-filter-type' : el.classList.contains('obs-filter-source') ? '.obs-filter-source' : '.obs-filter-confidence';
          document.querySelectorAll(selector).forEach(other => { other.value = value; });
          applyObservationFilters();
        });
      });
      document.querySelectorAll('.obs-filter-reset').forEach(button => {
        button.addEventListener('click', () => {
          document.querySelectorAll('.obs-filter-type').forEach(el => { el.value = 'all'; });
          document.querySelectorAll('.obs-filter-source').forEach(el => { el.value = 'all'; });
          document.querySelectorAll('.obs-filter-confidence').forEach(el => { el.value = '0'; });
          applyObservationFilters();
        });
      });
    }

    function refreshObservationSourceOptions() {
      const sources = [...new Set(observationRecords.map(record => record.source).filter(Boolean))].sort();
      document.querySelectorAll('.obs-filter-source').forEach(select => {
        const current = select.value;
        select.innerHTML = '<option value="all">All sources</option>' + sources.map(source => '<option value="' + escapeHTML(source) + '">' + escapeHTML(source) + '</option>').join('');
        select.value = sources.includes(current) ? current : 'all';
      });
    }

    function temporalStatusPill(state) {
      const label = state === 'READY' ? 'VERIFIED' : state === 'AWAITING DATA' ? 'AWAITING DATA' : 'UNAVAILABLE';
      const cls = state === 'READY' ? 'text-emerald-300 border-emerald-400/20 bg-emerald-400/5' : state === 'AWAITING DATA' ? 'text-amber-300 border-amber-400/20 bg-amber-400/5' : 'text-rose-300 border-rose-400/20 bg-rose-400/5';
      return '<span class="px-2 py-1 rounded-full border text-[7px] font-bold tracking-[.16em] '+cls+'">'+label+'</span>';
    }

    function renderTemporalChangeIntelligence(observations) {
      const records = Array.isArray(observations) ? observations : [];
      const temporal = records.filter(observation => {
        const metadata = observation && observation.metadata && typeof observation.metadata === 'object'
          ? observation.metadata
          : {};
        return Boolean(
          metadata.baseline_year ||
          metadata.comparison_year ||
          metadata.detected_at ||
          metadata.change_type
        );
      });

      const years = [...new Set(temporal.flatMap(observation => {
        const metadata = observation.metadata || {};
        return [metadata.baseline_year, metadata.comparison_year]
          .map(Number)
          .filter(Number.isFinite);
      }))].sort((a, b) => a - b);

      const changeTypes = [...new Set(temporal.map(observation => {
        const metadata = observation.metadata || {};
        return String(metadata.change_type || observation.observation_type || '').trim();
      }).filter(Boolean))];

      const detections = temporal
        .map(observation => observation.metadata && observation.metadata.detected_at)
        .filter(Boolean);

      const status = temporal.length ? 'VERIFIED DATA' : 'AWAITING DATA';
      const statusClass = temporal.length ? 'text-emerald-400' : 'text-zinc-600';
      const window = years.length >= 2
        ? years.join(' → ')
        : years.length === 1
          ? String(years[0]) + ' / comparison pending'
          : 'No verified temporal observations';

      document.querySelectorAll('.temporal-change-status').forEach(el => {
        el.textContent = status;
        el.classList.remove('text-emerald-400', 'text-zinc-600');
        el.classList.add(statusClass);
      });
      document.querySelectorAll('.temporal-change-window').forEach(el => { el.textContent = window; });
      document.querySelectorAll('.temporal-change-count').forEach(el => { el.textContent = String(temporal.length); });
      document.querySelectorAll('.temporal-change-signals').forEach(el => {
        el.textContent = changeTypes.length ? changeTypes.slice(0, 2).join(' · ') : '0 verified';
      });
      document.querySelectorAll('.temporal-change-detection').forEach(el => {
        el.textContent = detections.length
          ? new Date(detections[0]).toLocaleDateString('en-IN')
          : 'Not available';
      });
    }

    async function loadRoadChangesInView() {
      const requestId = ++roadChangeRequestId;
      roadChangeAbortController?.abort();
      roadChangeAbortController = new AbortController();
      const bounds = map.getBounds();
      const params = new URLSearchParams({
        minLat: bounds.getSouth().toFixed(6),
        minLon: bounds.getWest().toFixed(6),
        maxLat: bounds.getNorth().toFixed(6),
        maxLon: bounds.getEast().toFixed(6)
      });
      try {
        const response = await fetch('/api/road-change?' + params.toString(), {
          headers: { 'Accept': 'application/json' },
          signal: roadChangeAbortController.signal
        });
        if (!response.ok) throw new Error('Road change API request failed');
        const payload = await response.json();
        if (requestId !== roadChangeRequestId) return;
        if (payload.api_version !== 'road-change-v1') throw new Error('Unsupported road change API version');
        const changes = Array.isArray(payload.changes) ? payload.changes : [];
        renderTemporalChangeIntelligence(changes.map(change => ({
          observation_type: change.observation_type,
          metadata: {
            baseline_year: change.baseline_year,
            comparison_year: change.comparison_year,
            detected_at: change.detected_at,
            change_type: change.change_type
          }
        })));
      } catch (error) {
        if (requestId !== roadChangeRequestId) return;
        renderTemporalChangeIntelligence([]);
      }
    }

    async function loadObservationsInView() {
      const requestId = ++observationRequestId;
      observationAbortController?.abort();
      observationAbortController = new AbortController();
      setObservationLayerStatus('loading');
      const bounds = map.getBounds();
      observationViewportKey = [
        bounds.getSouth().toFixed(3),
        bounds.getWest().toFixed(3),
        bounds.getNorth().toFixed(3),
        bounds.getEast().toFixed(3)
      ].join(',');
      if (observationViewportKey === lastLoadedObservationViewportKey) return;
      setObservationLoadMeta();
      const params = new URLSearchParams({
        minLat: bounds.getSouth().toFixed(6),
        minLon: bounds.getWest().toFixed(6),
        maxLat: bounds.getNorth().toFixed(6),
        maxLon: bounds.getEast().toFixed(6),
        limit: '500'
      });

      try {
        const response = await fetch('/api/observations?' + params.toString(), {
          headers: { 'Accept': 'application/json' },
          signal: observationAbortController.signal
        });
        if (!response.ok) {
          let detail = 'Observation API request failed';
          try {
            const errorPayload = await response.json();
            if (errorPayload.error) detail = errorPayload.error;
          } catch {}
          throw new Error(detail);
        }
        const payload = await response.json();
        if (requestId !== observationRequestId) return;
        if (payload.api_version !== 'observations-v6') {
          throw new Error('Unsupported observation API version');
        }
        const returnedCount = Number.isFinite(Number(payload.count)) ? Number(payload.count) : (Array.isArray(payload.observations) ? payload.observations.length : 0);
        document.querySelectorAll('.obs-view-note').forEach(el => { el.classList.toggle('hidden', payload.truncated === true); });
        clearObservationLayers();
        observationRecords = [];

        const observations = Array.isArray(payload.observations) ? payload.observations : [];
        document.querySelectorAll('.obs-returned-count').forEach(el => { el.textContent = String(returnedCount); });
        observations.forEach(observation => {
          const lat = Number(observation.latitude);
          const lon = Number(observation.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

          const rawType = observation.observation_type || 'observation';
          const presentation = observationPresentation(rawType);
          const confidence = Number(observation.confidence);
          const confidenceText = Number.isFinite(confidence) ? Math.round(confidence * 100) + '%' : 'N/A';
          const source = String(observation.source || 'unknown');
          const observedAt = observation.observed_at
            ? new Date(observation.observed_at).toLocaleString('en-IN')
            : 'N/A';

          const radius = Number.isFinite(confidence)
            ? 7 + Math.round(Math.max(0, Math.min(1, confidence)) * 4)
            : 8;

          const layer = L.circleMarker([lat, lon], {
            radius,
            weight: 2,
            color: presentation.color,
            fillColor: presentation.color,
            fillOpacity: 0.88
          }).addTo(map);

          layer.bindTooltip(presentation.label, {
            direction: 'top',
            offset: [0, -7],
            opacity: 0.9,
            className: 'road-intel-tooltip'
          });

          layer.on('click', event => {
            L.DomEvent.stopPropagation(event);
            selectObservationLayer(layer);
            showRoadIntelligence(observation, presentation, confidence, confidenceText, source, observedAt);
            enrichObservationProvenance(observation);
          });

          layer.bindPopup('<div class="space-y-1.5 min-w-[190px]">' +
            '<p class="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Verified Road Observation</p>' +
            '<p class="text-sm text-white font-semibold">' + escapeHTML(presentation.label) + '</p>' +
            '<p class="text-[11px] text-zinc-400">Source: <span class="text-zinc-200">' + escapeHTML(source) + '</span></p>' +
            '<p class="text-[11px] text-zinc-400">Confidence: <span class="text-zinc-200">' + escapeHTML(confidenceText) + '</span></p>' +
            '<p class="text-[11px] text-zinc-400">Observed: <span class="text-zinc-200">' + escapeHTML(observedAt) + '</span></p>' +
             '<p class="text-[11px] text-zinc-400">Temporal signal: <span class="text-zinc-200">' + escapeHTML(observation.metadata?.change_type || 'Not provided') + '</span></p>' +
          '</div>');

          observationLayers.push(layer);
          observationRecords.push({
            layer,
            typeKey: String(rawType).toLowerCase(),
            source,
            confidence
          });
        });

        refreshObservationSourceOptions();
        applyObservationFilters();
        updateObservationStatus(observations.length, observations.length ? 'READY' : 'NO DATA');
        renderTemporalChangeIntelligence(observations);
        loadRoadChangesInView();
        loadObservationSummary(bounds, requestId);
        lastObservationLoadAt = new Date();
        lastLoadedObservationViewportKey = observationViewportKey;
        setObservationLoadMeta();
        setObservationLayerStatus(observations.length ? 'live' : 'empty');
        document.querySelectorAll('.obs-summary-count').forEach(el => { if (!observations.length) el.textContent = '· NO VERIFIED OBSERVATIONS'; });
      document.querySelectorAll('.obs-layer-error').forEach(el => { el.textContent = ''; });
      } catch (error) {
        if (requestId !== observationRequestId) return;
        console.warn('[observations] Could not load road observations', error);
        clearObservationLayers();
        observationRecords = [];
        document.querySelectorAll('.obs-returned-count').forEach(el => { el.textContent = '0'; });
        document.querySelectorAll('.obs-view-note').forEach(el => { el.classList.add('hidden'); });
        document.querySelectorAll('.obs-summary-count').forEach(el => { el.textContent = '· -- GROUPS'; });
        refreshObservationSourceOptions();
        applyObservationFilters();
        renderTemporalChangeIntelligence([]);
        setObservationLayerStatus('error');
        document.querySelectorAll('.obs-layer-meta').forEach(el => {
          el.textContent = 'Viewport · unavailable';
        });
      }
    }

    async function loadObservationSummary(bounds, requestId) {
      const summaryId = ++observationSummaryRequestId;
      observationSummaryAbortController?.abort();
      observationSummaryAbortController = new AbortController();
      const params = new URLSearchParams({
        minLat: bounds.getSouth().toFixed(6),
        minLon: bounds.getWest().toFixed(6),
        maxLat: bounds.getNorth().toFixed(6),
        maxLon: bounds.getEast().toFixed(6)
      });
      try {
        const response = await fetch('/api/observation-summary?' + params.toString(), {
          headers: { 'Accept': 'application/json' },
          signal: observationSummaryAbortController.signal
        });
        if (!response.ok || summaryId !== observationSummaryRequestId || requestId !== observationRequestId) return;
        const payload = await response.json();
        if (payload.api_version !== 'observation-summary-v1') return;
        const groups = Array.isArray(payload.summary) ? payload.summary : [];
        document.querySelectorAll('.obs-summary-count').forEach(el => { el.textContent = '· ' + groups.length + ' GROUPS'; });
      } catch {}
    }

    function scheduleObservationLoad() {
      clearTimeout(observationLoadTimer);
      observationLoadTimer = setTimeout(loadObservationsInView, 450);
    }

    bindObservationFilters();
    map.on('moveend', scheduleObservationLoad, { passive: true });
    map.on('zoomend', updateMapContext, { passive: true });
    updateMapContext();
    loadObservationsInView();

    // Manual Point Select Popup
    map.on('click', e => {
      if (selectedObservationLayer) {
        selectedObservationLayer.setStyle({ weight: 2, opacity: 1, fillOpacity: 0.88 });
        selectedObservationLayer.getElement()?.classList.remove('road-intel-selected');
        selectedObservationLayer = null;
      }
      document.getElementById('road-intel-overlay')?.classList.add('hidden');
      const lat = e.latlng.lat.toFixed(5), lng = e.latlng.lng.toFixed(5);
      L.popup().setLatLng(e.latlng)
        .setContent(`<div class="space-y-1">
          <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Selected Coordinate</p>
          <p class="text-xs font-mono-lux text-white">${lat}, ${lng}</p>
        </div>`)
        .openOn(map);
    });

    // ── MAP TILE LAYER SELECTION ──
    function setTile(t) {
      map.removeLayer(tile);
      if (t === 'sat') {
        document.getElementById('map').classList.remove('map-dark');
        tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          maxNativeZoom: 19,
          attribution: '&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        }).addTo(map);
        document.getElementById('btn-sat').classList.add('active');
        document.getElementById('btn-sat').setAttribute('aria-pressed', 'true');
        document.getElementById('btn-map').classList.remove('active');
        document.getElementById('btn-map').setAttribute('aria-pressed', 'false');
      } else {
        tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: '&copy; Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, and the GIS User Community'
        }).addTo(map);
        document.getElementById('btn-map').classList.add('active');
        document.getElementById('btn-map').setAttribute('aria-pressed', 'true');
        document.getElementById('btn-sat').classList.remove('active');
        document.getElementById('btn-sat').setAttribute('aria-pressed', 'false');
      }
    }

    // ── SEARCH LOGIC & NOMINATIM INTEGRATION ──
    const si = document.getElementById('s-input');
    const sg = document.getElementById('sugg');
    let searchTimer = null;

    sg.addEventListener('click', event => {
      const item = event.target.closest('.sugg-item');
      if (!item) return;
      if (item.dataset.searchCity) gotoCity(item.dataset.searchCity);
      else if (item.dataset.searchLat && item.dataset.searchLon) gotoCoords(Number(item.dataset.searchLat), Number(item.dataset.searchLon), item.dataset.searchName || 'Selected location');
      sg.style.display = 'none';
    });

    si.addEventListener('input', function() {
      const q = this.value.trim().toLowerCase();
      clearTimeout(searchTimer);

      if (q.length < 2) {
        sg.style.display = 'none';
        sg.innerHTML = '';
        si.removeAttribute('aria-busy');
        return;
      }

      // Local results render immediately so typing never waits on the network.
      const local = Object.keys(CITIES).filter(c => c.includes(q)).slice(0, 5);
      const localHTML = local.map(c => `
        <div class="sugg-item flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 border-b border-black/5 cursor-pointer transition-colors" data-search-city="${c}">
          <span class="text-blue-500">●</span>
          <span>${c.charAt(0).toUpperCase() + c.slice(1)}</span>
          <span class="text-[9px] uppercase tracking-wider text-zinc-400 ml-auto font-bold">Local</span>
        </div>`).join('');

      sg.innerHTML = localHTML || '<div class="px-4 py-3 text-[10px] text-zinc-500">Press Enter to search this place.</div>';
      sg.style.display = 'block';
      si.removeAttribute('aria-busy');

      // Keep the local index fast, but always enrich it with live OSM search.
      // This makes villages, hamlets, wards, localities, PIN codes and small towns
      // searchable across India instead of limiting the product to CITIES.
      if (q.length >= 3) {
        searchTimer = setTimeout(async () => {
          if (si.value.trim().toLowerCase() !== q) return;
          si.setAttribute('aria-busy', 'true');
          try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=jsonv2&limit=7&countrycodes=in&addressdetails=1&namedetails=1`;
            const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
            if (!res.ok) throw new Error(`Search failed with ${res.status}`);
            const data = await res.json();
            if (si.value.trim().toLowerCase() !== q) return;

            const osm = Array.isArray(data) ? data : [];
            const seen = new Set(local.map(name => name.toLowerCase()));
            const rows = osm.filter(r => {
              const key = `${r.lat},${r.lon}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return Number.isFinite(Number(r.lat)) && Number.isFinite(Number(r.lon));
            }).slice(0, 7);

            const osmHTML = rows.map(r => {
              const parts = String(r.display_name || '').split(',').map(s => s.trim()).filter(Boolean);
              const title = parts[0] || 'Location';
              const context = parts.slice(1, 4).join(', ');
              const kind = r.type || r.addresstype || 'place';
              const safeName = escapeHTML(title);
              return `
                <div class="sugg-item flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 border-b border-black/5 cursor-pointer transition-colors" data-search-lat="${r.lat}" data-search-lon="${r.lon}" data-search-name="${safeName}">
                  <span class="text-zinc-400">⌖</span>
                  <span class="min-w-0 truncate">
                    <span class="block truncate">${safeName}</span>
                    <span class="block truncate text-[9px] text-zinc-400 mt-0.5">${escapeHTML(context || 'India')} · ${escapeHTML(kind)}</span>
                  </span>
                  <span class="text-[9px] uppercase tracking-wider text-zinc-400 ml-auto font-bold">OSM</span>
                </div>`;
            }).join('');

            if (osmHTML) {
              const localBlock = localHTML ? `<div class="px-4 py-1.5 text-[8px] uppercase tracking-[.16em] text-zinc-400 font-bold">Quick matches</div>${localHTML}` : '';
              sg.innerHTML = localBlock + `<div class="px-4 py-1.5 text-[8px] uppercase tracking-[.16em] text-zinc-400 font-bold">India locations</div>` + osmHTML;
            } else if (!local.length) {
              sg.innerHTML = '<div class="px-4 py-3 text-[10px] text-zinc-500">No matching location found in India.</div>';
            }
          } catch (error) {
            if (error.name !== 'AbortError') console.warn('[search] Geocoding failed', error);
          } finally {
            if (si.value.trim().toLowerCase() === q) si.removeAttribute('aria-busy');
          }
        }, 280);
      }
    });

    si.addEventListener('keydown', async event => {
      if (event.key === 'Escape') { sg.style.display = 'none'; si.removeAttribute('aria-busy'); return; }
      if (event.key === 'ArrowDown') {
        const first = sg.querySelector('.sugg-item');
        if (first) { event.preventDefault(); first.focus(); }
        return;
      }
      if (event.key !== 'Enter') return;
      const q = si.value.trim();
      if (!q) return;

      const localMatch = Object.keys(CITIES).find(c => c === q.toLowerCase());
      if (localMatch) {
        gotoCity(localMatch);
        return;
      }

      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' India')}&format=json&limit=4&countrycodes=in`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
        if (!res.ok) throw new Error(`Search failed with ${res.status}`);
        const data = await res.json();
        const nomHTML = data.map(r => {
          const safeName = r.display_name.split(',')[0].replace(/'/g, "\\'");
          return `
            <div class="sugg-item flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-400 border-b border-zinc-900 cursor-pointer transition-colors" data-search-lat="${r.lat}" data-search-lon="${r.lon}" data-search-name="${safeName}">
              <span class="text-zinc-500">🔍</span>
              <span class="truncate">${escapeHTML(r.display_name.split(',').slice(0, 2).join(', '))}</span>
              <span class="text-[9px] uppercase tracking-wider text-zinc-600 ml-auto font-bold">OSM</span>
            </div>`;
        }).join('');
        sg.innerHTML = nomHTML || `
          <div class="px-4 py-3 text-[10px] text-zinc-600">No matching location found.</div>`;
        sg.style.display = 'block';
      } catch (error) {
        console.warn('[search] Geocoding failed', error);
        sg.innerHTML = `
          <div class="px-4 py-3 text-[10px] text-rose-400">Location search unavailable. Try again.</div>`;
        sg.style.display = 'block';
      }
    });

    document.addEventListener('click', e => {
      if (!si.contains(e.target)) sg.style.display = 'none';
    });

    // ── PANNING & MARKERS ──
    function gotoCity(city) {
      const c = CITIES[city]; if (!c) return;
      showEarthThenZoom(c, 13, city);
      sg.style.display = 'none';
      si.value = city.charAt(0).toUpperCase() + city.slice(1); si.blur();
      placeMarker(c, si.value);
      loadAlerts(city);
      if (isMobile()) { openSheetMid(); showTab('alerts'); } else showTab('alerts');
    }

    function gotoCoords(lat, lon, name) {
      const c = [parseFloat(lat), parseFloat(lon)];
      showEarthThenZoom(c, 14, name);
      sg.style.display = 'none'; si.value = name; si.blur();
      placeMarker(c, name);
      loadAlerts(name);
      if (isMobile()) { openSheetMid(); showTab('alerts'); } else showTab('alerts');
    }

    function placeMarker(coords, name) {
      if (locMarker) map.removeLayer(locMarker);
      locMarker = L.marker(coords, {
        icon: L.divIcon({
          html: `<div style="width:12px;height:12px;background:#ffffff;border-radius:50%;border:2.5px solid #ef4444;box-shadow:0 0 0 4px rgba(239,68,68,0.25)"></div>`,
          className: '', iconSize: [12, 12], iconAnchor: [6, 6]
        })
      }).addTo(map);
    }

    function escapeHTML(value) {
      return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[char]));
    }

    // ── HIGH SPEED ROUTER ENGINE (OSRM) ──
    function drawRouteLine(coords, dashed = false) {
      // Dedicated route pane keeps the highlighted corridor above the base map and markers.
      if (!map.getPane('route-highlight')) {
        map.createPane('route-highlight');
        map.getPane('route-highlight').style.zIndex = 620;
        map.getPane('route-highlight').style.pointerEvents = 'none';
      }

      // Three-layer treatment: dark casing + vivid cyan route + thin white core.
      const casing = L.polyline(coords, {
        pane: 'route-highlight', color: '#050505', weight: 13, opacity: 0.9,
        lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
      const route = L.polyline(coords, {
        pane: 'route-highlight', color: '#22d3ee', weight: 8, opacity: 1,
        lineCap: 'round', lineJoin: 'round'
      }).addTo(map);
      const core = L.polyline(coords, {
        pane: 'route-highlight', color: '#ffffff', weight: 2.5, opacity: 0.95,
        lineCap: 'round', lineJoin: 'round',
        dashArray: dashed ? '10 8' : null
      }).addTo(map);

      routeLines.push(casing, route, core);
      return core;
    }

    function setRouteLoadingState(loading, message = 'Calculate Route →', activePrefix = null) {
      const buttons = activePrefix
        ? [document.getElementById(activePrefix + '-go-btn')].filter(Boolean)
        : Array.from(document.querySelectorAll('[id$="-go-btn"]'));

      buttons.forEach(btn => {
        btn.disabled = loading;
        btn.textContent = loading ? 'Calculating…' : message;
      });
    }

    function clearRouteState(clearOutput = false) {
      routeLines.forEach(line => map.removeLayer(line));
      routeLines = [];
      markers.forEach(marker => map.removeLayer(marker));
      markers = [];

      document.getElementById('route-status-overlay')?.classList.add('hidden');
      document.getElementById('stat-dist-val').textContent = '-- km';
      document.getElementById('stat-time-val').textContent = '-- mins';
      document.getElementById('stat-gap-val').textContent = 'N/A';

      if (clearOutput) {
        document.querySelectorAll('[id$="-route-out"]').forEach(el => { el.innerHTML = ''; });
      }
    }

    async function planRoute(p) {
      const from = document.getElementById(p + '-from').value.trim().toLowerCase();
      const to = document.getElementById(p + '-to').value.trim().toLowerCase();
      if (!from || !to) return;
      
      const btn = document.getElementById(p + '-go-btn');
      routeAbortController?.abort();
      routeAbortController = new AbortController();
      setRouteLoadingState(true, 'Finding locations…', p);
      clearRouteState(true);

      const fc = CITIES[from] || await geocodePlace(from);
      const tc = CITIES[to] || await geocodePlace(to);
      if (!fc || !tc) {
        clearRouteState();
        setRouteLoadingState(false, 'Calculate Route →', p);
        document.getElementById(p + '-route-out').innerHTML = `
          <div class="text-rose-500 text-xs mt-3 p-3 bg-rose-500/08 border border-rose-500/20 rounded-xl">
            One or both locations could not be found. Try a city, district, PIN code or full place name in India.
          </div>`;
        return;
      }
      
      btn.textContent = 'Calculating Route…';

      // Routing belongs to the detailed road map, not the Earth overview.
      // Hand off before drawing the corridor so the route is immediately visible.
      clearTimeout(earthTransitionTimer);
      setEarthOverview(false);
      map.invalidateSize({ pan: false });

      // If the Earth was at world scale, reset the hidden Leaflet camera
      // before adding route layers so fitBounds has a valid road-map viewport.
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();
      if (!Number.isFinite(currentZoom) || currentZoom <= 1 ||
          !Number.isFinite(currentCenter?.lat) || !Number.isFinite(currentCenter?.lng)) {
        map.setView([22, 78], 5, { animate: false });
        map.invalidateSize({ pan: false });
      }
      
      routeLines.forEach(l => map.removeLayer(l)); routeLines = [];
      markers.forEach(m => map.removeLayer(m)); markers = [];

      // Start/End markers stay above the highlighted corridor.
      const mk = (c, label, kind) => L.marker(c, {
        icon: L.divIcon({
          html: '<div class="route-endpoint-label ' + kind + '"><span class="route-endpoint-dot"></span><span>' + escapeHTML(label) + '</span></div>',
          className: '', iconSize: [0, 0], iconAnchor: [0, 16]
        }),
        zIndexOffset: 1000
      }).addTo(map);
      markers.push(mk(fc, 'START', 'start'), mk(tc, 'DESTINATION', 'end'));

      let dist, time, routeSource = 'OSRM';
      try {
        const osrm = await fetch(`https://router.project-osrm.org/route/v1/driving/${fc[1]},${fc[0]};${tc[1]},${tc[0]}?overview=full&geometries=geojson`, { signal: routeAbortController.signal });
        const od = await osrm.json();
        if (od.code === 'Ok' && Array.isArray(od.routes) && od.routes[0]?.geometry?.coordinates?.length >= 2) {
          const route = od.routes[0];
          dist = Math.round(route.distance / 1000);
          time = Math.round(route.duration / 60);
          const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
          const rl = drawRouteLine(coords);
          map.fitBounds(rl.getBounds(), { padding: [70, 90] });
        } else throw new Error();
      } catch (e) {
        if (e?.name === 'AbortError') {
          setRouteLoadingState(false, 'Calculate Route →', p);
          return;
        }
        routeSource = 'APPROX';
        dist = calcDist(fc, tc); time = Math.round(dist * 1.4);
        const rl = drawRouteLine([fc, tc], true);
        map.fitBounds(rl.getBounds(), { padding: [70, 90] });
      }

      const routeStatus = document.getElementById('route-status-overlay');
      document.getElementById('route-status-path').textContent = from.toUpperCase() + ' → ' + to.toUpperCase();
      document.getElementById('route-status-distance').textContent = dist + ' km';
      document.getElementById('route-status-time').textContent = time + ' min';
      document.getElementById('route-status-source').textContent = routeSource === 'OSRM' ? 'OSRM · ROAD NETWORK' : 'APPROX · ESTIMATE';
      routeStatus.classList.toggle('route-approx', routeSource === 'APPROX');
      routeStatus.classList.remove('hidden');

      // Do not manufacture road-coverage numbers. Verified observation data will populate this later.
      const pct = null;
      
      // Update floating desktop stat overlay
      document.getElementById('stat-dist-val').innerText = `${dist} km`;
      document.getElementById('stat-time-val').innerText = `${time} mins`;
      document.getElementById('stat-gap-val').innerText = pct === null ? 'N/A' : `${pct}%`;

      const alertResult = await fetchAlerts(from);
      const alerts = alertResult.alerts;
      const aiGuide = await getAIGuide(from, to, dist, time, alerts, pct);
      setRouteLoadingState(false, 'Calculate Route →', p);

      const alertNotice = alertResult.error
        ? `<div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 mt-3">
             <p class="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Local alert feed unavailable</p>
             <p class="text-[10px] text-zinc-600 mt-1">Route calculation completed, but the alert source could not be reached.</p>
           </div>`
        : '';

      const html = `
        ${routeSource === 'APPROX' ? `
        <div class="bg-amber-500/10 border border-amber-400/25 rounded-xl p-3 mt-3">
          <p class="text-[9px] uppercase tracking-wider text-amber-400 font-bold">Approximate route · provider fallback</p>
          <p class="text-[10px] text-zinc-500 mt-1">The routing service was unavailable. Distance and duration below are estimates, not verified road conditions.</p>
        </div>` : ''}

        ${alertNotice}

        <!-- Floating-like Stat Boxes in Sidebar -->
        <div class="grid grid-cols-3 gap-2 mt-4">
          <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
            <p class="text-white text-base font-bold">${dist}<span class="text-[10px] text-zinc-500 font-normal"> km</span></p>
            <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Distance</p>
          </div>
          <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
            <p class="text-white text-base font-bold">${time}<span class="text-[10px] text-zinc-500 font-normal"> min</span></p>
            <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Duration</p>
          </div>
          <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
            <p class="text-zinc-400 text-base font-bold">${pct === null ? 'N/A' : `${pct}%`}</p>
            <p class="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Verified gap</p>
          </div>
        </div>

        ${alerts.length ? `
        <div class="bg-rose-500/10 border border-rose-500/25 rounded-xl p-4 space-y-2 mt-3">
          <p class="text-[10px] uppercase tracking-wider text-rose-500 font-bold">⚠ Local Alerts</p>
          <div class="space-y-1.5">
            ${alerts.slice(0, 3).map(a => `<p class="text-xs text-zinc-300 leading-snug">• ${escapeHTML(a)}</p>`).join('')}
          </div>
        </div>` : ''}

        <!-- AI Navigation Intelligence -->
        <div class="bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl space-y-3 mt-3">
          <p class="text-[10px] uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Route guidance <span class="ml-auto text-[7px] text-zinc-600 font-mono-lux">GENERATED · NOT VERIFIED</span>
          </p>
          <p class="text-xs text-zinc-300 font-serif-lux italic leading-relaxed">${aiGuide}</p>
        </div>`;
        
      document.getElementById(p + '-route-out').innerHTML = html;
    }

    async function geocodePlace(query) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' India')}&format=jsonv2&limit=1&countrycodes=in&addressdetails=1`;
        const response = await fetch(url, {
          headers: { 'Accept-Language': 'en' }
        });
        if (!response.ok) return null;
        const results = await response.json();
        if (!Array.isArray(results) || !results.length) return null;
        const lat = Number(results[0].lat);
        const lon = Number(results[0].lon);
        return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
      } catch (error) {
        console.warn('[router] Geocoding failed', error);
        return null;
      }
    }

    function findClosest(q) {
      return CITIES[Object.keys(CITIES).find(k => k.startsWith(q.slice(0, 4))) || ''] || null;
    }
    
    function calcDist(c1, c2) {
      const R = 6371, dLat = (c2[0] - c1[0]) * Math.PI / 180, dLon = (c2[1] - c1[1]) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    // ── AI NAVIGATION CO-PILOT ──
    async function getAIGuide(origin, dest, dist, time, alerts, missingPct) {
      try {
        const res = await fetch('/api/route-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin, dest, dist, time, alerts, missingPct, lang: 'en' })
        });
        if (!res.ok) return defaultGuide(origin, dest);
        const data = await res.json();
        return data.text || defaultGuide(origin, dest);
      } catch (e) {
        return defaultGuide(origin, dest);
      }
    }
    
    function defaultGuide(o, d) {
      return 'No verified route guidance is available for ' + o.toUpperCase() + ' → ' + d.toUpperCase() + '. Use the calculated route as a network path only; local road conditions and alerts should be verified separately.';
    }

    // ── LIVE ALERT EXTRACTION ──
    async function fetchAlerts(city) {
      try {
        const r = await fetch(`/api/news?city=${encodeURIComponent(city)}`);
        if (!r.ok) throw new Error(`Alert feed returned ${r.status}`);
        const data = await r.json();
        return { alerts: Array.isArray(data.alerts) ? data.alerts : [], error: null };
      } catch (e) {
        console.warn('[alerts] Could not load alert feed', e);
        return { alerts: [], error: e };
      }
    }

    let activeAlertCity = null;

    async function loadAlerts(city) {
      activeAlertCity = city;
      const loading = `
        <div class="flex flex-col items-center justify-center py-12 text-zinc-500 gap-3">
          <div class="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin"></div>
          <p class="text-xs uppercase tracking-wider text-zinc-600 font-bold">Scanning for Alerts...</p>
        </div>`;
      document.getElementById('d-alerts-box').innerHTML = loading;
      document.getElementById('m-alerts-box').innerHTML = loading;
      
      const result = await fetchAlerts(city);
      if (result.error) {
        const msg = `
          <div class="text-center py-12 text-zinc-500 space-y-2 bg-zinc-900/30 rounded-xl border border-zinc-900 p-5">
            <span class="text-2xl block">!</span>
            <p class="text-xs uppercase tracking-wider text-rose-400 font-bold">Alert feed unavailable</p>
            <p class="text-[11px] text-zinc-600">The current alert source could not be reached. No safety conclusion is implied.</p>
            <button type="button" class="alert-feed-retry mt-2 text-[8px] uppercase tracking-wider font-bold text-zinc-400 hover:text-white">Retry</button>
          </div>`;
        document.getElementById('d-alerts-box').innerHTML = msg;
        document.getElementById('m-alerts-box').innerHTML = msg;
        return;
      }
      const alerts = result.alerts;
      if (!alerts.length) {
        const msg = `
          <div class="text-center py-12 text-zinc-500 space-y-1 bg-zinc-900/30 rounded-xl border border-zinc-900 p-5">
            <span class="text-2xl block">✓</span>
            <p class="text-xs uppercase tracking-wider text-zinc-400 font-bold">No alerts returned</p>
            <p class="text-[11px] text-zinc-600">No alerts were returned for this location by the current feed.</p>
          </div>`;
        document.getElementById('d-alerts-box').innerHTML = msg;
        document.getElementById('m-alerts-box').innerHTML = msg;
        return;
      }
      
      const html = alerts.map(a => `
        <div class="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 transition-all space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[8px] font-bold tracking-widest uppercase border px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border-zinc-800">ALERT · CURRENT FEED</span>
            <span class="text-[9px] text-zinc-600 font-semibold font-mono-lux">CURRENT FEED</span>
          </div>
          <p class="text-xs text-zinc-200 leading-snug">${escapeHTML(a)}</p>
        </div>`).join('');
      
      document.getElementById('d-alerts-box').innerHTML = html;
      document.getElementById('m-alerts-box').innerHTML = html;
      showTab('alerts');
    }

    document.addEventListener('click', event => {
      if (event.target.closest('.alert-feed-retry') && activeAlertCity) loadAlerts(activeAlertCity);
    });

    // ── LOCATE ME SERVICE ──
    function setLocateButtonState(state) {
      const button = document.getElementById('btn-loc');
      if (!button) return;
      const busy = state === 'loading';
      button.setAttribute('aria-busy', String(busy));
      button.setAttribute('aria-pressed', state === 'active' ? 'true' : 'false');
      button.classList.toggle('active', state === 'active');
      button.title = busy ? 'Locating your position…' : state === 'active' ? 'Location centered' : 'Locate me';
    }

    function locateMe() {
      if (!navigator.geolocation) {
        setLocateButtonState('idle');
        return;
      }
      setLocateButtonState('loading');
      navigator.geolocation.getCurrentPosition(pos => {
        const c = [pos.coords.latitude, pos.coords.longitude];
        map.flyTo(c, 15);
        if (locMarker) map.removeLayer(locMarker);
        locMarker = L.marker(c, {
          icon: L.divIcon({
            html: `<div style="width:14px;height:14px;background:#ffffff;border-radius:50%;border:2.5px solid #3b82f6;box-shadow:0 0 0 6px rgba(59,130,246,0.25)"></div>`,
            className: '', iconSize: [14, 14], iconAnchor: [7, 7]
          })
        }).addTo(map);
        setLocateButtonState('active');
      }, () => {
        setLocateButtonState('idle');
      }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
    }

    // ── SIDEBAR CONTROLS ──
    function syncEarthViewport() {
      const root = document.querySelector('main');
      if (!root) return;
      root.style.setProperty('--earth-right', (!isMobile() && sidebarOpen) ? '336px' : '0px');
    }

    function toggleSidebar() {
      sidebarOpen = !sidebarOpen;
      const sidebar = document.getElementById('sidebar');
      const toggle = document.getElementById('toggle-btn');
      toggle.setAttribute('aria-expanded', String(sidebarOpen));
      if (sidebarOpen) {
        sidebar.classList.remove('hidden');
        toggle.innerText = '◀';
        toggle.style.left = '-12px';
      } else {
        sidebar.classList.add('hidden');
        toggle.innerText = '▶';
        toggle.style.left = '-24px';
      }
      syncEarthViewport();
      setTimeout(() => map.invalidateSize(), 320);
    }

    // ── MOBILE BOTTOM SHEET GRAB HANDLE ──
    function toggleSheet() {
      sheetOpen = !sheetOpen;
      document.getElementById('sheet').classList.toggle('open', sheetOpen);
      document.getElementById('sheet-toggle')?.setAttribute('aria-expanded', String(sheetOpen));
    }
    
    function openSheet() {
      sheetOpen = true;
      document.getElementById('sheet').classList.add('open');
    }
    
    function openSheetMid() {
      sheetOpen = false;
      document.getElementById('sheet').classList.remove('open');
    }

    // ── TAB SWITCH ENGINE ──
    function showTab(t) {
      const valid = ['alerts', 'route', 'data'];
      if (!valid.includes(t)) return;

      if (t === 'route') {
        clearTimeout(earthTransitionTimer);
        setEarthOverview(false);
        map.invalidateSize({ pan: false });
        const center = map.getCenter();
        const zoom = map.getZoom();
        if (!Number.isFinite(zoom) || zoom <= 1 ||
            !Number.isFinite(center?.lat) || !Number.isFinite(center?.lng)) {
          map.setView([22, 78], 5, { animate: false });
        }
      }

      document.querySelectorAll('[data-nav-tab]').forEach(el => {
        const active = el.dataset.navTab === t;
        el.classList.toggle('active', active);
        el.setAttribute('aria-current', active ? 'page' : 'false');
      });

      ['alerts', 'route', 'data'].forEach(x => {
        const on = x === t;
        ['dt', 'mt'].forEach(p => {
          const el = document.getElementById(p + '-' + x);
          if (!el) return;
          el.classList.toggle('on', on);
          el.classList.toggle('active', on);
          el.classList.toggle('text-white', on);
          el.classList.toggle('text-zinc-500', !on);
          el.classList.toggle('border-white', on);
          el.setAttribute('aria-selected', String(on));
        });
        ['dp', 'mp'].forEach(p => {
          const el = document.getElementById(p + '-' + x);
          if (el) el.classList.toggle('on', on);
        });
      });
    }

    // ── GLOBAL KEYBOARD SHORTCUTS ──
    // Keep shortcuts intentionally small and discoverable: / = search, R = routing, L = location, Esc = dismiss.
    document.addEventListener('keydown', event => {
      const target = event.target;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (event.key === '/' && !typing) {
        event.preventDefault();
        si.focus();
        si.select();
        return;
      }

      if (event.key === 'Escape') {
        sg.style.display = 'none';
        si.removeAttribute('aria-busy');
        document.getElementById('road-intel-overlay')?.classList.add('hidden');
        if (isMobile() && sheetOpen) openSheetMid();
        return;
      }

      if (typing || event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        showTab('route');
        if (isMobile()) openSheet();
        const routeInput = document.getElementById(isMobile() ? 'm-from' : 'd-from');
        routeInput?.focus();
      }

      if (event.key.toLowerCase() === 'l') {
        event.preventDefault();
        locateMe();
      }
    });

    // Reliable map-control binding: keep the command deck functional even if
    // browser inline-handler behavior is restricted by CSP or cached markup.
    const mapCommandDeck = document.getElementById('map-command-deck');
    mapCommandDeck?.addEventListener('click', event => {
      const button = event.target.closest('[data-map-action]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();

      const action = button.dataset.mapAction;

      // The Earth overview sits above Leaflet, so changing a hidden tile layer
      // would look like a dead button. Hand off to the detail map first.
      const enterDetailMap = () => {
        clearTimeout(earthTransitionTimer);
        setEarthOverview(false);
        map.invalidateSize({ pan: false });
        // Never inherit the hidden/invalid Leaflet camera from the globe state.
        // The detail engine always enters on the India overview.
        const z = map.getZoom();
        const center = map.getCenter();
        const invalidCamera =
          !Number.isFinite(z) || z < 3 ||
          !Number.isFinite(center?.lat) || !Number.isFinite(center?.lng) ||
          Math.abs(center.lat) > 90 || Math.abs(center.lng) > 180;

        if (invalidCamera || earthOverviewActive) {
          map.setView([22, 78], 5, { animate: false });
        }
      };

      if (action === 'map' || action === 'sat') {
        enterDetailMap();
        setTile(action);
      }

      if (action === 'locate') {
        enterDetailMap();
        locateMe();
      }

      if (action === 'reset') {
        resetMapView();
      }
    });

    // Keep legacy inline integrations working as well.
    window.setTile = setTile;
    window.locateMe = locateMe;
    window.resetMapView = resetMapView;
    window.toggleSidebar = toggleSidebar;
    window.showTab = showTab;

    // Initialize Default States
    syncEarthViewport();
    window.addEventListener('resize', syncEarthViewport, { passive: true });
    loadAlerts('dehradun');

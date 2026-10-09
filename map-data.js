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

    
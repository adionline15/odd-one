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
      earthTransitionLocked = true;
      earthTransitionLocked = false;
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
    let earthTransitionLocked = false;

    function setEarthOverview(active) {
      earthOverviewActive = active;
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
      if (earthTransitionLocked) return;
      const target = { lat: Number(coords[0]), lng: Number(coords[1]) };
      clearTimeout(earthTransitionTimer);
      setEarthOverview(true);

      // Cinematic navigation: settle on the destination first, then hand off
      // to the detailed road map. The two engines overlap briefly so the
      // transition feels like one continuous journey rather than a jump.
      if (earthGlobe) {
        earthGlobe.controls().autoRotate = false;
        earthGlobe.controls().enableZoom = false;
        earthGlobe.pointOfView(
          { lat: target.lat, lng: target.lng, altitude: 1.85 },
          1450
        );
      }

      earthTransitionTimer = setTimeout(() => {
        setEarthOverview(false);
        earthGlobe?.controls().enableZoom = true;
        map.invalidateSize();
        map.stop();
        map.flyTo(coords, zoom, {
          duration: 2.25,
          easeLinearity: 0.12
        });
        placeMarker(coords, name);
        earthTransitionLocked = false;
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
        showEarthThenZoom(c, 15, 'My location');
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

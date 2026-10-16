const MAPLIBRE_VERSION = "6.14.0";
const MAPLIBRE_MODULE = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.mjs`;
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const DEFAULT_VIEW = { center: [77.209, 28.6139], zoom: 11.2, pitch: 24, bearing: -8 };
const DEMO_INTERVAL_MS = 1800;

const $ = (selector) => document.querySelector(selector);
const mapHost = $("#map");
const mapStatus = $("#map-status");
const gpsButton = $("#gps-button");
const gpsMessage = $("#gps-message");
const featureCard = $("#feature-card");
const feed = $("#activity-feed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const demoVehicles = [
  { id: "demo-van-01", name: "Demo vehicle 01", route: [[77.209,28.6139],[77.218,28.620],[77.229,28.617],[77.236,28.626],[77.244,28.631]], step: 0, progress: 0, color: "#81d3ff" },
  { id: "demo-van-02", name: "Demo vehicle 02", route: [[77.190,28.602],[77.198,28.609],[77.207,28.606],[77.215,28.613],[77.223,28.611]], step: 0, progress: 0.48, color: "#81d3ff" },
  { id: "demo-van-03", name: "Demo vehicle 03", route: [[77.230,28.597],[77.226,28.605],[77.234,28.612],[77.246,28.614],[77.253,28.622]], step: 0, progress: 0.72, color: "#81d3ff" }
];
const demoTeams = [
  { id: "demo-team-01", name: "Demo field team A", coordinates: [77.202,28.625], task: "Sample road survey" },
  { id: "demo-team-02", name: "Demo field team B", coordinates: [77.246,28.603], task: "Sample road verification" }
];
const demoEvents = [
  { id: "demo-event-01", name: "Sample road report", coordinates: [77.217,28.617], category: "Road report", status: "Unverified demo event" },
  { id: "demo-event-02", name: "Sample construction notice", coordinates: [77.239,28.608], category: "Construction", status: "Illustrative only" }
];

let maplibre;
let map;
let mapLoaded = false;
let gpsWatchId = null;
let gpsMarker = null;
let userCoordinates = null;
let demoTimer = null;
let markerRecords = [];
let selectedMarker = null;
let activityItems = [];
let lastGpsTimestamp = null;

const setStatus = (message, hide = false) => {
  if (!mapStatus) return;
  mapStatus.textContent = message;
  mapStatus.hidden = hide;
};
const formatTime = (date = new Date()) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

function addActivity(title, detail, color = "#81d3ff") {
  activityItems.unshift({ title, detail, color });
  activityItems = activityItems.slice(0, 5);
  feed.innerHTML = activityItems.map((item) => `<div class="activity-item"><span class="feed-dot" style="background:${item.color}"></span><div><b>${escapeHTML(item.title)}</b><small>${escapeHTML(item.detail)}</small></div></div>`).join("");
}

function createMarkerElement(kind, glyph, label) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = `live-marker ${kind}`;
  element.textContent = glyph;
  element.setAttribute("aria-label", label);
  element.title = label;
  return element;
}

function showFeature({ type, title, description, meta = [] }) {
  $("#feature-type").textContent = type.toUpperCase();
  $("#feature-title").textContent = title;
  $("#feature-description").textContent = description;
  $("#feature-meta").innerHTML = meta.map(([label, value]) => `<div><span>${escapeHTML(label)}</span><b>${escapeHTML(value)}</b></div>`).join("");
  featureCard.hidden = false;
}
function closeFeature() { featureCard.hidden = true; }
$("#close-feature").addEventListener("click", closeFeature);

function addPointMarker({ kind, glyph, label, coordinates, details }) {
  const element = createMarkerElement(kind, glyph, label);
  element.addEventListener("click", () => {
    selectedMarker = details.id;
    showFeature(details);
  });
  const marker = new maplibre.Marker({ element, anchor: "center" }).setLngLat(coordinates).addTo(map);
  markerRecords.push({ id: details.id, kind, marker, element, details });
  return marker;
}

function setLayerVisibility(kind, visible) {
  markerRecords.filter((record) => record.kind === kind).forEach((record) => {
    record.element.style.display = visible ? "" : "none";
    record.element.tabIndex = visible ? 0 : -1;
  });
  if (kind === "me" && gpsMarker) {
    const el = gpsMarker.getElement();
    el.style.display = visible && userCoordinates ? "" : "none";
  }
}
function syncLayerControls() {
  setLayerVisibility("vehicle", $("#toggle-vehicles").checked);
  setLayerVisibility("team", $("#toggle-teams").checked);
  setLayerVisibility("event", $("#toggle-events").checked);
  setLayerVisibility("me", $("#toggle-me").checked);
}
$("#toggle-vehicles").addEventListener("change", syncLayerControls);
$("#toggle-teams").addEventListener("change", syncLayerControls);
$("#toggle-events").addEventListener("change", syncLayerControls);
$("#toggle-me").addEventListener("change", syncLayerControls);

function addDemoMarkers() {
  demoVehicles.forEach((vehicle) => {
    const coords = vehicle.route[0];
    addPointMarker({
      kind: "vehicle", glyph: "↗", label: vehicle.name, coordinates: coords,
      details: { type: "SIMULATED VEHICLE", title: vehicle.name, description: "Synthetic marker used to exercise map movement. Not connected to a real GPS device.", id: vehicle.id, meta: [["Feed", "Local demo"], ["Last update", "Simulated"], ["Status", "Not real tracking"]] }
    });
  });
  demoTeams.forEach((team) => addPointMarker({
    kind: "team", glyph: "●", label: team.name, coordinates: team.coordinates,
    details: { type: "SIMULATED FIELD TEAM", title: team.name, description: "Illustrative field-agent location. No real person is being tracked.", id: team.id, meta: [["Task", team.task], ["Feed", "Local demo"], ["Consent", "Synthetic data"]] }
  }));
  demoEvents.forEach((event) => addPointMarker({
    kind: "event", glyph: "!", label: event.name, coordinates: event.coordinates,
    details: { type: "SAMPLE ROAD EVENT", title: event.name, description: "Illustrative event for the interface only. It is not a verified road condition or live alert.", id: event.id, meta: [["Category", event.category], ["Status", event.status], ["Source", "Synthetic sample"]] }
  }));
  $("#vehicle-count").textContent = String(demoVehicles.length);
  $("#team-count").textContent = String(demoTeams.length);
  $("#event-count").textContent = String(demoEvents.length);
  demoVehicles.forEach((vehicle) => addActivity(vehicle.name + " · demo feed", "Synthetic position · " + formatTime(), "#81d3ff"));
  addActivity("Sample road events loaded", "Not verified · demo data only", "#ffca7a");
  syncLayerControls();
}

function interpolateRoute(vehicle) {
  const points = vehicle.route;
  const index = vehicle.step % (points.length - 1);
  const start = points[index];
  const end = points[index + 1];
  return [start[0] + (end[0] - start[0]) * vehicle.progress, start[1] + (end[1] - start[1]) * vehicle.progress];
}
function animateDemoFeed() {
  if (document.hidden || !mapLoaded) return;
  demoVehicles.forEach((vehicle, i) => {
    vehicle.progress += 0.07 + i * 0.012;
    if (vehicle.progress >= 1) {
      vehicle.progress = 0;
      vehicle.step = (vehicle.step + 1) % (vehicle.route.length - 1);
    }
    const coords = interpolateRoute(vehicle);
    const record = markerRecords.find((item) => item.id === vehicle.id);
    if (record) record.marker.setLngLat(coords);
  });
  addActivity("Demo positions refreshed", "Synthetic feed · " + formatTime(), "#81d3ff");
}
function startDemoFeed() {
  if (demoTimer) window.clearInterval(demoTimer);
  demoTimer = window.setInterval(animateDemoFeed, DEMO_INTERVAL_MS);
}
function pauseDemoFeed() { if (demoTimer) window.clearInterval(demoTimer); demoTimer = null; }

function updateGpsUI() {
  const enabled = gpsWatchId !== null;
  $("#gps-state").textContent = enabled && userCoordinates ? "On" : "Off";
  $("#gps-updated").textContent = lastGpsTimestamp ? "Updated " + formatTime(new Date(lastGpsTimestamp)) : "Not sharing";
  $("#toggle-me").checked = Boolean(userCoordinates);
  if (gpsMarker) gpsMarker.getElement().style.display = userCoordinates ? "" : "none";
  gpsButton.innerHTML = enabled ? "<span aria-hidden=\"true\">■</span> Stop my GPS" : "<span aria-hidden=\"true\">◎</span> Enable my GPS";
}
function stopGps(message = "GPS stopped. Your location is no longer being watched by this page.") {
  if (gpsWatchId !== null && "geolocation" in navigator) navigator.geolocation.clearWatch(gpsWatchId);
  gpsWatchId = null;
  userCoordinates = null;
  lastGpsTimestamp = null;
  if (gpsMarker) { gpsMarker.remove(); gpsMarker = null; }
  $("#toggle-me").checked = false;
  $("#gps-state").textContent = "Off";
  $("#gps-updated").textContent = "Not sharing";
  gpsMessage.textContent = message;
  updateGpsUI();
}
function enableGps() {
  if (!("geolocation" in navigator)) {
    gpsMessage.textContent = "This browser does not support geolocation.";
    return;
  }
  if (!window.isSecureContext && location.hostname !== "localhost") {
    gpsMessage.textContent = "Browser GPS requires HTTPS or localhost.";
    return;
  }
  gpsButton.disabled = true;
  gpsMessage.textContent = "Waiting for browser permission and GPS fix…";
  gpsWatchId = navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude, accuracy } = position.coords;
    userCoordinates = [longitude, latitude];
    lastGpsTimestamp = position.timestamp;
    if (!gpsMarker) {
      const element = createMarkerElement("me", "•", "Your device location");
      gpsMarker = new maplibre.Marker({ element, anchor: "center" }).setLngLat(userCoordinates).addTo(map);
      element.addEventListener("click", () => showFeature({
        type: "DEVICE GPS", title: "Your device", description: "This location stays in this browser page. It is not uploaded or shared by this prototype.",
        meta: [["Accuracy", Math.round(accuracy) + " m"], ["Updated", formatTime(new Date(position.timestamp))], ["Sharing", "Device-local only"]]
      }));
    } else gpsMarker.setLngLat(userCoordinates);
    gpsMarker.getElement().style.display = $("#toggle-me").checked ? "" : "none";
    gpsMessage.textContent = "Your location is visible on this device only · accuracy ±" + Math.round(accuracy) + " m · " + formatTime(new Date(position.timestamp));
    $("#gps-state").textContent = "On";
    $("#gps-updated").textContent = "Updated " + formatTime(new Date(position.timestamp));
    $("#toggle-me").checked = true;
    addActivity("Your device GPS updated", "Device-local · accuracy ±" + Math.round(accuracy) + " m", "#c3b1ff");
  }, (error) => {
    const messages = { 1: "Location permission was denied. GPS remains off.", 2: "Your current location is unavailable. Try again in a clearer signal area.", 3: "Location request timed out. You can try again." };
    stopGps(messages[error.code] || "Could not read device location.");
  }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 });
  gpsButton.disabled = false;
  updateGpsUI();
}
gpsButton.addEventListener("click", () => {
  if (gpsWatchId !== null) stopGps();
  else enableGps();
});

function searchMap() {
  const raw = $("#map-search").value.trim();
  if (!raw) return;
  const coordsMatch = raw.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (coordsMatch) {
    const first = Number(coordsMatch[1]);
    const second = Number(coordsMatch[2]);
    let center;
    if (Math.abs(first) <= 90 && Math.abs(second) <= 180) center = [second, first]; // latitude, longitude
    else if (Math.abs(first) <= 180 && Math.abs(second) <= 90) center = [first, second]; // longitude, latitude
    else { setStatus("Coordinates are outside valid latitude/longitude ranges."); return; }
    map.flyTo({ center, zoom: Math.max(map.getZoom(), 13), essential: !reduceMotion });
    setStatus("Showing coordinates · " + center.map((v) => v.toFixed(5)).join(", "), true);
    return;
  }
  setStatus("Place-name search is not connected yet. Try latitude, longitude or use the map controls.");
}
$("#search-button").addEventListener("click", searchMap);
$("#map-search").addEventListener("keydown", (event) => { if (event.key === "Enter") searchMap(); });
$("#reset-view").addEventListener("click", () => map?.flyTo({ ...DEFAULT_VIEW, duration: reduceMotion ? 0 : 900, essential: !reduceMotion }));

function installMapFailure(message) {
  setStatus(message);
  mapHost.innerHTML = '<div class="map-fallback"><div><p class="eyebrow">MAP CONNECTION UNAVAILABLE</p><h2>The map could not load.</h2><p>Check your internet connection and whether the map style service is reachable. The demo and GPS controls require a working map.</p></div></div>';
}
async function bootMap() {
  if (!mapHost) return;
  setStatus("Loading MapLibre GL JS " + MAPLIBRE_VERSION + "…");
  try {
    maplibre = await import(MAPLIBRE_MODULE);
    map = new maplibre.Map({
      container: mapHost, style: STYLE_URL, ...DEFAULT_VIEW,
      projection: { type: "globe" }, renderWorldCopies: false,
      cooperativeGestures: true, attributionControl: false,
      canvasContextAttributes: { antialias: false, powerPreference: "high-performance" },
      fadeDuration: reduceMotion ? 0 : 180
    });
    map.addControl(new maplibre.NavigationControl({ showCompass: false, visualizePitch: true }), "bottom-right");
    map.addControl(new maplibre.AttributionControl({ compact: true }), "bottom-right");
    map.on("load", () => {
      mapLoaded = true;
      setStatus("Map ready · OpenFreeMap / OpenStreetMap", true);
      addDemoMarkers();
      startDemoFeed();
    });
    map.on("error", (event) => {
      if (!mapLoaded && event?.error) setStatus("Map is connecting to its style and tile services…");
    });
  } catch (error) {
    installMapFailure("Map loading failed. Check network access and retry.");
    console.error("Odd-One Live map initialization failed", error);
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseDemoFeed();
  else if (mapLoaded) startDemoFeed();
});
window.addEventListener("pagehide", () => {
  pauseDemoFeed();
  if (gpsWatchId !== null && "geolocation" in navigator) navigator.geolocation.clearWatch(gpsWatchId);
});
window.addEventListener("beforeunload", () => {
  pauseDemoFeed();
  if (gpsWatchId !== null && "geolocation" in navigator) navigator.geolocation.clearWatch(gpsWatchId);
});

bootMap();
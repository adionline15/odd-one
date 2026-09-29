# Odd-One.in

**India road intelligence — MVP**

Odd-One.in is a map-first prototype for discovering road conditions, route information, and local road alerts. The current MVP combines an OpenStreetMap base map, OSRM routing, Google News road-alert extraction, and an optional Gemini-powered route guide.

## Current MVP

### User flow

1. Open the map.
2. Search for an Indian city or use the preset cities.
3. Open **Alerts** to see recent road/traffic/construction news.
4. Open **Route** and calculate a route between supported cities.
5. Review distance, estimated travel time, local alerts, and optional AI guidance.

### Architecture

```text
Browser
  │
  ├── Leaflet map ───────────────► OpenStreetMap tiles
  ├── Route request ─────────────► OSRM
  ├── Search ────────────────────► Nominatim
  ├── GET /api/news ─────────────► Google News RSS
  └── POST /api/route-guide ─────► Vercel Function ──► Gemini API
                                      │
                                      └── GEMINI_API_KEY
                                         stays server-side
```

## Important data boundary

The prototype **does not currently claim a verified road-coverage percentage**. Route-level data-gap metrics are shown as unavailable until verified road observations are connected.

This is intentional: the product should never turn a synthetic number into an apparent real-world road statistic.

## API endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/news?city=...` | GET | Fetch recent road/traffic/construction alerts |
| `/api/route-guide` | POST | Generate optional route guidance with Gemini |
| `/api/tiles/{z}/{x}/{y}` | GET | Server-side OSM tile proxy |

## Environment variables

Set these in the Vercel project environment, not in Git:

```text
GEMINI_API_KEY=...
```

No API key is required in the browser.

## Production MVP boundary

The next product layer is a verified road-observation system:

```text
Observation
├── id
├── geometry
├── observation_type
├── source
├── observed_at
├── submitted_at
├── confidence
├── status
├── metadata
├── created_by
└── reviewed_by
```

Recommended lifecycle:

```text
pending ──► approved
    │
    └──────► rejected
```

Only approved observations should become public road-intelligence data.

## Repository structure

- `index.html` — current web MVP
- `api/news.js` — road-alert API
- `api/route-guide.js` — Gemini route-guide API
- `api/tiles.js` — OSM tile proxy
- `docs/ARCHITECTURE.md` — product/backend direction
- `docs/SECURITY.md` — production security checklist
- `oddone_rag.py` and older prototype HTML files — research/legacy experiments

## Deployment

The repository is designed for Vercel's static frontend + serverless API model.

Before deploying production data services, add:

- persistent Postgres/PostGIS storage
- authenticated observation submission
- moderation/review workflow
- audit logs
- rate limiting
- automated tests
- monitoring and backups
- documented data provenance

## License

All rights reserved unless a separate license is added to this repository.

# Odd-One.in

**India road intelligence — MVP**

Odd-One.in is a map-first road-intelligence prototype for verified observations, route information, and local road alerts. The interface distinguishes verified data from estimates and unavailable sources. The current MVP combines an OpenStreetMap base map, OSRM routing, Google News road-alert extraction, an optional Gemini-powered route guide, and the foundation for verified road observations.

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
  ├── Leaflet map ───────────────► Esri World Street Map / imagery
  ├── Route request ─────────────► OSRM
  ├── Search ────────────────────► Nominatim
  ├── GET /api/news ─────────────► Google News RSS
  ├── POST /api/route-guide ─────► Vercel Function ──► Gemini API
  └── GET /api/observations ─────► Vercel Function ──► Supabase/PostGIS
                                      │
                                      └── secrets stay server-side
```

## Important data boundary

The prototype **does not currently claim a verified road-coverage percentage**. Route-level data-gap metrics are shown as unavailable until verified road observations are connected.

This is intentional: the product should never turn a synthetic number into an apparent real-world road statistic.

## Observation data layer

The repository now contains a PostGIS-backed observation foundation:

Temporal change intelligence is rendered only when approved observations contain temporal/change metadata; the product does not invent historical change statistics.

- `db/schema.sql` — observation tables, enums, spatial index, RLS, and RPC functions
- `api/observations.js` — validated API for approved map observations and pending submissions

Observation lifecycle:

```text
source → ingest → validate → pending → review → approved → publish
                                      └──────────► rejected
```

Only approved observations are returned by the public observation read path.

### Observation model

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

### Map and search behavior

When OSRM is unavailable, the client uses an explicitly labelled approximate fallback; it must not be presented as verified road intelligence.

- The map renders the current road-intelligence layer from approved observations.
- Local city search is handled in the browser for known Indian locations.
- External Nominatim search is only triggered by an explicit user search action.
- Route calculation uses OSRM when available; the UI labels the fallback route as approximate.

### Supabase setup

The database layer uses Supabase Postgres + PostGIS. Supabase documents PostGIS as the geospatial layer for indexed point/polygon queries and recommends keeping the extension outside the `public` schema. citeturn1search0

1. Create a Supabase project.
2. Enable PostGIS in a dedicated `gis` schema.
3. Run `db/schema.sql` in the Supabase SQL Editor.
4. Add these **Vercel server-side** variables:

```text
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
OBSERVATIONS_SUBMISSION_ENABLED=false
```

Supabase's Data API is generated from the database schema and protected by API-key authentication; current docs distinguish server-side secret keys from client-side publishable keys. citeturn0search0turn0search3

Keep `OBSERVATIONS_SUBMISSION_ENABLED=false` until authentication and abuse protection are implemented.

## Observation API contract

## Observation viewport limits

The public observation read path accepts geographic viewports up to 60 degrees in latitude and longitude span and caps a single response at 500 observations. Larger areas should be explored through normal map navigation rather than a single unbounded request.



Successful observation reads return API version `observations-v6` and include `count`, `limit`, and `truncated` metadata. Responses are briefly cacheable to reduce repeated viewport reads while the frontend refreshes only the active map area.

## API endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/news?city=...` | GET | Recent road/traffic/construction alerts |
| `/api/route-guide` | POST | Optional Gemini route guidance |
| `/api/tiles/{z}/{x}/{y}` | GET | Server-side Esri World Street Map proxy |
| `/api/observations?minLat=...&minLon=...&maxLat=...&maxLon=...` | GET | Approved observations in a map viewport |
| `/api/observation-summary?minLat=...&minLon=...&maxLat=...&maxLon=...` | GET | Approved observation counts by type and source |
| `/api/observations` | POST | Submit a pending observation when explicitly enabled |

### Observation summary example

```text
GET /api/observation-summary?minLat=28&minLon=77&maxLat=29&maxLon=78
```

The summary is derived only from approved observations and is viewport-scoped. Each group includes observation type, source, count, average confidence, and latest observed timestamp. The endpoint uses a short cache because approved observations can change.

### Public data boundary

Observation timestamps describe when a signal was observed, not when the map was last refreshed.

Only observations with `approved` status are exposed through public observation reads and summaries.

## Environment variables

See `.env.example`.

Secrets must be configured in Vercel, never committed to Git.

## Production MVP boundary

The next production layer is:

1. add authenticated observation submission
2. build reviewer/admin workflow
3. add API documentation and generated contract tests
4. add monitoring, rate limiting, backups, and audit logs
5. build ingestion and temporal change-detection pipelines
6. review external provider licensing and attribution for production scale

## Repository structure

- `index.html` — current web MVP
- `api/news.js` — road-alert API
- `api/route-guide.js` — Gemini route-guide API
- `api/tiles.js` — OSM tile proxy
- `api/observations.js` — observation API
- `api/observation-summary.js` — approved observation summary API
- `db/schema.sql` — PostGIS schema and database functions
- `docs/ARCHITECTURE.md` — system architecture
- `docs/SECURITY.md` — production security checklist
- `oddone_rag.py` and older prototype HTML files — research/legacy experiments

## Deployment

The repository is designed for Vercel's static frontend + serverless API model.

Before production traffic:

- authenticated observation submission
- moderation/review workflow
- audit logs
- rate limiting
- automated tests
- monitoring and backups
- documented data provenance

## License

All rights reserved unless a separate license is added to this repository.


### Data trust principles

- Never invent road observations, alerts, historical change, or confidence.
- Clearly label verified observations, estimates, unavailable services, and awaiting data.

- Source labels are descriptive provenance, not independent proof.
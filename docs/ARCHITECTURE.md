# Odd-One Architecture

## 1. Current MVP

The current application is intentionally small:

- Static browser frontend in `index.html`
- Vercel serverless functions under `api/`
- External routing via OSRM
- Geocoding/search via Nominatim
- Recent road-alert discovery via Google News RSS
- Optional AI guidance via Gemini

The browser must never receive the Gemini API key.

## 2. Target road-intelligence architecture

```text
                    ┌──────────────────────┐
                    │      Web / Mobile    │
                    │   Map + Observations │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │      API Gateway     │
                    │ Auth + rate limiting │
                    └───────┬───────┬───────┘
                            │       │
                 ┌──────────▼─┐   ┌▼─────────────┐
                 │ Postgres + │   │ Object Store │
                 │   PostGIS  │   │ photos/video │
                 └──────┬─────┘   └──────┬──────┘
                        │                │
                        └───────┬────────┘
                                │
                     ┌──────────▼──────────┐
                     │ Intelligence layer  │
                     │ validation + fusion │
                     └──────────┬──────────┘
                                │
                     ┌──────────▼──────────┐
                     │ Approved road data  │
                     │ public API + map     │
                     └──────────────────────┘
```

## 3. Observation model

Each observation should have:

- geometry
- observation type
- source
- observation timestamp
- submission timestamp
- confidence
- status
- metadata
- creator
- reviewer

Possible observation types:

- missing road
- new road
- road closure
- construction
- surface condition
- access restriction
- map mismatch

## 4. Data lifecycle

```text
source → ingest → validate → pending → review → approved → publish
                                      └──────────► rejected
```

Public endpoints should read from approved observations only.

## 5. Request boundaries

The browser talks to small serverless endpoints rather than directly holding privileged credentials.

- Observation reads are viewport-scoped and return approved data only.
- News queries are city-scoped and cached briefly.
- Route guidance receives bounded route metrics and a small alert set.
- Tile requests validate zoom and tile coordinates before proxying upstream.
- Secrets remain server-side.

## 6. Freshness model

Road intelligence is time-bound data, not a timeless map attribute. Every observation carries observed_at, while the UI separately tracks the latest successful viewport load. Cached reads therefore reduce duplicate work without changing the underlying observation timestamps.

## 7. Product rule

Every intelligence item should be traceable to:

- **what** was observed
- **where** it was observed
- **when** it was observed
- **how** it was sourced
- **how confident** the system is
- **whether** it has been reviewed

This provenance model is the foundation for scaling beyond a visual prototype.

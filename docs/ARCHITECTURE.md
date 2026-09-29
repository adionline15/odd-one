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

## 5. Product rule

Every intelligence item should be traceable to:

- **what** was observed
- **where** it was observed
- **when** it was observed
- **how** it was sourced
- **how confident** the system is
- **whether** it has been reviewed

This provenance model is the foundation for scaling beyond a visual prototype.

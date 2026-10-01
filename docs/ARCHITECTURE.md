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

Public endpoints should read from approved observations only. Aggregations must apply the same approved-only boundary before returning product metrics.

## 5. Request boundaries

The browser talks to small serverless endpoints rather than directly holding privileged credentials.

- Observation reads are viewport-scoped and return approved data only.
- News queries are city-scoped and cached briefly.
- Route guidance receives bounded route metrics and a small alert set.
- Tile requests validate zoom and tile coordinates before proxying upstream.
- Secrets remain server-side.

## 6. Summary service

The summary endpoint aggregates only approved observations already stored in PostGIS. It does not infer missing coverage or generate synthetic intelligence metrics.

## 7. Freshness model

Road intelligence is time-bound data, not a timeless map attribute. Every observation carries observed_at, while the UI separately tracks the latest successful viewport load. Temporal metadata is treated as provenance, not proof of a change unless the observation source supports that claim. Cached reads therefore reduce duplicate work without changing the underlying observation timestamps.

## 8. Product rule

Every intelligence item should be traceable to:

- **what** was observed
- **where** it was observed
- **when** it was observed
- **how** it was sourced
- **how confident** the system is
- **whether** it has been reviewed

This provenance model is the foundation for scaling beyond a visual prototype.


## Stale response handling

Viewport requests carry client-side request identity so an older response cannot overwrite a newer map state.

## Viewport-first loading

The map requests intelligence for the active geographic viewport rather than attempting an unbounded India-wide observation payload.

- Summary groups describe returned approved observations; a group count is not a claim about total road coverage.
- Observation source identifies the submitted signal origin and should not be interpreted as independent verification.
- Confidence is a normalized score supplied by the observation pipeline; it is not a guarantee of correctness.
- observed_at describes observation time; submitted_at describes ingestion time.
- Approval controls public visibility; it does not manufacture missing metadata.
- Fallback routing is a degraded estimate and remains visually distinct from provider-backed routing.
- External geocoding, routing, imagery, and news providers are treated as replaceable upstream dependencies.
- The browser owns presentation and interaction state; privileged database access remains server-side.
- Short caches reduce repeated reads but never rewrite source timestamps.
- A provider failure should produce an unavailable state rather than fabricated replacement data.
- Observation reads return `observations-v6`.

- Observation summaries return `observation-summary-v1`.

- Route source distinguishes provider-backed and approximate output.

- News results retain upstream source attribution in the API contract.

- Satellite imagery is a visualization source and does not itself create verified observations.

- AI-generated route guidance is explanatory output, not a substitute for verified road records.

- Future ingestion workers should write normalized observations before public publication.

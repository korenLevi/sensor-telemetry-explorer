# Sensor Telemetry Explorer

Explore ~1M sensor readings from water facilities — a filterable, paginated
table plus per-asset min/avg/max charts.

**Stack:** Django + MySQL / React (Vite + MUI) / Docker Compose

## How to run

```bash
cp .env.example .env          # defaults work out of the box
docker compose up --build

# Load the data (one time, in a second terminal):
docker compose exec backend python scripts/clean_csv.py
docker compose exec backend python manage.py load_csv /data/telemetry_clean.csv
```
Place the provided CSV at `data/telemetry.csv` before loading.

Tests: `docker compose exec backend python manage.py test`

## Key decisions
\
**Keep it simple.** Plain Django MVT (no DRF) is enough for three read-only
JSON endpoints — I come from Laravel, so this is the way of organizing things
I'm comfortable and productive with.

**Data pipeline.** pandas is used for offline batch cleaning only — never in
the live request path:

```
telemetry.csv ──(clean_csv.py, pandas)──▶ telemetry_clean.csv ──(load_csv)──▶ MySQL
```

The cleaning step dedupes, coerces types, normalizes to UTC and flags
out-of-range values; the loader inserts in 10k batches with `bulk_create`.

**Performance.** Composite indexes on `(asset_id, -recorded_at)` and
`(metric, -recorded_at)` match the query patterns (filter + order by time).

**Frontend: smart/dumb components.** Pages are the smart components — they own
fetching and state and pass everything down as props. Components (`Table`,
`Filters`, `SummaryChart`) are dumb: props in, callbacks out. This keeps them
reusable and easy to modify — if a component owned its own fixed state,
customizing it for a new feature would be much harder.

**Shared filter state via Context.** Filters live in a `FiltersContext` shared
between the Readings and Summary pages, so a filter applied on one page
carries over to the other. That's a deliberate product choice (and shows real
Context usage). If the requirement were "each page starts clean", I'd give
each page local state and clear it on unmount instead.

## Edge cases

- Huge page numbers — clamped to the last page (tested); `page_size` capped at 200.
- Empty results — clear empty state in the UI.
- Dirty data (duplicate ids, blank values, bad timestamps) — handled at the
  ETL/load stage, not at query time.
- Faulted readings — kept and filterable by status.

## Stretch attempted

pandas ETL step (`backend/scripts/clean_csv.py`) — kept strictly offline/batch.

## With more time

- Keyset pagination — offset degrades on deep pages; a `(recorded_at, id)`
  cursor keeps every page fast.
- Frontend tests (Vitest + React Testing Library).
- Precomputed hourly rollups for the summary endpoint at larger scale.
```
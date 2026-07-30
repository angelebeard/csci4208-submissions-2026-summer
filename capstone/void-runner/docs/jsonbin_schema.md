# JSONBin Schema & Merge Policy

Void Runner uses two [JSONBin](https://jsonbin.io) bins. Both are provisioned by whoever deploys the app (see README → "Configuration") — no keys are committed to this repo.

## Bin 1 — Daily config (public GET, read-only in the app)

**Purpose:** a small, published JSON document the app polls once per session (cached 10 minutes) to vary today's difficulty. This is the "static JSON you host, updated routinely" GET the spec asks for.

```json
{
  "seedDate": "2026-07-27",
  "spawnRateMultiplier": 1.15,
  "speedMultiplier": 1.05,
  "theme": "signal"
}
```

- `spawnRateMultiplier` / `speedMultiplier`: fed straight into `GameState` and `Enemy` spawn timing.
- If this bin isn't configured (fresh clone), `publicApi.js` returns a hardcoded fallback so the app still boots and plays offline.

## Bin 2 — Leaderboard (cloud write: PUT/POST)

**Purpose:** shared, public, non-sensitive high-score board.

```json
{
  "entries": [
    { "id": "run_1932ab", "name": "NOVA", "score": 4210, "ts": 1753500000000 },
    { "id": "run_77cd10", "name": "KAI", "score": 3885, "ts": 1753499000000 }
  ]
}
```

- `id`: client-generated (`makeId('run')`) so a resubmission overwrites its own prior entry instead of duplicating.
- `name`: player-entered callsign, capped at 16 characters, stored locally as `profile.playerName` too.
- `score`: integer, floor of the run's final score.
- `ts`: `Date.now()` at submission.

### Example write flow

**Request (PUT `/b/{LEADERBOARD_BIN_ID}`):**
```json
{ "entries": [ { "id": "run_9f01", "name": "NOVA", "score": 4210, "ts": 1753500000000 }, "...top 20 total" ] }
```

**Result:** JSONBin echoes the stored record back; the app doesn't need it beyond a 200 status.

## Merge policy

Last-write-wins **on the whole bin**, computed client-side before the write:

1. `GET /b/{id}/latest` for the current entries.
2. Remove any existing entry with the same `id` (defensive de-dupe / resubmission).
3. Append the new entry, sort by `score` descending, keep the top **20**.
4. `PUT` the full array back.

**Known tradeoff:** two players submitting within the same round-trip window could race and one write could silently drop the other's *concurrent* new entry (classic read-modify-write race). At class-project traffic levels this is an acceptable, documented tradeoff rather than something worth a real backend/transaction for. A production version would move the merge server-side or use a bin-per-entry collection instead of a single array.

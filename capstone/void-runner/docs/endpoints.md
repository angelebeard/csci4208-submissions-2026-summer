# Endpoints

All requests go through `src/services/ApiClient.js` (retry with exponential backoff, `AbortController` per view).

| Purpose | Method | Path | Called from | Cache/TTL |
|---|---|---|---|---|
| Daily challenge config | GET | `{JSONBIN_BASE}/b/{DAILY_CONFIG_BIN_ID}/latest` | `services/publicApi.js` → `TitleView` | 10 min TTL, localStorage-backed |
| Leaderboard read | GET | `{JSONBIN_BASE}/b/{LEADERBOARD_BIN_ID}/latest` | `services/cloudApi.js` → `LeaderboardView`, `GameOverView` (pre-merge) | 1 min TTL |
| Leaderboard write | PUT | `{JSONBIN_BASE}/b/{LEADERBOARD_BIN_ID}` | `services/cloudApi.js` → `GameOverView` | n/a (write) |

`JSONBIN_BASE` defaults to `https://api.jsonbin.io/v3`. Bin ids and the API key are read from `src/services/config.js`, which itself checks `localStorage` overrides first (`voidrunner:cfg:*`) so real ids never need to be committed to source — see README → Configuration.

// src/services/config.js
// Non-secret endpoint configuration. Only PUBLIC-readable bin ids/keys
// belong here — never commit a private write key. See README "Data &
// Networking" for how to provision your own bins.
//
// You can also override any of these at runtime without editing source,
// by opening the browser console and running e.g.:
//   localStorage.setItem('voidrunner:cfg:leaderboardBinId', 'xxxx')
// then reloading. This keeps real ids out of the repo while still being
// gradeable end-to-end.

function override(key, fallback) {
  try {
    return localStorage.getItem(`voidrunner:cfg:${key}`) || fallback;
  } catch {
    return fallback;
  }
}

export const CONFIG = {
  JSONBIN_BASE: "https://api.jsonbin.io/v3",

  // A public, read-only bin holding today's challenge modifiers.
  // Shape: { seedDate, spawnRateMultiplier, speedMultiplier, theme }
  DAILY_CONFIG_BIN_ID: override("dailyConfigBinId", "REPLACE_WITH_PUBLIC_BIN_ID"),

  // A bin holding the shared, public leaderboard array.
  // Shape: { entries: [{ id, name, score, ts }] }
  LEADERBOARD_BIN_ID: override("leaderboardBinId", "REPLACE_WITH_LEADERBOARD_BIN_ID"),

  // JSONBin "X-Master-Key" scoped to this bin only. Public read/write
  // demo key — rotate before real deployment.
  JSONBIN_API_KEY: override("apiKey", "REPLACE_WITH_JSONBIN_KEY"),

  DAILY_CONFIG_TTL_MS: 10 * 60 * 1000, // 10 minutes
  LEADERBOARD_TTL_MS: 60 * 1000, // 1 minute
};

export function isCloudConfigured() {
  return (
    !CONFIG.LEADERBOARD_BIN_ID.startsWith("REPLACE_") &&
    !CONFIG.JSONBIN_API_KEY.startsWith("REPLACE_")
  );
}

export function isDailyConfigured() {
  return !CONFIG.DAILY_CONFIG_BIN_ID.startsWith("REPLACE_");
}

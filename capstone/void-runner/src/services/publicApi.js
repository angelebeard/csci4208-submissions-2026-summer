// src/services/publicApi.js
// The "public GET" half of the REST requirement. Fetches a small, published
// JSON document (a JSONBin bin, or any static JSON/CSV endpoint you host)
// describing today's challenge modifiers. Cached with a TTL because the
// data changes at most once a day, not once a frame.

import { ApiClient } from "./ApiClient.js";
import { CONFIG, isDailyConfigured } from "./config.js";
import { withTtlCache } from "../utils/timeUtils.js";

const client = new ApiClient(CONFIG.JSONBIN_BASE);

const FALLBACK_DAILY_CONFIG = {
  seedDate: new Date().toISOString().slice(0, 10),
  spawnRateMultiplier: 1,
  speedMultiplier: 1,
  theme: "signal",
};

/**
 * GET today's daily-challenge config.
 * @param {{signal?: AbortSignal, force?: boolean}} opts
 * @returns {Promise<{value: object, fromCache: boolean, source: "network"|"fallback"}>}
 */
export async function fetchDailyConfig(opts = {}) {
  if (!isDailyConfigured()) {
    // No bin configured yet (e.g. fresh clone before Sprint-1 setup) —
    // local-first fallback so the app still boots and plays offline.
    return { value: FALLBACK_DAILY_CONFIG, fromCache: false, source: "fallback" };
  }

  try {
    const { value, fromCache } = await withTtlCache(
      "voidrunner:cache:dailyConfig",
      CONFIG.DAILY_CONFIG_TTL_MS,
      async () => {
        const json = await client.get(`/b/${CONFIG.DAILY_CONFIG_BIN_ID}/latest`, {
          signal: opts.signal,
          retries: 2,
        });
        return json.record ?? json;
      },
      { force: opts.force }
    );
    return { value, fromCache, source: "network" };
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    return { value: FALLBACK_DAILY_CONFIG, fromCache: false, source: "fallback" };
  }
}

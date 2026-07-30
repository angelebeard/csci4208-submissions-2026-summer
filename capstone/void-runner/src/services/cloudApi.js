// src/services/cloudApi.js
// The "cloud write" half of the REST requirement. Reads + writes a small
// public leaderboard bin on JSONBin. See docs/jsonbin_schema.md for the
// full schema and merge policy this implements.

import { ApiClient } from "./ApiClient.js";
import { CONFIG, isCloudConfigured } from "./config.js";
import { withTtlCache } from "../utils/timeUtils.js";

const client = new ApiClient(CONFIG.JSONBIN_BASE, {
  "Content-Type": "application/json",
  "X-Master-Key": CONFIG.JSONBIN_API_KEY,
});

const MAX_ENTRIES = 20;

export async function fetchLeaderboard(opts = {}) {
  if (!isCloudConfigured()) {
    return { entries: [], source: "unconfigured" };
  }
  try {
    const { value } = await withTtlCache(
      "voidrunner:cache:leaderboard",
      CONFIG.LEADERBOARD_TTL_MS,
      async () => {
        const json = await client.get(`/b/${CONFIG.LEADERBOARD_BIN_ID}/latest`, {
          signal: opts.signal,
        });
        return json.record?.entries ?? [];
      },
      { force: opts.force }
    );
    return { entries: value, source: "network" };
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    return { entries: [], source: "error", error: err };
  }
}

/**
 * Submit a run to the shared leaderboard.
 * Merge policy: fetch current top entries, append the new one, de-dupe by
 * id, sort desc by score, keep the top MAX_ENTRIES, then PUT the whole
 * array back (last-write-wins on the bin as a whole — acceptable for a
 * low-traffic class project; see docs/jsonbin_schema.md for the tradeoff).
 */
export async function submitScore({ id, name, score, ts }, opts = {}) {
  if (!isCloudConfigured()) {
    return { ok: false, reason: "unconfigured" };
  }
  const current = await fetchLeaderboard({ force: true, signal: opts.signal });
  const withNew = [...current.entries.filter((e) => e.id !== id), { id, name, score, ts }]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  await client.put(
    `/b/${CONFIG.LEADERBOARD_BIN_ID}`,
    { entries: withNew },
    { signal: opts.signal }
  );
  return { ok: true, entries: withNew };
}

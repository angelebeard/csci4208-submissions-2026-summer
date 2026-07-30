// src/utils/timeUtils.js
// TTL cache + backoff helpers shared by publicApi.js and cloudApi.js.

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrap an async fetcher with a localStorage-backed TTL cache.
 * @param {string} cacheKey  storage key for the cached payload
 * @param {number} ttlMs     how long the cached value stays fresh
 * @param {() => Promise<any>} fetcher  performs the real network call
 * @param {{force?: boolean}} opts
 */
export async function withTtlCache(cacheKey, ttlMs, fetcher, opts = {}) {
  const now = Date.now();
  if (!opts.force) {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && now - cached.ts < ttlMs) {
          return { value: cached.value, fromCache: true };
        }
      }
    } catch {
      // corrupt cache entry — fall through and refetch
    }
  }

  const value = await fetcher();
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ ts: now, value }));
  } catch {
    // storage full/unavailable — non-fatal, we still return the fresh value
  }
  return { value, fromCache: false };
}

export async function withRetry(fn, { retries = 2, baseDelayMs = 400 } = {}) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt >= retries || err?.name === "AbortError") throw err;
      await sleep(baseDelayMs * 2 ** attempt);
      attempt += 1;
    }
  }
}

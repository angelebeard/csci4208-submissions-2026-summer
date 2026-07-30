// src/services/ApiClient.js
// Domain class (#2 of the required 3+): a small, reusable REST client.
// publicApi.js and cloudApi.js both build on top of this instead of
// calling fetch() directly, so retry/backoff/abort logic lives in one place.

import { withRetry } from "../utils/timeUtils.js";

export class ApiClient {
  constructor(baseUrl, defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  /**
   * @param {string} path
   * @param {{method?, headers?, body?, signal?, retries?}} opts
   */
  async request(path, opts = {}) {
    const { method = "GET", headers = {}, body, signal, retries = 2 } = opts;
    const url = `${this.baseUrl}${path}`;

    return withRetry(
      async () => {
        const res = await fetch(url, {
          method,
          headers: { ...this.defaultHeaders, ...headers },
          body: body ? JSON.stringify(body) : undefined,
          signal,
        });
        if (!res.ok) {
          const err = new Error(`Request failed: ${res.status} ${res.statusText}`);
          err.status = res.status;
          throw err;
        }
        const contentType = res.headers.get("content-type") || "";
        return contentType.includes("application/json") ? res.json() : res.text();
      },
      { retries, baseDelayMs: 350 }
    );
  }

  get(path, opts) {
    return this.request(path, { ...opts, method: "GET" });
  }
  put(path, body, opts) {
    return this.request(path, { ...opts, method: "PUT", body });
  }
  post(path, body, opts) {
    return this.request(path, { ...opts, method: "POST", body });
  }
}

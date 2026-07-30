// src/services/localStore.js
// The only module allowed to touch window.localStorage directly.
// Everything else in the app goes through here, which is what keeps the
// app "local-first": it can boot and render fully offline.

import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_PROFILE, DEFAULT_RUNS, SCHEMA_VERSION } from "../state/schema.js";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === SCHEMA_VERSION) return parsed;
    return fallback; // future migration point
  } catch {
    return fallback;
  }
}

export const localStore = {
  loadSettings() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.settings), { ...DEFAULT_SETTINGS });
  },
  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ ...settings, version: SCHEMA_VERSION }));
  },

  loadProfile() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.profile), { ...DEFAULT_PROFILE });
  },
  saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify({ ...profile, version: SCHEMA_VERSION }));
  },

  loadRuns() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.runs), { ...DEFAULT_RUNS, entries: [] });
  },
  addRun(entry) {
    const runs = this.loadRuns();
    runs.entries = [entry, ...runs.entries].slice(0, 50); // keep last 50 locally
    localStorage.setItem(STORAGE_KEYS.runs, JSON.stringify(runs));
    return runs;
  },

  loadHighScore() {
    const raw = localStorage.getItem(STORAGE_KEYS.highScore);
    return raw ? Number(raw) || 0 : 0;
  },
  saveHighScoreIfBetter(score) {
    const current = this.loadHighScore();
    if (score > current) {
      localStorage.setItem(STORAGE_KEYS.highScore, String(score));
      return score;
    }
    return current;
  },

  /** Bundles all personal, local-first state for backup/transfer. */
  exportAll() {
    return {
      exportedAt: new Date().toISOString(),
      settings: this.loadSettings(),
      profile: this.loadProfile(),
      runs: this.loadRuns(),
      highScore: this.loadHighScore(),
    };
  },

  importAll(bundle) {
    if (!bundle || typeof bundle !== "object") throw new Error("Invalid backup file");
    if (bundle.settings) this.saveSettings(bundle.settings);
    if (bundle.profile) this.saveProfile(bundle.profile);
    if (bundle.runs?.entries) localStorage.setItem(STORAGE_KEYS.runs, JSON.stringify(bundle.runs));
    if (typeof bundle.highScore === "number") localStorage.setItem(STORAGE_KEYS.highScore, String(bundle.highScore));
  },
};

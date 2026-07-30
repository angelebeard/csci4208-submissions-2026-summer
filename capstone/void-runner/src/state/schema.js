// src/state/schema.js
// Single source of truth for local-first storage keys + defaults.
// Bumping SCHEMA_VERSION lets services/localStore.js run a migration
// instead of silently misreading old shapes.

export const SCHEMA_VERSION = 1;

export const STORAGE_KEYS = {
  settings: `voidrunner:v${SCHEMA_VERSION}:settings`,
  profile: `voidrunner:v${SCHEMA_VERSION}:profile`,
  runs: `voidrunner:v${SCHEMA_VERSION}:runs`,
  highScore: `voidrunner:v${SCHEMA_VERSION}:highScore`,
};

export const DEFAULT_SETTINGS = {
  version: SCHEMA_VERSION,
  muteFx: false,
  reduceMotion: false,
  controlScheme: "keyboard", // "keyboard" | "touch"
};

export const DEFAULT_PROFILE = {
  version: SCHEMA_VERSION,
  playerName: "",
};

export const DEFAULT_RUNS = {
  version: SCHEMA_VERSION,
  entries: [], // { id, score, combo, ts }
};

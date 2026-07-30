// src/utils/idUtils.js
// Lightweight id helpers so we don't need a uuid dependency.

export function makeId(prefix = "id") {
  const rand = Math.random().toString(36).slice(2, 9);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}

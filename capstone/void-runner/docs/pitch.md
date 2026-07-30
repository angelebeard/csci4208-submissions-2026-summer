# Pitch

**Track:** Games / Entertainment

**Product (one line):** Void Runner — a browser-native asteroid dodger with a daily-seeded challenge and a shared global leaderboard.

**Problem & User:** Casual players who want a no-install arcade session that's fast to start, quick to replay, and has a reason to come back daily (the daily modifier feed) and compete with others (the shared leaderboard). Play sessions run 60–120 seconds; the loop is designed for "one more run."

**Core Loop (3–5 sentences):** The player steers a ship on an HTML Canvas field using keyboard or pointer, dodging drifting asteroids that spawn faster and move quicker the longer the run lasts. Surviving nudges the combo multiplier up; getting clipped resets the combo and costs a hull point, ending the run at zero. Power-ups (shield, time-slow) drift onto the field and can be grabbed mid-dodge for a temporary edge. On death, the run is saved locally first (instant, offline-safe), then optionally submitted to the shared leaderboard; the title screen also pulls a small daily-challenge JSON (spawn/speed modifiers) so every day plays slightly differently.

**Why this satisfies "application-class":** the game is not just a Canvas loop — it has multiple views (title, play, game-over, leaderboard) driven by a real view manager, a central store, a REST client class used for both a public GET (daily config) and a cloud write (JSONBin leaderboard), and local-first persistence with export/import.

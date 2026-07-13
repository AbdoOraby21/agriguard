// Thin wrapper around localStorage so the rest of the app never touches
// the browser API directly. If you later add a real backend (Firebase,
// your own API), swap the internals of get/set/remove here and nothing
// else in the app needs to change.

export const localDb = {
  get(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — fail silently, app still works this session */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

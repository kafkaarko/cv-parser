export const ENDPOINT =
  // runtime injected config (priority 1)
  (typeof window !== "undefined" && window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.API_URL) ||
  // vite build-time environment (priority 2)
  import.meta.env?.VITE_API_URL ||
  // safe fallback (priority terakhir)
  "http://localhost:8000/";
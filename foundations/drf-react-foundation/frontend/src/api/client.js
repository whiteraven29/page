/**
 * The only place that talks to the API.
 *
 * - Keeps the access token in memory (never in localStorage, so injected scripts can't read it).
 * - On a 401, asks /auth/refresh/ for a new access token once, then retries the request.
 * - Turns the backend's standard error shape into an ApiError.
 */
const BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

let accessToken = null;
let refreshing = null;
let onAuthLost = () => {};

export const setAccessToken = (token) => {
  accessToken = token;
};
export const setOnAuthLost = (fn) => {
  onAuthLost = fn;
};

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error?.message || `Request failed (${status})`);
    this.status = status;
    this.code = body?.error?.code;
    this.details = body?.error?.details;
  }
}

function send(path, { method = "GET", body, auth = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return fetch(BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  });
}

export function refreshAccess() {
  // If several requests hit 401 together, they share one refresh call.
  if (!refreshing) {
    refreshing = send("/auth/refresh/", { method: "POST", auth: false })
      .then(async (res) => {
        if (!res.ok) {
          accessToken = null;
          return null;
        }
        accessToken = (await res.json()).access;
        return accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export async function api(path, options = {}) {
  let res = await send(path, options);
  if (res.status === 401 && options.auth !== false) {
    if (await refreshAccess()) res = await send(path, options);
    else onAuthLost();
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

// Central API access. Every admin screen goes through here so that base-URL
// handling and server error messages behave the same everywhere.

const RAW_BASE = import.meta.env.VITE_API_URL ?? "";

// Trailing slashes turn `${BASE}/images/all` into `//images/all`.
export const API_BASE = String(RAW_BASE).trim().replace(/\/+$/, "");

if (!API_BASE && import.meta.env.DEV) {
  console.error(
    "[api] VITE_API_URL is not set. Copy .env.example to .env and restart the dev server."
  );
}

/** Absolute URL for an image path stored by the backend ("/uploads/x.jpg"). */
export const assetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

/** The persisted zustand store is the source of truth; the bare key is legacy. */
export function getToken() {
  try {
    const raw = localStorage.getItem("auth-storage");
    const fromStore = raw ? JSON.parse(raw)?.state?.token : null;
    return fromStore || localStorage.getItem("access_token") || null;
  } catch {
    return localStorage.getItem("access_token") || null;
  }
}

/**
 * The backend answers with { message } on failure and sometimes with
 * { success: false } and HTTP 200. Both are treated as errors, and the
 * server's own wording is preserved instead of a generic "Upload failed".
 */
async function request(path, { method = "GET", body, headers, signal, auth } = {}) {
  if (!API_BASE) {
    throw new Error("VITE_API_URL is not configured");
  }

  const isFormData = body instanceof FormData;

  const token = auth ? getToken() : null;
  if (auth && !token) {
    throw new Error("Please sign in to continue");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: {
      ...(isFormData || body === undefined
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // HTML error page (a 404 from the wrong base URL is the usual cause)
    if (!res.ok) {
      throw new Error(
        `${res.status} ${res.statusText} from ${path} - check VITE_API_URL`
      );
    }
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `${res.status} ${res.statusText}`
    );
  }

  if (data && data.success === false) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

/** Same verbs, but the request carries the bearer token and fails fast without one. */
export const authApi = {
  get: (path, opts) => request(path, { ...opts, method: "GET", auth: true }),
  post: (path, body, opts) =>
    request(path, { ...opts, method: "POST", body, auth: true }),
  put: (path, body, opts) =>
    request(path, { ...opts, method: "PUT", body, auth: true }),
  patch: (path, body, opts) =>
    request(path, { ...opts, method: "PATCH", body, auth: true }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE", auth: true }),
};

/**
 * Upload with progress. fetch() cannot report upload progress, so the file
 * endpoints use XHR while everything else uses fetch above.
 */
export function uploadWithProgress(path, formData, onProgress) {
  return new Promise((resolve, reject) => {
    if (!API_BASE) {
      reject(new Error("VITE_API_URL is not configured"));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}${path}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        reject(
          new Error(`${xhr.status} ${xhr.statusText} - check VITE_API_URL`)
        );
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(data?.message || data?.error || `Upload failed (${xhr.status})`));
        return;
      }

      if (data && data.success === false) {
        reject(new Error(data.message || "Upload failed"));
        return;
      }

      resolve(data);
    };

    xhr.onerror = () => reject(new Error("Network error - the server did not respond"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));

    xhr.send(formData);
  });
}

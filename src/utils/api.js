import { BASE_URL } from "./config";

export async function apiFetch(path, options = {}) {
  const { auth = false, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    credentials: auth ? "include" : rest.credentials || "same-origin",
  });

  let result = {};
  try {
    result = await res.json();
  } catch {
    result = {};
  }

  if (!res.ok) {
    const error = new Error(result.message || "Request failed");
    error.status = res.status;
    throw error;
  }

  return result;
}

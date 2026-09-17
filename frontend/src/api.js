const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5001/api";

const TOKEN_KEY = "gym_tracker_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

export function signup(email, password, profile) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, ...profile }),
  });
}

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function getCurrentUser() {
  return request("/auth/me");
}

export function updateProfile(payload) {
  return request("/auth/me", { method: "PATCH", body: JSON.stringify(payload) });
}

export function getMuscleStatus() {
  return request("/muscle-status");
}

export function getExercises() {
  return request("/exercises");
}

export function createExercise(payload) {
  return request("/exercises", { method: "POST", body: JSON.stringify(payload) });
}

export function getMuscleGroups() {
  return request("/muscle-groups");
}

export function logSession(payload) {
  return request("/sessions", { method: "POST", body: JSON.stringify(payload) });
}

export function getSessions() {
  return request("/sessions");
}

export function getStats() {
  return request("/stats");
}

export function getProgress() {
  return request("/progress");
}

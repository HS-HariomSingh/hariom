/**
 * API client for communicating with the FastAPI backend service
 * Routes through Vercel's top-level rewrite: /api/* -> backend
 */

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { healthy: false, status: res.status };
    return await res.json();
  } catch (err) {
    return { healthy: false, error: String(err) };
  }
}

export async function fetchBackendItems(params?: {
  type?: string;
  category?: string;
  status?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.type && params.type !== 'ALL') query.append('type', params.type);
  if (params?.category && params.category !== 'All') query.append('category', params.category);
  if (params?.status && params.status !== 'ALL') query.append('status', params.status);
  if (params?.search) query.append('search', params.search);

  const url = `${API_BASE}/items${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch items`);
  return await res.json();
}

export async function loginStudentAPI(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/student/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
    throw new Error(err.detail || 'Login failed');
  }
  return await res.json();
}

export async function loginAdminAPI(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Invalid admin credentials' }));
    throw new Error(err.detail || 'Login failed');
  }
  return await res.json();
}

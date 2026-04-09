/**
 * Shared API client for SmartEco Admin Panel
 * Automatically attaches JWT token and handles auth errors.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('smarteco_token');
}

function buildHeaders(extra?: Record<string, string>): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

function handleUnauthorized() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('smarteco_token');
        window.location.href = '/login';
    }
}

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: buildHeaders(),
    });
    if (res.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `GET ${path} failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });
    if (res.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `POST ${path} failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH',
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });
    if (res.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `PATCH ${path} failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });
    if (res.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `PUT ${path} failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export async function apiDelete<T = void>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'DELETE',
        headers: buildHeaders(),
    });
    if (res.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `DELETE ${path} failed: ${res.status}`);
    }
    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return undefined as T;
    }
    return res.json() as Promise<T>;
}

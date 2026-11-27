export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7177';
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hlhaproduction.runasp.net';

export function mediaSrc(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
  return url;
}

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...options.headers,
  };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('unauthorized'));
    return Promise.reject(new Error('Unauthorized'));
  }

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { title: response.statusText };
    }
    return Promise.reject(errorData);
  }

  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

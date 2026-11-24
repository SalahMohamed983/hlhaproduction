import { apiClient } from './client';

export function getClients(params = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.from) qs.set('from', params.from);
  if (params.to) qs.set('to', params.to);
  if (params.search) qs.set('search', params.search);
  if (params.searchBy) qs.set('searchBy', params.searchBy);
  const q = qs.toString();
  return apiClient(`/api/clients${q ? `?${q}` : ''}`);
}

export function getClient(id) {
  return apiClient(`/api/clients/${id}`);
}

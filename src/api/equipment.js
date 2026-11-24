import { apiClient } from './client';

export function getEquipmentCategories() {
  return apiClient('/api/equipment-categories');
}

export function createEquipmentCategory(body) {
  return apiClient('/api/equipment-categories', { method: 'POST', body: JSON.stringify(body) });
}

export function deleteEquipmentCategory(id) {
  return apiClient(`/api/equipment-categories/${id}`, { method: 'DELETE' });
}

export function getEquipment(categoryId = '') {
  return apiClient(`/api/equipment${categoryId ? `?categoryId=${categoryId}` : ''}`);
}

export function createEquipment(body) {
  return apiClient('/api/equipment', { method: 'POST', body: JSON.stringify(body) });
}

export function updateEquipment(id, body) {
  return apiClient(`/api/equipment/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function deleteEquipment(id) {
  return apiClient(`/api/equipment/${id}`, { method: 'DELETE' });
}

export function createEquipmentReservation(id, body) {
  return apiClient(`/api/equipment/${id}/reservations`, { method: 'POST', body: JSON.stringify(body) });
}

export function getEquipmentReservations(params = {}) {
  const qs = new URLSearchParams();
  if (params.from) qs.set('from', params.from);
  if (params.to) qs.set('to', params.to);
  if (params.page) qs.set('page', params.page);
  if (params.pageSize) qs.set('pageSize', params.pageSize);
  if (params.search) qs.set('search', params.search);
  const q = qs.toString();
  return apiClient(`/api/equipment/reservations${q ? `?${q}` : ''}`);
}

export function searchOrders(query) {
  return apiClient(`/api/orders?search=${encodeURIComponent(query)}&pageSize=10`);
}

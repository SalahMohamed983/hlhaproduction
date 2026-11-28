import { apiClient } from './client';

export async function getOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.serviceKind && params.serviceKind !== 'all') query.append('serviceKind', params.serviceKind);
  if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
  if (params.from) query.append('from', params.from);
  if (params.to) query.append('to', params.to);
  if (params.status === 'cancelled') query.append('includeCancelled', 'true');

  return apiClient(`/api/orders?${query.toString()}`);
}

export function getOrder(id) {
  return apiClient(`/api/orders/${id}`);
}

export async function createOrder(data) {
  return apiClient('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrder(id, data) {
  return apiClient(`/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(id, status) {
  return apiClient(`/api/orders/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export async function assignOrderEmployee(id, employeeId, assign) {
  return apiClient(`/api/orders/${id}/assignments`, {
    method: 'POST',
    body: JSON.stringify({ employeeId, assign }),
  });
}

export async function recordOrderPayment(id, data) {
  return apiClient(`/api/orders/${id}/payments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

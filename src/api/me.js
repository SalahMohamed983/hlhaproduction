import { apiClient } from './client';

/** GET /api/me/tasks?includeCompleted=false */
export function getMyTasks(includeCompleted = false) {
  return apiClient(`/api/me/tasks?includeCompleted=${includeCompleted}`);
}

/** GET /api/me/history */
export function getMyHistory() {
  return apiClient('/api/me/history');
}

/** POST /api/orders/{orderId}/status — EMPLOYEE: only in_production↔internal_qa */
export function updateMyOrderStatus(orderId, status) {
  return apiClient(`/api/orders/${orderId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

/** PATCH /api/orders/{orderId}/assignments/me — deliverableType, deliverableLink, employeeNotes */
export function updateMyAssignment(orderId, { deliverableType, deliverableLink, employeeNotes }) {
  return apiClient(`/api/orders/${orderId}/assignments/me`, {
    method: 'PATCH',
    body: JSON.stringify({ deliverableType, deliverableLink, employeeNotes }),
  });
}

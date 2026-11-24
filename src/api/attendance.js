import { apiClient } from './client';

export function getAttendance(date) {
  return apiClient(`/api/attendance?date=${date}`);
}

export function putAttendance(date, employeeId, body) {
  return apiClient(`/api/attendance/${date}/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function markAllPresent(date) {
  return apiClient(`/api/attendance/${date}/mark-all-present`, { method: 'POST' });
}

export function syncAttendanceMonth(date) {
  return apiClient(`/api/attendance/${date}/sync-month`, { method: 'POST' });
}

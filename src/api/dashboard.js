import { apiClient } from './client';

export function getOverview(yearMonth = '') {
  return apiClient(`/api/dashboard/overview${yearMonth ? `?yearMonth=${yearMonth}` : ''}`);
}

export function getAnalytics() {
  return apiClient('/api/dashboard/analytics');
}

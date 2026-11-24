import { apiClient } from './client';

export async function getServices() {
  return apiClient('/api/services');
}

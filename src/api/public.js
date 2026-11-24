import { apiClient } from './client';

export function getPublicWorks() { return apiClient('/api/public/portfolio'); }
export function getPublicBloggers() { return apiClient('/api/public/bloggers'); }
export function getPublicDigital() { return apiClient('/api/public/digital-products'); }
export function getPublicPhoto() { return apiClient('/api/public/photo-packages'); }
export function getPublicCatalog() { return apiClient('/api/public/catalog'); }
export function createPublicOrder(body) { return apiClient('/api/public/service-requests', { method: 'POST', body: JSON.stringify(body) }); }

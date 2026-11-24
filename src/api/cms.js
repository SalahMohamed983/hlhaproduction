import { apiClient } from './client';

export function getCmsWorks() { return apiClient('/api/cms/works'); }
export function addCmsWork(body) { return apiClient('/api/cms/works', { method: 'POST', body }); }
export function updateCmsWork(id, body) { return apiClient(`/api/cms/works/${id}`, { method: 'PUT', body }); }
export function deleteCmsWork(id) { return apiClient(`/api/cms/works/${id}`, { method: 'DELETE' }); }

export function getCmsBloggers() { return apiClient('/api/cms/bloggers'); }
export function addCmsBlogger(body) { return apiClient('/api/cms/bloggers', { method: 'POST', body }); }
export function updateCmsBlogger(id, body) { return apiClient(`/api/cms/bloggers/${id}`, { method: 'PUT', body }); }
export function deleteCmsBlogger(id) { return apiClient(`/api/cms/bloggers/${id}`, { method: 'DELETE' }); }

export function getCmsDigital() { return apiClient('/api/cms/digital-products'); }
export function addCmsDigital(body) { return apiClient('/api/cms/digital-products', { method: 'POST', body: JSON.stringify(body) }); }
export function updateCmsDigital(id, body) { return apiClient(`/api/cms/digital-products/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
export function deleteCmsDigital(id) { return apiClient(`/api/cms/digital-products/${id}`, { method: 'DELETE' }); }

export function getCmsPhoto() { return apiClient('/api/cms/photo-packages'); }
export function addCmsPhoto(body) { return apiClient('/api/cms/photo-packages', { method: 'POST', body }); }
export function updateCmsPhoto(id, body) { return apiClient(`/api/cms/photo-packages/${id}`, { method: 'PUT', body }); }
export function deleteCmsPhoto(id) { return apiClient(`/api/cms/photo-packages/${id}`, { method: 'DELETE' }); }

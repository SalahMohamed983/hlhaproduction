import { apiClient } from './client';

export function getInvoices() {
  return apiClient('/api/invoices');
}

export function getInvoice(id) {
  return apiClient(`/api/invoices/${id}`);
}

export function createInvoice(body) {
  return apiClient('/api/invoices', { method: 'POST', body: JSON.stringify(body) });
}

export function recordInvoicePayment(id, body) {
  return apiClient(`/api/invoices/${id}/payments`, { method: 'POST', body: JSON.stringify(body) });
}

export function getOverdueInvoices() {
  return apiClient('/api/invoices/overdue');
}

export function getInvoiceReminderText(id) {
  return apiClient(`/api/invoices/${id}/reminder-text`);
}

export function getOrderPayments() {
  return apiClient('/api/financials/order-payments');
}

export function getExpenses(params = {}) {
  const qs = new URLSearchParams();
  if (params.from) qs.set('from', params.from);
  if (params.to) qs.set('to', params.to);
  const q = qs.toString();
  return apiClient(`/api/expenses${q ? `?${q}` : ''}`);
}

export function createExpense(body) {
  return apiClient('/api/expenses', { method: 'POST', body: JSON.stringify(body) });
}

import { apiClient } from './client';

export function getSpecialties() {
  return apiClient('/api/specialties');
}

export function createSpecialty(nameAr) {
  return apiClient('/api/specialties', { method: 'POST', body: JSON.stringify({ nameAr }) });
}

export function updateSpecialty(id, nameAr) {
  return apiClient(`/api/specialties/${id}`, { method: 'PUT', body: JSON.stringify({ nameAr }) });
}

export function getEmployees(employmentStatus = 'all', search = '') {
  const q = new URLSearchParams();
  if (employmentStatus) q.set('employmentStatus', employmentStatus);
  if (search) q.set('search', search);
  const qs = q.toString();
  return apiClient(`/api/employees${qs ? `?${qs}` : ''}`);
}

export function createEmployee(body) {
  return apiClient('/api/employees', { method: 'POST', body: JSON.stringify(body) });
}

export function updateEmployee(id, body) {
  return apiClient(`/api/employees/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

export function getPayrollSettings(yearMonth) {
  return apiClient(`/api/payroll-settings/${yearMonth}`);
}

export function putPayrollSettings(yearMonth, workDays) {
  return apiClient(`/api/payroll-settings/${yearMonth}`, {
    method: 'PUT',
    body: JSON.stringify({ workDays }),
  });
}

export function getEmployeePayroll(id, yearMonth) {
  return apiClient(`/api/employees/${id}/payroll/${yearMonth}`);
}

export function putEmployeePayroll(id, yearMonth, body) {
  return apiClient(`/api/employees/${id}/payroll/${yearMonth}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function getPayrollReport(yearMonth) {
  return apiClient(`/api/payroll/${yearMonth}/report`);
}

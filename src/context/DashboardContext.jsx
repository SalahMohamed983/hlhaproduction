import { createContext, useContext, useMemo, useState } from 'react';
import {
  ORDERS, EXPENSES, SERVICES_CATALOG, USERS, DAILY_ATTENDANCE, CLIENTS,
  EQUIPMENT, EQUIPMENT_RESERVATIONS, INVOICES, CLIENT_PAYMENTS,
  SPECIALTIES, SERVICE_CATEGORIES, EQUIPMENT_CATEGORIES,
  PAYROLL_MONTH_SETTINGS, EMPLOYEE_PAYROLL_MONTHS,
} from '@/data/mockData';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [orders, setOrders] = useState(ORDERS);
  const [expenses, setExpenses] = useState(EXPENSES);
  const [services, setServices] = useState(SERVICES_CATALOG);
  const [team, setTeam] = useState(USERS.filter(u => u.role === 'EMPLOYEE'));
  const [attendance, setAttendance] = useState(DAILY_ATTENDANCE);
  const [clients, setClients] = useState(CLIENTS);
  const [equipment, setEquipment] = useState(EQUIPMENT);
  const [reservations, setReservations] = useState(EQUIPMENT_RESERVATIONS);
  const [invoices, setInvoices] = useState(INVOICES);
  const [payments, setPayments] = useState(CLIENT_PAYMENTS);
  const [payrollSettings, setPayrollSettings] = useState(PAYROLL_MONTH_SETTINGS);
  const [payrollMonths, setPayrollMonths] = useState(EMPLOYEE_PAYROLL_MONTHS);
  const [nextId, setNextId] = useState({ order: 10, user: 9, expense: 7, equipment: 11, reservation: 4, invoice: 5, payment: 5, client: 10 });

  const takeId = (key) => {
    const id = nextId[key];
    setNextId(prev => ({ ...prev, [key]: prev[key] + 1 }));
    return id;
  };

  const moveOrder = (orderId, newStatus) =>
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

  const updateOrder = (orderId, updates) =>
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));

  const addOrder = (payload) => {
    const id = payload.id ?? takeId('order');
    setOrders(prev => [{ ...payload, id, assignments: payload.assignments ?? [] }, ...prev]);
    return id;
  };

  const upsertClient = ({ contactName, phone, companyName, email }) => {
    const existing = clients.find(c => (phone && c.phone === phone) || c.contactName === contactName);
    if (existing) {
      const patch = {
        ...existing,
        contactName: contactName || existing.contactName,
        phone: phone || existing.phone,
        companyName: companyName || existing.companyName,
        email: email || existing.email,
        status: 'Active',
      };
      setClients(prev => prev.map(c => c.id === existing.id ? patch : c));
      return existing.id;
    }
    const id = takeId('client');
    setClients(prev => [...prev, { id, contactName, phone: phone || '', companyName: companyName || '', email: email || '', status: 'Active' }]);
    return id;
  };

  const assignStaff = (orderId, employeeId) =>
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const list = o.assignments || [];
      const already = list.some(a => a.employeeId === employeeId);
      return {
        ...o,
        assignments: already
          ? list.filter(a => a.employeeId !== employeeId)
          : [...list, { employeeId, assignedAt: new Date().toISOString(), deliverableType: null, deliverableLink: null, employeeNotes: '' }],
      };
    }));

  const patchAssignment = (orderId, employeeId, updates) =>
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        assignments: (o.assignments || []).map(a => a.employeeId === employeeId ? { ...a, ...updates } : a),
      };
    }));

  const updateTeamMember = (memberId, updates) =>
    setTeam(prev => prev.map(m => m.id === memberId ? { ...m, ...updates } : m));

  const addTeamMember = (newMember) => {
    const id = newMember.id ?? takeId('user');
    setTeam(prev => [...prev, { ...newMember, id, role: 'EMPLOYEE' }]);
  };

  const addExpense = (newExpense) => {
    const id = newExpense.id ?? takeId('expense');
    setExpenses(prev => [{ ...newExpense, id, title: newExpense.title || newExpense.name, expenseDate: newExpense.expenseDate || newExpense.date, isRecurring: newExpense.isRecurring ?? newExpense.recurring }, ...prev]);
  };

  const upsertAttendance = (date, employeeId, updates) =>
    setAttendance(prev => {
      const idx = prev.findIndex(r => r.date === date && r.employeeId === employeeId);
      if (idx === -1) return [...prev, { date, employeeId, status: 'present', checkInTime: '09:00', notes: '', ...updates }];
      return prev.map((r, i) => i === idx ? { ...r, ...updates } : r);
    });

  const markAllPresent = (date, employeeIds) =>
    setAttendance(prev => {
      const others = prev.filter(r => r.date !== date);
      const day = employeeIds.map(id => {
        const existing = prev.find(r => r.date === date && r.employeeId === id);
        return { date, employeeId: id, status: 'present', checkInTime: existing?.checkInTime || '09:00', notes: existing?.notes || '' };
      });
      return [...others, ...day];
    });

  const addEquipment = (item) => {
    const id = item.id ?? takeId('equipment');
    setEquipment(prev => [{ ...item, id }, ...prev]);
  };

  const updateEquipment = (id, updates) =>
    setEquipment(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));

  const addReservation = (row) => {
    const id = row.id ?? takeId('reservation');
    setReservations(prev => [...prev, { ...row, id }]);
    setEquipment(prev => prev.map(e => e.id === row.equipmentId ? { ...e, status: 'checked_out' } : e));
  };

  const addInvoice = (inv) => {
    const id = inv.id ?? takeId('invoice');
    setInvoices(prev => [{ ...inv, id }, ...prev]);
  };

  const addPayment = (pay) => {
    const id = pay.id ?? takeId('payment');
    setPayments(prev => [{ ...pay, id }, ...prev]);
  };

  const upsertPayrollMonth = (employeeId, yearMonth, patch) =>
    setPayrollMonths(prev => {
      const idx = prev.findIndex(r => r.employeeId === employeeId && r.yearMonth === yearMonth);
      const base = idx === -1
        ? { employeeId, yearMonth, attendanceDays: 0, absenceDays: 0, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 }
        : prev[idx];
      const next = { ...base, ...patch };
      if (idx === -1) return [...prev, next];
      return prev.map((r, i) => i === idx ? next : r);
    });

  const setWorkDays = (yearMonth, workDays) =>
    setPayrollSettings(prev => {
      const idx = prev.findIndex(s => s.yearMonth === yearMonth);
      if (idx === -1) return [...prev, { yearMonth, workDays }];
      return prev.map((s, i) => i === idx ? { ...s, workDays } : s);
    });

  const value = useMemo(() => ({
    orders, setOrders, moveOrder, updateOrder, addOrder, assignStaff, patchAssignment,
    expenses, addExpense,
    services, setServices,
    team, updateTeamMember, addTeamMember,
    attendance, upsertAttendance, markAllPresent,
    clients, setClients, upsertClient,
    equipment, addEquipment, updateEquipment,
    reservations, addReservation,
    invoices, addInvoice,
    payments, addPayment,
    specialties: SPECIALTIES,
    serviceCategories: SERVICE_CATEGORIES,
    equipmentCategories: EQUIPMENT_CATEGORIES,
    payrollSettings, setWorkDays,
    payrollMonths, upsertPayrollMonth,
  }), [orders, expenses, services, team, attendance, clients, equipment, reservations, invoices, payments, payrollSettings, payrollMonths, nextId]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => useContext(DashboardContext);

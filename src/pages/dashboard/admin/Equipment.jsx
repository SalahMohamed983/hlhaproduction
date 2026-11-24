import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, Plus, Wrench, Trash2, Tag, X, Search } from 'lucide-react';
import Modal from '@/components/dashboard/ui/Modal';
import {
  fetchEquipmentCategories, fetchEquipment,
  createEquipment, updateEquipment, deleteEquipment,
  createEquipmentCategory, deleteEquipmentCategory,
  createEquipmentReservation,
} from '@/store/slices/equipmentSlice';
import { fetchEmployees } from '@/store/slices/employeesSlice';
import * as equipmentApi from '@/api/equipment';

const STATUS = {
  operational: { label: 'جاهز',           cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  checked_out:  { label: 'مستعار',         cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  maintenance:  { label: 'صيانة',          cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  lost:         { label: 'تالف / مفقود',   cls: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
};

export default function Equipment() {
  const dispatch = useDispatch();
  const categories    = useSelector((s) => s.equipment.categories);
  const equipmentList = useSelector((s) => s.equipment.items);
  const employees     = useSelector((s) => s.employees.items);

  const [cat, setCat] = useState('all');

  // Modals
  const [addOpen,      setAddOpen]      = useState(false);
  const [assignOpen,   setAssignOpen]   = useState(null);  // item
  const [editOpen,     setEditOpen]     = useState(null);  // item
  const [catMgrOpen,   setCatMgrOpen]   = useState(false);
  const [deleteEqConf, setDeleteEqConf] = useState(null);  // item

  const [conflict,  setConflict]  = useState('');
  const [catError,  setCatError]  = useState('');
  const [newCatAr,  setNewCatAr]  = useState('');
  const [newCatEn,  setNewCatEn]  = useState('');

  // Add equipment form
  const [form, setForm] = useState({ name: '', equipmentCategoryId: '', serialNumber: '' });

  // Assign form + order search
  const [assign, setAssign] = useState({
    orderId: '', assignedEmployeeId: '',
    checkoutDate: '', returnDate: '',
  });
  const [orderQuery,       setOrderQuery]       = useState('');
  const [orderSuggestions, setOrderSuggestions] = useState([]);
  const [selectedOrder,    setSelectedOrder]    = useState(null);
  const orderSearchTimeout = useRef(null);

  // ──────────────────────────────────────────────────────────────
  // Data loading
  // ──────────────────────────────────────────────────────────────
  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchEquipmentCategories()).unwrap(),
        dispatch(fetchEquipment(cat === 'all' ? '' : cat)).unwrap(),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    dispatch(fetchEmployees({ employmentStatus: 'working' }));
  }, [cat, dispatch]);

  // ──────────────────────────────────────────────────────────────
  // Order search with debounce
  // ──────────────────────────────────────────────────────────────
  const handleOrderSearch = (val) => {
    setOrderQuery(val);
    setSelectedOrder(null);
    setAssign((a) => ({ ...a, orderId: '' }));
    clearTimeout(orderSearchTimeout.current);
    if (val.length < 2) { setOrderSuggestions([]); return; }
    orderSearchTimeout.current = setTimeout(async () => {
      try {
        const result = await equipmentApi.searchOrders(val);
        const list = Array.isArray(result) ? result : (result?.items ?? []);
        setOrderSuggestions(list.slice(0, 8));
      } catch { setOrderSuggestions([]); }
    }, 300);
  };

  const selectOrder = (order) => {
    setSelectedOrder(order);
    setOrderQuery(`${order.clientName ?? ''} — ${order.serviceNameAr ?? order.title ?? `#${order.id}`}`);
    setAssign((a) => ({ ...a, orderId: order.id }));
    setOrderSuggestions([]);
  };

  // ──────────────────────────────────────────────────────────────
  // Equipment CRUD
  // ──────────────────────────────────────────────────────────────
  async function saveNew() {
    if (!form.name.trim() || !form.equipmentCategoryId) return;
    try {
      await dispatch(createEquipment({
        name: form.name.trim(),
        equipmentCategoryId: +form.equipmentCategoryId,
        serialNumber: form.serialNumber.trim() || '—',
      })).unwrap();
      setForm({ name: '', equipmentCategoryId: categories[0]?.id || '', serialNumber: '' });
      setAddOpen(false);
      loadData();
    } catch (err) { console.error(err); }
  }

  async function confirmDeleteEquipment() {
    if (!deleteEqConf) return;
    try {
      await dispatch(deleteEquipment(deleteEqConf.id)).unwrap();
      setDeleteEqConf(null);
      loadData();
    } catch (err) { console.error(err); }
  }

  async function patchEquipment(id, updates) {
    try {
      await dispatch(updateEquipment({ id, body: updates })).unwrap();
      setEditOpen(null);
      loadData();
    } catch (err) { console.error(err); }
  }

  // ──────────────────────────────────────────────────────────────
  // Reservation
  // ──────────────────────────────────────────────────────────────
  function openAssign(item) {
    setConflict('');
    setOrderQuery('');
    setSelectedOrder(null);
    setOrderSuggestions([]);
    setAssign({
      orderId: '',
      assignedEmployeeId: employees[0]?.id || '',
      checkoutDate: new Date().toISOString().slice(0, 10),
      returnDate: '',
    });
    setAssignOpen(item);
  }

  async function saveAssign() {
    if (!assign.checkoutDate) return;
    if (assign.returnDate && assign.returnDate < assign.checkoutDate) {
      setConflict('تاريخ العودة يجب أن يكون بعد تاريخ الخروج');
      return;
    }
    try {
      await dispatch(createEquipmentReservation({
        id: assignOpen.id,
        body: {
          orderId: assign.orderId ? +assign.orderId : undefined,
          assignedEmployeeId: assign.assignedEmployeeId ? +assign.assignedEmployeeId : undefined,
          checkoutDate: assign.checkoutDate,
          returnDate: assign.returnDate || null,
        },
      })).unwrap();
      setAssignOpen(null);
      loadData();
    } catch (err) {
      if (err?.status === 409 || err?.statusCode === 409) {
        setConflict('يوجد تعارض في التواريخ — المعدة محجوزة في هذه الفترة.');
      } else {
        setConflict(err?.detail || err?.title || 'حدث خطأ أثناء الحجز.');
      }
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Category CRUD
  // ──────────────────────────────────────────────────────────────
  async function saveCategory() {
    if (!newCatAr.trim()) { setCatError('اسم التصنيف بالعربي مطلوب'); return; }
    try {
      await dispatch(createEquipmentCategory({ nameAr: newCatAr.trim(), nameEn: newCatEn.trim() || undefined })).unwrap();
      setNewCatAr(''); setNewCatEn(''); setCatError('');
      dispatch(fetchEquipmentCategories());
    } catch (err) {
      setCatError(err?.detail || err?.title || 'حدث خطأ');
    }
  }

  async function removeCategory(id) {
    if (!window.confirm('سيتم حذف التصنيف وجميع معداته وحجوزاتها. هل أنت متأكد؟')) return;
    try {
      await dispatch(deleteEquipmentCategory(id)).unwrap();
      if (cat === id) setCat('all');
      await dispatch(fetchEquipmentCategories());
      loadData();
    } catch (err) { alert(err?.detail || 'حدث خطأ'); }
  }

  // ──────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">تتبع المعدات</h1>
          <p className="mt-1 text-sm text-slate-500">المخزون، الحالة، والحجز الداخلي على الطلبات</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCatMgrOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600">
            <Tag size={16} /> إدارة التصنيفات
          </button>
          <button onClick={() => { setForm(f => ({ ...f, equipmentCategoryId: categories[0]?.id || '' })); setAddOpen(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700">
            <Plus size={16} /> إضافة معدة
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCat('all')}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${cat === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          الكل
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${cat === c.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
            {c.nameAr}
            {c.equipmentCount > 0 && (
              <span className="mr-1.5 opacity-70">({c.equipmentCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {equipmentList.map((item) => {
          const resv = item.currentReservation;
          return (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400">{item.category?.nameAr} · {item.serialNumber}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS[item.status]?.cls || 'bg-slate-100 text-slate-600'}`}>
                  {STATUS[item.status]?.label || item.status}
                </span>
              </div>
              {resv && (
                <p className="text-xs text-slate-500 bg-amber-50 dark:bg-amber-900/10 rounded-lg px-2.5 py-1.5 mb-3">
                  📦 مستعارة: {resv.checkoutDate} → {resv.returnDate || 'غير محدد'}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => openAssign(item)}
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">
                  حجز داخلي
                </button>
                <button onClick={() => setEditOpen(item)}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200">
                  تعديل
                </button>
                {item.status !== 'maintenance' && (
                  <button onClick={() => patchEquipment(item.id, { status: 'maintenance' })}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100">
                    <Wrench size={12} /> صيانة
                  </button>
                )}
                <button onClick={() => setDeleteEqConf(item)}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300">
                  <Trash2 size={12} /> حذف
                </button>
              </div>
            </div>
          );
        })}
        {equipmentList.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-slate-400">لا توجد معدات مسجلة.</p>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          Modals
      ═══════════════════════════════════════════════ */}

      {/* Add Equipment */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="إضافة معدة جديدة">
        <div className="space-y-3">
          <label className="block text-xs text-slate-500">اسم المعدة *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="مثال: Sony A7III"
            className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white" />

          <label className="block text-xs text-slate-500 mt-2">التصنيف *</label>
          <select value={form.equipmentCategoryId} onChange={(e) => setForm((f) => ({ ...f, equipmentCategoryId: e.target.value }))}
            className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white">
            <option value="">— اختر التصنيف —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
          </select>

          <label className="block text-xs text-slate-500 mt-2">الرقم التسلسلي</label>
          <input value={form.serialNumber} onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
            placeholder="اختياري"
            className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white" />

          <button onClick={saveNew} disabled={!form.name.trim() || !form.equipmentCategoryId}
            className="w-full mt-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-40">
            حفظ المعدة
          </button>
        </div>
      </Modal>

      {/* Delete Equipment Confirm */}
      <Modal open={Boolean(deleteEqConf)} onClose={() => setDeleteEqConf(null)} title="تأكيد الحذف">
        {deleteEqConf && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              هل تريد حذف <strong className="text-slate-800 dark:text-white">{deleteEqConf.name}</strong> وجميع حجوزاتها؟ لا يمكن التراجع.
            </p>
            <div className="flex gap-2">
              <button onClick={confirmDeleteEquipment}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700">
                نعم، احذف
              </button>
              <button onClick={() => setDeleteEqConf(null)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200">
                إلغاء
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign (Reservation) */}
      <Modal open={Boolean(assignOpen)} onClose={() => setAssignOpen(null)} title={`حجز داخلي — ${assignOpen?.name}`}>
        {assignOpen && (
          <div className="space-y-3">
            {conflict && (
              <p className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
                <AlertTriangle size={16} /> {conflict}
              </p>
            )}

            <label className="block text-xs text-slate-500">الموظف المسؤول</label>
            <select value={assign.assignedEmployeeId} onChange={(e) => setAssign((a) => ({ ...a, assignedEmployeeId: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white">
              <option value="">— موظف —</option>
              {employees.map((t) => <option key={t.id} value={t.id}>{t.nameAr}</option>)}
            </select>

            {/* Order search with suggestions */}
            <label className="block text-xs text-slate-500 mt-2">ربط بطلب (اكتب أول حرفين للبحث)</label>
            <div className="relative">
              <div className="relative">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={orderQuery}
                  onChange={(e) => handleOrderSearch(e.target.value)}
                  placeholder="ابحث عن طلب..."
                  className="w-full rounded-xl border px-3 py-2 pr-9 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
                {selectedOrder && (
                  <button onClick={() => { setSelectedOrder(null); setOrderQuery(''); setAssign((a) => ({ ...a, orderId: '' })); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                )}
              </div>
              {orderSuggestions.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800 max-h-48 overflow-y-auto">
                  {orderSuggestions.map((o) => (
                    <li key={o.id}>
                      <button onClick={() => selectOrder(o)}
                        className="w-full px-3 py-2.5 text-right text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <span className="font-medium text-slate-800 dark:text-white">{o.clientName}</span>
                        <span className="mx-1 text-slate-400">—</span>
                        <span className="text-slate-500">{o.serviceNameAr}</span>
                        <span className="mr-2 text-xs text-slate-400">#{o.id}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedOrder && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-3 py-1.5">
                ✓ تم ربط الطلب: #{selectedOrder.id} — {selectedOrder.clientName}
              </p>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label className="text-xs text-slate-500">
                تاريخ الخروج *
                <input type="date" value={assign.checkoutDate} onChange={(e) => setAssign((a) => ({ ...a, checkoutDate: e.target.value }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
              </label>
              <label className="text-xs text-slate-500">
                تاريخ العودة (متوقع)
                <input type="date" value={assign.returnDate} onChange={(e) => setAssign((a) => ({ ...a, returnDate: e.target.value }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
              </label>
            </div>

            <button onClick={saveAssign} disabled={!assign.checkoutDate}
              className="w-full mt-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-40">
              تأكيد الحجز
            </button>
          </div>
        )}
      </Modal>

      {/* Edit Equipment */}
      <Modal open={Boolean(editOpen)} onClose={() => setEditOpen(null)} title={`تعديل — ${editOpen?.name}`}>
        {editOpen && (
          <div className="space-y-3">
            <label className="block text-xs text-slate-500">الاسم</label>
            <input defaultValue={editOpen.name}
              onBlur={(e) => { if (e.target.value.trim()) patchEquipment(editOpen.id, { name: e.target.value.trim() }); }}
              className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white" />

            <label className="block text-xs text-slate-500 mt-2">التصنيف</label>
            <select defaultValue={editOpen.category?.id}
              onChange={(e) => patchEquipment(editOpen.id, { equipmentCategoryId: +e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
            </select>

            <label className="block text-xs text-slate-500 mt-2">الحالة</label>
            <select defaultValue={editOpen.status}
              onChange={(e) => patchEquipment(editOpen.id, { status: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white">
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>

            <button onClick={() => setEditOpen(null)}
              className="w-full mt-2 rounded-xl bg-slate-800 py-2.5 text-sm font-bold text-white hover:bg-slate-700">
              إغلاق
            </button>
          </div>
        )}
      </Modal>

      {/* Category Manager */}
      <Modal open={catMgrOpen} onClose={() => setCatMgrOpen(false)} title="إدارة تصنيفات المعدات">
        <div className="space-y-4">
          {/* Add new */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">إضافة تصنيف جديد</p>
            <input value={newCatAr} onChange={(e) => { setNewCatAr(e.target.value); setCatError(''); }}
              placeholder="الاسم بالعربي *"
              className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            <input value={newCatEn} onChange={(e) => setNewCatEn(e.target.value)}
              placeholder="الاسم بالإنجليزي (اختياري)"
              className="w-full rounded-xl border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            {catError && <p className="text-xs text-red-600">{catError}</p>}
            <button onClick={saveCategory} disabled={!newCatAr.trim()}
              className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-40">
              إضافة التصنيف
            </button>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">لا توجد تصنيفات</p>
            )}
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5">
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">{c.nameAr}</span>
                  {c.nameEn && <span className="mr-2 text-xs text-slate-400">{c.nameEn}</span>}
                  <span className="mr-2 text-xs text-indigo-500">{c.equipmentCount} معدة</span>
                </div>
                <button onClick={() => removeCategory(c.id)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

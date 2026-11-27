import { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutGrid, Table, Plus, X, Search, Calendar,
  Banknote, User, Flag, CheckCircle, UserPlus, UserMinus,
  FileText, Phone, Building2, Filter, ExternalLink, RefreshCw,
} from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import {
  KANBAN_COLUMNS, SERVICE_KIND_COLORS, SERVICE_KIND_LABELS,
} from '@/data/mockData';
import Badge from '@/components/dashboard/ui/Badge';
import Modal from '@/components/dashboard/ui/Modal';
import { fetchOrders, fetchOrder, createOrder, updateOrder, updateOrderStatus, assignOrderEmployee } from '@/store/slices/ordersSlice';
import { fetchServices } from '@/store/slices/servicesSlice';
import { fetchEmployees } from '@/store/slices/employeesSlice';
import { getClients, getClient } from '@/api/clients';
import { asList } from '@/store/helpers';

const fmt = n => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n || 0);
const priorityOptions = [
  { value: 'urgent', label: 'عاجل جداً' },
  { value: 'high', label: 'أولوية عالية' },
  { value: 'medium', label: 'أولوية عادية' },
  { value: 'low', label: 'منخفض' },
];
const CANCELLED_COLUMN = { id: 'cancelled', label: 'ملغى', color: '#EF4444' };
const ORDER_STATUSES = [...KANBAN_COLUMNS, CANCELLED_COLUMN];

function DualHScroll({ children }) {
  const topRef = useRef(null);
  const botRef = useRef(null);
  const [innerW, setInnerW] = useState(0);
  const syncing = useRef(false);

  useEffect(() => {
    const bot = botRef.current;
    if (!bot) return;
    const measure = () => setInnerW(bot.scrollWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(bot);
    if (bot.firstElementChild) ro.observe(bot.firstElementChild);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [children]);

  const copy = (from, to) => {
    if (!from || !to || syncing.current) return;
    syncing.current = true;
    to.scrollLeft = from.scrollLeft;
    requestAnimationFrame(() => { syncing.current = false; });
  };

  return (
    <div>
      <div ref={topRef} onScroll={() => copy(topRef.current, botRef.current)} className="orders-hscroll mb-2 hidden md:block" aria-hidden>
        <div style={{ width: Math.max(innerW, 1), height: 1 }} />
      </div>
      <div ref={botRef} onScroll={() => copy(botRef.current, topRef.current)} className="orders-hscroll pb-3">
        {children}
      </div>
    </div>
  );
}

function KindFields({ kind, form, set, site }) {
  if (kind === 'blogger_ad') {
    return (
      <div>
        <label className="text-xs text-slate-400 mb-1 block">البلوجر *</label>
        <select value={form.bloggerId || ''} onChange={e => set('bloggerId', e.target.value ? +e.target.value : '')} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm">
          <option value="">اختر بلوجر</option>
          {site.siteCreators.map(c => <option key={c.id} value={c.id}>{c.fullName || c.name}</option>)}
        </select>
      </div>
    );
  }
  if (kind === 'photo_session' || kind === 'product_shoot') {
    return (
      <div>
        <label className="text-xs text-slate-400 mb-1 block">باقة التصوير</label>
        <select value={form.photoPackageId || ''} onChange={e => set('photoPackageId', e.target.value ? +e.target.value : '')} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm">
          <option value="">بدون باقة</option>
          {site.photoPackages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
    );
  }
  if (kind === 'software') {
    return (
      <div>
        <label className="text-xs text-slate-400 mb-1 block">منتج رقمي</label>
        <select value={form.digitalProductId || ''} onChange={e => set('digitalProductId', e.target.value ? +e.target.value : '')} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm">
          <option value="">بدون</option>
          {site.digitalCatalog.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>
    );
  }
  if (kind === 'social_media') {
    return null; // تتحكم فيها حالة الاشتراك على مستوى الفورم
  }
  return null;
}

function OrderCard({ order, onClick }) {
  const color = SERVICE_KIND_COLORS[order.serviceKind] ?? '#94a3b8';
  return (
    <div onClick={onClick} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: color + '22', color }}>{order.serviceNameAr}</span>
        <Badge type={order.priority} />
      </div>
      <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{order.clientName}</h3>
      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{order.description || ''}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-amber-500">{Number(order.agreedPrice) > 0 ? fmt(order.agreedPrice) : fmt(order.remainingAmount)}</span>
        <span className="text-xs text-slate-400">↑ {order.dueDate?.split('T')[0]}</span>
      </div>
      {order.hasDeposit && (
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700">مدفوع جزئياً</span>
      )}
    </div>
  );
}

function OrderModal({ orderId, onClose, onRefresh, team }) {
  const site = useSiteContent();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({});
  const [modalRefresh, setModalRefresh] = useState(0);

  const reloadOrder = () => setModalRefresh(s => s + 1);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrder(orderId))
      .unwrap()
      .then(res => {
        setOrder(res);
        setDraft({
          priority: res.priority,
          dueDate: res.dueDate?.split('T')[0] || '',
          description: res.description ?? '',
          adminNotes: res.adminNotes ?? '',
          status: res.status,
          assigneeIds: res.assignments?.map(a => a.employeeId) || [],
          bloggerId: res.bloggerId || '',
          photoPackageId: res.photoPackageId || '',
          digitalProductId: res.digitalProductId || '',
          subscriptionStart: res.subscriptionStart?.split('T')[0] || '',
          subscriptionEnd: res.subscriptionEnd?.split('T')[0] || '',
        });
        setLoading(false);
      })
      .catch(console.error);
  }, [orderId, dispatch, modalRefresh]);

  const setField = (key, val) => setDraft(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    try {
      if (draft.status !== order.status) {
        await dispatch(updateOrderStatus({ id: order.id, status: draft.status })).unwrap();
      }
      const canEditPrice = order.status === 'new_lead' && Number(order.agreedPrice) > 0;
      await dispatch(updateOrder({
        id: order.id,
        data: {
          priority: draft.priority,
          dueDate: draft.dueDate,
          ...(canEditPrice ? { agreedPrice: +draft.agreedPrice || 0 } : {}),
          description: draft.description,
          adminNotes: draft.adminNotes,
          bloggerId: draft.bloggerId || null,
          photoPackageId: draft.photoPackageId || null,
          digitalProductId: draft.digitalProductId || null,
          subscriptionStart: draft.subscriptionStart || null,
          subscriptionEnd: draft.subscriptionEnd || null,
        },
      })).unwrap();

      const oldAssignees = order.assignments?.map(a => a.employeeId) || [];
      const added = draft.assigneeIds.filter(id => !oldAssignees.includes(id));
      const removed = oldAssignees.filter(id => !draft.assigneeIds.includes(id));
      
      for (const id of added) {
        await dispatch(assignOrderEmployee({ id: order.id, employeeId: id, assign: true })).unwrap();
      }
      for (const id of removed) {
        await dispatch(assignOrderEmployee({ id: order.id, employeeId: id, assign: false })).unwrap();
      }

      onRefresh();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error saving order');
    }
  };

  if (loading || !order) return null;

  return (
    <Modal open onClose={onClose} title={`تفاصيل الطلب #${order.id} — ${order.clientName}`} size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">العميل</p>
              <p className="font-semibold text-sm">{order.clientName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">الخدمة</p>
              <p className="font-semibold text-sm">{order.serviceNameAr} · {SERVICE_KIND_LABELS[order.serviceKind]}</p>
            </div>
          </div>
          {(order.clientPhone || order.companyName) && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {order.clientPhone && <p className="flex items-center gap-1"><Phone size={13} /> {order.clientPhone}</p>}
              {order.companyName && <p className="flex items-center gap-1"><Building2 size={13} /> {order.companyName}</p>}
            </div>
          )}
          {/* Order description (editable) */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><FileText size={12} /> وصف الطلب</p>
            <textarea
              value={draft.description}
              onChange={e => setField('description', e.target.value)}
              rows={3}
              placeholder="وصف تفصيلي للطلب..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-3 py-2 text-sm resize-none focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/60 rounded-xl p-4 space-y-2 border">
            <div className="flex items-center gap-2"><Banknote size={15} className="text-amber-500" /><h4 className="text-sm font-bold">معلومات الحساب</h4></div>
            {order.status === 'new_lead' && Number(order.agreedPrice) > 0 ? (
              <input type="number" value={draft.agreedPrice} onChange={e => setField('agreedPrice', e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-800" />
            ) : Number(order.agreedPrice) > 0 ? (
              <div className="text-sm">السعر المتفق: <b className="text-amber-500">{fmt(order.agreedPrice)}</b></div>
            ) : null}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>مدفوع الفاتورة: <b className="text-emerald-600">{fmt(order.paidAmount)}</b></div>
              <div>المتبقي: <b>{fmt(order.remainingAmount)}</b></div>
            </div>
          </div>
          <KindFields kind={order.serviceKind} form={draft} set={setField} site={site} />
          <div>
            <p className="text-xs font-semibold text-amber-600 mb-1 flex items-center gap-1"><FileText size={13} /> ملاحظات المدير</p>
            <textarea value={draft.adminNotes} onChange={e => setField('adminNotes', e.target.value)} rows={4} className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-900/10" />
          </div>
        </div>
        <div className="space-y-4">
          <select value={draft.status} onChange={e => setField('status', e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-700">
            {ORDER_STATUSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <div className="flex items-center gap-1.5 mb-1"><Flag size={13} /><span className="text-xs text-slate-400">الأولوية</span></div>
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map(opt => (
              <button key={opt.value} type="button" onClick={() => setField('priority', opt.value)} className={`py-2 rounded-xl text-xs font-bold border ${draft.priority === opt.value ? 'border-amber-400 bg-amber-400/10' : 'border-slate-200'}`}>{opt.label}</button>
            ))}
          </div>
          <input type="date" value={draft.dueDate} onChange={e => setField('dueDate', e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm dark:bg-slate-700" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 flex items-center gap-1"><User size={13} /> إسناد (مهمة لكل موظف)</p>
              <button
                type="button"
                onClick={reloadOrder}
                title="تحديث بيانات الموظفين"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-500 transition-colors"
              >
                <RefreshCw size={12} /> تحديث
              </button>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {team.map(staff => {
                const assigned = draft.assigneeIds.includes(staff.id);
                // Find assignment details for this employee
                const assignmentInfo = order.assignments?.find(a => a.employeeId === staff.id);
                return (
                  <div key={staff.id} className={`rounded-xl border ${assigned ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold">{staff.nameAr}</p>
                        <p className="text-xs text-slate-400">{staff.specialtyNameAr}</p>
                      </div>
                      <button type="button" onClick={() => setField('assigneeIds', assigned ? draft.assigneeIds.filter(id => id !== staff.id) : [...draft.assigneeIds, staff.id])} className={`text-xs font-bold px-2 py-1 rounded-lg ${assigned ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                        {assigned ? <><UserMinus size={12} /> إلغاء</> : <><UserPlus size={12} /> إسناد</>}
                      </button>
                    </div>
                    {/* Show employee delivery info if assigned */}
                    {assignmentInfo && (assignmentInfo.employeeNotes || assignmentInfo.deliverableLink) && (
                      <div className="border-t border-slate-200 dark:border-slate-700 px-3 pb-2 pt-1.5 space-y-1">
                        {assignmentInfo.employeeNotes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">ملاحظات التنفيذ: </span>
                            {assignmentInfo.employeeNotes}
                          </p>
                        )}
                        {assignmentInfo.deliverableLink && (
                          <a href={assignmentInfo.deliverableLink} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1">
                            <ExternalLink size={11} /> رابط التسليم
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-sm">إلغاء</button>
        <button type="button" onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-amber-400 text-slate-900 rounded-xl text-sm font-bold"><CheckCircle size={15} /> حفظ</button>
      </div>
    </Modal>
  );
}

function ClientSuggestInput({ label, required, value, onChange, searchBy, skipUntilRef, onPick, error, inputCls, dir }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Date.now() < (skipUntilRef.current || 0)) {
      setItems([]);
      setOpen(false);
      return;
    }
    const q = value.trim();
    if (q.length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await getClients({ search: q, searchBy });
        const list = asList(res);
        setItems(list);
        setOpen(list.length > 0);
      } catch {
        setItems([]);
        setOpen(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [value, searchBy, skipUntilRef]);

  return (
    <div className="relative">
      <label className="text-xs text-slate-400 mb-1 block">{label}{required ? ' *' : ''}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => items.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={inputCls(error)}
        dir={dir}
        autoComplete="off"
      />
      {open && items.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
          {items.map(c => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); onPick(c); setItems([]); setOpen(false); }}
                className="w-full px-3 py-2 text-right text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="block font-semibold text-slate-800 dark:text-white">
                  {searchBy === 'company' ? (c.company || c.nameAr) : c.nameAr}
                </span>
                <span className="block text-xs text-slate-400">
                  {[searchBy === 'company' ? c.nameAr : c.company, c.phone].filter(Boolean).join(' · ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NewOrderModal({ onClose, onRefresh, team, services }) {
  const dispatch = useDispatch();
  const site = useSiteContent();
  const enabled = services.filter(s => s.isEnabled);
  const skipUntilRef = useRef(0);
  // null = لم يُحدَّد بعد، false = جديد، true = موجود مسبقاً
  const [isExistingClient, setIsExistingClient] = useState(null);
  // حالة الاشتراك: null | 'new' | 'active' | 'expired'
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [form, setForm] = useState({
    contactName: '', phone: '', companyName: '', email: '',
    serviceId: enabled[0]?.id || '', agreedPrice: '', initialPayment: '', dueDate: '', priority: 'medium',
    assigneeIds: [], description: '', adminNotes: '',
    bloggerId: '', photoPackageId: '', digitalProductId: '',
    subscriptionStart: '', subscriptionEnd: '',
  });
  const [errors, setErrors] = useState({});
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const pickClient = async (c) => {
    skipUntilRef.current = Date.now() + 400;
    setIsExistingClient(true);
    setForm(prev => ({
      ...prev,
      contactName: c.nameAr || '',
      companyName: c.company || '',
      phone: c.phone || '',
      email: c.email || '',
      agreedPrice: '',
      initialPayment: '',
    }));
    // جلب حالة الاشتراك من بيانات العميل الموجودة
    try {
      const details = await getClient(c.id);
      const subStatus = details?.subscriptionStatus || 'new';
      setSubscriptionStatus(subStatus);
    } catch {
      setSubscriptionStatus('new');
    }
  };
  // عند الكتابة اليدوية في حقل الاسم أو الهاتف → إعادة الوضع لـ "غير محدد"
  const handleNameChange = (v) => {
    setIsExistingClient(null);
    setSubscriptionStatus(null);
    set('contactName', v);
  };
  const handlePhoneChange = (v) => {
    setIsExistingClient(null);
    setSubscriptionStatus(null);
    set('phone', v);
  };

  const svc = enabled.find(s => s.id === +form.serviceId);

  const handleSubmit = async () => {
    const e = {};
    if (!form.contactName.trim()) e.contactName = 'مطلوب';
    if (!form.serviceId) e.serviceId = 'مطلوب';
    // السعر مطلوب فقط للعميل الجديد
    if (!isExistingClient) {
      if (!form.agreedPrice || isNaN(+form.agreedPrice)) e.agreedPrice = 'أدخل رقماً';
    }
    if (!form.dueDate) e.dueDate = 'مطلوب';
    if (svc?.kind === 'blogger_ad' && !form.bloggerId) e.bloggerId = 'مطلوب';
    if (svc?.kind === 'blogger_ad' && !form.bloggerId) e.bloggerId = 'مطلوب';
    // حقلا الاشتراك مطلوبان عند: عميل جديد، أو اشتراك منتهي
    const needsSubscription = isExistingClient !== true || subscriptionStatus === 'expired';
    if (needsSubscription && !form.subscriptionStart) e.subscriptionStart = 'تاريخ بداية الاشتراك مطلوب';
    setErrors(e);
    if (Object.keys(e).length) return;
    
    try {
      await dispatch(createOrder({
        contactName: form.contactName.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim(),
        email: form.email.trim(),
        serviceId: +form.serviceId,
        description: form.description.trim(),
        bloggerId: form.bloggerId ? +form.bloggerId : null,
        photoPackageId: form.photoPackageId ? +form.photoPackageId : null,
        digitalProductId: form.digitalProductId ? +form.digitalProductId : null,
        // إرسال null للعميل الموجود، رقم للعميل الجديد
        agreedPrice: isExistingClient ? null : (+form.agreedPrice || 0),
        initialPayment: !isExistingClient && form.initialPayment ? +form.initialPayment : null,
        subscriptionStart: form.subscriptionStart || null,
        subscriptionEnd: form.subscriptionEnd || null,
        priority: form.priority,
        dueDate: form.dueDate,
        adminNotes: form.adminNotes.trim(),
        assigneeIds: form.assigneeIds,
      })).unwrap();
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating order');
    }
  };

  const inputCls = (err) => `w-full bg-slate-100 dark:bg-slate-700 border ${err ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'} rounded-xl px-3 py-2.5 text-sm`;

  // هل يظهر قسم السعر؟ — نعم للعميل الجديد، لا للعميل الموجود
  const showPriceSection = isExistingClient !== true;
  // هل تظهر حقول الاشتراك؟ — عميل جديد أو اشتراك منتهٍ
  const needsSubscription = isExistingClient !== true || subscriptionStatus === 'expired';
  // رسالة توضيحية
  const clientHint = isExistingClient === true && subscriptionStatus === 'active'
    ? '✅ عميل مسجَّل — اشتراكه نشط، سيُضاف الطلب لحسابه الحالي'
    : isExistingClient === true && (subscriptionStatus === null || subscriptionStatus === 'new')
    ? '✅ عميل مسجَّل — سيُضاف الطلب لحسابه الحالي بدون سعر جديد'
    : null;

  return (
    <Modal open onClose={onClose} title="إضافة طلب خدمة" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClientSuggestInput
          label="اسم العميل"
          required
          value={form.contactName}
          onChange={handleNameChange}
          searchBy="contactName"
          skipUntilRef={skipUntilRef}
          onPick={pickClient}
          error={errors.contactName}
          inputCls={inputCls}
        />
        <div>
          <label className="text-xs text-slate-400 mb-1 block">الهاتف</label>
          <input value={form.phone} onChange={e => handlePhoneChange(e.target.value)} className={inputCls()} dir="ltr" />
        </div>
        <ClientSuggestInput
          label="الشركة"
          value={form.companyName}
          onChange={v => set('companyName', v)}
          searchBy="company"
          skipUntilRef={skipUntilRef}
          onPick={pickClient}
          inputCls={inputCls}
        />
        <div>
          <label className="text-xs text-slate-400 mb-1 block">البريد</label>
          <input value={form.email} onChange={e => set('email', e.target.value)} className={inputCls()} dir="ltr" />
        </div>

        {/* رسالة حالة العميل */}
        {clientHint && (
          <div className="md:col-span-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2">
            {clientHint}
          </div>
        )}

        <div>
          <label className="text-xs text-slate-400 mb-1 block">الخدمة *</label>
          <select value={form.serviceId} onChange={e => set('serviceId', +e.target.value)} className={inputCls(errors.serviceId)}>
            {enabled.map(s => <option key={s.id} value={s.id}>{s.nameAr} ({SERVICE_KIND_LABELS[s.kind]})</option>)}
          </select>
        </div>

        {/* قسم السعر — يظهر للعميل الجديد فقط */}
        {showPriceSection && (
          <>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">السعر المتفق *</label>
              <input type="number" value={form.agreedPrice} onChange={e => set('agreedPrice', e.target.value)} className={inputCls(errors.agreedPrice)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">المدفوع مقدماً</label>
              <input type="number" value={form.initialPayment} onChange={e => set('initialPayment', e.target.value)} className={inputCls()} />
            </div>
            {form.agreedPrice !== '' && (
              <div className="md:col-span-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/40 rounded-xl px-3 py-2">
                المديونية: <b className="text-red-500">{fmt(Math.max(0, (+form.agreedPrice || 0) - (+form.initialPayment || 0)))}</b>
              </div>
            )}
          </>
        )}

        <KindFields kind={svc?.kind} form={form} set={set} site={site} />
        {errors.bloggerId && <p className="text-xs text-red-400">{errors.bloggerId}</p>}

        {/* تنبيه تجديد الاشتراك */}
        {subscriptionStatus === 'expired' && (
          <div className="md:col-span-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
            ⚠️ اشتراك العميل منتهٍ — أدخل تواريخ التجديد وسيتم تحديث الاشتراك تلقائياً عند إضافة الطلب
          </div>
        )}

        {/* حقلا الاشتراك — تظهر للعميل الجديد أو عند انتهاء الاشتراك */}
        {needsSubscription && (
          <>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">بداية الاشتراك *</label>
              <input type="date" value={form.subscriptionStart} onChange={e => set('subscriptionStart', e.target.value)} className={inputCls(errors.subscriptionStart)} />
              {errors.subscriptionStart && <p className="text-xs text-red-400 mt-1">{errors.subscriptionStart}</p>}
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">نهاية الاشتراك</label>
              <input type="date" value={form.subscriptionEnd} onChange={e => set('subscriptionEnd', e.target.value)} className={inputCls()} />
            </div>
          </>
        )}

        <div>
          <label className="text-xs text-slate-400 mb-1 block">الموعد النهائي *</label>
          <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className={inputCls(errors.dueDate)} />
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-slate-400 mb-2">إسناد موظفين</p>
          <div className="flex flex-wrap gap-2">
            {team.map(emp => {
              const sel = form.assigneeIds.includes(emp.id);
              return (
                <button key={emp.id} type="button" onClick={() => set('assigneeIds', sel ? form.assigneeIds.filter(id => id !== emp.id) : [...form.assigneeIds, emp.id])} className={`px-3 py-2 rounded-xl border text-xs ${sel ? 'border-amber-400 bg-amber-50' : 'border-slate-200'}`}>
                  {emp.nameAr}
                </button>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-2">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="وصف الطلب" className={inputCls() + ' resize-none'} />
        </div>
        <div className="md:col-span-2">
          <textarea value={form.adminNotes} onChange={e => set('adminNotes', e.target.value)} rows={2} placeholder="ملاحظات المدير" className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onClose} className="px-5 py-2">إلغاء</button>
        <button type="button" onClick={handleSubmit} className="px-6 py-2 bg-amber-400 rounded-xl font-bold text-sm">إضافة الطلب</button>
      </div>
    </Modal>
  );
}

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.orders.items);
  const services = useSelector((s) => s.services.items);
  const team = useSelector((s) => s.employees.items.filter((e) => e.employmentStatus !== 'dismissed'));

  const [view, setView] = useState('kanban');
  const [selectedId, setSelectedId] = useState(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [refreshStamp, setRefreshStamp] = useState(0);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOrders({
      search,
      from: dateFrom,
      to: dateTo,
      status: statusFilter,
      serviceKind: kindFilter,
      priority: priorityFilter
    }));
  }, [dispatch, search, dateFrom, dateTo, statusFilter, kindFilter, priorityFilter, refreshStamp]);

  const refreshOrders = () => setRefreshStamp(prev => prev + 1);

  const visibleColumns = useMemo(() => {
    if (statusFilter === 'cancelled') return [CANCELLED_COLUMN];
    if (statusFilter === 'all') return KANBAN_COLUMNS;
    return KANBAN_COLUMNS.filter(c => c.id === statusFilter);
  }, [statusFilter]);

  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
  const hasFilters = search || dateFrom || dateTo || statusFilter !== 'all' || kindFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة الطلبات</h1>
          <p className="text-slate-500 text-sm mt-1">{orders.length} طلب خدمة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
            <button type="button" onClick={() => setView('kanban')} className={`p-2 rounded-lg ${view === 'kanban' ? 'bg-white shadow-sm text-amber-500' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
            <button type="button" onClick={() => setView('table')} className={`p-2 rounded-lg ${view === 'table' ? 'bg-white shadow-sm text-amber-500' : 'text-slate-400'}`}><Table size={18} /></button>
          </div>
          <button type="button" onClick={() => setShowNewOrder(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-xl text-sm font-bold"><Plus size={16} /> إضافة طلب</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1"><Search size={11} /> بحث</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="عميل، هاتف، رقم طلب، خدمة..." className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-sm" />
          </div>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-700" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-700" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-700">
            <option value="all">كل الحالات</option>
            {KANBAN_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            <option value="cancelled">ملغى</option>
          </select>
          <select value={kindFilter} onChange={e => setKindFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-700">
            <option value="all">كل الأنواع</option>
            {Object.entries(SERVICE_KIND_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-700">
            <option value="all">كل الأولويات</option>
            {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {hasFilters && <button type="button" onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); setStatusFilter('all'); setKindFilter('all'); setPriorityFilter('all'); }} className="text-xs text-red-500 font-semibold"><X size={13} /> مسح</button>}
        </div>
      </div>

      {view === 'kanban' ? (
        <DualHScroll>
          <div className="flex gap-4 min-w-max">
            {visibleColumns.map(col => {
              const colOrders = orders.filter(o => o.status === col.id);
              return (
                <div key={col.id} className="flex-shrink-0 w-72">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: col.color }} />
                    <h3 className="font-semibold text-sm">{col.label}</h3>
                    <span className="text-xs text-slate-400">{colOrders.length}</span>
                  </div>
                  <div className="space-y-3">
                    {colOrders.map(o => <OrderCard key={o.id} order={o} onClick={() => setSelectedId(o.id)} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </DualHScroll>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border overflow-hidden">
          <DualHScroll>
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                  {['#', 'العميل', 'الخدمة', 'النوع', 'السعر', 'المدفوع', 'الأولوية', 'الحالة', 'الاستحقاق', ''].map(h => (
                    <th key={h} className="text-right px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(o => {
                  const col = ORDER_STATUSES.find(c => c.id === o.status);
                  return (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-3 font-medium">{o.clientName}</td>
                      <td className="px-4 py-3">{o.serviceNameAr}</td>
                      <td className="px-4 py-3 text-xs">{SERVICE_KIND_LABELS[o.serviceKind]}</td>
                      <td className="px-4 py-3 font-bold text-amber-500">{fmt(o.agreedPrice)}</td>
                      <td className="px-4 py-3 text-emerald-600">{fmt(o.paidAmount)}</td>
                      <td className="px-4 py-3"><Badge type={o.priority} /></td>
                      <td className="px-4 py-3"><span className="text-xs font-bold" style={{ color: col?.color }}>{col?.label}</span></td>
                      <td className="px-4 py-3">{o.dueDate?.split('T')[0]}</td>
                      <td className="px-4 py-3"><button type="button" onClick={() => setSelectedId(o.id)} className="text-xs text-amber-500 font-semibold">تفاصيل</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DualHScroll>
        </div>
      )}

      {selectedId && <OrderModal orderId={selectedId} team={team} onRefresh={refreshOrders} onClose={() => setSelectedId(null)} />}
      {showNewOrder && <NewOrderModal team={team} services={services} onRefresh={refreshOrders} onClose={() => setShowNewOrder(false)} />}
    </div>
  );
}

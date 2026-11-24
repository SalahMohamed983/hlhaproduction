import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, Clapperboard, Users, Code2, Camera } from 'lucide-react';
import Modal from '@/components/dashboard/ui/Modal';
import { mediaSrc } from '@/api/client';
import {
  fetchCmsWorks, addCmsWork, updateCmsWork, deleteCmsWork,
  fetchCmsBloggers, addCmsBlogger, updateCmsBlogger, deleteCmsBlogger,
  fetchCmsDigital, addCmsDigital, updateCmsDigital, deleteCmsDigital,
  fetchCmsPhoto, addCmsPhoto, updateCmsPhoto, deleteCmsPhoto
} from '@/store/slices/cmsSlice';

const fmt = n => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(n || 0);

const TABS = [
  { id: 'works', label: 'الأعمال', icon: Clapperboard },
  { id: 'bloggers', label: 'البلوجرز', icon: Users },
  { id: 'digital', label: 'البرمجة', icon: Code2 },
  { id: 'photo', label: 'جلسة تصوير', icon: Camera },
];

const ICONS = [
  { id: 'app', label: 'تطبيق' },
  { id: 'website', label: 'موقع' },
  { id: 'menu', label: 'منيو' },
];

const empty = {
  works: { title: '', details: '', videoUrl: '', imageUrl: '' },
  bloggers: { fullName: '', niche: '', label: '', description: '', imageUrl: '', sampleVideoUrl: '', videoPrice: '' },
  digital: { title: '', hint: '', price: '', iconKey: 'website' },
  photo: { name: '', details: '', price: '', imageUrl: '' },
};

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-slate-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white';

function parsePrice(v) {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function FileField({ label, accept, file, onFile, currentUrl, kind }) {
  const [blobUrl, setBlobUrl] = useState('');
  useEffect(() => {
    if (!file) { setBlobUrl(''); return undefined; }
    const u = URL.createObjectURL(file);
    setBlobUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  const preview = blobUrl || mediaSrc(currentUrl);
  return (
    <Field label={label}>
      <input type="file" accept={accept} onChange={e => onFile(e.target.files?.[0] || null)} className={inputCls} />
      {file && <p className="mt-1 text-xs text-slate-400">{file.name}</p>}
      {!file && currentUrl && kind !== 'image' && <p className="mt-1 text-xs text-slate-400">ملف محفوظ</p>}
      {kind === 'image' && preview && <img src={preview} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
      {kind === 'video' && preview && <video src={preview} className="mt-2 h-20 rounded-lg" muted />}
    </Field>
  );
}

export default function SiteContent() {
  const dispatch = useDispatch();
  const { works, bloggers, digital, photo } = useSelector((s) => s.cms);
  const [tab, setTab] = useState('works');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty.works);
  const [files, setFiles] = useState({});

  const loadData = async () => {
    try {
      if (tab === 'works') await dispatch(fetchCmsWorks()).unwrap();
      else if (tab === 'bloggers') await dispatch(fetchCmsBloggers()).unwrap();
      else if (tab === 'digital') await dispatch(fetchCmsDigital()).unwrap();
      else if (tab === 'photo') await dispatch(fetchCmsPhoto()).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab]);

  const openNew = () => {
    setForm(empty[tab]);
    setFiles({});
    setEditing('new');
  };
  
  const openEdit = (item) => {
    const next = { ...empty[tab], ...item };
    if ('videoPrice' in next) next.videoPrice = item.videoPrice ? String(item.videoPrice) : '';
    if ('price' in next) next.price = item.price ? String(item.price) : '';
    setForm(next);
    setFiles({});
    setEditing(item);
  };

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    try {
      if (tab === 'works') {
        const fd = new FormData();
        fd.append('title', form.title.trim() || 'عمل جديد');
        fd.append('details', form.details || '');
        fd.append('cssClass', form.cssClass || 'video-1');
        fd.append('sortOrder', String(form.sortOrder || 0));
        if (files.video) fd.append('video', files.video);
        if (files.image) fd.append('image', files.image);
        if (editing === 'new') await dispatch(addCmsWork(fd)).unwrap();
        else await dispatch(updateCmsWork({ id: editing.id, body: fd })).unwrap();
      } else if (tab === 'bloggers') {
        const fd = new FormData();
        fd.append('fullName', form.fullName.trim() || 'بلوجر');
        fd.append('niche', form.niche || '');
        fd.append('label', form.label || '');
        fd.append('description', form.description || '');
        const price = parsePrice(form.videoPrice);
        if (price != null) fd.append('videoPrice', String(price));
        if (files.image) fd.append('image', files.image);
        if (files.sampleVideo) fd.append('sampleVideo', files.sampleVideo);
        if (editing === 'new') await dispatch(addCmsBlogger(fd)).unwrap();
        else await dispatch(updateCmsBlogger({ id: editing.id, body: fd })).unwrap();
      } else if (tab === 'digital') {
        const payload = { title: form.title.trim() || 'خدمة', hint: form.hint, price: parsePrice(form.price), iconKey: form.iconKey || 'website' };
        if (editing === 'new') await dispatch(addCmsDigital(payload)).unwrap();
        else await dispatch(updateCmsDigital({ id: editing.id, body: payload })).unwrap();
      } else if (tab === 'photo') {
        const fd = new FormData();
        fd.append('name', form.name.trim() || 'جلسة تصوير');
        fd.append('details', form.details || '');
        const price = parsePrice(form.price);
        if (price != null) fd.append('price', String(price));
        if (files.image) fd.append('image', files.image);
        if (editing === 'new') await dispatch(addCmsPhoto(fd)).unwrap();
        else await dispatch(updateCmsPhoto({ id: editing.id, body: fd })).unwrap();
      }
      setEditing(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('تأكيد الحذف؟')) return;
    try {
      if (tab === 'works') await dispatch(deleteCmsWork(id)).unwrap();
      else if (tab === 'bloggers') await dispatch(deleteCmsBlogger(id)).unwrap();
      else if (tab === 'digital') await dispatch(deleteCmsDigital(id)).unwrap();
      else if (tab === 'photo') await dispatch(deleteCmsPhoto(id)).unwrap();
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const titles = { works: 'عمل', bloggers: 'بلوجر', digital: 'خدمة برمجة', photo: 'جلسة تصوير' };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">محتوى الموقع</h1>
          <p className="mt-1 text-sm text-slate-500">إضافة وتعديل وحذف أقسام الصفحة الرئيسية</p>
        </div>
        <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-300 transition-colors">
          <Plus size={16} /> إضافة {titles[tab]}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => { setTab(t.id); setEditing(null); }} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${tab === t.id ? 'bg-amber-400 text-slate-900' : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'works' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {works.map(w => (
            <article key={w.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 transition-colors hover:border-amber-300 dark:hover:border-amber-500/50">
              <div className="aspect-video bg-slate-900 relative">
                {w.videoUrl ? <video src={mediaSrc(w.videoUrl)} poster={mediaSrc(w.imageUrl)} className="h-full w-full object-cover" muted playsInline /> : <div className="flex h-full items-center justify-center text-slate-500">بدون فيديو</div>}
              </div>
              <div className="space-y-2 p-4">
                <h3 className="font-bold text-slate-800 dark:text-white">{w.title}</h3>
                <p className="line-clamp-2 text-xs text-slate-500 min-h-[32px]">{w.details || '—'}</p>
                <div className="pt-2">
                  <RowActions onEdit={() => openEdit(w)} onDelete={() => remove(w.id)} />
                </div>
              </div>
            </article>
          ))}
          {works.length === 0 && <p className="col-span-full text-center text-slate-400 py-10">لا توجد أعمال.</p>}
        </div>
      )}

      {tab === 'bloggers' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bloggers.map(c => (
            <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 transition-colors hover:border-amber-300 dark:hover:border-amber-500/50">
              <div className="flex gap-3">
                <img src={mediaSrc(c.imageUrl)} alt="" className="h-16 w-16 rounded-xl object-cover bg-slate-200 dark:bg-slate-700" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-white">{c.fullName}</h3>
                  <p className="text-xs text-slate-500">{c.niche}</p>
                  {c.videoPrice > 0 && <p className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">{fmt(c.videoPrice)} ر.س / فيديو</p>}
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-slate-500 min-h-[32px]">{c.description}</p>
              <div className="mt-4"><RowActions onEdit={() => openEdit(c)} onDelete={() => remove(c.id)} /></div>
            </article>
          ))}
          {bloggers.length === 0 && <p className="col-span-full text-center text-slate-400 py-10">لا يوجد بلوجرز.</p>}
        </div>
      )}

      {tab === 'digital' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {digital.map(p => (
            <article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 transition-colors hover:border-amber-300 dark:hover:border-amber-500/50">
              <h3 className="font-bold text-slate-800 dark:text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-500 min-h-[40px]">{p.hint}</p>
              {p.price > 0 && <p className="mt-3 text-lg font-black text-amber-500">{fmt(p.price)} ر.س</p>}
              <div className="mt-4"><RowActions onEdit={() => openEdit(p)} onDelete={() => remove(p.id)} /></div>
            </article>
          ))}
          {digital.length === 0 && <p className="col-span-full text-center text-slate-400 py-10">لا توجد خدمات رقمية.</p>}
        </div>
      )}

      {tab === 'photo' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {photo.map(p => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 transition-colors hover:border-amber-300 dark:hover:border-amber-500/50">
              {p.imageUrl ? <img src={mediaSrc(p.imageUrl)} alt="" className="h-36 w-full object-cover" /> : <div className="h-36 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 text-xs">بدون صورة</div>}
              <div className="space-y-2 p-4">
                <h3 className="font-bold text-slate-800 dark:text-white">{p.name}</h3>
                <p className="text-sm text-slate-500 min-h-[40px] line-clamp-2">{p.details}</p>
                {p.price > 0 && <p className="font-black text-amber-500">{fmt(p.price)} ر.س / جلسة</p>}
                <div className="pt-2">
                  <RowActions onEdit={() => openEdit(p)} onDelete={() => remove(p.id)} />
                </div>
              </div>
            </article>
          ))}
          {photo.length === 0 && <p className="col-span-full text-center text-slate-400 py-10">لا توجد جلسات تصوير.</p>}
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing === 'new' ? `إضافة ${titles[tab]}` : `تعديل ${titles[tab]}`} size="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          {tab === 'works' && (
            <>
              <Field label="الاسم"><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
              <FileField label="الفيديو" accept="video/mp4,video/webm,video/quicktime" file={files.video} onFile={f => setFiles(p => ({ ...p, video: f }))} currentUrl={form.videoUrl} kind="video" />
              <div className="sm:col-span-2"><Field label="التفاصيل"><textarea className={inputCls} rows={3} value={form.details} onChange={e => set('details', e.target.value)} /></Field></div>
              <div className="sm:col-span-2"><FileField label="صورة غلاف" accept="image/*" file={files.image} onFile={f => setFiles(p => ({ ...p, image: f }))} currentUrl={form.imageUrl} kind="image" /></div>
            </>
          )}
          {tab === 'bloggers' && (
            <>
              <Field label="الاسم"><input className={inputCls} value={form.fullName} onChange={e => set('fullName', e.target.value)} /></Field>
              <Field label="التصنيف"><input className={inputCls} value={form.niche} onChange={e => set('niche', e.target.value)} /></Field>
              <Field label="وصف قصير"><input className={inputCls} value={form.label} onChange={e => set('label', e.target.value)} /></Field>
              <Field label="سعر الفيديو (ر.س)"><input type="number" className={inputCls} value={form.videoPrice} onChange={e => set('videoPrice', e.target.value)} /></Field>
              <div className="sm:col-span-2"><Field label="التفاصيل"><textarea className={inputCls} rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></Field></div>
              <FileField label="الصورة" accept="image/*" file={files.image} onFile={f => setFiles(p => ({ ...p, image: f }))} currentUrl={form.imageUrl} kind="image" />
              <FileField label="فيديو معاينة (اختياري)" accept="video/mp4,video/webm,video/quicktime" file={files.sampleVideo} onFile={f => setFiles(p => ({ ...p, sampleVideo: f }))} currentUrl={form.sampleVideoUrl} kind="video" />
            </>
          )}
          {tab === 'digital' && (
            <>
              <Field label="الاسم"><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
              <Field label="السعر (ر.س)"><input type="number" className={inputCls} value={form.price} onChange={e => set('price', e.target.value)} /></Field>
              <Field label="الأيقونة">
                <select className={inputCls} value={form.iconKey} onChange={e => set('iconKey', e.target.value)}>
                  {ICONS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2"><Field label="التفاصيل"><textarea className={inputCls} rows={3} value={form.hint} onChange={e => set('hint', e.target.value)} /></Field></div>
            </>
          )}
          {tab === 'photo' && (
            <>
              <Field label="الاسم"><input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} /></Field>
              <Field label="السعر (ر.س)"><input type="number" className={inputCls} value={form.price} onChange={e => set('price', e.target.value)} /></Field>
              <div className="sm:col-span-2"><Field label="التفاصيل"><textarea className={inputCls} rows={3} value={form.details} onChange={e => set('details', e.target.value)} /></Field></div>
              <div className="sm:col-span-2"><FileField label="الصورة" accept="image/*" file={files.image} onFile={f => setFiles(p => ({ ...p, image: f }))} currentUrl={form.imageUrl} kind="image" /></div>
            </>
          )}
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={save} className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-slate-900 hover:bg-amber-300 transition-colors">حفظ</button>
          <button type="button" onClick={() => setEditing(null)} className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onEdit} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"><Pencil size={12} /> تعديل</button>
      <button type="button" onClick={onDelete} className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"><Trash2 size={12} /> حذف</button>
    </div>
  );
}

import { useState } from 'react';
import { Star, Instagram, Youtube, Plus, Search, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/dashboard/ui/Modal';
import Badge from '@/components/dashboard/ui/Badge';

const platformIcon = { Instagram: Instagram, YouTube: Youtube, TikTok: () => <span className="text-xs font-black">TK</span> };
const categories = { food: 'طعام', fashion: 'موضة', tech: 'تقنية', lifestyle: 'أسلوب حياة' };
const fmt = n => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n);
const fmtK = n => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(0)+'K' : n;

export default function Bloggers() {
  const { bloggers } = useDashboard();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showCost, setShowCost] = useState(true);

  const filtered = bloggers.filter(b => {
    const matchSearch = b.name.includes(search) || b.handle.includes(search);
    const matchCat = cat === 'all' || b.category === cat;
    const matchPlatform = platform === 'all' || b.platform === platform;
    return matchSearch && matchCat && matchPlatform;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">شبكة المدوّنين</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{bloggers.length} مدوّن في الشبكة</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 rounded-xl text-sm font-bold hover:bg-amber-300 transition-colors">
          <Plus size={16}/> إضافة مدوّن
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 flex-1 min-w-48">
          <Search size={16} className="text-slate-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو المعرّف..." className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none flex-1"/>
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none">
          <option value="all">كل الفئات</option>
          {Object.entries(categories).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={platform} onChange={e => setPlatform(e.target.value)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none">
          <option value="all">كل المنصات</option>
          {['Instagram','YouTube','TikTok'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {isAdmin && (
          <button onClick={() => setShowCost(!showCost)} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:border-amber-400 transition-colors">
            {showCost ? <EyeOff size={16}/> : <Eye size={16}/>}
            {showCost ? 'إخفاء سعر التكلفة' : 'إظهار سعر التكلفة'}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(b => {
          const margin = Math.round(((b.sellingPrice - b.costPrice) / b.sellingPrice) * 100);
          const PlatIcon = platformIcon[b.platform] ?? (() => null);
          return (
            <div key={b.id} onClick={() => setSelected(b)}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{b.name}</p>
                    <p className="text-xs text-slate-400">{b.handle}</p>
                  </div>
                </div>
                <Badge type={b.status}/>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <PlatIcon size={12}/> {b.platform}
                </span>
                <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{categories[b.category]}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-slate-400">المتابعون</p>
                  <p className="font-bold text-slate-800 dark:text-white">{fmtK(b.followers)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">معدل التفاعل</p>
                  <p className="font-bold text-emerald-500">{b.engagementRate}%</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-1.5">
                {isAdmin && showCost && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">التكلفة (سري)</span>
                    <span className="text-sm font-bold text-red-400">{fmt(b.costPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">سعر العميل</span>
                  <span className="text-sm font-bold text-amber-500">{fmt(b.sellingPrice)}</span>
                </div>
                {isAdmin && showCost && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">الهامش</span>
                    <span className={`text-sm font-bold ${margin > 30 ? 'text-emerald-500' : margin > 15 ? 'text-amber-500' : 'text-red-400'}`}>{margin}%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 mt-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} className={s <= Math.floor(b.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}/>)}
                <span className="text-xs text-slate-400 mr-1">{b.rating} ({b.campaigns} حملة)</span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <Modal open onClose={() => setSelected(null)} title={selected.name} size="md">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">{selected.bio}</p>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
              <p className="font-semibold mb-1">ملاحظات داخلية:</p>
              <p>{selected.notes}</p>
            </div>
            {isAdmin && (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">تكلفتنا</p>
                  <p className="font-bold text-red-500">{fmt(selected.costPrice)}</p>
                </div>
                <div className="text-center bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">سعر العميل</p>
                  <p className="font-bold text-amber-500">{fmt(selected.sellingPrice)}</p>
                </div>
                <div className="text-center bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">الهامش</p>
                  <p className="font-bold text-emerald-500">{Math.round(((selected.sellingPrice-selected.costPrice)/selected.sellingPrice)*100)}%</p>
                </div>
              </div>
            )}
            <button className="w-full py-2.5 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm">تعديل البيانات</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

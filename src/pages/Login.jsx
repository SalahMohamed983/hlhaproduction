import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.user.role === 'EMPLOYEE') navigate('/dashboard/employee/tasks');
      else navigate('/dashboard/admin/overview');
    } catch (err) {
      setError(err.title || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-cairo" dir="rtl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 rounded-2xl mb-4 shadow-lg shadow-amber-400/30">
            <span className="text-slate-900 font-black text-2xl">ه</span>
          </div>
          <h1 className="text-2xl font-bold text-white">هلها برودكشن</h1>
          <p className="text-slate-400 text-sm mt-1">لوحة التحكم الموحدة</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">اسم المستخدم</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                dir="ltr"
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-amber-400"
                placeholder="sara"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  dir="ltr"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 pl-10"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 rounded-xl transition-colors disabled:opacity-70"
            >
              {loading ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <><LogIn size={18} /><span>دخول</span></>}
            </button>
            <p className="text-xs text-slate-500 text-center">الباسورد اهو عشان هنساه: sara / noura — كلمة المرور demo1234</p>
          </form>
        </div>
      </div>
    </div>
  );
}

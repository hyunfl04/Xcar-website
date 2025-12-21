
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

// FIX: Added apiUrl to LoginProps interface to resolve TypeScript errors in App.tsx
interface LoginProps {
  setUser: (user: User) => void;
  apiUrl: string;
}

const Login: React.FC<LoginProps> = ({ setUser, apiUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FIX: Use apiUrl from props for authentication fetch
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(3000)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem('xcar_user', JSON.stringify(data));
        navigate(data.isAdmin ? '/admin' : '/');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.warn("Server connection failed. Using local simulation.");
      
      // LOGIC CHẾ ĐỘ DEMO (KHI KHÔNG CÓ SERVER)
      const demoUsers = JSON.parse(localStorage.getItem('xcar_demo_users') || '[]');
      const localMatch = demoUsers.find((u: any) => u.email === email && u.password === password);

      if (email === 'admin@xcar.com' && password === '123456789') {
        // Tài khoản Admin mặc định theo yêu cầu
        const adminUser = {
          firstName: 'System',
          lastName: 'Admin',
          email: 'admin@xcar.com',
          phone: '0000',
          isAdmin: true
        };
        setUser(adminUser);
        localStorage.setItem('xcar_user', JSON.stringify(adminUser));
        navigate('/admin');
      } else if (localMatch) {
        // Tài khoản khách đã đăng ký trong máy này
        setUser(localMatch);
        localStorage.setItem('xcar_user', JSON.stringify(localMatch));
        navigate(localMatch.isAdmin ? '/admin' : '/');
      } else {
        setError('Invalid credentials. Admin password is 123456789');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 p-12 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-serif gold-text text-center mb-12">Client Access</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all text-white"
              placeholder="admin@xcar.com"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all text-white"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#d4af37] text-black py-4 font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-white transition-all ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-zinc-500 font-light">
          Don't have an account? <Link to="/register" className="text-[#d4af37] hover:underline">Apply for Membership</Link>
        </p>
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-600 tracking-widest uppercase font-bold mb-1">Demo Admin Login:</p>
          <p className="text-[11px] gold-text font-bold">admin@xcar.com / 123456789</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

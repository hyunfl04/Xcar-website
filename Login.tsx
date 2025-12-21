
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from './types';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    if (email === 'admin@xcar.com') {
      const adminUser = {
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@xcar.com',
        phone: '0000',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('xcar_user', JSON.stringify(adminUser));
      navigate('/admin');
    } else {
      const mockUser = {
        firstName: 'Valued',
        lastName: 'Client',
        email,
        phone: '123',
        isAdmin: false
      };
      setUser(mockUser);
      localStorage.setItem('xcar_user', JSON.stringify(mockUser));
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 p-12 rounded-2xl">
        <h2 className="text-3xl font-serif gold-text text-center mb-12">Client Access</h2>
        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all"
              placeholder="client@exclusive.com"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#d4af37] text-black py-4 font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-white transition-all"
          >
            Authenticate
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-zinc-500 font-light">
          Don't have an account? <Link to="/register" className="text-[#d4af37] hover:underline">Apply for Membership</Link>
        </p>
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-600 tracking-widest uppercase font-bold">Demo: admin@xcar.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// FIX: Defined RegisterProps interface with apiUrl to resolve TypeScript errors in App.tsx
interface RegisterProps {
  apiUrl: string;
}

const Register: React.FC<RegisterProps> = ({ apiUrl }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FIX: Use apiUrl from props for registration fetch
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(3000)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.isAdmin ? 'Admin Created Successfully!' : 'Membership Approved!');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.warn("Server connection failure. Registering in Demo Mode.");
      
      const demoUsers = JSON.parse(localStorage.getItem('xcar_demo_users') || '[]');
      
      if (demoUsers.find((u: any) => u.email === formData.email)) {
        setError('Email already exists in Demo Mode.');
        setLoading(false);
        return;
      }

      const isDemoAdmin = formData.email === 'admin@xcar.com';
      // Nếu là admin thì ép mật khẩu 123456789 nếu người dùng nhập khác (để đảm bảo đúng yêu cầu của bạn)
      const finalPassword = isDemoAdmin ? '123456789' : formData.password;
      
      const newUser = { ...formData, password: finalPassword, isAdmin: isDemoAdmin };
      demoUsers.push(newUser);
      localStorage.setItem('xcar_demo_users', JSON.stringify(demoUsers));

      alert(isDemoAdmin 
        ? 'Demo: Admin Registered! Default password is 123456789' 
        : 'Demo: Registered Successfully!'
      );
      
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div className="relative max-w-xl w-full bg-zinc-900/90 border border-white/10 p-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif gold-text mb-2">New Membership</h2>
          <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase">Begin your journey with Xcar</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center uppercase tracking-widest font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Last Name</label>
            <input 
              type="text" required
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all text-white"
              placeholder="Surname"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">First Name</label>
            <input 
              type="text" required
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all text-white"
              placeholder="Given Name"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Email Address</label>
            <input 
              type="email" required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all text-white"
              placeholder="admin@xcar.com"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Phone Number</label>
            <input 
              type="tel" required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all text-white"
              placeholder="+1 XXX XXX XXXX"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Security Passphrase</label>
            <input 
              type="password" required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all text-white"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`col-span-2 mt-8 bg-[#d4af37] text-black py-4 font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-white transition-all shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Apply for Membership'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
             Note: Admin password is set to <span className="gold-text font-bold">123456789</span>
           </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500 font-light">
          Already a member? <Link to="/login" className="text-[#d4af37] hover:underline font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    alert('Membership application submitted successfully.');
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full bg-zinc-900/50 border border-white/10 p-12 rounded-2xl">
        <h2 className="text-3xl font-serif gold-text text-center mb-12">New Membership</h2>
        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-8">
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">First Name</label>
            <input 
              type="text" required
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Last Name</label>
            <input 
              type="text" required
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Email Address</label>
            <input 
              type="email" required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Phone Number</label>
            <input 
              type="tel" required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-3 font-bold">Password</label>
            <input 
              type="password" required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 py-2 focus:border-[#d4af37] outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="col-span-2 mt-8 bg-[#d4af37] text-black py-4 font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-white transition-all"
          >
            Apply for Membership
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-zinc-500 font-light">
          Already a member? <Link to="/login" className="text-[#d4af37] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

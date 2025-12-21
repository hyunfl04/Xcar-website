
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { Car, User } from './types';

interface AdminProps {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  user: User | null;
}

const Admin: React.FC<AdminProps> = ({ cars, setCars, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    name: '',
    brand: '',
    price: 0,
    acceleration: '',
    power: '',
    description: '',
    imageUrl: '',
    category: 'Supercar'
  });

  if (!user?.isAdmin) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif text-red-500 mb-4">Access Restricted</h2>
        <p className="text-zinc-500">Only authorized personnel can access the command center.</p>
      </div>
    );
  }

  const handleSave = () => {
    if (editingCar) {
      setCars(prev => prev.map(c => c.id === editingCar.id ? { ...c, ...formData } as Car : c));
    } else {
      const newCar = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Car;
      setCars(prev => [...prev, newCar]);
    }
    setIsModalOpen(false);
    setEditingCar(null);
    setFormData({ name: '', brand: '', price: 0, acceleration: '', power: '', description: '', imageUrl: '', category: 'Supercar' });
  };

  const deleteCar = (id: string) => {
    if (window.confirm('Are you sure you want to decommission this model?')) {
      setCars(prev => prev.filter(c => c.id !== id));
    }
  };

  const openEdit = (car: Car) => {
    setEditingCar(car);
    setFormData(car);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-serif gold-text mb-2">Command Center</h2>
          <p className="text-zinc-500 text-xs tracking-widest uppercase">Fleet Inventory Management</p>
        </div>
        <button 
          onClick={() => { setEditingCar(null); setIsModalOpen(true); }}
          className="bg-white text-black px-6 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-[#d4af37] transition-colors flex items-center space-x-3"
        >
          <Plus size={16} />
          <span>Add New Asset</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] tracking-[0.2em] uppercase text-zinc-500">
              <th className="py-6 px-4">Asset</th>
              <th className="py-6 px-4">Class</th>
              <th className="py-6 px-4">Value</th>
              <th className="py-6 px-4">Status</th>
              <th className="py-6 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cars.map(car => (
              <tr key={car.id} className="group hover:bg-zinc-900/30 transition-colors">
                <td className="py-6 px-4">
                  <div className="flex items-center space-x-4">
                    <img src={car.imageUrl} alt="" className="w-16 h-10 object-cover rounded grayscale group-hover:grayscale-0 transition-all" />
                    <div>
                      <p className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase">{car.brand}</p>
                      <p className="font-serif">{car.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-4 text-sm text-zinc-400">{car.category}</td>
                <td className="py-6 px-4 font-serif text-[#d4af37]">${car.price.toLocaleString()}</td>
                <td className="py-6 px-4">
                  <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-500 rounded font-bold tracking-widest uppercase">Active</span>
                </td>
                <td className="py-6 px-4 text-right space-x-4">
                  <button onClick={() => openEdit(car)} className="text-zinc-500 hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteCar(car.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-2xl font-serif gold-text">{editingCar ? 'Edit Asset' : 'New Asset Registration'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Model Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-[#d4af37] outline-none rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Manufacturer</label>
                <input 
                  type="text" 
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-[#d4af37] outline-none rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">MSRP Price ($)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-[#d4af37] outline-none rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Asset Class</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-[#d4af37] outline-none rounded"
                >
                  <option>Hypercar</option>
                  <option>Supercar</option>
                  <option>Hybrid</option>
                  <option>GT</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Media URL</label>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-[#d4af37] outline-none rounded"
                />
              </div>
               <div className="col-span-2">
                <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-2 font-bold">Asset Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-[#d4af37] outline-none rounded resize-none"
                />
              </div>
            </div>

            <div className="p-8 bg-zinc-900/50 flex space-x-4">
              <button 
                onClick={handleSave}
                className="flex-1 bg-[#d4af37] text-black py-4 font-bold tracking-widest uppercase text-[10px] hover:bg-white transition-all"
              >
                Sync with Database
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 border border-white/20 text-white font-bold tracking-widest uppercase text-[10px] hover:bg-zinc-800 transition-all"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

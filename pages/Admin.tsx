
import React, { useState, useRef } from 'react';
import { Plus, X, Database, Save, PlayCircle, Upload, FileVideo, AlertCircle, RotateCcw, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { Car, User } from '../types';
import { saveVideoToDB, clearVideoFromDB } from '../storage';

// FIX: Added apiUrl to AdminProps interface to resolve TypeScript errors in App.tsx
interface AdminProps {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  user: User | null;
  homeVideoUrl: string;
  setHomeVideoUrl: (url: string) => void;
  apiUrl: string;
}

const DEFAULT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-luxury-car-driving-on-a-highway-at-sunset-34531-large.mp4';

const Admin: React.FC<AdminProps> = ({ cars, setCars, user, homeVideoUrl, setHomeVideoUrl, apiUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tempVideoUrl, setTempVideoUrl] = useState(homeVideoUrl);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [deploySuccess, setDeploySuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Car>>({ 
    name: '', brand: '', price: 0, acceleration: '', power: '', description: '', imageUrl: '', category: 'Supercar' 
  });

  if (!user?.isAdmin) return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-red-500">
      <h2 className="text-3xl font-serif uppercase tracking-[0.2em]">Access Restricted</h2>
      <p className="text-zinc-500 mt-4 uppercase text-[10px] tracking-widest">Administrator credentials required</p>
    </div>
  );

  const updateLocalState = (updatedCars: Car[]) => {
    setCars(updatedCars);
    localStorage.setItem('xcar_local_cars', JSON.stringify(updatedCars));
  };

  const handleUpdateVideo = async () => {
    if (!tempVideoUrl.trim()) return alert('Please provide a video source.');
    
    setUploadLoading(true);
    try {
      if (tempVideoUrl.startsWith('data:')) {
        // Saving a file upload to IndexedDB
        await saveVideoToDB(tempVideoUrl);
        localStorage.removeItem('xcar_home_video'); // Clean up old URL storage
      } else {
        // Saving a URL to LocalStorage
        localStorage.setItem('xcar_home_video', tempVideoUrl);
        await clearVideoFromDB(); // Clean up old DB storage
      }
      
      setHomeVideoUrl(tempVideoUrl);
      setDeploySuccess(true);
      setTimeout(() => setDeploySuccess(false), 3000);
    } catch (e) {
      alert('Error saving video. File might be extremely large or browser storage is full.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleResetVideo = async () => {
    if (window.confirm('Reset homepage background to default luxury video?')) {
      await clearVideoFromDB();
      localStorage.removeItem('xcar_home_video');
      setTempVideoUrl(DEFAULT_VIDEO);
      setHomeVideoUrl(DEFAULT_VIDEO);
      setSelectedFileName(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // IndexedDB can handle larger files (e.g., 50MB is usually fine)
    if (file.size > 50 * 1024 * 1024) { 
      alert('ERROR: File size exceeds 50MB. Please use a shorter clip or a Cloud URL for better performance.');
      return;
    }

    setSelectedFileName(file.name);
    setUploadLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setTempVideoUrl(result);
      setUploadLoading(false);
    };
    reader.onerror = () => {
      alert('Failed to read video file.');
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setDbStatus('syncing');
    try {
      // FIX: Replaced hardcoded localhost URL with dynamic apiUrl prop
      const url = editingCar 
        ? `${apiUrl}/api/cars/${editingCar._id || editingCar.id}` 
        : `${apiUrl}/api/cars`;
      
      const response = await fetch(url, {
        method: editingCar ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const savedCar = await response.json();
        const mappedCar = { ...savedCar, id: savedCar._id };
        let newCars = editingCar 
          ? cars.map(c => (c._id === editingCar._id || c.id === editingCar.id) ? mappedCar : c)
          : [mappedCar, ...cars];
        updateLocalState(newCars);
        setDbStatus('connected');
      } else { throw new Error(); }
    } catch (err) {
      setDbStatus('offline');
      let newCars;
      if (editingCar) {
        newCars = cars.map(c => (c._id === editingCar._id || c.id === editingCar.id) ? { ...formData, id: editingCar.id } as Car : c);
      } else {
        const newLocalCar = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Car;
        newCars = [newLocalCar, ...cars];
      }
      updateLocalState(newCars);
    } finally {
      setIsModalOpen(false);
      setEditingCar(null);
      setFormData({ name: '', brand: '', price: 0, acceleration: '', power: '', description: '', imageUrl: '', category: 'Supercar' });
      setTimeout(() => setDbStatus(prev => prev === 'offline' ? 'offline' : 'connected'), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this masterpiece from inventory?')) return;
    try {
      // FIX: Replaced hardcoded localhost URL with dynamic apiUrl prop
      const response = await fetch(`${apiUrl}/api/cars/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(2000) });
      if (response.ok) { updateLocalState(cars.filter(c => c._id !== id && c.id !== id)); }
      else { throw new Error(); }
    } catch (err) {
      updateLocalState(cars.filter(c => c._id !== id && c.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="text-5xl font-serif gold-text mb-4 uppercase tracking-tighter">Command Center</h2>
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${dbStatus === 'connected' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
            <Database size={12} />
            <span>{dbStatus === 'connected' ? 'Cloud Synced' : 'Demo Mode'}</span>
          </div>
        </div>
      </div>

      {/* VIDEO MANAGEMENT */}
      <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-md">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center text-[#d4af37]">
                  <PlayCircle size={28} />
              </div>
              <div>
                  <h3 className="text-2xl font-serif uppercase">Experience Control</h3>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Homepage Background Settings</p>
              </div>
            </div>
            <button 
              onClick={handleResetVideo}
              className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors text-[9px] uppercase font-bold tracking-widest"
            >
              <RotateCcw size={14} />
              <span>Reset to Default</span>
            </button>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Option 1: Video URL (Cloud Path)</label>
                    <LinkIcon size={16} className="text-zinc-600" />
                </div>
                <input 
                    type="text"
                    value={tempVideoUrl.startsWith('data:') ? '' : tempVideoUrl}
                    onChange={(e) => {
                        setTempVideoUrl(e.target.value);
                        setSelectedFileName(null);
                    }}
                    placeholder="Enter https://... URL"
                    className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white focus:border-[#d4af37] outline-none transition-all font-mono text-sm"
                />
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center"><span className="bg-[#0c0c0c] px-4 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">OR</span></div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Option 2: Local Video Asset (Persistent)</label>
                    <FileVideo size={16} className="text-zinc-600" />
                </div>
                
                <input type="file" accept="video/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all group ${selectedFileName ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-white/10 hover:border-[#d4af37]/40 hover:bg-white/5'}`}
                >
                    {uploadLoading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#d4af37] border-r-2 border-transparent" />
                    ) : selectedFileName ? (
                        <>
                            <FileVideo className="text-[#d4af37] mb-4" size={40} />
                            <p className="text-sm font-bold text-white mb-1">{selectedFileName}</p>
                            <p className="text-[10px] text-[#d4af37] uppercase font-bold tracking-widest">Ready to deploy</p>
                        </>
                    ) : (
                        <>
                            <Upload className="text-zinc-600 group-hover:text-[#d4af37] transition-colors mb-4" size={40} />
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Select file from device</p>
                            <p className="text-[9px] text-zinc-700 mt-2 uppercase tracking-tighter">Powered by IndexedDB for persistent storage</p>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed">
                   We use <b>IndexedDB</b> to ensure your video stays saved even after closing the browser. This allows for high-quality background experiences.
                </p>
            </div>

            <button 
                onClick={handleUpdateVideo}
                disabled={uploadLoading}
                className={`w-full ${deploySuccess ? 'bg-green-500' : 'bg-[#d4af37]'} text-black h-16 font-bold tracking-[0.4em] uppercase text-[11px] hover:bg-white transition-all rounded-2xl flex items-center justify-center space-x-3 shadow-xl ${uploadLoading ? 'opacity-50' : ''}`}
            >
                {deploySuccess ? <CheckCircle size={20} /> : <Save size={20} />}
                <span>{deploySuccess ? 'Success' : uploadLoading ? 'Processing...' : 'Deploy Experience'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Real-time Preview</h4>
            <div className="aspect-[9/16] bg-black rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl group">
                {tempVideoUrl ? (
                    <video key={tempVideoUrl} autoPlay muted loop playsInline src={tempVideoUrl} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-[10px] uppercase font-bold">No Video Active</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest mb-2 animate-pulse">Live Feed</p>
                    <p className="text-xs text-white font-serif opacity-60 italic">Your brand experience in motion.</p>
                </div>
            </div>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="flex justify-between items-center mb-10">
          <h3 className="text-3xl font-serif uppercase tracking-tight">Fleet Inventory</h3>
          <button onClick={() => { setEditingCar(null); setFormData({ name: '', brand: '', price: 0, acceleration: '', power: '', description: '', imageUrl: '', category: 'Supercar' }); setIsModalOpen(true); }} className="bg-white text-black px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#d4af37] transition-all flex items-center space-x-3">
              <Plus size={18} />
              <span>Register New Asset</span>
          </button>
      </div>

      <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
              <th className="p-8">Asset</th>
              <th className="p-8">Class</th>
              <th className="p-8">MSRP</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cars.map(car => (
              <tr key={car._id || car.id} className="group hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center space-x-6">
                    <img src={car.imageUrl} className="w-20 h-12 object-cover rounded-lg shadow-lg" alt="" />
                    <div>
                      <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">{car.brand}</p>
                      <p className="font-serif text-lg">{car.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                    <span className="text-[10px] bg-zinc-800 px-3 py-1 rounded-full text-zinc-400 font-bold uppercase tracking-widest">{car.category}</span>
                </td>
                <td className="p-6 font-serif text-xl">${car.price.toLocaleString()}</td>
                <td className="p-6 text-right space-x-6">
                  <button onClick={() => { setEditingCar(car); setFormData(car); setIsModalOpen(true); }} className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">Edit</button>
                  <button onClick={() => handleDelete(car._id || car.id)} className="text-zinc-500 hover:text-red-500 transition-colors uppercase text-[10px] font-bold tracking-widest">Retire</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <h3 className="text-2xl font-serif gold-text uppercase">{editingCar ? 'Update Asset' : 'New Registration'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-6 overflow-y-auto custom-scrollbar">
              <div className="col-span-1 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Model Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]" />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Manufacturer</label>
                <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]" />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">MSRP Price ($)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]" />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]">
                  <option>Hypercar</option><option>Supercar</option><option>Hybrid</option><option>GT</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]" />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Acceleration</label>
                <input type="text" value={formData.acceleration} onChange={e => setFormData({...formData, acceleration: e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]" />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Power</label>
                <input type="text" value={formData.power} onChange={e => setFormData({...formData, power: e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4af37] resize-none" />
              </div>
            </div>

            <div className="p-8 bg-zinc-900/80 flex space-x-4">
              <button onClick={handleSave} className="flex-1 bg-[#d4af37] text-black py-5 font-bold uppercase tracking-widest rounded-2xl shadow-lg hover:bg-white transition-all">Commit Changes</button>
              <button onClick={() => setIsModalOpen(false)} className="px-10 border border-white/10 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all">Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;


import React, { useState } from 'react';
import { Trash2, ShoppingBag, CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import { CartItem, Car } from '../types';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  cart: CartItem[];
  cars: Car[];
  removeFromCart: (carId: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, cars, removeFromCart }) => {
  const navigate = useNavigate();
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartDetails = cart.map(item => ({ 
    car: cars.find(c => (c._id === item.carId || c.id === item.carId))!, 
    quantity: item.quantity 
  })).filter(item => item.car !== undefined);

  const total = cartDetails.reduce((sum, item) => sum + (item.car.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCheckedOut(true);
    }, 2000);
  };

  if (isCheckedOut) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in duration-700">
        <div className="w-32 h-32 bg-green-500/10 flex items-center justify-center rounded-full mb-10 border border-green-500/20">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-5xl font-serif gold-text mb-6">Acquisition Confirmed</h2>
        <p className="text-zinc-400 max-w-md mb-12 leading-relaxed">Your acquisition has been logged in our global network. Our Concierge team will reach out within 24 hours to finalize delivery details.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-[#d4af37] text-black px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (cartDetails.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-zinc-900 flex items-center justify-center rounded-full mb-8">
          <ShoppingBag size={32} className="text-zinc-600" />
        </div>
        <h2 className="text-3xl font-serif text-white mb-6">Your Garage is Empty</h2>
        <p className="text-zinc-500 mb-10 max-w-xs">Explore our collection and find your next mechanical masterpiece.</p>
        <button 
          onClick={() => navigate('/discover')} 
          className="border border-[#d4af37] text-[#d4af37] px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#d4af37] hover:text-black transition-all"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="flex items-center space-x-4 mb-16">
        <h2 className="text-5xl font-serif gold-text">Shopping Bag</h2>
        <span className="text-zinc-700 font-serif text-2xl">/ {cartDetails.length} Asset{cartDetails.length > 1 ? 's' : ''}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cartDetails.map(item => (
            <div key={item.car._id || item.car.id} className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 bg-zinc-900/40 border border-white/5 p-8 rounded-2xl relative group hover:border-[#d4af37]/30 transition-all">
              <div className="w-48 h-28 overflow-hidden rounded-xl">
                <img src={item.car.imageUrl} alt={item.car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h4 className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase mb-1">{item.car.brand}</h4>
                <h3 className="text-2xl font-serif mb-2">{item.car.name}</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Class: {item.car.category}</p>
              </div>
              <div className="flex items-center space-x-12">
                <div className="text-right">
                  <p className="text-[10px] text-zinc-600 uppercase mb-1 font-bold">Price per Unit</p>
                  <p className="text-xl font-serif text-white">${(item.car.price * item.quantity).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.car._id || item.car.id)} 
                  className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-full text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-900/90 backdrop-blur-xl p-10 rounded-3xl border border-white/10 sticky top-32 shadow-2xl">
            <h3 className="text-xl font-serif mb-8 flex items-center space-x-3">
              <CreditCard className="text-[#d4af37]" size={20} />
              <span>Summary</span>
            </h3>
            
            <div className="space-y-4 mb-10 pb-10 border-b border-white/5">
              <div className="flex justify-between text-xs tracking-widest uppercase text-zinc-500">
                <span>Market Value</span>
                <span className="text-white">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs tracking-widest uppercase text-zinc-500">
                <span>Shipping</span>
                <span className="text-green-500">Complimentary</span>
              </div>
              <div className="flex justify-between text-xs tracking-widest uppercase text-zinc-500">
                <span>Taxes & Duties</span>
                <span>Included</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-10">
              <span className="text-sm tracking-[0.2em] text-zinc-400 font-bold uppercase">Total Due</span>
              <span className="text-3xl font-serif gold-text font-bold">${total.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full bg-[#d4af37] text-black py-5 font-bold tracking-[0.3em] uppercase text-xs hover:bg-white transition-all flex items-center justify-center space-x-4 group shadow-xl ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{isProcessing ? 'Authenticating...' : 'Confirm Acquisition'}</span>
              {!isProcessing && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <p className="mt-6 text-[9px] text-zinc-600 text-center leading-relaxed uppercase tracking-tighter">By proceeding, you agree to Xcar Global's terms of acquisition and privacy protocols.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

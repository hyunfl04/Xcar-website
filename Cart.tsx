
import React, { useState } from 'react';
import { Trash2, ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react';
import { CartItem, Car } from './types';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  cart: CartItem[];
  cars: Car[];
  removeFromCart: (carId: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, cars, removeFromCart }) => {
  const navigate = useNavigate();
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const cartDetails = cart.map(item => ({
    car: cars.find(c => c.id === item.carId)!,
    quantity: item.quantity
  })).filter(item => item.car !== undefined);

  const total = cartDetails.reduce((sum, item) => sum + (item.car.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsCheckedOut(true);
    // In real app, call API
  };

  if (isCheckedOut) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-[#d4af37]/20 flex items-center justify-center rounded-full mb-8">
          <CheckCircle size={48} className="text-[#d4af37]" />
        </div>
        <h2 className="text-4xl font-serif gold-text mb-4">Acquisition Initiated</h2>
        <p className="text-zinc-500 max-w-sm mb-12">Your order has been successfully placed. Our concierge team will contact you shortly to finalize the transaction.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-black px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#d4af37] transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (cartDetails.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag size={48} className="text-zinc-800 mb-8" />
        <h2 className="text-3xl font-serif text-white mb-6">Your Garage is Empty</h2>
        <button 
          onClick={() => navigate('/discover')}
          className="border border-white/20 px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
        >
          Start Browsing
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-serif gold-text mb-12">Shopping Bag</h2>
      
      <div className="space-y-8 mb-16">
        {cartDetails.map(item => (
          <div key={item.car.id} className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 bg-zinc-900/30 border border-white/5 p-6 rounded-xl relative">
            <img src={item.car.imageUrl} alt={item.car.name} className="w-40 h-24 object-cover rounded" />
            <div className="flex-grow text-center sm:text-left">
              <h4 className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase">{item.car.brand}</h4>
              <h3 className="text-xl font-serif mb-1">{item.car.name}</h3>
              <p className="text-sm text-zinc-500 font-light">${item.car.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center space-x-12">
              <div className="text-right">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                <p className="text-lg font-serif">${(item.car.price * item.quantity).toLocaleString()}</p>
              </div>
              <button onClick={() => removeFromCart(item.car.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-md p-10 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-10">
          <span className="text-sm tracking-widest text-zinc-500 font-bold uppercase">Estimated Total</span>
          <span className="text-3xl font-serif gold-text">${total.toLocaleString()}</span>
        </div>
        <button 
          onClick={handleCheckout}
          className="w-full bg-[#d4af37] text-black py-5 font-bold tracking-[0.3em] uppercase text-xs hover:bg-white transition-all flex items-center justify-center space-x-4 group"
        >
          <span>Complete Purchase</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Cart;


import React, { useState } from 'react';
import { ChevronRight, Eye } from 'lucide-react';
import { Car } from '../types';

const BudgetFinder: React.FC<{ cars: Car[] }> = ({ cars }) => {
  const [income, setIncome] = useState<number>(50000);
  const SAVING_RATIO = 0.3; // Dedicate 30% of income for the car

  const calculateMonths = (price: number) => {
    const monthlySaving = income * SAVING_RATIO;
    return Math.ceil(price / monthlySaving);
  };

  const getFormatTime = (totalMonths: number) => {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years === 0) return `${months} months`;
    return `${years}y ${months}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif gold-text mb-4">Financial Compass</h2>
        <p className="text-zinc-500 tracking-widest uppercase text-xs">Plan your supercar acquisition journey</p>
      </div>

      <div className="max-w-3xl mx-auto mb-20 bg-zinc-900/50 p-12 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div className="mb-6 md:mb-0">
            <label className="block text-sm font-bold tracking-widest uppercase text-zinc-400 mb-2">Monthly Net Income (USD)</label>
            <p className="text-[10px] text-zinc-600 uppercase">Calculation based on 30% savings allocation</p>
          </div>
          <span className="text-4xl font-serif text-[#d4af37] font-bold">${income.toLocaleString()}</span>
        </div>
        
        <input 
          type="range" 
          min="2000" 
          max="200000" 
          step="1000"
          value={income}
          onChange={(e) => setIncome(parseInt(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
        />
        
        <div className="flex justify-between mt-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          <span>Min: $2,000</span>
          <span>Max: $200,000+</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {cars.map(car => {
          const months = calculateMonths(car.price);
          return (
            <div key={car._id || car.id} className="bg-zinc-950 border border-white/10 p-8 hover:border-[#d4af37]/50 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-serif text-xl mb-1 group-hover:text-[#d4af37] transition-colors">{car.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">{car.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#d4af37] uppercase mb-1 font-bold">Ownership Path</p>
                  <p className="text-lg font-serif text-white">{getFormatTime(months)}</p>
                </div>
              </div>
              
              <div className="h-40 overflow-hidden mb-6 rounded-lg">
                <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-sm text-[#d4af37] font-bold">${car.price.toLocaleString()}</span>
                <button className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase hover:text-[#d4af37] transition-colors group/btn">
                  <span>View Details</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetFinder;

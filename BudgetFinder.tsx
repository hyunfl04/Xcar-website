
import React, { useState } from 'react';
import { Calculator, ChevronRight, Eye } from 'lucide-react';
import { Car } from './types';

const BudgetFinder: React.FC<{ cars: Car[] }> = ({ cars }) => {
  const [income, setIncome] = useState<number>(10000);
  const SAVING_RATIO = 0.3; // Spend 30% of income on car

  const calculateMonths = (price: number) => {
    return Math.ceil(price / (income * SAVING_RATIO));
  };

  const getFormatTime = (totalMonths: number) => {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return years > 0 ? `${years}y ${months}m` : `${months} months`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif gold-text mb-4">Financial Compass</h2>
        <p className="text-zinc-500 tracking-widest uppercase text-xs">Plan your acquisition journey</p>
      </div>

      <div className="max-w-2xl mx-auto mb-20 bg-zinc-900/50 p-10 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <label className="text-sm font-bold tracking-widest uppercase text-zinc-400">Monthly Net Income ($)</label>
          <span className="text-2xl font-serif text-[#d4af37]">${income.toLocaleString()}</span>
        </div>
        <input 
          type="range" 
          min="2000" 
          max="100000" 
          step="500"
          value={income}
          onChange={(e) => setIncome(parseInt(e.target.value))}
          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
        />
        <p className="mt-6 text-center text-[10px] text-zinc-500 tracking-widest uppercase">
          Calculation based on saving <span className="text-white">30%</span> of monthly income
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map(car => {
          const months = calculateMonths(car.price);
          return (
            <div key={car.id} className="bg-zinc-950 border border-white/10 p-8 hover:border-[#d4af37]/50 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-serif text-xl mb-1">{car.name}</h3>
                  <p className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase">{car.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Ownership in</p>
                  <p className="text-lg font-serif text-white">{getFormatTime(months)}</p>
                </div>
              </div>
              
              <img src={car.imageUrl} alt={car.name} className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 mb-6" />
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-sm text-zinc-400 font-serif">${car.price.toLocaleString()}</span>
                <button className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase hover:text-[#d4af37] transition-colors">
                  <span>View Details</span>
                  <ChevronRight size={14} />
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

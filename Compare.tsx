
import React from 'react';
// Added Plus to imports
import { X, ArrowRight, Minus, Plus } from 'lucide-react';
import { Car } from './types';
import { useNavigate } from 'react-router-dom';

interface CompareProps {
  cars: Car[];
  compareList: string[];
  toggleCompare: (carId: string) => void;
}

const Compare: React.FC<CompareProps> = ({ cars, compareList, toggleCompare }) => {
  const navigate = useNavigate();
  const selectedCars = cars.filter(car => compareList.includes(car.id));

  if (selectedCars.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-serif gold-text mb-6">Selection Empty</h2>
        <p className="text-zinc-500 max-w-sm mb-12">Select up to 3 models from the discovery page to compare specifications side-by-side.</p>
        <button 
          onClick={() => navigate('/discover')}
          className="border border-[#d4af37] px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#d4af37] hover:text-black transition-all"
        >
          Discover Models
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 overflow-x-auto">
      <div className="flex justify-between items-end mb-16 min-w-[800px]">
        <div>
          <h2 className="text-4xl font-serif gold-text mb-4">Side-by-Side</h2>
          <p className="text-zinc-500 tracking-widest uppercase text-xs">Technical Analysis</p>
        </div>
        <button onClick={() => selectedCars.forEach(c => toggleCompare(c.id))} className="text-[10px] text-red-500 hover:underline uppercase tracking-widest font-bold">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-8 min-w-[1000px]">
        {/* Labels Column */}
        <div className="pt-[250px] space-y-12 text-[10px] text-zinc-500 tracking-[0.2em] font-bold uppercase text-right pr-6">
          <div className="h-20">Model Name</div>
          <div className="h-10">MSRP Price</div>
          <div className="h-10">0-100 KM/H</div>
          <div className="h-10">Max Power</div>
          <div className="h-10">Class</div>
        </div>

        {/* Cars Columns */}
        {selectedCars.map(car => (
          <div key={car.id} className="relative bg-zinc-900/30 border border-white/5 p-8 rounded-xl">
            <button 
              onClick={() => toggleCompare(car.id)}
              className="absolute -top-4 -right-4 bg-zinc-800 p-2 rounded-full hover:bg-red-500 transition-colors z-10"
            >
              <X size={16} />
            </button>
            
            <div className="h-48 mb-12 overflow-hidden rounded-lg">
              <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-12">
              <div className="h-20">
                <p className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase mb-1">{car.brand}</p>
                <h3 className="text-xl font-serif">{car.name}</h3>
              </div>
              <div className="h-10 font-serif text-lg text-[#d4af37]">${car.price.toLocaleString()}</div>
              <div className="h-10 text-sm font-semibold">{car.acceleration}</div>
              <div className="h-10 text-sm font-semibold">{car.power}</div>
              <div className="h-10 text-sm font-light text-zinc-400">{car.category}</div>
            </div>
            
            <button 
              className="mt-12 w-full py-4 border border-[#d4af37] text-[10px] font-bold tracking-widest uppercase hover:bg-[#d4af37] hover:text-black transition-all"
            >
              Order This Model
            </button>
          </div>
        ))}

        {/* Placeholder Column */}
        {selectedCars.length < 3 && (
          <div className="border border-dashed border-white/10 flex items-center justify-center rounded-xl min-h-[600px]">
            <button 
              onClick={() => navigate('/discover')}
              className="flex flex-col items-center space-y-4 text-zinc-600 hover:text-[#d4af37] transition-colors"
            >
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase">Add Model</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
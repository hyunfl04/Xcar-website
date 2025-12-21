
import React, { useState } from 'react';
// Added X to imports
import { ShoppingCart, BarChart3, Info, Eye, X } from 'lucide-react';
import { Car } from './types';

interface DiscoverProps {
  cars: Car[];
  addToCart: (carId: string) => void;
  toggleCompare: (carId: string) => void;
  compareList: string[];
}

const Discover: React.FC<DiscoverProps> = ({ cars, addToCart, toggleCompare, compareList }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const categories = ['All', 'Hypercar', 'Supercar', 'Hybrid', 'GT'];
  const filteredCars = selectedCategory === 'All' 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
        <div>
          <h2 className="text-4xl font-serif gold-text mb-4">The Collection</h2>
          <p className="text-zinc-500 text-sm tracking-wider uppercase">Available Masterpieces</p>
        </div>
        
        <div className="flex space-x-8 text-[10px] font-bold tracking-[0.2em] overflow-x-auto pb-4 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pb-2 border-b-2 transition-all uppercase ${selectedCategory === cat ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-zinc-600 hover:text-zinc-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCars.map(car => (
          <div key={car.id} className="group relative bg-zinc-900/50 border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#d4af37]/30">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={car.imageUrl} 
                alt={car.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
              
              {/* Hover Actions */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm space-x-4">
                 <button 
                  onClick={() => setSelectedCar(car)}
                  className="bg-white text-black p-3 rounded-full hover:bg-[#d4af37] transition-colors"
                >
                  <Eye size={20} />
                </button>
                <button 
                  onClick={() => addToCart(car.id)}
                  className="bg-white text-black p-3 rounded-full hover:bg-[#d4af37] transition-colors"
                >
                  <ShoppingCart size={20} />
                </button>
                <button 
                  onClick={() => toggleCompare(car.id)}
                  className={`p-3 rounded-full transition-colors ${compareList.includes(car.id) ? 'bg-[#d4af37] text-black' : 'bg-white text-black hover:bg-[#d4af37]'}`}
                >
                  <BarChart3 size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] text-[#d4af37] font-bold uppercase mb-1">{car.brand}</h4>
                  <h3 className="text-xl font-serif font-bold text-zinc-100">{car.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">MSRP FROM</p>
                  <p className="text-lg font-serif text-[#d4af37]">${car.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">0-100 km/h</p>
                  <p className="text-sm font-semibold">{car.acceleration}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Power</p>
                  <p className="text-sm font-semibold">{car.power}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-5xl w-full bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full relative">
                <img src={selectedCar.imageUrl} alt={selectedCar.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedCar(null)}
                  className="absolute top-4 left-4 bg-black/50 p-2 rounded-full hover:bg-[#d4af37] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-12 space-y-8">
                <div>
                  <h4 className="text-[#d4af37] tracking-[0.4em] font-bold text-xs uppercase mb-2">{selectedCar.brand}</h4>
                  <h2 className="text-4xl font-serif mb-4">{selectedCar.name}</h2>
                  <p className="text-zinc-400 leading-relaxed font-light">{selectedCar.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                  <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Acceleration</span>
                    <span className="text-xl font-serif">{selectedCar.acceleration}</span>
                  </div>
                   <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Max Power</span>
                    <span className="text-xl font-serif">{selectedCar.power}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Class</span>
                    <span className="text-xl font-serif">{selectedCar.category}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Base Price</span>
                    <span className="text-xl font-serif text-[#d4af37]">${selectedCar.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={() => { addToCart(selectedCar.id); setSelectedCar(null); }}
                    className="flex-1 bg-[#d4af37] text-black py-4 font-bold tracking-widest uppercase text-[10px] hover:bg-white transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => { toggleCompare(selectedCar.id); setSelectedCar(null); }}
                    className="px-6 border border-white/20 hover:border-[#d4af37] transition-colors"
                  >
                    <BarChart3 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
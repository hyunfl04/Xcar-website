
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-car-on-a-city-street-at-night-23420-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
        <h3 className="text-[#d4af37] tracking-[0.5em] text-xs font-bold mb-6 animate-pulse">ESTABLISHED 2024</h3>
        <h1 className="text-5xl md:text-8xl font-serif mb-8 max-w-4xl tracking-tight leading-tight">
          THE APEX OF <span className="gold-text italic">AUTOMOTIVE</span> LUXURY
        </h1>
        <p className="text-zinc-300 max-w-xl mb-12 text-sm md:text-lg leading-relaxed font-light">
          Discover a curated collection of world-class machinery, precision engineering, and timeless design.
        </p>
        
        <button 
          onClick={() => navigate('/discover')}
          className="group flex items-center space-x-4 border border-[#d4af37] px-8 py-4 text-xs font-bold tracking-[0.3em] hover:bg-[#d4af37] hover:text-black transition-all duration-500 uppercase"
        >
          <span>Explore Models</span>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-[#d4af37]" />
        <span className="text-[10px] tracking-[0.4em] mt-4 text-[#d4af37]">SCROLL</span>
      </div>
    </div>
  );
};

export default Home;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface HomeProps {
  videoUrl: string;
}

const Home: React.FC<HomeProps> = ({ videoUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[90vh] overflow-hidden bg-black">
      {/* 
        FIX: Setting src directly on video element for better Data URL support.
        Added playsInline, muted, and autoPlay for cross-browser compatibility.
      */}
      <video
        key={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.5)' }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />

      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
        <h3 className="text-[#d4af37] tracking-[0.5em] text-[10px] md:text-xs font-bold mb-6 animate-pulse uppercase">
          Xcar Global Presence
        </h3>
        <h1 className="text-5xl md:text-9xl font-serif mb-8 max-w-4xl tracking-tight leading-tight uppercase">
          THE <span className="gold-text italic">COLLECTION</span>
        </h1>
        <p className="text-zinc-300 max-w-xl mb-12 text-sm md:text-lg leading-relaxed font-light uppercase tracking-widest opacity-80">
          Experience the world's most exclusive collection of high-performance machinery.
        </p>
        
        <button 
          onClick={() => navigate('/discover')}
          className="group relative flex items-center space-x-6 border border-[#d4af37] px-10 py-5 text-[10px] font-bold tracking-[0.4em] hover:bg-[#d4af37] hover:text-black transition-all duration-700 uppercase overflow-hidden"
        >
          <span className="relative z-10">Explore Models</span>
          <ChevronRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
          <div className="absolute inset-0 bg-[#d4af37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-40">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-[#d4af37]" />
        <span className="text-[9px] tracking-[0.5em] mt-4 text-[#d4af37] font-bold uppercase">Scroll Down</span>
      </div>
    </div>
  );
};

export default Home;

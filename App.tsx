
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Heart, WifiOff } from 'lucide-react';
import { Car, User, CartItem } from './types';
import { INITIAL_CARS } from './constants';
import { getVideoFromDB } from './storage';

// Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import BudgetFinder from './pages/BudgetFinder';
import Compare from './pages/Compare';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

const DEFAULT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-luxury-car-driving-on-a-highway-at-sunset-34531-large.mp4';

// Tự động xác định URL của API dựa trên môi trường đang chạy
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://your-backend-service-on-google-cloud-run.a.run.app'; // Thay bằng URL thật sau khi deploy backend

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [homeVideoUrl, setHomeVideoUrl] = useState<string>(DEFAULT_VIDEO);
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('xcar_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('xcar_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('xcar_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('xcar_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadPersistedData = async () => {
      const storedVideo = await getVideoFromDB();
      if (storedVideo) {
        setHomeVideoUrl(storedVideo);
      } else {
        const savedUrl = localStorage.getItem('xcar_home_video');
        if (savedUrl) setHomeVideoUrl(savedUrl);
      }
    };
    loadPersistedData();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cars`, { signal: AbortSignal.timeout(3000) });
        if (response.ok) {
          const data = await response.json();
          const mappedData = data.map((c: any) => ({ ...c, id: c._id || c.id }));
          setCars(mappedData.length > 0 ? mappedData : INITIAL_CARS);
          setIsOffline(false);
          localStorage.setItem('xcar_local_cars', JSON.stringify(mappedData));
        } else {
          throw new Error();
        }
      } catch (err) {
        setIsOffline(true);
        const localCars = localStorage.getItem('xcar_local_cars');
        setCars(localCars ? JSON.parse(localCars) : INITIAL_CARS);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    localStorage.setItem('xcar_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (carId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.carId === carId);
      if (existing) {
        return prev.map(item => item.carId === carId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { carId, quantity: 1 }];
    });
  };

  const removeFromCart = (carId: string) => {
    setCart(prev => prev.filter(item => item.carId !== carId));
  };

  const toggleCompare = (carId: string) => {
    setCompareList(prev => {
      if (prev.includes(carId)) return prev.filter(id => id !== carId);
      if (prev.length >= 3) return prev; 
      return [...prev, carId];
    });
  };

  const toggleFavorite = (carId: string) => {
    setFavorites(prev => {
      if (prev.includes(carId)) return prev.filter(id => id !== carId);
      return [...prev, carId];
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('xcar_user');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col font-sans">
        {isOffline && (
          <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-black text-[10px] font-bold py-1 text-center flex items-center justify-center space-x-2 uppercase tracking-widest">
            <WifiOff size={12} />
            <span>MÔI TRƯỜNG OFFLINE / DEMO</span>
          </div>
        )}
        <nav className={`fixed ${isOffline ? 'top-6' : 'top-0'} left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10 px-6 py-4 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-3xl font-serif font-bold gold-text tracking-tighter">XCAR</Link>
            
            <div className="hidden md:flex items-center space-x-10 text-xs font-semibold tracking-[0.2em]">
              <Link to="/" className="hover:text-[#d4af37] transition-all duration-300">TRANG CHỦ</Link>
              <Link to="/discover" className="hover:text-[#d4af37] transition-all duration-300">KHÁM PHÁ</Link>
              <Link to="/budget-finder" className="hover:text-[#d4af37] transition-all duration-300">NGÂN SÁCH</Link>
              <Link to="/compare" className="hover:text-[#d4af37] transition-all duration-300">SO SÁNH</Link>
              {user?.isAdmin && <Link to="/admin" className="text-red-500 hover:text-red-400 font-bold border border-red-500/30 px-3 py-1 rounded">QUẢN TRỊ</Link>}
            </div>

            <div className="flex items-center space-x-6">
              <Link to="/discover" className="relative hover:text-red-500 transition-colors">
                <Heart size={20} className={favorites.length > 0 ? "fill-red-500 text-red-500" : ""} />
              </Link>
              <Link to="/cart" className="relative hover:text-[#d4af37] transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] gold-text font-bold uppercase">{user.firstName}</span>
                  <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hover:text-[#d4af37] transition-colors">
                  <UserIcon size={20} />
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className={`flex-grow ${isOffline ? 'pt-24' : 'pt-16'}`}>
          <Routes>
            <Route path="/" element={<Home videoUrl={homeVideoUrl} />} />
            <Route path="/discover" element={
              <Discover 
                cars={cars} 
                addToCart={addToCart} 
                toggleCompare={toggleCompare} 
                compareList={compareList}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            } />
            <Route path="/budget-finder" element={<BudgetFinder cars={cars} />} />
            <Route path="/compare" element={<Compare cars={cars} compareList={compareList} toggleCompare={toggleCompare} />} />
            <Route path="/cart" element={<Cart cart={cart} cars={cars} removeFromCart={removeFromCart} />} />
            <Route path="/admin" element={
              <Admin 
                cars={cars} 
                setCars={setCars} 
                user={user} 
                homeVideoUrl={homeVideoUrl} 
                setHomeVideoUrl={setHomeVideoUrl} 
                apiUrl={API_BASE_URL}
              />
            } />
            <Route path="/login" element={<Login setUser={setUser} apiUrl={API_BASE_URL} />} />
            <Route path="/register" element={<Register apiUrl={API_BASE_URL} />} />
          </Routes>
        </main>

        <footer className="bg-zinc-950 border-t border-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto text-center text-zinc-600 text-[10px] tracking-widest uppercase">
            &copy; 2024 XCAR GLOBAL. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

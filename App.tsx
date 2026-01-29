
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import ProductList from './pages/ProductList';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import { CartItem, Product } from './types';

const AppContent: React.FC<{ 
  cart: CartItem[], 
  addToCart: (p: Product, q: number) => void, 
  totalAmount: number, 
  clearCart: () => void 
}> = ({ cart, addToCart, totalAmount, clearCart }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#fdfcf9] shadow-2xl flex flex-col relative overflow-hidden border-x border-gray-100">
      <header className={`sticky top-0 z-40 transition-all duration-500 glass-effect border-b border-emerald-100/50 ${isHome ? 'py-8' : 'py-4'}`}>
        <div className="flex flex-col items-center px-4 text-center">
          <div className="bg-emerald-800 p-2 rounded-xl mb-3 shadow-lg rotate-3">
             <ShoppingBag size={20} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-900 tracking-tight leading-tight drop-shadow-sm">
            DL Cosmetic by Yuu Lin
          </h1>
          {isHome && (
            <div className="flex flex-col items-center mt-2">
              <div className="h-px w-12 bg-emerald-200 mb-2"></div>
              <span className="text-[11px] text-emerald-700 font-bold tracking-[0.15em] uppercase">
                Tel: 093 801 240
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProductList 
                addToCart={addToCart} 
                totalAmount={totalAmount} 
                cartCount={cart.length}
                onClear={clearCart}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <Checkout 
                cart={cart}
                totalAmount={totalAmount} 
                onSuccess={clearCart} 
              />
            } 
          />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setNotification({
      message: `បន្ថែម ${quantity}x ${product.name} ទៅក្នុងកន្ត្រក`,
      visible: true,
    });
  };

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [notification.visible]);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const clearCart = () => setCart([]);

  return (
    <HashRouter>
      <div className="relative">
        <div 
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${
            notification.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'
          }`}
        >
          <div className="bg-emerald-900 text-white px-6 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-3 border border-emerald-700/50 whitespace-nowrap">
            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle size={14} className="text-white" />
            </div>
            <span className="text-xs font-medium tracking-wide">{notification.message}</span>
          </div>
        </div>

        <AppContent 
          cart={cart} 
          addToCart={addToCart} 
          totalAmount={totalAmount} 
          clearCart={clearCart} 
        />
      </div>
    </HashRouter>
  );
};

export default App;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductListProps {
  addToCart: (product: Product, quantity: number) => void;
  totalAmount: number;
  cartCount: number;
  onClear: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ addToCart, totalAmount, cartCount, onClear }) => {
  const navigate = useNavigate();
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (totalAmount > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalAmount]);

  return (
    <div className="p-6 pb-32">
      {/* Intro section */}
      <div className="mb-8 text-center">
        <p className="text-xs font-bold text-emerald-700/40 tracking-[0.3em] uppercase mb-2"></p>
        <h2 className="text-2xl font-light text-emerald-950 italic">លក់គ្រឿងសំអាង</h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-12">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAdd={addToCart} 
          />
        ))}
      </div>

      {/* Elegant Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[calc(28rem-3rem)] z-50">
        <div className="glass-effect rounded-3xl p-3 premium-shadow border border-emerald-100 flex gap-3 items-center">
          <button
            onClick={onClear}
            disabled={cartCount === 0}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
              cartCount > 0 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-300 opacity-50 cursor-not-allowed'
            }`}
            aria-label="Clear Cart"
          >
            <Trash2 size={20} />
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-center">
             <span className="text-[10px] font-bold text-emerald-700/50 uppercase tracking-widest">តម្លៃសរុប</span>
             <span className={`text-xl font-black text-emerald-900 transition-all duration-300 ${isBumping ? 'scale-110' : 'scale-100'}`}>
                ${totalAmount.toFixed(2)}
             </span>
          </div>
          
          <button
            onClick={() => navigate('/checkout')}
            disabled={cartCount === 0}
            className={`flex-1 h-12 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              cartCount > 0 
                ? 'bg-emerald-800 text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-900' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ទិញ
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

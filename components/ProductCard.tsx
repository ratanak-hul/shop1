
import React, { useState } from 'react';
import { Plus, Minus, ShoppingBasket } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(q => Math.min(q + 1, 99));
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(q => Math.max(q - 1, 1));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="group relative flex flex-col space-y-3">
      {/* Image Wrapper */}
      <div className="relative aspect-[4/5] bg-white rounded-[2rem] overflow-hidden premium-shadow border border-emerald-50/50 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_-12px_rgba(6,78,59,0.2)]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Subtle overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 opacity-40" />

        {/* Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
           <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl flex items-center gap-2 border border-white/50">
             <div className="flex items-center bg-gray-50 rounded-xl px-1.5 py-1 border border-gray-100">
               <button onClick={decrement} className="p-1 hover:bg-white rounded-lg text-emerald-900 transition-colors"><Minus size={14} /></button>
               <span className="w-6 text-center text-xs font-bold text-emerald-900">{quantity}</span>
               <button onClick={increment} className="p-1 hover:bg-white rounded-lg text-emerald-900 transition-colors"><Plus size={14} /></button>
             </div>
             <button
                onClick={handleAdd}
                className="flex-1 bg-emerald-800 text-white h-10 rounded-xl text-[11px] font-bold hover:bg-emerald-900 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/10"
              >
                <ShoppingBasket size={14} />
                ទិញ
              </button>
           </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-1 text-center">
        <h3 className="font-semibold text-emerald-900 text-sm tracking-tight mb-0.5">{product.name}</h3>
        <p className="text-amber-700 font-bold text-base tracking-tighter">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Mobile-only visible add button (if needed, but usually group-hover works on tap) */}
      <button
        onClick={handleAdd}
        className="md:hidden absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-emerald-50 text-emerald-800 active:scale-90 transition-transform"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default ProductCard;

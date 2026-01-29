
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 flex flex-col items-center justify-center text-center space-y-8 h-full animate-[fadeIn_0.8s_ease-out]">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
        <div className="text-emerald-600 relative">
          <CheckCircle2 size={120} strokeWidth={1} className="animate-[scaleIn_0.5s_ease-out]" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-black text-emerald-950 tracking-tight">បានជោគជ័យ!</h2>
        <p className="text-emerald-700/60 font-medium max-w-[280px] leading-relaxed mx-auto text-sm italic">
          អរគុណសម្រាប់ការគាំទ្រផលិតផលរបស់ខ្ញុំ។ ខ្ញុំនឹងដឹកជូនអ្នកក្នុងពេលឆាប់ៗនេះ។
        </p>
      </div>

      <div className="w-full pt-8">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-emerald-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-emerald-950 transition-all flex items-center justify-center gap-2 active:scale-95 group uppercase tracking-[0.2em] text-xl"
        >
          <Home size={16} className="transition-transform group-hover:-translate-y-0.5" />
          ត្រលប់ទៅទំព័រដើម
        </button>
      </div>
      
      <div className="text-[10px] font-black text-emerald-800/20 uppercase tracking-[0.4em] pt-4">
        
      </div>
    </div>
  );
};

export default Success;

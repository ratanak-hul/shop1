import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MapPin, ReceiptText, AlertCircle } from 'lucide-react';
import { CheckoutFormData, CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  totalAmount: number;
  onSuccess: () => void;
}

const TELEGRAM_TOKEN = '8004068793:AAFMPWeqZGjHmNZCJIlHR7te4TGCevIWhn8';
const TELEGRAM_CHAT_ID = '@Yuu_Lin'; 

const Checkout: React.FC<CheckoutProps> = ({ cart, totalAmount, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorStatus) setErrorStatus(null);
  };

  const sendTelegramMessage = async () => {
    const productList = cart
      .map(item => `▪️ *${item.name}* x ${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`)
      .join('\n');

    const messageText = `
🔔 *ការបញ្ជាទិញថ្មី (New Order)*
━━━━━━━━━━━━━━━
👤 *អតិថិជន:* ${formData.name}
📞 *ទូរសព្ទ:* ${formData.phone}
📍 *ទីតាំង:* ${formData.location}

🛒 *មុខទំនិញ:*
${productList}

━━━━━━━━━━━━━━━
💰 *សរុប:* $${totalAmount.toFixed(2)}
⏰ *កាលបរិច្ឆេទ:* ${new Date().toLocaleString('km-KH')}
━━━━━━━━━━━━━━━
✅ _បញ្ជាទិញតាមរយៈវេបសាយ DL Cosmetic by Yuu Lin_
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        console.error('Telegram API Error Body:', data);
        throw new Error(data.description || 'Unknown Telegram Error');
      }
      return true;
    } catch (error: any) {
      console.error('Telegram API error:', error);
      setErrorStatus(error.message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location) return;

    setIsSubmitting(true);
    setErrorStatus(null);
    
    const telegramSent = await sendTelegramMessage();
    
    if (telegramSent) {
      onSuccess();
      navigate('/success');
    } else {
      setIsSubmitting(false);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
          }));
        },
        () => alert("មិនអាចចូលប្រើទីតាំងបានទេ")
      );
    }
  };

  return (
    <div className="p-6 bg-[#fdfcf9] min-h-full pb-20 animate-[fadeIn_0.5s_ease-out]">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-emerald-800 font-semibold text-sm hover:text-emerald-950 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={16} />
        ត្រលប់ថយក្រោយ
      </button>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-emerald-950 tracking-tight">វិក្កយបត្រ</h2>
      </div>
      
      {errorStatus && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-bounce">
          <AlertCircle className="text-red-500 shrink-0" size={18} />
          <div className="text-xs text-red-800 font-medium">
            <p className="font-bold mb-1">បញ្ហា Telegram:</p>
            <p>{errorStatus === 'Forbidden: bot is not a member of the channel chat' 
              ? 'សូមមេត្តាបន្ថែម Bot ទៅក្នុង Channel ជា Admin ជាមុនសិន។' 
              : errorStatus}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl mb-10 premium-shadow border border-emerald-50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-800" />
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-emerald-900 border-b border-gray-100 pb-4">
            <ReceiptText size={18} />
            <span className="font-bold text-xs uppercase tracking-widest">រាយមុខទំនិញ៖</span>
          </div>
          
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div className="flex flex-col pr-4">
                  <span className="font-bold text-emerald-950">{item.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase mt-0.5 tracking-wider">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </span>
                </div>
                <span className="text-emerald-900 font-black tabular-nums whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-6 border-t border-dashed border-gray-200">
             <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">សរុបទាំងអស់</span>
                <span className="text-3xl font-black text-emerald-950 tabular-nums">
                  ${totalAmount.toFixed(2)}
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="mb-10 text-center flex flex-col items-center">
        <p className="text-[14px] font-black text-emerald-800 uppercase tracking-widest mb-4">ស្កេនដើម្បីទូទាត់ប្រាក់</p>
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-emerald-50 max-w-[280px]">
          <img 
            src="https://zvfcqqbfjprahrcregqh.supabase.co/storage/v1/object/public/product%20items/QR.svg" 
            alt="Payment QR" 
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[20px] font-black text-emerald-800 uppercase tracking-widest px-1">ឈ្មោះអ្នកទិញ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
            className="w-full bg-white px-5 py-4 rounded-2xl border border-emerald-50 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all shadow-sm font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[20px] font-black text-emerald-800 uppercase tracking-widest px-1">លេខទូរសព្ទ</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0XX XXX XXX"
            className="w-full bg-white px-5 py-4 rounded-2xl border border-emerald-50 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all shadow-sm font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[20px] font-black text-emerald-800 uppercase tracking-widest">អាសយដ្ឋានដឹកជញ្ជូន</label>
            <button 
              type="button"
              onClick={handleUseMyLocation}
              className="text-[10px] flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-black uppercase tracking-tighter transition-all"
            >
              <MapPin size={12} />
              ទំលាក់ទីតាំង
            </button>
          </div>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="ទីតាំងរបស់អ្នក..."
            className="w-full bg-white px-5 py-4 rounded-2xl border border-emerald-50 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all shadow-sm min-h-[120px] font-medium resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || totalAmount === 0}
          className="w-full bg-emerald-900 text-white font-black py-5 rounded-2xl shadow-[0_20px_40px_rgba(6,78,59,0.2)] hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none group"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span className="uppercase tracking-[0.1em] text-xs">សូមអរគុណ!!!</span>
            </div>
          ) : (
            <>
              <span className="uppercase tracking-[0.2em] text-xl">ទិញឥឡូវនេះ</span>
              <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
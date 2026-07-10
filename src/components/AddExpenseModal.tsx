import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Coins, 
  Home, 
  Utensils, 
  Flower, 
  Shirt, 
  Camera, 
  Gift, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  History,
  Compass,
  Heart
} from 'lucide-react';
import { Expense, Milestone } from '../types';

interface AddExpenseModalProps {
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id'>) => void;
  milestones: Milestone[];
  expenses: Expense[];
}

interface CategoryOption {
  code: string;
  label: string;
  iconName: string;
}

const CATEGORIES: CategoryOption[] = [
  { code: 'khutba_feast', label: 'Engagement', iconName: 'Heart' },
  { code: 'mahr', label: 'Mahr (Dowry)', iconName: 'Coins' },
  { code: 'shabka', label: 'Shabka & Jwlry', iconName: 'Sparkles' },
  { code: 'venue', label: 'Venue & Feast', iconName: 'Home' },
  { code: 'flowers', label: 'Flowers', iconName: 'Flower' },
  { code: 'photo', label: 'Photography', iconName: 'Camera' },
  { code: 'gifts', label: 'Gifts', iconName: 'Gift' },
  { code: 'honeymoon_travel', label: 'Honeymoon', iconName: 'Compass' },
  { code: 'house_furniture', label: 'Home setup', iconName: 'Home' },
];

export default function AddExpenseModal({
  onClose,
  onSaveExpense,
  milestones,
  expenses
}: AddExpenseModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('mahr');
  const [showHistory, setShowHistory] = useState(false);

  const todayRaw = new Date();
  const [dateStr, setDateStr] = useState<string>(todayRaw.toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  // Handle clicking save
  const handleSave = () => {
    if (amount <= 0) {
      alert("Please enter a valid expense amount!");
      return;
    }

    // Determine target phaseId based on selected category
    const matchedMilestone = milestones.find(m => m.category === selectedCategory);
    let assignedPhaseId: string = 'wedding'; // default fallback

    if (matchedMilestone) {
      assignedPhaseId = matchedMilestone.phaseId;
    } else {
      // Direct hardcoded standard mapping for known categories
      if (selectedCategory === 'khutba_feast') assignedPhaseId = 'khutba';
      else if (selectedCategory === 'mahr' || selectedCategory === 'shabka') assignedPhaseId = 'melka';
      else if (selectedCategory === 'honeymoon_travel') assignedPhaseId = 'honeymoon';
      else if (selectedCategory === 'house_furniture') assignedPhaseId = 'house';
    }

    onSaveExpense({
      amount: Number(amount),
      category: selectedCategory,
      date: dateStr,
      note: note.trim() || undefined,
      phaseId: assignedPhaseId
    });
    
    onClose();
  };

  const getLinkedMilestoneName = () => {
    const linked = milestones.find(m => m.category === selectedCategory);
    if (linked) return linked.name;
    
    const cat = CATEGORIES.find(c => c.code === selectedCategory);
    return cat ? cat.label : selectedCategory;
  };

  const getCategoryIcon = (iconName: string, active: boolean) => {
    const defaultClass = active ? "w-6 h-6 text-white" : "w-5 h-5 text-on-surface-variant group-hover:text-primary";
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={defaultClass} />;
      case 'Coins': return <Coins className={defaultClass} />;
      case 'Home': return <Home className={defaultClass} />;
      case 'Utensils': return <Utensils className={defaultClass} />;
      case 'Flower': return <Flower className={defaultClass} />;
      case 'Shirt': return <Shirt className={defaultClass} />;
      case 'Camera': return <Camera className={defaultClass} />;
      case 'Gift': return <Gift className={defaultClass} />;
      case 'Compass': return <Compass className={defaultClass} />;
      case 'Heart': return <Heart className={defaultClass} />;
      default: return <Coins className={defaultClass} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#1d1c16]/30 backdrop-blur-sm p-0 md:p-6 transition-all animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        title="Dismiss modal overlay"
      />
      
      {/* Modal Card */}
      <div className="bg-surface w-full max-w-md h-[90vh] md:h-auto rounded-t-2xl md:rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between border-t border-outline-variant/30 md:border z-10 animate-in slide-in-from-bottom duration-300 grain-texture">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors text-lg"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="font-plus text-lg font-extrabold text-on-surface">Audit Expense</h2>
          
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-primary font-bold text-xs px-2.5 py-1 hover:bg-primary/5 rounded-full flex items-center gap-1"
          >
            <History className="w-4 h-4" /> History
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-h-[75vh]">
          {showHistory ? (
            <div className="space-y-3 animate-in fade-in duration-200 py-2">
              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-outline-variant/15">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Past Expense History Logs</h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  Back to Add form
                </button>
              </div>

              {expenses.length > 0 ? (
                <div className="space-y-2">
                  {expenses.map((e) => (
                    <div key={e.id} className="p-3 bg-white border border-outline-variant/20 rounded-xl flex justify-between items-center text-xs shadow-sm">
                      <div>
                        <p className="font-bold text-on-surface capitalize">{e.note || `${e.category} Allocation`}</p>
                        <p className="text-[10px] text-on-surface-variant">{new Date(e.date).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-error">-{e.amount.toLocaleString()} SAR</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic py-10 opacity-70 text-center">No recorded expenses found locally</p>
              )}
            </div>
          ) : (
            <>
              {/* Numeric Input Section */}
              <div className="text-center pt-2 sm:pt-0">
                <p className="text-[10px] font-extrabold text-on-surface-variant mb-2 uppercase tracking-widest block">
                  Amount in SAR Currency
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-plus text-3xl font-bold text-primary/40 select-none">SAR</span>
                  <input
                    autoFocus
                    type="number"
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-1/2 bg-transparent border-none outline-none focus:ring-0 text-center font-plus text-4xl font-extrabold text-primary placeholder-primary/25"
                    min="1"
                  />
                </div>
                
                {/* Dynamically bound Wedding Milestone target tag */}
                <div className="mt-2 text-primary font-semibold text-xs flex items-center justify-center gap-1 transition-all">
                  <Sparkles className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span>Goal Category: {getLinkedMilestoneName()}</span>
                </div>
              </div>

              {/* Category Grid Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Select Category</p>
                  <p className="text-[10px] text-primary font-bold">Auto-linking to Milestone</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.code;
                    return (
                      <button
                        key={cat.code}
                        onClick={() => setSelectedCategory(cat.code)}
                        type="button"
                        className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? 'border-primary bg-primary/5 scale-102 shadow-[0_4px_12px_rgba(0,110,28,0.1)] text-primary' 
                            : 'border-outline-variant/40 bg-surface/30 hover:border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border mb-2 transition-all ${
                          isActive 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                        }`}>
                          {getCategoryIcon(cat.iconName, isActive)}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider transition-all line-clamp-1`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Log Details */}
              <div className="space-y-3.5 pt-1">
                {/* Transaction Date Entry */}
                <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3 border border-outline-variant/10 focus-within:border-primary/50 transition-all">
                  <Calendar className="w-4 h-4 text-on-surface-variant/75" />
                  <div className="flex-1">
                    <p className="text-[9px] uppercase font-bold text-on-surface-variant/80 tracking-wider">Transaction date</p>
                    <input
                      type="date"
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-xs font-bold focus:ring-0 text-on-surface focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Annotation Optional Note */}
                <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3 border border-outline-variant/10 focus-within:border-primary/50 transition-all">
                  <FileText className="w-4 h-4 text-on-surface-variant/75" />
                  <div className="flex-1">
                    <p className="text-[9px] uppercase font-bold text-on-surface-variant/80 tracking-wider">Note (optional)</p>
                    <input
                      type="text"
                      placeholder="e.g. Paid jeweler / booking venue"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-xs font-bold focus:ring-0 text-on-surface-variant placeholder-on-surface-variant/35 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Action CTA Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/10 flex flex-col items-center">
          <div className="leaf-divider opacity-50 mb-4 scale-95" />
          
          <button
            onClick={showHistory ? () => setShowHistory(false) : handleSave}
            type="button"
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/15 flex items-center justify-center gap-2 hover:bg-opacity-95 active:scale-98 transition-all tracking-tight sm:py-3.5 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 fill-white/10" />
            <span className="font-plus font-bold text-xs uppercase tracking-widest">
              {showHistory ? 'Return to form' : 'Save Wedding Expense'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

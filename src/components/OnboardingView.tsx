import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, ShieldAlert, DollarSign, ArrowRight, User, Languages, Trash2, Plus } from 'lucide-react';
import { WeddingSettings } from '../types';
import AvatarImage from './AvatarImage';
import { t, Language } from '../lib/translations';

interface OnboardingViewProps {
  onComplete: (settings: WeddingSettings) => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState<number>(300000);
  const [weddingDate, setWeddingDate] = useState('');
  const [avatarId, setAvatarId] = useState<'green' | 'red' | 'blue'>('green');
  
  const [step, setStep] = useState(1); // 1: Language, 2: Meet Companion, 3: Wedding Timeline, 4: Custom Phases & Sliders
  const [validationError, setValidationError] = useState('');

  // Step 4 states
  const [localPhases, setLocalPhases] = useState<any[]>([]);
  const [showAddPhaseForm, setShowAddPhaseForm] = useState(false);
  const [customPhaseName, setCustomPhaseName] = useState('');
  const [customPhaseDesc, setCustomPhaseDesc] = useState('');
  const [customPhaseBudget, setCustomPhaseBudget] = useState<number>(0);
  const [customPhaseDate, setCustomPhaseDate] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!userName.trim() || !partnerName.trim()) {
        setValidationError(t('validationNames', language));
        return;
      }
      setValidationError('');
      setStep(3);
    }
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim() || !partnerName.trim()) {
      setValidationError(t('validationNames', language));
      setStep(2);
      return;
    }

    if (!weddingDate) {
      setValidationError(t('validationDate', language));
      return;
    }

    if (budgetLimit <= 1000) {
      setValidationError(t('validationBudget', language));
      return;
    }

    setValidationError('');

    // Pre-calculate standard phase budgets proportionally
    const b = Number(budgetLimit);
    const bShofa = Math.round(b * 0.017);
    const bKhutba = Math.round(b * 0.05);
    const bMelka = Math.round(b * 0.25);
    const bWedding = Math.round(b * 0.45);
    const bHoneymoon = Math.round(b * 0.065);
    const bHouse = b - (bShofa + bKhutba + bMelka + bWedding + bHoneymoon);

    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffTime = wedding.getTime() - today.getTime();
    const totalDays = Math.max(30, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const getOffsetDate = (days: number) => {
      const d = new Date();
      d.setDate(today.getDate() + days);
      return formatDate(d);
    };

    const shofaDate = getOffsetDate(Math.round(totalDays * 0.15));
    const khutbaDate = getOffsetDate(Math.round(totalDays * 0.4));
    const melkaDate = getOffsetDate(Math.round(totalDays * 0.7));
    const weddingDateStr = weddingDate;

    const honeymoonDateObj = new Date(wedding);
    honeymoonDateObj.setDate(wedding.getDate() + 14);
    const honeymoonDate = formatDate(honeymoonDateObj);

    const houseDateObj = new Date(wedding);
    houseDateObj.setDate(wedding.getDate() + 30);
    const houseDate = formatDate(houseDateObj);

    const isAr = language === 'ar';
    const initialPhases = [
      { 
        id: 'shofa', 
        name: isAr ? 'الشوفة الشرعية' : 'Shofa', 
        description: isAr 
          ? 'تأسيس رحلتكم: الرؤية، قائمة الضيوف الأولية، وتقدير الميزانية الأساسية' 
          : 'The foundation of your journey: vision, guests, and initial budgeting',
        allocatedBudget: bShofa,
        targetDate: shofaDate
      },
      { 
        id: 'khutba', 
        name: isAr ? 'الخطوبة' : 'Khutba', 
        description: isAr 
          ? 'اللقاءات الرسمية، حفل الخطوبة، وتجهيز المظهر الخارجي والملابس' 
          : 'Engagement, proposal meetings, and personal wardrobe',
        allocatedBudget: bKhutba,
        targetDate: khutbaDate
      },
      { 
        id: 'melka', 
        name: isAr ? 'الملكة عقد القران' : 'Melka', 
        description: isAr 
          ? 'تقديم المهر، شراء طقم الشبكة الذهبي والمجوهرات، وتوقيع رخصة عقد النكاح الرسمي' 
          : 'Dowry (Mahr) delivery, Shabka jewelry purchase, and official license',
        allocatedBudget: bMelka,
        targetDate: melkaDate
      },
      { 
        id: 'wedding', 
        name: isAr ? 'حفل الزفاف' : 'The Wedding', 
        description: isAr 
          ? 'القاعة والضيافة، التصوير، الكوشة، ووجبة عشاء المدعوين' 
          : 'Celebratory hall, photography, catering, and evening guest feast',
        allocatedBudget: bWedding,
        targetDate: weddingDateStr
      },
      { 
        id: 'honeymoon', 
        name: isAr ? 'شهر العسل' : 'Honeymoon', 
        description: isAr 
          ? 'حجز الطيران، الفنادق، والرحلات الترفيهية بعد مراسم الزواج' 
          : 'Flights, hotel bookings, and post-ceremony travels',
        allocatedBudget: bHoneymoon,
        targetDate: honeymoonDate
      },
      { 
        id: 'house', 
        name: isAr ? 'عش الزوجية' : 'The House', 
        description: isAr 
          ? 'الأجهزة الكهربائية، أثاث المعيشة والغرف، وتجهيز المنزل بالكامل' 
          : 'Appliances, living room layout, and essential home furnishing',
        allocatedBudget: bHouse,
        targetDate: houseDate
      }
    ];

    setLocalPhases(initialPhases);
    setCustomPhaseDate(todayStr);
    setStep(4);
  };

  const handleSliderChange = (phaseId: string, val: number) => {
    setLocalPhases(localPhases.map(p => p.id === phaseId ? { ...p, allocatedBudget: val } : p));
  };

  const handleDeleteLocalPhase = (phaseId: string) => {
    setLocalPhases(localPhases.filter(p => p.id !== phaseId));
  };

  const handleAddLocalPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhaseName.trim()) return;

    const newId = `custom_${Date.now()}`;
    const newPhase = {
      id: newId,
      name: customPhaseName.trim(),
      description: customPhaseDesc.trim() || (language === 'ar' ? 'مرحلة مخصصة مضافة من قبل المستخدم' : 'User-created custom milestone phase'),
      allocatedBudget: Number(customPhaseBudget) || 0,
      targetDate: customPhaseDate || todayStr
    };

    setLocalPhases([...localPhases, newPhase]);
    setCustomPhaseName('');
    setCustomPhaseDesc('');
    setCustomPhaseBudget(0);
    setCustomPhaseDate(todayStr);
    setShowAddPhaseForm(false);
  };

  const handleAutoBalance = () => {
    const totalAllocated = localPhases.reduce((sum, p) => sum + p.allocatedBudget, 0);
    if (totalAllocated === 0) {
      const equalShare = Math.round(budgetLimit / localPhases.length);
      const balanced = localPhases.map((p, idx) => ({
        ...p,
        allocatedBudget: idx === localPhases.length - 1 ? budgetLimit - (equalShare * (localPhases.length - 1)) : equalShare
      }));
      setLocalPhases(balanced);
      return;
    }
    
    let runningSum = 0;
    const balanced = localPhases.map((p, idx) => {
      if (idx === localPhases.length - 1) {
        return {
          ...p,
          allocatedBudget: Math.max(0, budgetLimit - runningSum)
        };
      }
      const share = Math.round((p.allocatedBudget / totalAllocated) * budgetLimit);
      runningSum += share;
      return {
        ...p,
        allocatedBudget: share
      };
    });
    
    setLocalPhases(balanced);
  };

  const handleFinalSubmit = () => {
    if (localPhases.length === 0) {
      setValidationError(language === 'ar' ? '⚠️ يرجى إضافة مرحلة واحدة على الأقل لبناء مسارك!' : '⚠️ Please add at least one phase to build your path!');
      return;
    }

    const totalAllocated = localPhases.reduce((sum, p) => sum + p.allocatedBudget, 0);

    onComplete({
      userName: userName.trim(),
      partnerName: partnerName.trim(),
      budgetLimit: totalAllocated, // scale total wedding budget to match final sliders sum
      weddingDate,
      avatarId,
      isOnboarded: true,
      activePhaseId: localPhases[0]?.id || 'shofa',
      phases: localPhases,
      language
    });
  };

  const allocatedSum = localPhases.reduce((sum, p) => sum + p.allocatedBudget, 0);
  const remaining = budgetLimit - allocatedSum;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background flex flex-col justify-between overflow-y-auto px-6 py-8 turtle-shell-pattern"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Upper header */}
      <div className="flex justify-center mt-2">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-outline-variant/30 flex items-center justify-center p-2.5">
          <img
            alt="Simsim Mascot"
            className="w-full h-full object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW2BGQvlV34vo5wbg_C95TOMe9fwwPc7wv13SGSSnwFyNFMi_BrKwQoDPKthdBxsU4Z42txmWVMhYm9cnHa-C8H_-C28TdlRxiIBcPuYRzBSX7wD5O6Fe5EvLkY_ArIF2rv0qDVgL37zgd5irwxzx5AU8Q-XsIpUG1oiqzbzgd25wUvVCP9rpR6uRIzvt3A9Qt4fVQH5mbSQoCB1YsV45WcH0V6bzagZ-puw4I4S-T1G3XfuwVFWdh5blYkogwFjUShvCFySFs3eiJ"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Main onboarding card */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-6 pt-4">
        
        {/* Step Indicator Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
            <span>
              {step === 4 
                ? (language === 'ar' ? 'الخطوة 4 من 4' : 'Step 4 of 4')
                : t('stepIndicator', language).replace('{step}', String(step)).replace('{total}', '4')}
            </span>
          </div>
          
          <h1 className="font-plus text-2xl font-black text-[#1a1915] tracking-tight">
            {step === 1 
              ? t('chooseLanguage', language) 
              : step === 2 
              ? t('meetCompanion', language) 
              : step === 3 
              ? t('weddingTimeline', language)
              : (language === 'ar' ? 'ميزانية المراحل وتخصيصها' : 'Phase Budgets & Sliders')}
          </h1>
          <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
            {step === 1 
              ? "Select your preferred language. You can also adjust this later in settings."
              : step === 2
              ? t('onboardingDescStep1', language)
              : step === 3
              ? t('onboardingDescStep2', language)
              : (language === 'ar' ? 'قم بتخصيص ميزانية كل مرحلة وإضافة أو حذف المراحل حسب احتياجكم.' : 'Customize allocations using the sliders, and add or delete stages to match your plan.')}
          </p>
        </div>

        {/* Mascot Speech Intro */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-primary/20 shadow-sm relative text-center">
          <div className="text-xs font-semibold text-primary/90 leading-normal">
            {step === 1 
              ? "Ahlan! Choose English or Arabic to start preparing your journey. 🌐🐢"
              : step === 2 
              ? t('companionSpeechStep1', language) 
              : step === 3
              ? t('companionSpeechStep2', language)
              : (language === 'ar' ? 'دعنا نقسم الميزانية بين المحطات بالتمرير، وتخصيص مسار زفافكم الفريد! 🐢🌱' : 'Let\'s divide the budget across stops, and build your custom wedding roadmap! 🐢🌱')}
          </div>
        </div>

        {step <= 3 ? (
          <form onSubmit={step === 3 ? handleStep3Submit : (e) => { e.preventDefault(); handleNextStep(); }} className="bg-white rounded-2xl border border-outline-variant/40 p-5 shadow-lg space-y-4">
            
            {validationError && (
              <div className="p-3 bg-error/10 text-error font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {step === 1 ? (
              /* STEP 1: LANGUAGE SELECTION */
              <div className="space-y-4 animate-in fade-in duration-250">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      language === 'en'
                        ? 'border-primary bg-primary/5 scale-102 shadow-[0_4px_12px_rgba(0,110,28,0.12)]'
                        : 'border-outline-variant/40 bg-surface/30 hover:border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-sm font-black text-on-surface">English</span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5">Default language</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      language === 'ar'
                        ? 'border-primary bg-primary/5 scale-102 shadow-[0_4px_12px_rgba(0,110,28,0.12)]'
                        : 'border-outline-variant/40 bg-surface/30 hover:border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-sm font-black text-on-surface">العربية</span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5">اللغة العربية</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-95 active:scale-98 transition-all tracking-tight mt-2 text-sm cursor-pointer"
                >
                  {t('continueSetup', language)} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : step === 2 ? (
              /* STEP 2: PARTNERSHIP PROFILE */
              <div className="space-y-4 animate-in fade-in duration-250">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-extrabold text-on-surface-variant tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-primary" /> {t('yourName', language)}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if(validationError) setValidationError('');
                    }}
                    placeholder={t('placeholderYourName', language)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-bold text-on-surface"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-extrabold text-on-surface-variant tracking-wider flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-error fill-error/10" /> {t('partnerName', language)}
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => {
                      setPartnerName(e.target.value);
                      if(validationError) setValidationError('');
                    }}
                    placeholder={t('placeholderPartnerName', language)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-bold text-on-surface"
                    required
                  />
                </div>

                {/* CHOOSE COMPANION SHELL AVATAR */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                  <label className="text-xs uppercase font-extrabold text-on-surface-variant tracking-wider block">
                    {t('chooseCompanion', language)}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['green', 'red', 'blue'] as const).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setAvatarId(id)}
                        className={`relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          avatarId === id 
                            ? 'border-primary bg-primary/5 scale-102 shadow-[0_4px_12px_rgba(0,110,28,0.12)]' 
                            : 'border-outline-variant/40 bg-surface/30 hover:border-outline-variant hover:bg-surface-container-low'
                        }`}
                      >
                        <AvatarImage avatarId={id} className="w-12 h-12" />
                        <span className="text-[10px] uppercase font-bold mt-1 text-on-surface-variant">
                          {id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-surface-container-high text-on-surface-variant font-bold py-3 px-4 rounded-xl text-center text-xs tracking-tight"
                  >
                    {t('back', language)}
                  </button>
                  <button
                    type="submit"
                    className="flex-3 bg-primary text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 hover:bg-opacity-95 active:scale-98 transition-all tracking-tight text-xs cursor-pointer"
                  >
                    {t('continueSetup', language)} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 3: FINANCES AND DATES */
              <div className="space-y-4 animate-in fade-in duration-250">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-extrabold text-on-surface-variant tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-primary" /> {t('budgetLimitSar', language)}
                  </label>
                  <input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => {
                      setBudgetLimit(Number(e.target.value));
                      if(validationError) setValidationError('');
                    }}
                    placeholder="300000"
                    className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-bold text-on-surface"
                    min="1000"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-extrabold text-on-surface-variant tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {t('weddingDateProj', language)}
                  </label>
                  <input
                    type="date"
                    value={weddingDate}
                    min={todayStr}
                    onChange={(e) => {
                      setWeddingDate(e.target.value);
                      if(validationError) setValidationError('');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-bold text-on-surface"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-surface-container-high text-on-surface-variant font-bold py-3 px-4 rounded-xl text-center text-xs tracking-tight animate-pulse"
                  >
                    {t('back', language)}
                  </button>
                  <button
                    type="submit"
                    className="flex-3 bg-primary text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 hover:bg-opacity-95 active:scale-98 transition-all tracking-tight text-xs cursor-pointer"
                  >
                    {t('continueSetup', language)} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </form>
        ) : (
          /* STEP 4: INTERACTIVE BUDGET SLIDERS & CUSTOM PHASES */
          <div className="bg-white rounded-2xl border border-outline-variant/40 p-5 shadow-lg space-y-4 animate-in fade-in duration-250">
            
            {validationError && (
              <div className="p-3 bg-error/10 text-error font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Allocated budget status bar */}
            <div className="space-y-2 pb-3 border-b border-outline-variant/20">
              <div className="flex justify-between text-xs font-black text-on-surface-variant">
                <span>{language === 'ar' ? 'الميزانية الموزعة:' : 'Allocated Budget:'}</span>
                <span className="font-mono">{allocatedSum.toLocaleString()} / {budgetLimit.toLocaleString()} SAR</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    remaining === 0 ? 'bg-primary' : remaining < 0 ? 'bg-error' : 'bg-[#b18129]'
                  }`}
                  style={{ width: `${Math.min(100, (allocatedSum / budgetLimit) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold mt-1">
                <span className={remaining === 0 ? 'text-primary' : remaining < 0 ? 'text-error' : 'text-[#b18129]'}>
                  {remaining === 0 
                    ? (language === 'ar' ? '💍 الميزانية موزعة بالكامل!' : '💍 Perfect allocation match!')
                    : remaining < 0 
                    ? (language === 'ar' ? `⚠️ زيادة بـ: ${Math.abs(remaining).toLocaleString()} ر.س` : `⚠️ Over budget by: ${Math.abs(remaining).toLocaleString()} SAR`)
                    : (language === 'ar' ? `⏳ متبقي غير موزع: ${remaining.toLocaleString()} ر.س` : `⏳ Unallocated remaining: ${remaining.toLocaleString()} SAR`)}
                </span>
                
                {remaining !== 0 && (
                  <button
                    type="button"
                    onClick={handleAutoBalance}
                    className="text-[9px] font-black uppercase text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'تعديل ذكي' : 'Auto Adjust'}
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable list of phases */}
            <div className="space-y-3 max-h-[25vh] overflow-y-auto pr-1 scrollbar-none">
              {localPhases.map((phase) => (
                <div key={phase.id} className="p-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-xl space-y-2 relative">
                  
                  {/* Phase header details */}
                  <div className="flex justify-between items-start pr-8 pl-1">
                    <div>
                      <h4 className="text-xs font-black text-on-surface">{phase.name}</h4>
                      <p className="text-[9px] text-on-surface-variant/80 font-normal leading-tight line-clamp-1 mt-0.5">{phase.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-primary block">{phase.allocatedBudget.toLocaleString()} SAR</span>
                      <span className="text-[8px] text-on-surface-variant/50 font-mono mt-0.5 block">{phase.targetDate}</span>
                    </div>
                  </div>

                  {/* Range input slider */}
                  <input
                    type="range"
                    min="0"
                    max={budgetLimit}
                    step="500"
                    value={phase.allocatedBudget}
                    onChange={(e) => handleSliderChange(phase.id, Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
                  />

                  {/* Trash delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteLocalPhase(phase.id)}
                    className="absolute top-2 right-2 text-on-surface-variant/60 hover:text-error p-1 rounded-md hover:bg-error/5 transition-colors cursor-pointer"
                    title={language === 'ar' ? 'حذف المرحلة' : 'Delete Phase'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {localPhases.length === 0 && (
                <div className="text-center py-6 text-xs text-on-surface-variant/50 italic">
                  {language === 'ar' ? 'لا توجد مراحل حالياً. أضف مرحلة جديدة بالأسفل!' : 'No phases added. Create a custom phase below!'}
                </div>
              )}
            </div>

            {/* Add custom phase form */}
            <div className="pt-2 border-t border-outline-variant/20">
              {!showAddPhaseForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddPhaseForm(true)}
                  className="w-full py-2 bg-surface-container-high text-on-surface text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 hover:brightness-95 active:scale-98 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> {language === 'ar' ? 'إضافة مرحلة مخصصة' : 'Add Custom Phase'}
                </button>
              ) : (
                <div className="p-3.5 border border-primary/20 bg-primary/3 rounded-xl space-y-3 animate-fade-in">
                  <p className="text-[9px] font-black uppercase text-primary tracking-wider">
                    {language === 'ar' ? 'تفاصيل المرحلة الجديدة' : 'New Phase Details'}
                  </p>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="space-y-0.5">
                      <label className="text-[9px] uppercase font-bold text-on-surface-variant">{language === 'ar' ? 'اسم المرحلة' : 'Phase Name'}</label>
                      <input
                        type="text"
                        value={customPhaseName}
                        onChange={(e) => setCustomPhaseName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: حفلة الحناء' : 'Henna Party'}
                        className="w-full bg-white border border-outline-variant/40 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary font-bold text-on-surface"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] uppercase font-bold text-on-surface-variant">{language === 'ar' ? 'وصف المرحلة' : 'Description'}</label>
                      <input
                        type="text"
                        value={customPhaseDesc}
                        onChange={(e) => setCustomPhaseDesc(e.target.value)}
                        placeholder={language === 'ar' ? 'وصف قصير لهذه المرحلة' : 'Short description'}
                        className="w-full bg-white border border-outline-variant/40 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary font-bold text-on-surface"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant">{language === 'ar' ? 'الميزانية (ر.س)' : 'Budget (SAR)'}</label>
                        <input
                          type="number"
                          value={customPhaseBudget}
                          onChange={(e) => setCustomPhaseBudget(Number(e.target.value))}
                          className="w-full bg-white border border-outline-variant/40 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary font-bold text-on-surface"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant">{language === 'ar' ? 'التاريخ المستهدف' : 'Target Date'}</label>
                        <input
                          type="date"
                          value={customPhaseDate}
                          min={todayStr}
                          onChange={(e) => setCustomPhaseDate(e.target.value)}
                          className="w-full bg-white border border-outline-variant/40 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary font-mono font-bold text-on-surface"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddLocalPhase}
                      className="flex-1 bg-primary text-white text-[10px] font-black uppercase py-2 rounded-lg hover:brightness-95 transition-all cursor-pointer"
                    >
                      {language === 'ar' ? 'حفظ المرحلة' : 'Add Phase'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPhaseForm(false)}
                      className="px-3 bg-surface-container-highest text-on-surface text-[10px] font-black uppercase py-2 rounded-lg hover:brightness-95 cursor-pointer"
                    >
                      {t('cancel', language)}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step actions */}
            <div className="flex gap-2 pt-2 border-t border-outline-variant/15">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 bg-surface-container-high text-on-surface-variant font-bold py-3 px-4 rounded-xl text-center text-xs tracking-tight"
              >
                {t('back', language)}
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-3 bg-primary text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 hover:bg-opacity-95 active:scale-98 transition-all tracking-tight text-xs cursor-pointer shadow-md shadow-primary/10"
              >
                {language === 'ar' ? 'أنشئ مسار رحلتنا' : 'Build My Path'} <Sparkles className="w-3.5 h-3.5 fill-white/10" />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Botanic capsule footer ornament */}
      <div className="text-center mt-4">
        <div className="leaf-divider opacity-50 scale-95" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant opacity-60 mt-2">
          {t('footerOrnament', language)}
        </p>
      </div>
    </div>
  );
}

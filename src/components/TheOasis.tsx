import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  PiggyBank, 
  Calendar, 
  Check, 
  ChevronRight,
  HelpCircle,
  Clock,
  Unlock,
  Coins,
  Compass,
  Sparkles
} from 'lucide-react';
import { Expense, Milestone, WeddingSettings } from '../types';
import AvatarImage from './AvatarImage';
import PhaseDetailScreen from './PhaseDetailScreen';
import CountdownTimeline from './CountdownTimeline';
import { t, translatePhaseName, translatePhaseDesc } from '../lib/translations';

interface TheOasisProps {
  expenses: Expense[];
  milestones: Milestone[];
  settings: WeddingSettings;
  onOpenAddExpense: () => void;
  setTab: (tab: string) => void;
  onUpdateSettings: (settings: WeddingSettings) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onUpdateMilestone: (updated: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  onDeletePhase: (id: string) => void;
}

// Logical suggestions sequence
const SUGGESTIONS = [
  { id: 'khutba', name: 'Khutba', description: 'Engagement, proposal meetings, and personal wardrobe' },
  { id: 'melka', name: 'Melka', description: 'Dowry (Mahr) delivery, Shabka jewelry purchase, and official license' },
  { id: 'wedding', name: 'The Wedding', description: 'Celebratory hall, photography, catering, and evening guest feast' },
  { id: 'honeymoon', name: 'Honeymoon', description: 'Flights, hotel bookings, and post-ceremony travels' },
  { id: 'house', name: 'The House', description: 'Appliances, living room layout, and essential home furnishing' },
];

export default function TheOasis({ 
  expenses, 
  milestones, 
  settings, 
  onOpenAddExpense,
  setTab,
  onUpdateSettings,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  onDeleteExpense,
  onDeletePhase
}: TheOasisProps) {
  
  // Local state to track which phase detail screen is modal-open (null if closed)
  const [selectedPhaseDetailId, setSelectedPhaseDetailId] = useState<string | null>(null);

  // Local state for inline budget adjustment
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState<string>(settings.budgetLimit.toString());

  useEffect(() => {
    setBudgetInput(settings.budgetLimit.toString());
  }, [settings.budgetLimit]);

  const handleSaveBudget = () => {
    const newBudget = Number(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      onUpdateSettings({
        ...settings,
        budgetLimit: newBudget
      });
      setIsEditingBudget(false);
    }
  };

  // Local state for dynamic roadmap construction modal
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseBudget, setNewPhaseBudget] = useState<number | ''>(10000);
  const [newPhasePercent, setNewPhasePercent] = useState<number | ''>(10);
  const [newPhaseDate, setNewPhaseDate] = useState<string>('');

  const handleBudgetChange = (valStr: string) => {
    if (valStr === '') {
      setNewPhaseBudget('');
      setNewPhasePercent('');
      return;
    }
    const val = Number(valStr);
    setNewPhaseBudget(val);
    if (settings.budgetLimit > 0) {
      const pct = Number(((val / settings.budgetLimit) * 100).toFixed(1));
      setNewPhasePercent(pct);
    } else {
      setNewPhasePercent(0);
    }
  };

  const handlePercentChange = (valStr: string) => {
    if (valStr === '') {
      setNewPhasePercent('');
      setNewPhaseBudget('');
      return;
    }
    const val = Number(valStr);
    setNewPhasePercent(val);
    if (settings.budgetLimit > 0) {
      const bgt = Math.round((val / 100) * settings.budgetLimit);
      setNewPhaseBudget(bgt);
    } else {
      setNewPhaseBudget(0);
    }
  };

  const lang = settings.language || 'en';

  // Normalize current dynamic phases list
  const currentPhases = settings.phases && settings.phases.length > 0
    ? settings.phases
    : [
        { 
          id: 'shofa', 
          name: lang === 'ar' ? 'الشوفة الشرعية' : 'Shofa', 
          description: lang === 'ar' 
            ? 'تأسيس رحلتكم: الرؤية، قائمة الضيوف الأولية، وتقدير الميزانية الأساسية' 
            : 'The foundation of your journey: vision, guests, and initial budgeting' 
        }
      ];

  const maxSegment = Math.min(20, currentPhases.length + (currentPhases.length < 20 ? 1 : 0));
  const dynamicHeight = maxSegment * 100;

  // Generate coordinate slots dynamically to support up to 20 nodes with scrollable spacing
  const roadSlots = Array.from({ length: maxSegment + 1 }, (_, i) => {
    let x = 200;
    if (i % 4 === 1) x = 70;
    else if (i % 4 === 3) x = 330;

    let labelPos: 'left' | 'right' = 'left';
    if (i % 4 === 1) labelPos = 'right';

    const y = dynamicHeight - (i * 100) - 50;

    return { x, y, labelPos };
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);



  // Map each phase to its slot coordinate
  const phaseNodes = currentPhases.map((phase, idx) => {
    const slot = roadSlots[Math.min(idx, roadSlots.length - 1)];
    return {
      id: phase.id,
      name: translatePhaseName(phase.id, phase.name, lang),
      description: translatePhaseDesc(phase.id, phase.description, lang),
      x: slot.x,
      y: slot.y,
      labelPos: slot.labelPos,
      num: idx + 1,
      targetDate: phase.targetDate
    };
  });

  // Dynamic Date-based Active Phase Indexing
  const today = new Date();
  const weddingDate = new Date(settings.weddingDate);

  const getPhaseTargetDate = (phase: any, index: number): Date => {
    if (phase.targetDate) {
      return new Date(phase.targetDate);
    }
    const totalPhases = currentPhases.length;
    const now = new Date();
    const weddingTime = weddingDate.getTime();
    const nowTime = now.getTime();
    
    const weddingIndex = currentPhases.findIndex(p => p.id === 'wedding') !== -1 
      ? currentPhases.findIndex(p => p.id === 'wedding') 
      : Math.min(3, totalPhases - 1);

    if (index < weddingIndex) {
      const share = (index + 1) / (weddingIndex || 1);
      const totalDays = Math.max(0, (weddingTime - nowTime) / (1000 * 60 * 60 * 24));
      const daysToPhase = Math.round(totalDays * share);
      return new Date(nowTime + daysToPhase * 24 * 60 * 60 * 1000);
    } else if (index === weddingIndex) {
      return weddingDate;
    } else {
      const offsetMultiplier = index - weddingIndex;
      return new Date(weddingTime + (offsetMultiplier * 14) * 24 * 60 * 60 * 1000);
    }
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const targetDates = currentPhases.map((phase, idx) => getPhaseTargetDate(phase, idx));

  let computedActiveIndex = currentPhases.findIndex((_, idx) => {
    const tDate = targetDates[idx];
    const compDate = new Date(tDate);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() >= todayStart.getTime();
  });

  if (computedActiveIndex === -1) {
    computedActiveIndex = currentPhases.length - 1;
  }

  const activeIndex = computedActiveIndex;

  // Dynamic calculations based on Completed and Planned milestone goals
  const completedSpent = expenses.reduce((sum, e) => sum + e.amount, 0); // actual spent
  const totalPlanned = milestones.reduce((sum, m) => sum + m.targetAmount, 0); // total planned target
  const budgetLimit = settings.budgetLimit;

  const completedPercent = budgetLimit > 0 ? Math.min(100, Math.round((completedSpent / budgetLimit) * 100)) : 0;
  const plannedPercent = budgetLimit > 0 ? Math.min(100, Math.round((totalPlanned / budgetLimit) * 100)) : 0;
  
  const diffTime = weddingDate.getTime() - today.getTime();
  const daysToGo = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Mascot dynamic quote
  let simsimQuote = lang === 'ar' ? "أهلاً بك في المسار! دعنا نختار أحد أهداف التخطيط. 🐢" : "Welcome to the path! Let's choose a milestone. 🐢";
  const activePhase = currentPhases[activeIndex] || currentPhases[0];
  if (activePhase) {
    const translatedName = translatePhaseName(activePhase.id, activePhase.name, lang);
    simsimQuote = lang === 'ar' ? `مرحلة ${translatedName}: دعنا نتابع أهدافنا! 💍🐢` : `${translatedName} Stage: Let's track our targets! 💍🐢`;
  }
  // Auto-scroll active phase into view
  useEffect(() => {
    const activeCardEl = document.getElementById(`timeline-card-${activePhase?.id}`);
    if (activeCardEl) {
      activeCardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeIndex, activePhase?.id]);
  // Find node coordinate for active Simsim mascot positioning
  const activeNode = phaseNodes[activeIndex] || phaseNodes[0];

  const handleSetAsActivePhase = (phaseId: string) => {
    onUpdateSettings({
      ...settings,
      activePhaseId: phaseId
    });
  };

  const handleUpdatePhaseDetails = (
    phaseId: string, 
    name: string, 
    description: string, 
    allocatedBudget?: number,
    targetDate?: string
  ) => {
    const updatedPhases = currentPhases.map(p => 
      p.id === phaseId 
        ? { 
            ...p, 
            name, 
            description, 
            ...(allocatedBudget !== undefined ? { allocatedBudget } : {}),
            ...(targetDate !== undefined ? { targetDate } : {})
          } 
        : p
    );
    onUpdateSettings({
      ...settings,
      phases: updatedPhases
    });
  };

  // SVG dynamic path constructor
  const getPathString = (numPhases: number, includeNext: boolean = false) => {
    const limit = Math.min(20, numPhases + (includeNext ? 1 : 0));
    if (limit === 0) return "";
    
    const startSlot = roadSlots[0];
    let pathStr = `M 200 ${startSlot.y + 30} L 200 ${startSlot.y}`;
    
    for (let i = 1; i < limit; i++) {
      const prev = roadSlots[i - 1];
      const curr = roadSlots[i];
      pathStr += ` C ${prev.x} ${prev.y - 40}, ${curr.x} ${curr.y + 40}, ${curr.x} ${curr.y}`;
    }
    return pathStr;
  };

  const handleOpenAddPhase = () => {
    const rawSuggested = SUGGESTIONS[currentPhases.length - 1];
    let nextSuggestedName = rawSuggested?.name || `Phase ${currentPhases.length + 1}`;
    if (lang === 'ar' && rawSuggested) {
      nextSuggestedName = translatePhaseName(rawSuggested.id, rawSuggested.name, 'ar');
    }
    setNewPhaseName(nextSuggestedName);
    
    const defaultPercent = 10;
    const defaultBudget = settings.budgetLimit > 0 ? Math.round((settings.budgetLimit * defaultPercent) / 100) : 10000;
    setNewPhaseBudget(defaultBudget);
    setNewPhasePercent(defaultPercent);
    setNewPhaseDate(settings.weddingDate || '');
    setIsAddPhaseOpen(true);
  };

  const handleConfirmAddPhase = () => {
    const rawSuggested = SUGGESTIONS[currentPhases.length - 1];
    let nextSuggestedName = rawSuggested?.name || `Phase ${currentPhases.length + 1}`;
    let nextSuggestedDesc = rawSuggested?.description || 'Plan custom goals and budgets for this phase';
    
    if (lang === 'ar' && rawSuggested) {
      nextSuggestedName = translatePhaseName(rawSuggested.id, rawSuggested.name, 'ar');
      nextSuggestedDesc = translatePhaseDesc(rawSuggested.id, rawSuggested.description, 'ar');
    }
    
    const finalId = rawSuggested?.id || `phase_${Date.now()}`;
    const budgetVal = newPhaseBudget === '' ? 0 : Number(newPhaseBudget);
    
    const finalPhase = {
      id: finalId,
      name: newPhaseName.trim() || nextSuggestedName,
      description: lang === 'ar'
        ? `الميزانية المستهدفة: ${budgetVal.toLocaleString()} ر.س (${newPhasePercent}% من الإجمالي) - ${nextSuggestedDesc}`
        : `Target Budget: ${budgetVal.toLocaleString()} SAR (${newPhasePercent}% of total) - ${nextSuggestedDesc}`,
      allocatedBudget: budgetVal,
      targetDate: newPhaseDate || settings.weddingDate
    };

    const updatedPhases = [...currentPhases, finalPhase];
    onUpdateSettings({
      ...settings,
      phases: updatedPhases,
      activePhaseId: settings.activePhaseId
    });

    setIsAddPhaseOpen(false);
  };

  return (
    <div className="relative z-10 pb-28" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Shell Texture Layer */}
      <div className="fixed inset-0 pointer-events-none turtle-shell-pattern z-0 opacity-60" />

      {/* Quest Map Section */}
      <section className="mb-10 relative z-10 flex flex-col items-center w-full">
        <div className="text-center mb-4">
          <h2 className="font-plus text-2xl font-black text-on-surface">
            {lang === 'ar' ? 'مسار الزفاف' : 'The Wedding Roadmap'}
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {lang === 'ar' ? 'انقر على أي محطة بالأسفل لمراجعة تفاصيل أهداف التخطيط' : 'Click a stop below to details-audit milestones'}
          </p>
        </div>

        {/* Interactive Total Wedding Budget Widget Card */}
        <div className="w-full max-w-sm bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/45 rounded-3xl p-5 mb-4 shadow-sm transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-6 translate-x-6 shrink-0 pointer-events-none" />
          
          {!isEditingBudget ? (
            <div 
              onClick={() => {
                setBudgetInput(settings.budgetLimit.toString());
                setIsEditingBudget(true);
              }}
              className="cursor-pointer group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#b18129] block">
                  💍 {lang === 'ar' ? 'الميزانية الإجمالية للزواج' : 'TOTAL WEDDING BUDGET'}
                </span>
                <span className="font-plus text-2xl font-black text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {settings.budgetLimit.toLocaleString()} <span className="text-sm font-bold text-on-surface-variant/70">{t('sar', lang)}</span>
                </span>
                <span className="text-[10px] text-on-surface-variant/50 font-medium block">
                  {lang === 'ar' ? 'انقر لتعديل ميزانية الزفاف الإجمالية' : 'Click to adjust total wedding fund limit'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                <PiggyBank className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#b18129] block">
                {lang === 'ar' ? 'تعديل ميزانية الزواج الإجمالية' : 'Adjust Wedding Budget Limit'}
              </span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveBudget();
                      if (e.key === 'Escape') setIsEditingBudget(false);
                    }}
                    autoFocus
                    className="w-full bg-white border border-primary/20 rounded-xl pl-4 pr-12 py-2.5 text-base font-black text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                    placeholder={lang === 'ar' ? 'أدخل الحد الأقصى للميزانية' : 'Enter budget limit'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-extrabold uppercase text-on-surface-variant/70">
                    {t('sar', lang)}
                  </span>
                </div>
                <button
                  onClick={handleSaveBudget}
                  className="bg-primary hover:bg-[#005214] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm shrink-0 flex items-center justify-center"
                >
                  {t('save', lang)}
                </button>
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="bg-outline-variant/20 hover:bg-outline-variant/30 text-on-surface-variant px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
                >
                  {t('cancel', lang)}
                </button>
              </div>
              <p className="text-[10px] text-on-surface-variant/60 font-medium leading-tight">
                {lang === 'ar' ? 'اضغط Enter للحفظ، Esc للإلغاء.' : 'Press Enter to save, Esc to cancel.'}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Budget Progress Bars Integrated Seamlessly */}
        <div className="w-full max-w-sm bg-white/60 backdrop-blur-sm border border-primary/10 rounded-2xl p-4 mb-5 shadow-sm space-y-3">
          {/* Planned Progress */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-[#b18129]">
              <span className="flex items-center gap-1 font-plus">⏳ {lang === 'ar' ? 'الميزانية المخططة' : 'Planned Budget'}</span>
              <span className="font-mono font-bold text-xs">{totalPlanned.toLocaleString()} {t('sar', lang)} ({plannedPercent}%)</span>
            </div>
            <div className="relative w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-[#b18129] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(177,129,41,0.25)]" 
                style={{ width: `${plannedPercent}%` }}
              />
            </div>
          </div>

          {/* Payed Amount Progress */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-primary">
              <span className="flex items-center gap-1 font-plus">💍 {lang === 'ar' ? 'المبالغ المدفوعة' : 'Payed Amount'}</span>
              <span className="font-mono font-bold text-xs">{completedSpent.toLocaleString()} {t('sar', lang)} ({completedPercent}%)</span>
            </div>
            <div className="relative w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,110,28,0.25)]" 
                style={{ width: `${completedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Countdown & Compact Phase Timeline */}
        <CountdownTimeline
          settings={settings}
          milestones={milestones}
          currentPhases={currentPhases}
          onSelectPhase={(phaseId) => setSelectedPhaseDetailId(phaseId)}
        />

        {/* Scrollable Container Wrapper with beautiful Off-white Canvas background and botanical hints */}
        <div 
          ref={scrollContainerRef}
          className="w-full max-w-sm h-[580px] max-h-[620px] overflow-y-auto pr-1 border border-primary/15 rounded-3xl bg-[#FAF9F5] relative shadow-inner p-4 scroll-smooth scrollbar-none"
        >
          {/* Subtle background botanical vector ornaments to feel artistic */}
          <div className="absolute top-4 left-4 opacity-[0.03] text-primary pointer-events-none select-none">
            <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,20 4,21 3,21C3,21 6.5,15.5 13.5,9C16.5,6.2 19,4 21,3C21,3 20.2,5.2 17,8M12.2,11.3C7.5,16.5 5.5,17 5,17C5,17 7.2,13 10.8,9.5C12.3,8.1 13.7,7 14.7,6.3C14.7,6.3 14.1,8.3 12.2,11.3M8.8,14C5.8,17 4.8,17.2 4.5,17.2C4.5,17.2 6,14.5 8.2,12.2C9,11.4 9.8,10.7 10.3,10.3C10.3,10.3 10.1,11.8 8.8,14Z" />
            </svg>
          </div>
          <div className="absolute bottom-4 right-4 opacity-[0.03] text-primary pointer-events-none select-none">
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,20 4,21 3,21C3,21 6.5,15.5 13.5,9C16.5,6.2 19,4 21,3C21,3 20.2,5.2 17,8M12.2,11.3C7.5,16.5 5.5,17 5,17C5,17 7.2,13 10.8,9.5C12.3,8.1 13.7,7 14.7,6.3C14.7,6.3 14.1,8.3 12.2,11.3M8.8,14C5.8,17 4.8,17.2 4.5,17.2C4.5,17.2 6,14.5 8.2,12.2C9,11.4 9.8,10.7 10.3,10.3C10.3,10.3 10.1,11.8 8.8,14Z" transform="scale(-1, 1) translate(-24, 0)" />
            </svg>
          </div>

          {/* New Scrapbook Timeline Layout */}
          <div className="relative w-full py-4 select-none shrink-0 z-10">
            
            {/* Center vine stem line running top-to-bottom */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-[#b18129] via-[#006e1c] to-[#b18129]/30"
              style={{ zIndex: 1 }}
            />

            <div className="space-y-6 relative">
              {currentPhases.map((phase, idx) => {
                const isCompleted = idx < activeIndex;
                const isActive = idx === activeIndex;
                const isFuture = idx > activeIndex;

                // Spent calculations
                const phaseExpenses = expenses.filter(e => e.phaseId === phase.id);
                const spent = phaseExpenses.reduce((sum, e) => sum + e.amount, 0);
                const budget = phase.allocatedBudget;
                const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

                const name = translatePhaseName(phase.id, phase.name, lang);
                const isLeft = idx % 2 === 0;

                // Click node navigator
                const handleNodeClick = () => {
                  setSelectedPhaseDetailId(phase.id);
                };

                return (
                  <div 
                    key={phase.id} 
                    id={`timeline-card-${phase.id}`}
                    className="relative flex items-center justify-between w-full min-h-[90px] z-10 animate-fade-in"
                  >
                    {/* Left Hand Card Column */}
                    <div className="w-[44%] flex justify-end">
                      {isLeft && (
                        <div 
                          onClick={handleNodeClick}
                          className={`w-full p-3.5 rounded-2xl border transition-all duration-300 hover:scale-103 active:scale-98 cursor-pointer relative shadow-sm hover:shadow-md ${
                            isCompleted 
                              ? 'bg-primary/5 text-primary border-primary/20 border-r-4 border-r-primary'
                              : isActive
                                ? 'bg-gradient-to-br from-primary to-[#004e13] text-white border-primary shadow-lg shadow-primary/20 border-r-4 border-r-amber-400'
                                : 'bg-white text-on-surface-variant border-outline-variant/30 border-r-4 border-r-outline-variant'
                          }`}
                        >
                          <h3 className={`text-xs font-black tracking-tight ${isActive ? 'text-white' : 'text-on-surface'}`}>{name}</h3>
                          
                          <span className={`text-[8.5px] font-mono font-black mt-1 px-2 py-0.5 rounded-full inline-block ${
                            isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                          }`}>
                            📅 {phase.targetDate}
                          </span>
                          
                          {/* Mini Progress */}
                          <div className="mt-2.5 space-y-1">
                            <div className="flex justify-between text-[7px] font-black uppercase opacity-85">
                              <span>{lang === 'ar' ? 'المنفق:' : 'Spent:'}</span>
                              <span className="font-mono">{spent.toLocaleString()} / {budget.toLocaleString()} SAR</span>
                            </div>
                            <div className={`w-full h-1 rounded-full overflow-hidden ${isActive ? 'bg-white/25' : 'bg-surface-container'}`}>
                              <div 
                                className={`h-full rounded-full ${isActive ? 'bg-white' : 'bg-primary'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Center Node Column */}
                    <div className="w-[10%] flex justify-center relative">
                      <div 
                        onClick={handleNodeClick}
                        className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all duration-300 z-10 cursor-pointer shadow-md ${
                          isCompleted 
                            ? 'bg-primary border-2 border-amber-500/25 text-white hover:scale-110 shadow-primary/10'
                            : isActive
                              ? 'bg-gradient-to-tr from-primary to-[#005e16] text-white scale-110 border-2 border-white ring-4 ring-primary/35 shadow-lg shadow-primary/30'
                              : 'bg-white border-2 border-dashed border-outline-variant text-on-surface-variant/60 hover:bg-surface-container-low hover:scale-110'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                        ) : (
                          <span className="text-xs font-black">{idx + 1}</span>
                        )}
                      </div>

                      {/* Companion mascot floating on top of the active center node */}
                      {isActive && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-14 h-14">
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-amber-400 opacity-20 blur-lg rounded-full scale-100 animate-pulse" />
                          <AvatarImage 
                            avatarId={settings.avatarId || 'green'} 
                            className="w-full h-full object-contain drop-shadow-xl animate-bounce-slow" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Hand Card Column */}
                    <div className="w-[44%] flex justify-start">
                      {!isLeft && (
                        <div 
                          onClick={handleNodeClick}
                          className={`w-full p-3.5 rounded-2xl border transition-all duration-300 hover:scale-103 active:scale-98 cursor-pointer relative shadow-sm hover:shadow-md ${
                            isCompleted 
                              ? 'bg-primary/5 text-primary border-primary/20 border-l-4 border-l-primary'
                              : isActive
                                ? 'bg-gradient-to-br from-primary to-[#004e13] text-white border-primary shadow-lg shadow-primary/20 border-l-4 border-l-amber-400'
                                : 'bg-white text-on-surface-variant border-outline-variant/30 border-l-4 border-l-outline-variant'
                          }`}
                        >
                          <h3 className={`text-xs font-black tracking-tight ${isActive ? 'text-white' : 'text-on-surface'}`}>{name}</h3>
                          
                          <span className={`text-[8.5px] font-mono font-black mt-1 px-2 py-0.5 rounded-full inline-block ${
                            isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                          }`}>
                            📅 {phase.targetDate}
                          </span>
                          
                          {/* Mini Progress */}
                          <div className="mt-2.5 space-y-1">
                            <div className="flex justify-between text-[7px] font-black uppercase opacity-85">
                              <span>{lang === 'ar' ? 'المنفق:' : 'Spent:'}</span>
                              <span className="font-mono">{spent.toLocaleString()} / {budget.toLocaleString()} SAR</span>
                            </div>
                            <div className={`w-full h-1 rounded-full overflow-hidden ${isActive ? 'bg-white/25' : 'bg-surface-container'}`}>
                              <div 
                                className={`h-full rounded-full ${isActive ? 'bg-white' : 'bg-primary'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* ROADWAY CONSTRUCTOR PLUS (+) BUTTON - rendered centered at the bottom of the timeline */}
            {currentPhases.length < 20 && (
              <div className="flex justify-center pt-8 pb-3 z-10 relative">
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddPhase}
                    className="w-11 h-11 rounded-full bg-white border border-primary/20 text-primary flex items-center justify-center shadow-md hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
                    title="Construct Next Stop"
                  >
                    <Plus className="w-5 h-5 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                  <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    {lang === 'ar' ? 'إضافة محطة هدف' : 'Add Stop'}
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Dynamic Add Phase Modal Overlay */}
      {isAddPhaseOpen && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-primary/20 shadow-2xl relative overflow-hidden grain-texture">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-6 translate-x-6 shrink-0 pointer-events-none" />
            
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-sm">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-black text-on-surface leading-snug">
                  {lang === 'ar' ? 'إنشاء محطة هدف جديدة' : 'Construct Goal Stop'}
                </h3>
                <p className="text-[9px] uppercase tracking-widest font-black text-primary">
                  {lang === 'ar' ? 'صانع مسار الرحلة' : 'The Path Builder'}
                </p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant mb-5 leading-relaxed">
              {lang === 'ar' ? (
                <>قم ببناء المحطة القادمة في مسارك. نقترح اسم <span className="font-extrabold text-primary">"{newPhaseName}"</span>، ولكن لا تتردد في كتابة أي اسم آخر!</>
              ) : (
                <>Construct the next stop on your quest. We suggest <span className="font-extrabold text-primary">"{newPhaseName}"</span>, but feel free to customize the name!</>
              )}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant/80 mb-1.5">
                  {lang === 'ar' ? 'اسم محطة الهدف' : 'Goal Stop Name'}
                </label>
                <input
                  type="text"
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder={lang === 'ar' ? 'مثال: الخطوبة' : 'e.g. Khutba'}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant/80 mb-1.5">
                    {lang === 'ar' ? 'الميزانية (ر.س)' : 'Budget (SAR)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPhaseBudget}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. 10000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant/80 mb-1.5">
                    {lang === 'ar' ? 'النسبة من الميزانية' : 'Budget % of Total'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newPhasePercent}
                    onChange={(e) => handlePercentChange(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. 10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant/80 mb-1.5">
                  {lang === 'ar' ? 'الموعد المستهدف للمرحلة' : 'Phase Target Date'}
                </label>
                <input
                  type="date"
                  value={newPhaseDate}
                  onChange={(e) => setNewPhaseDate(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  required
                />
              </div>

              <p className="text-[10px] text-on-surface-variant/60 font-semibold italic text-center mt-1">
                {lang === 'ar' ? (
                  <>مخصصة من إجمالي الميزانية البالغة {settings.budgetLimit.toLocaleString()} ر.س</>
                ) : (
                  <>Allocated from {settings.budgetLimit.toLocaleString()} SAR Total Budget</>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAddPhaseOpen(false)}
                className="w-full py-3.5 bg-outline-variant/20 hover:bg-outline-variant/30 text-on-surface-variant rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                {t('cancel', lang)}
              </button>
              <button
                type="button"
                onClick={handleConfirmAddPhase}
                className="w-full py-3.5 bg-primary hover:bg-[#005214] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                {lang === 'ar' ? 'بناء' : 'Construct'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DYNAMIC ROUTED DETAIL SCREEN (MODAL LAYER PORTED DIRECTLY OVER ROADMAP VIEW) */}
      {selectedPhaseDetailId && (
        <PhaseDetailScreen
          key={`${selectedPhaseDetailId}_${JSON.stringify(settings.phases?.find(p => p.id === selectedPhaseDetailId))}`}
          phaseId={selectedPhaseDetailId}
          settings={settings}
          milestones={milestones}
          expenses={expenses}
          onClose={() => setSelectedPhaseDetailId(null)}
          onSetAsActivePhase={handleSetAsActivePhase}
          onAddMilestone={onAddMilestone}
          onUpdateMilestone={onUpdateMilestone}
          onDeleteMilestone={onDeleteMilestone}
          onDeleteExpense={onDeleteExpense}
          onDeletePhase={onDeletePhase}
          onUpdatePhaseBudget={handleUpdatePhaseDetails}
        />
      )}
    </div>
  );
}

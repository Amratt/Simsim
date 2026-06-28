import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { WeddingSettings, Milestone, WeddingPhase } from '../types';
import { translatePhaseName, translatePhaseDesc, t } from '../lib/translations';

interface CountdownTimelineProps {
  settings: WeddingSettings;
  milestones: Milestone[];
  currentPhases: WeddingPhase[];
  onSelectPhase: (phaseId: string) => void;
}

export default function CountdownTimeline({
  settings,
  milestones,
  currentPhases,
  onSelectPhase,
}: CountdownTimelineProps) {
  const lang = settings.language || 'en';

  const weddingDate = new Date(settings.weddingDate);

  // Precise Target Date extractor for a given phase
  const getPhaseTargetDate = (phase: WeddingPhase, index: number): Date => {
    if (phase.targetDate) {
      return new Date(phase.targetDate);
    }
    
    // Fallback: estimate linearly relative to wedding date
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

  // Determine dynamic active index based on closest upcoming event (first phase whose targetDate >= today)
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

  const normalizedActiveIndex = computedActiveIndex;

  // Track the user selected index on the timeline (defaults to current active phase index)
  const [previewPhaseIndex, setPreviewPhaseIndex] = useState<number>(normalizedActiveIndex);

  // Sync state if active phase changes
  useEffect(() => {
    setPreviewPhaseIndex(normalizedActiveIndex);
  }, [normalizedActiveIndex]);

  const previewPhase = currentPhases[previewPhaseIndex] || currentPhases[normalizedActiveIndex] || currentPhases[0];

  const targetDateForPreview = getPhaseTargetDate(previewPhase, previewPhaseIndex);

  // Real-time ticking countdown states
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDateForPreview.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDateForPreview.getTime()]);

  // Calculate remaining days for the current preview item relative to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const compDate = new Date(targetDateForPreview);
  compDate.setHours(0, 0, 0, 0);
  
  const diffDaysTime = compDate.getTime() - today.getTime();
  const daysToGoForPreview = Math.ceil(diffDaysTime / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full max-w-sm bg-white/70 backdrop-blur-sm border border-primary/10 rounded-3xl p-5 shadow-md relative overflow-hidden mb-5">
      {/* Decorative floral/oriental top accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#b18129]/30 via-primary/30 to-[#b18129]/30" />
      
      {/* Premium Clock & Heading Row */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] uppercase font-black tracking-widest text-[#b18129] flex items-center gap-1.5 animate-pulse">
          <Clock className="w-3.5 h-3.5 text-[#b18129]" />
          {lang === 'ar' ? 'العد التنازلي' : 'Countdown'}
        </span>
        <span className="text-[9px] uppercase font-bold text-on-surface-variant/70 flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
          <Calendar className="w-3 h-3 text-primary" />
          {targetDateForPreview.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Main Realtime Ticking Countdown Grid for SELECTED PHASE */}
      <div className="grid grid-cols-4 gap-2 mb-5 text-center">
        {[
          { label: lang === 'ar' ? 'يوم' : 'Days', value: timeLeft.days },
          { label: lang === 'ar' ? 'ساعة' : 'Hrs', value: timeLeft.hours },
          { label: lang === 'ar' ? 'دقيقة' : 'Min', value: timeLeft.minutes },
          { label: lang === 'ar' ? 'ثانية' : 'Sec', value: timeLeft.seconds },
        ].map((unit, i) => (
          <div key={i} className="bg-surface-container/40 border border-outline-variant/15 rounded-xl p-2.5 relative">
            <span className="block font-mono text-2xl font-black text-on-surface leading-tight transition-all duration-300">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-on-surface-variant/60 block mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Horizontal Phase Timeline Tracker */}
      <div className="relative py-4 px-2 mb-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="relative flex items-center justify-between">
          
          {/* Progress Connecting Line */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-outline-variant/30 z-0">
            <div 
              className="h-full bg-primary rounded transition-all duration-700 ease-out"
              style={{
                width: `${(normalizedActiveIndex / (currentPhases.length - 1 || 1)) * 100}%`
              }}
            />
          </div>

          {/* Interactive Phase Points */}
          {currentPhases.map((phase, idx) => {
            const isCompleted = idx < normalizedActiveIndex;
            const isActive = idx === normalizedActiveIndex;
            const isSelected = idx === previewPhaseIndex;

            let pointContent = idx + 1;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setPreviewPhaseIndex(idx)}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                  isCompleted 
                    ? 'bg-primary border-primary text-white hover:scale-110' 
                    : isActive 
                      ? 'bg-white border-2 border-primary text-primary scale-110 font-black animate-pulse'
                      : 'bg-white border border-outline-variant/50 text-on-surface-variant/60 hover:border-primary/40'
                } ${isSelected ? 'ring-2 ring-[#b18129] ring-offset-2 scale-105' : ''}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span className="text-2xs font-extrabold font-mono">{pointContent}</span>
                )}
                
                {/* Micro-dot Indicator for current selection */}
                {isSelected && (
                  <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-[#b18129] rounded-full animate-bounce" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Selected Phase Details & Dynamic Targets */}
      <div className="bg-white/80 border border-outline-variant/20 rounded-2xl p-3.5 transition-all duration-300 animate-fade-in">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[8px] uppercase font-black tracking-widest text-[#b18129] bg-[#b18129]/10 px-2 py-0.5 rounded border border-[#b18129]/20">
              {previewPhaseIndex === normalizedActiveIndex ? (
                lang === 'ar' ? 'المرحلة النشطة حالياً' : 'Current Active Phase'
              ) : previewPhaseIndex < normalizedActiveIndex ? (
                lang === 'ar' ? 'مكتملة ومكتسبة' : 'Completed Stage'
              ) : (
                lang === 'ar' ? 'مرحلة مستقبلية' : 'Upcoming Stage'
              )}
            </span>
            <h4 className="font-plus text-sm font-black text-on-surface mt-1.5 flex items-center gap-1.5">
              {translatePhaseName(previewPhase.id, previewPhase.name, lang)}
            </h4>
            <p className="text-[10px] text-on-surface-variant/80 font-medium leading-relaxed mt-1">
              {translatePhaseDesc(previewPhase.id, previewPhase.description, lang)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectPhase(previewPhase.id)}
            className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all hover:scale-105 shrink-0 animate-pulse"
            title={lang === 'ar' ? 'استعراض أهداف هذه المرحلة' : 'Audit this phase milestones'}
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Dynamic target countdown estimation banner inside timeline widget */}
        <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-spin-slow" />
            {lang === 'ar' ? 'الموعد المستهدف للمرحلة:' : 'Phase Target Date:'}
          </span>
          <span className="font-mono text-primary font-black bg-primary/10 px-2.5 py-0.5 rounded">
            {daysToGoForPreview <= 0 ? (
              lang === 'ar' ? 'تم الوصول للهدف! 🎉' : 'Target reached! 🎉'
            ) : (
              lang === 'ar' ? `${daysToGoForPreview} يوم متبقي` : `${daysToGoForPreview} days left`
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

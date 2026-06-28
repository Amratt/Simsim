import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, ShieldAlert, DollarSign, ArrowRight, User, Languages } from 'lucide-react';
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
  
  const [step, setStep] = useState(1); // 1: Language, 2: Meet Companion, 3: Wedding Timeline
  const [validationError, setValidationError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
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

    onComplete({
      userName: userName.trim(),
      partnerName: partnerName.trim(),
      budgetLimit: Number(budgetLimit),
      weddingDate,
      avatarId,
      isOnboarded: true,
      activePhaseId: 'shofa',
      language
    });
  };

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
            <span>{t('stepIndicator', language).replace('{step}', String(step)).replace('{total}', '3')}</span>
          </div>
          
          <h1 className="font-plus text-2xl font-black text-[#1a1915] tracking-tight">
            {step === 1 ? t('chooseLanguage', language) : step === 2 ? t('meetCompanion', language) : t('weddingTimeline', language)}
          </h1>
          <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
            {step === 1 
              ? "Select your preferred language. You can also adjust this later in settings."
              : step === 2
              ? t('onboardingDescStep1', language)
              : t('onboardingDescStep2', language)}
          </p>
        </div>

        {/* Mascot Speech Intro */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-primary/20 shadow-sm relative text-center">
          <div className="text-xs font-semibold text-primary/90 leading-normal">
            {step === 1 
              ? "Ahlan! Choose English or Arabic to start preparing your journey. 🌐🐢"
              : step === 2 
              ? t('companionSpeechStep1', language) 
              : t('companionSpeechStep2', language)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-outline-variant/40 p-5 shadow-lg space-y-4">
          
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
                type="button"
                onClick={handleNextStep}
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
                  type="button"
                  onClick={handleNextStep}
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
                  {t('buildOasisPath', language)} <Sparkles className="w-3.5 h-3.5 fill-white/10" />
                </button>
              </div>
            </div>
          )}

        </form>
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

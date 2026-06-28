import React, { useState } from 'react';
import { Settings, Save, RefreshCw, ShieldAlert, Languages } from 'lucide-react';
import { WeddingSettings } from '../types';
import AvatarImage from './AvatarImage';
import { t, Language } from '../lib/translations';

interface SettingsViewProps {
  settings: WeddingSettings;
  onUpdateSettings: (settings: WeddingSettings) => void;
  onResetApp: () => void;
  onResetToOnboarding: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetApp,
  onResetToOnboarding,
}: SettingsViewProps) {
  const [budgetLimit, setBudgetLimit] = useState(settings.budgetLimit);
  const [weddingDate, setWeddingDate] = useState(settings.weddingDate);
  const [userName, setUserName] = useState(settings.userName);
  const [partnerName, setPartnerName] = useState(settings.partnerName);
  const [avatarId, setAvatarId] = useState<'green' | 'red' | 'blue'>(settings.avatarId || 'green');
  const [language, setLanguage] = useState<Language>(settings.language || 'en');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const lang = settings.language || 'en';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      budgetLimit: Number(budgetLimit),
      weddingDate,
      userName,
      partnerName,
      avatarId,
      language,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="relative z-10 pb-28" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <section className="mb-6">
        <h2 className="font-plus text-2xl font-extrabold text-[#1a1915] tracking-tight mb-1">
          {lang === 'ar' ? 'إعدادات التهيئة والتحكم' : 'Configuration Settings'}
        </h2>
        <p className="text-xs text-on-surface-variant font-medium">
          {lang === 'ar' ? 'قم بتخصيص أهدافك المالية وجدولك الزمني وتفضيلاتك.' : 'Customize your financial goals, timeline details, and preferences.'}
        </p>
      </section>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant/20 pb-2 mb-2">
            <Settings className="w-4 h-4 text-primary" /> {t('profileConfigTitle', lang)}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider block mb-1">
                {t('yourName', lang)}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider block mb-1">
                {t('partnerName', lang)}
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider block mb-1">
              {t('capLimitLabel', lang)}
            </label>
            <input
              type="number"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary font-bold"
              min="1000"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider block mb-1">
              {t('weddingDateLabel', lang)}
            </label>
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
              required
            />
          </div>

          {/* CHOOSE COMPANION SHELL AVATAR */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/20">
            <label className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider block">
              {t('avatarChoiceLabel', lang)} 🐢
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['green', 'red', 'blue'] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAvatarId(id)}
                  className={`relative flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    avatarId === id 
                      ? 'border-primary bg-primary/5 scale-102 shadow-[0_4px_12px_rgba(0,110,28,0.08)]' 
                      : 'border-outline-variant/40 bg-surface/30 hover:border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <AvatarImage avatarId={id} className="w-10 h-10" />
                  <span className="text-[9px] uppercase font-bold mt-1 text-on-surface-variant">
                    {id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* LANGUAGE OPTION IN SETTINGS */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/20">
            <label className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider block flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-primary" /> {t('languageChoiceLabel', lang)}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  language === 'en'
                    ? 'border-primary bg-primary/5 scale-101 font-black text-primary shadow-[0_4px_12px_rgba(0,110,28,0.08)]'
                    : 'border-outline-variant/40 bg-surface/30 text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-low font-semibold'
                }`}
              >
                <span className="text-xs">English</span>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  language === 'ar'
                    ? 'border-primary bg-primary/5 scale-101 font-black text-primary shadow-[0_4px_12px_rgba(0,110,28,0.08)]'
                    : 'border-outline-variant/40 bg-surface/30 text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-low font-semibold'
                }`}
              >
                <span className="text-xs">العربية</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <p className="text-xs font-extrabold text-primary text-center">
              {t('savedSuccess', lang)}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all text-xs tracking-tight cursor-pointer"
          >
            <Save className="w-4 h-4" /> {t('saveSettingsBtn', lang)}
          </button>
        </div>
      </form>

      {/* Danger Zone Reset Actions */}
      <div className="mt-8 bg-error/5 p-5 rounded-2xl border border-error/15 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-error uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-error/10">
          <ShieldAlert className="w-4 h-4 text-error" /> {t('dangerActionsTitle', lang)}
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-on-surface">{t('resetInfoTitle', lang)}</p>
            <p className="text-[11px] text-on-surface-variant/80 mt-0.5 mb-2">
              {t('resetInfoDesc', lang)}
            </p>
            
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-error hover:bg-error-hover text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs tracking-tight cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 shrink-0" /> {t('resetInfoBtn', lang)}
              </button>
            ) : (
              <div className="bg-error/10 border border-error/30 p-3.5 rounded-xl space-y-2 animate-pulse">
                <p className="text-xs font-extrabold text-[#ca1c1c] flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-error shrink-0" />
                  {t('confirmResetTitle', lang)}
                </p>
                <p className="text-[10px] text-on-surface-variant font-semibold">
                  {t('confirmResetDesc', lang)}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetConfirm(false);
                      onResetToOnboarding();
                    }}
                    className="bg-error hover:bg-error-hover text-white font-black py-2 px-3 rounded-lg text-xs tracking-tight transition-all cursor-pointer"
                  >
                    {t('confirmResetYes', lang)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-surface-container border border-outline-variant/30 text-on-surface font-bold py-2 px-3 rounded-lg text-xs tracking-tight transition-all cursor-pointer"
                  >
                    {t('confirmResetNo', lang)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

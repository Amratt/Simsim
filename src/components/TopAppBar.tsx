import React, { useState } from 'react';
import { Eye, Heart, Calendar } from 'lucide-react';
import { WeddingSettings } from '../types';
import AvatarImage from './AvatarImage';
import { t } from '../lib/translations';

interface TopAppBarProps {
  settings: WeddingSettings;
}

export default function TopAppBar({ settings }: TopAppBarProps) {
  const [showProfile, setShowProfile] = useState(false);
  const lang = settings.language || 'en';

  // Parse date
  const targetDate = new Date(settings.weddingDate);
  const formattedDate = targetDate.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-6 z-40 transition-colors">
        <div className="w-10" />
        
        <div />
        
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border border-primary/20 bg-white shadow-sm hover:brightness-95 active:scale-95 duration-100 cursor-pointer"
          id="profile-btn"
          title="Wedding Profile"
        >
          <AvatarImage avatarId={settings.avatarId || 'green'} className="w-9 h-9" />
        </button>
      </header>

      {/* Profile Sidebar/Modal overlay */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="fixed inset-0" onClick={() => setShowProfile(false)} />
          <div className="relative w-full max-w-sm bg-background h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-on-background font-plus">{t('profileConfigTitle', lang)}</h3>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant text-sm font-semibold"
                >
                  {t('cancel', lang)}
                </button>
              </div>

              <div className="flex flex-col items-center text-center py-6 border-b border-outline-variant/30 gap-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white shadow-md border-2 border-primary/40 overflow-hidden">
                    <AvatarImage avatarId={settings.avatarId || 'green'} className="w-20 h-20" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow uppercase">
                    {lang === 'ar' ? 'شريك' : 'Partner'}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold font-plus text-on-background">
                    {settings.userName} &amp; {settings.partnerName}
                  </h4>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1 justify-center mt-1">
                    <Calendar className="w-4 h-4 text-primary" /> {formattedDate}
                  </p>
                </div>
              </div>

              <div className="space-y-4 py-6">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                  <span className="text-xs text-on-surface-variant block font-medium uppercase tracking-wider">
                    {t('totalBudget', lang)}
                  </span>
                  <span className="text-lg font-bold text-primary mt-1 block">
                    {settings.budgetLimit.toLocaleString()} {t('sar', lang)}
                  </span>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                  <span className="text-xs text-on-surface-variant block font-medium uppercase tracking-wider">
                    {lang === 'ar' ? 'حالة التخطيط' : 'Planner Status'}
                  </span>
                  <span className="text-sm font-semibold text-secondary mt-1 block">
                    💍 {lang === 'ar' ? 'نعمل بنشاط على تخصيص الرحلة' : 'Actively Customizing Journey'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-on-surface-variant opacity-60 border-t border-outline-variant/30 pt-4">
              <p>{lang === 'ar' ? 'رفيق الزواج سمسم v1.0' : 'Simsim Wedding Companion v1.0'}</p>
              <p className="mt-1">{lang === 'ar' ? 'صُنع بحب للحظاتكم الجميلة' : 'Hand-crafted for beautiful moments'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

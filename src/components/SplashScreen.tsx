import React from 'react';

interface SplashScreenProps {
  isFading: boolean;
  language?: string;
}

export default function SplashScreen({ isFading, language = 'en' }: SplashScreenProps) {
  const isAr = language === 'ar';

  return (
    <div 
      className={`fixed inset-0 z-50 bg-background turtle-shell-pattern flex flex-col items-center justify-center transition-opacity duration-400 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col items-center gap-6 animate-splash-mount">
        
        {/* Simsim Mascot Container with glowing pulse ring */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing glow background rings */}
          <div className="absolute w-28 h-28 bg-primary/5 rounded-3xl animate-ping duration-1000" />
          <div className="absolute w-32 h-32 bg-primary/3 rounded-3xl animate-pulse duration-2000" />
          
          {/* Logo Card */}
          <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl border border-outline-variant/40 flex items-center justify-center p-3 animate-bounce-slow">
            <img
              alt="Simsim Mascot"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW2BGQvlV34vo5wbg_C95TOMe9fwwPc7wv13SGSSnwFyNFMi_BrKwQoDPKthdBxsU4Z42txmWVMhYm9cnHa-C8H_-C28TdlRxiIBcPuYRzBSX7wD5O6Fe5EvLkY_ArIF2rv0qDVgL37zgd5irwxzx5AU8Q-XsIpUG1oiqzbzgd25wUvVCP9rpR6uRIzvt3A9Qt4fVQH5mbSQoCB1YsV45WcH0V6bzagZ-puw4I4S-T1G3XfuwVFWdh5blYkogwFjUShvCFySFs3eiJ"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Branding Typography */}
        <div className="text-center space-y-1 mt-2">
          <h1 className="font-plus text-3xl font-black text-[#1d1c16] tracking-tight leading-none">
            {isAr ? 'سمسم' : 'Simsim'}
          </h1>
          <p className="text-[10px] font-black text-primary tracking-[0.25em] uppercase opacity-85">
            {isAr ? 'رفيق درب الزواج' : 'Your Wedding Companion'}
          </p>
        </div>

        {/* Elegant Botanical Green Ring Loader */}
        <div className="mt-8 relative flex items-center justify-center w-12 h-12">
          <svg className="w-8 h-8 animate-spin text-primary" viewBox="0 0 50 50">
            <circle
              className="opacity-20"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <circle
              className="opacity-80"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray="80"
              strokeDashoffset="45"
              strokeLinecap="round"
            />
          </svg>
          {/* Center botanic accent dot */}
          <span className="absolute text-[8px] animate-pulse">🌿</span>
        </div>

      </div>

      {/* Botanic divider at the very bottom */}
      <div className="absolute bottom-8 text-center opacity-40">
        <div className="leaf-divider scale-75" />
      </div>
    </div>
  );
}

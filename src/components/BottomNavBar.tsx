import React from 'react';
import { Home, BarChart2, Settings } from 'lucide-react';
import { t, Language } from '../lib/translations';

interface BottomNavBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  language?: Language;
}

export default function BottomNavBar({ currentTab, setTab, language = 'en' }: BottomNavBarProps) {
  const tabs = [
    { id: 'oasis', label: t('oasis', language), icon: Home },
    { id: 'analytics', label: t('analytics', language), icon: BarChart2 },
    { id: 'settings', label: t('settings', language), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-t border-outline-variant/30 px-4 pb-6 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.03)] rounded-t-xl flex justify-around items-center max-w-lg mx-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return isActive ? (
          <button
            key={tab.id}
            className="flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 shadow-md shadow-primary/15 transition-all duration-300 transform scale-105"
            onClick={() => setTab(tab.id)}
          >
            <Icon className="w-5 h-5 fill-white/20" />
            <span className="text-sm font-bold tracking-tight shrink-0">{tab.label}</span>
          </button>
        ) : (
          <button
            key={tab.id}
            className="flex flex-col items-center justify-center p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 duration-150"
            onClick={() => setTab(tab.id)}
          >
            <Icon className="w-5 h-5 opacity-70" />
            <span className="text-xs mt-1 font-medium select-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

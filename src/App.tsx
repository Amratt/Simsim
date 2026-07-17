import React, { useState, useEffect } from 'react';
import { 
  loadSettings, 
  saveSettings, 
  loadMilestones, 
  saveMilestones, 
  loadExpenses, 
  saveExpenses, 
  DEFAULT_SETTINGS,
  DEFAULT_MILESTONES,
  DEFAULT_EXPENSES
} from './localStorage';
import { Expense, Milestone, WeddingSettings } from './types';

// Components
import TopAppBar from './components/TopAppBar';
import BottomNavBar from './components/BottomNavBar';
import TheOasis from './components/TheOasis';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import AddExpenseModal from './components/AddExpenseModal';
import OnboardingView from './components/OnboardingView';
import SplashScreen from './components/SplashScreen';

export default function App() {
  // Global States
  const [settings, setSettings] = useState<WeddingSettings>(loadSettings);
  const [milestones, setMilestones] = useState<Milestone[]>(loadMilestones);
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses);

  // Splash Screen States
  const [isSplashActive, setIsSplashActive] = useState<boolean>(true);
  const [isSplashFading, setIsSplashFading] = useState<boolean>(false);

  // Tab routing: oasis, analytics, settings (exactly 3 options)
  const [activeTab, setActiveTab] = useState<string>('oasis');
  
  // Modal visibility
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);

  // Splash timer effect
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsSplashFading(true);
    }, 1800);

    const unmountTimer = setTimeout(() => {
      setIsSplashActive(false);
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  // Auto-synchronize storage upon state updates
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveMilestones(milestones);
  }, [milestones]);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  // Render Splash Screen if active, blocking everything else
  if (isSplashActive) {
    return <SplashScreen isFading={isSplashFading} language={settings.language} />;
  }

  // Trap and render exclusively Onboarding View when not onboarded
  if (!settings.isOnboarded) {
    return (
      <OnboardingView 
        onComplete={(onboardedSettings) => {
          const isAr = onboardedSettings.language === 'ar';
          
          // Proportional budget distribution logic (precision rounding to sum exactly to budgetLimit)
          const b = onboardedSettings.budgetLimit;
          const bShofa = Math.round(b * 0.017);
          const bKhutba = Math.round(b * 0.05);
          const bMelka = Math.round(b * 0.25);
          const bWedding = Math.round(b * 0.45);
          const bHoneymoon = Math.round(b * 0.065);
          const bHouse = b - (bShofa + bKhutba + bMelka + bWedding + bHoneymoon);

          // Linear timeline distribution logic relative to today and weddingDate
          const today = new Date();
          const wedding = new Date(onboardedSettings.weddingDate);
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
          const weddingDateStr = onboardedSettings.weddingDate;

          const honeymoonDateObj = new Date(wedding);
          honeymoonDateObj.setDate(wedding.getDate() + 14);
          const honeymoonDate = formatDate(honeymoonDateObj);

          const houseDateObj = new Date(wedding);
          houseDateObj.setDate(wedding.getDate() + 30);
          const houseDate = formatDate(houseDateObj);

          setSettings({
            ...onboardedSettings,
            activePhaseId: 'shofa', // default starter stage
            phases: [
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
                name: isAr ? 'عقد القران (الملكة)' : 'Melka', 
                description: isAr 
                  ? 'تقديم المهر، شراء الشبكة والذهب، وإتمام عقد النكاح الرسمي' 
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
            ],
            isOnboarded: true
          });
        }}
      />
    );
  }

  // Handler: Add recorded expense
  const handleSaveExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseId = 'exp_' + Date.now();
    const created: Expense = {
      ...newExpense,
      id: expenseId,
    };

    const nextExpenses = [...expenses, created];
    setExpenses(nextExpenses);

    // Auto-update matched milestone status depending on progress!
    const mappedToCategory = nextExpenses.filter(e => e.category === newExpense.category);
    const sumPaid = mappedToCategory.reduce((sum, e) => sum + e.amount, 0);

    const updatedMilestones = milestones.map(m => {
      if (m.category === newExpense.category) {
        let nextStatus: Milestone['status'] = m.status;
        if (sumPaid >= m.targetAmount) {
          nextStatus = 'completed';
        } else {
          nextStatus = 'planning';
        }
        return {
          ...m,
          status: nextStatus,
        };
      }
      return m;
    });

    setMilestones(updatedMilestones);
  };

  // Handler: Save settings adjustments
  const handleUpdateSettings = (newSettings: WeddingSettings) => {
    setSettings(newSettings);
  };

  // Handler: Add customized milestone
  const handleAddMilestone = (newMil: Omit<Milestone, 'id'>) => {
    const mId = 'mil_' + Date.now();
    const created: Milestone = {
      ...newMil,
      id: mId,
    };
    setMilestones([...milestones, created]);
  };

  // Handler: Update existing milestone parameters
  const handleUpdateMilestone = (updated: Milestone) => {
    setMilestones(milestones.map(m => m.id === updated.id ? updated : m));
  };

  // Handler: Delete custom milestone
  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  // Handler: Delete recorded expense
  const handleDeleteExpense = (expenseId: string) => {
    const nextExpenses = expenses.filter(e => e.id !== expenseId);
    setExpenses(nextExpenses);

    const deletedExpense = expenses.find(e => e.id === expenseId);
    if (deletedExpense) {
      const category = deletedExpense.category;
      const mappedToCategory = nextExpenses.filter(e => e.category === category);
      const sumPaid = mappedToCategory.reduce((sum, e) => sum + e.amount, 0);

      const updatedMilestones = milestones.map(m => {
        if (m.category === category) {
          let nextStatus: Milestone['status'] = m.status;
          if (sumPaid >= m.targetAmount) {
            nextStatus = 'completed';
          } else {
            nextStatus = 'planning';
          }
          return {
            ...m,
            status: nextStatus,
          };
        }
        return m;
      });
      setMilestones(updatedMilestones);
    }
  };

  // Handler: Completely reset back to pristine demo defaults
  const handleResetApp = () => {
    setSettings(DEFAULT_SETTINGS);
    setMilestones(DEFAULT_MILESTONES);
    setExpenses(DEFAULT_EXPENSES);
    setActiveTab('oasis');
  };

  // Handler: Full wipe to restart onboarding
  const handleResetToOnboarding = () => {
    setSettings({
      budgetLimit: 0,
      weddingDate: '',
      partnerName: '',
      userName: '',
      isOnboarded: false,
      avatarId: 'green',
      activePhaseId: 'shofa',
      phases: []
    });
    setMilestones([]);
    setExpenses([]);
    setActiveTab('oasis');
  };

  // Render active tab view
  const renderView = () => {
    switch (activeTab) {
      case 'oasis':
        return (
          <TheOasis
            expenses={expenses}
            milestones={milestones}
            settings={settings}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            setTab={setActiveTab}
            onUpdateSettings={handleUpdateSettings}
            onAddMilestone={handleAddMilestone}
            onUpdateMilestone={handleUpdateMilestone}
            onDeleteMilestone={handleDeleteMilestone}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            expenses={expenses}
            milestones={milestones}
            settings={settings}
            setTab={setActiveTab}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetApp={handleResetApp}
            onResetToOnboarding={handleResetToOnboarding}
          />
        );
      default:
        return (
          <TheOasis
            expenses={expenses}
            milestones={milestones}
            settings={settings}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            setTab={setActiveTab}
            onUpdateSettings={handleUpdateSettings}
            onAddMilestone={handleAddMilestone}
            onUpdateMilestone={handleUpdateMilestone}
            onDeleteMilestone={handleDeleteMilestone}
            onDeleteExpense={handleDeleteExpense}
          />
        );
    }
  };

  return (
    <div 
      className="min-h-screen bg-background text-[#1d1c16] font-plus tracking-tight antialiased transition-colors duration-150 relative overflow-x-hidden pt-20 pb-16 px-6 max-w-md mx-auto"
      dir={settings.language === 'ar' ? 'rtl' : 'ltr'}
    >
      
      {/* Top Header App bar */}
      <TopAppBar settings={settings} />

      {/* Main Panel Viewport */}
      <main className="w-full">
        {renderView()}
      </main>

      {/* Persistent Bottom capsule navigation */}
      <BottomNavBar currentTab={activeTab} setTab={setActiveTab} language={settings.language} />

      {/* Modal overlays */}
      {isAddExpenseOpen && (
        <AddExpenseModal
          onClose={() => setIsAddExpenseOpen(false)}
          onSaveExpense={handleSaveExpense}
          milestones={milestones}
          expenses={expenses}
        />
      )}
    </div>
  );
}

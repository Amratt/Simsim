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

export default function App() {
  // Global States
  const [settings, setSettings] = useState<WeddingSettings>(loadSettings);
  const [milestones, setMilestones] = useState<Milestone[]>(loadMilestones);
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses);

  // Tab routing: oasis, analytics, settings (exactly 3 options)
  const [activeTab, setActiveTab] = useState<string>('oasis');
  
  // Modal visibility
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);

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

  // Trap and render exclusively Onboarding View when not onboarded
  if (!settings.isOnboarded) {
    return (
      <OnboardingView 
        onComplete={(onboardedSettings) => {
          const isAr = onboardedSettings.language === 'ar';
          setSettings({
            ...onboardedSettings,
            activePhaseId: 'shofa', // default starter stage
            phases: [
              { 
                id: 'shofa', 
                name: isAr ? 'الشوفة الشرعية' : 'Shofa', 
                description: isAr 
                  ? 'تأسيس رحلتكم: الرؤية، قائمة الضيوف الأولية، وتقدير الميزانية الأساسية' 
                  : 'The foundation of your journey: vision, guests, and initial budgeting' 
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

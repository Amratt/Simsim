import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { 
  ChevronLeft, 
  Check, 
  Coins, 
  Layers, 
  Plus, 
  ShieldAlert, 
  CheckCircle, 
  Edit3, 
  Trash2,
  HelpCircle
} from 'lucide-react';
import { Expense, Milestone, WeddingSettings } from '../types';
import { t, translatePhaseName, translatePhaseDesc, translateMilestoneName } from '../lib/translations';

interface PhaseDetailScreenProps {
  key?: string;
  phaseId: string;
  settings: WeddingSettings;
  milestones: Milestone[];
  expenses: Expense[];
  onClose: () => void;
  onSetAsActivePhase: (phaseId: string) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onUpdateMilestone: (updated: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  onUpdatePhaseBudget?: (
    phaseId: string, 
    name: string, 
    description: string, 
    allocatedBudget?: number,
    targetDate?: string
  ) => void;
}

export const PHASES_INFO = {
  shofa: { name: 'Shofa', num: 1, description: 'The foundation of your journey: vision, guests, and initial budgeting' },
  khutba: { name: 'Khutba', num: 2, description: 'Engagement, proposal meetings, and personal wardrobe' },
  melka: { name: 'Melka', num: 3, description: 'Dowry (Mahr) delivery, Shabka jewelry purchase, and official license' },
  wedding: { name: 'The Wedding', num: 4, description: 'Celebratory hall, photography, catering, and evening guest feast' },
  honeymoon: { name: 'Honeymoon', num: 5, description: 'Flights, hotel bookings, and post-ceremony travels' },
  house: { name: 'The House', num: 6, description: 'Appliances, living room layout, and essential home furnishing' },
};

const AVAILABLE_ICONS = [
  { name: 'Coins', label: 'Cash', labelAr: 'نقدية' },
  { name: 'Gem', label: 'Jewelry', labelAr: 'مجوهرات وشبكة' },
  { name: 'Utensils', label: 'Catering & Feast', labelAr: 'ضيافة ووليمة' },
  { name: 'Video', label: 'Media & Photography', labelAr: 'تصوير وإعلام' },
  { name: 'Flower', label: 'Flowers & Decor', labelAr: 'ورد وديكور' },
  { name: 'Venue', label: 'Venues', labelAr: 'قاعات وأماكن' },
  { name: 'Gift', label: 'Gifts', labelAr: 'هدايا وتوزيعات' },
  { name: 'Plane', label: 'Travel & Tourism', labelAr: 'سفر وسياحة' },
  { name: 'Home', label: 'Housing & Furniture', labelAr: 'تأثيث ومنزل' },
  { name: 'Other', label: 'Other', labelAr: 'أخرى' },
];

export default function PhaseDetailScreen({
  phaseId,
  settings,
  milestones,
  expenses,
  onClose,
  onSetAsActivePhase,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  onDeleteExpense,
  onUpdatePhaseBudget,
}: PhaseDetailScreenProps) {
  const lang = settings.language || 'en';

  // Find dynamic phase information
  const dynamicPhase = settings.phases?.find(p => p.id === phaseId);
  const info = dynamicPhase 
    ? { 
        name: translatePhaseName(dynamicPhase.id, dynamicPhase.name, lang), 
        num: (settings.phases?.indexOf(dynamicPhase) ?? 0) + 1, 
        description: translatePhaseDesc(dynamicPhase.id, dynamicPhase.description, lang) 
      }
    : (PHASES_INFO[phaseId as keyof typeof PHASES_INFO] 
        ? { 
            name: translatePhaseName(phaseId, PHASES_INFO[phaseId as keyof typeof PHASES_INFO].name, lang),
            num: Object.keys(PHASES_INFO).indexOf(phaseId) + 1,
            description: translatePhaseDesc(phaseId, PHASES_INFO[phaseId as keyof typeof PHASES_INFO].description, lang)
          }
        : { 
            name: translatePhaseName(phaseId, phaseId.toUpperCase(), lang), 
            num: 1, 
            description: lang === 'ar' ? 'محطة أهداف مخصصة' : 'Custom Goal stop' 
          });

  const isActive = settings.activePhaseId === phaseId;

  // Fixed proportional phase allocations as defined archetypes:
  const phaseDefaultBudgets = {
    shofa: 5000,
    khutba: 15000,
    melka: 75000,
    wedding: 135500,
    honeymoon: 19500,
    house: 55000,
  };

  // Get current allocated budget (can be custom modified or fall back to default proportional split)
  const currentAllocatedBudget = dynamicPhase?.allocatedBudget !== undefined
    ? dynamicPhase.allocatedBudget
    : (phaseDefaultBudgets[phaseId as keyof typeof phaseDefaultBudgets] || 10000);

  // Inline editing state for phase name, description and budget
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editMetaName, setEditMetaName] = useState(info.name);
  const [editMetaDesc, setEditMetaDesc] = useState(info.description || '');
  const [editMetaBudget, setEditMetaBudget] = useState<number | ''>(currentAllocatedBudget);
  const [editMetaPercent, setEditMetaPercent] = useState<number | ''>(
    settings.budgetLimit > 0 ? Number(((currentAllocatedBudget / settings.budgetLimit) * 100).toFixed(1)) : 10
  );
  const [editMetaDate, setEditMetaDate] = useState<string>(dynamicPhase?.targetDate || settings.weddingDate || '');

  const handleBudgetEditChange = (valStr: string) => {
    if (valStr === '') {
      setEditMetaBudget('');
      setEditMetaPercent('');
      return;
    }
    const val = Number(valStr);
    setEditMetaBudget(val);
    if (settings.budgetLimit > 0) {
      const pct = Number(((val / settings.budgetLimit) * 100).toFixed(1));
      setEditMetaPercent(pct);
    } else {
      setEditMetaPercent(0);
    }
  };

  const handlePercentEditChange = (valStr: string) => {
    if (valStr === '') {
      setEditMetaPercent('');
      setEditMetaBudget('');
      return;
    }
    const val = Number(valStr);
    setEditMetaPercent(val);
    if (settings.budgetLimit > 0) {
      const bgt = Math.round((val / 100) * settings.budgetLimit);
      setEditMetaBudget(bgt);
    } else {
      setEditMetaBudget(0);
    }
  };

  const handleStartEditingMeta = () => {
    setEditMetaName(info.name);
    setEditMetaDesc(info.description || '');
    setEditMetaBudget(currentAllocatedBudget);
    setEditMetaPercent(
      settings.budgetLimit > 0 ? Number(((currentAllocatedBudget / settings.budgetLimit) * 100).toFixed(1)) : 10
    );
    setEditMetaDate(dynamicPhase?.targetDate || settings.weddingDate || '');
    setIsEditingMeta(true);
  };

  const handleSaveMetaEdit = () => {
    if (onUpdatePhaseBudget) {
      const newBudget = editMetaBudget === '' ? 0 : Number(editMetaBudget);
      onUpdatePhaseBudget(
        phaseId, 
        editMetaName.trim(), 
        editMetaDesc.trim(), 
        newBudget,
        editMetaDate
      );
    }
    setIsEditingMeta(false);
  };

  // Track state for creating milestone
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState<number>(10000);
  const [newIcon, setNewIcon] = useState('Coins');
  const [newStatus, setNewStatus] = useState<Milestone['status']>('planning');

  // Editing state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<Milestone['status']>('planning');

  // Budget calculations
  const allocatedBudget = currentAllocatedBudget;

  // Filtered milestones
  const filteredMilestones = milestones.filter(m => m.phaseId === phaseId);

  // Spent calculation based on actual transaction logs in this phase
  const totalSpentInPhase = expenses
    .filter(e => e.phaseId === phaseId)
    .reduce((sum, e) => sum + e.amount, 0);
  const remainingPhaseBalance = allocatedBudget - totalSpentInPhase;

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    // Auto category generated based on the selected icon and timestamp to ensure uniqueness
    const categoryId = `${newIcon.toLowerCase()}_${Date.now()}`;

    onAddMilestone({
      name: newName,
      category: categoryId,
      targetAmount: Number(newTarget),
      color: '#006e1c',
      iconName: newIcon,
      status: newStatus,
      phaseId: phaseId, // Strictly assigned to this phase
    });

    // Reset
    setNewName('');
    setNewTarget(10000);
    setNewIcon('Coins');
    setNewStatus('planning');
    setShowAddForm(false);
  };

  const handleStartEditing = (m: Milestone) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditTarget(m.targetAmount);
    setEditStatus(m.status);
  };

  const handleSaveEdit = (m: Milestone) => {
    onUpdateMilestone({
      ...m,
      name: editName,
      targetAmount: Number(editTarget),
      status: editStatus,
    });
    setEditingId(null);
  };

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    let resolvedName = iconName;
    if (iconName === 'Venue') resolvedName = 'Building';
    if (iconName === 'Other') resolvedName = 'MoreHorizontal';
    const IconComponent = (Icons as any)[resolvedName] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Sticky Top Header Bar */}
      <div 
        className="w-full max-w-md bg-background/95 backdrop-blur-sm border-b border-outline-variant/30 px-6 pb-4 flex items-center justify-start z-20 shrink-0 shadow-sm"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}
      >
        <button 
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" /> {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="w-full max-w-md overflow-y-auto px-6 py-6 flex-1 pb-28 relative scrollbar-none">
        
        {/* Phase Meta Block */}
        <div className="mb-6 text-center bg-primary/5 p-5 rounded-2xl border border-primary/10">
          <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md mb-2 inline-block">
            {lang === 'ar' ? (
              <>المحطة {info.num} من {settings.phases?.length || 1}</>
            ) : (
              <>Stop {info.num} of {settings.phases?.length || 1}</>
            )}
          </span>
          
          {isEditingMeta ? (
            <div className="space-y-3 mt-2 text-left">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70 mb-1">
                  {lang === 'ar' ? 'اسم محطة الهدف' : 'Goal Stop Name'}
                </label>
                <input
                  type="text"
                  value={editMetaName}
                  onChange={(e) => setEditMetaName(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-bold text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70 mb-1">
                    {lang === 'ar' ? 'الميزانية (ر.س)' : 'Budget (SAR)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editMetaBudget}
                    onChange={(e) => handleBudgetEditChange(e.target.value)}
                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-bold text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70 mb-1">
                    {lang === 'ar' ? 'النسبة %' : 'Budget %'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editMetaPercent}
                    onChange={(e) => handlePercentEditChange(e.target.value)}
                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-bold text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70 mb-1">
                  {lang === 'ar' ? 'التاريخ المستهدف للمرحلة' : 'Phase Target Date'}
                </label>
                <input
                  type="date"
                  value={editMetaDate}
                  onChange={(e) => setEditMetaDate(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-bold text-on-surface focus:outline-none focus:border-primary font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70 mb-1">
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  value={editMetaDesc}
                  onChange={(e) => setEditMetaDesc(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-medium text-on-surface focus:outline-none focus:border-primary min-h-[50px]"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingMeta(false)}
                  className="px-3 py-1.5 bg-outline-variant/20 hover:bg-outline-variant/30 text-on-surface-variant rounded-lg text-2xs font-extrabold uppercase cursor-pointer"
                >
                  {t('cancel', lang)}
                </button>
                <button
                  type="button"
                  onClick={handleSaveMetaEdit}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-2xs font-extrabold uppercase shadow-sm cursor-pointer"
                >
                  {t('save', lang)}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <h2 className="font-plus text-2xl font-extrabold text-on-surface flex items-center justify-center gap-1.5">
                {info.name}
                <button
                  type="button"
                  onClick={handleStartEditingMeta}
                  className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  title="Rename Goal Stop"
                >
                  <Icons.Edit3 className="w-4.5 h-4.5" />
                </button>
              </h2>
              <div className="my-2 flex items-center justify-center gap-1.5 text-xs text-[#b18129] font-black bg-[#b18129]/10 px-3 py-1 rounded-full w-fit mx-auto border border-[#b18129]/20 font-mono">
                <Icons.Calendar className="w-3.5 h-3.5 text-[#b18129]" />
                <span>
                  {lang === 'ar' ? 'الموعد المستهدف:' : 'Target Date:'}{' '}
                  {new Date(dynamicPhase?.targetDate || settings.weddingDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1.5 px-3 leading-relaxed">{info.description}</p>
            </div>
          )}
        </div>

        {/* PHASE-SPECIFIC BUDGET SUMMARY HEADER CARD */}
        <div className="glass-card rounded-2xl p-5 mb-6 border border-primary/10 shadow-md relative overflow-hidden bg-white/70">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-6 translate-x-6 shrink-0 pointer-events-none" />
          
          <div className="text-xs font-black uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1">
            <Icons.Coins className="w-4 h-4 text-primary" /> {lang === 'ar' ? 'حسابات ميزانية المرحلة' : 'Phase Budget Math'}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center divider-y">
            <div className="p-1">
              <span className="block text-[9px] font-extrabold uppercase tracking-wide text-on-surface-variant/70 leading-normal">
                {lang === 'ar' ? 'ميزانية المرحلة' : 'Phase Budget'}
              </span>
              <span className="text-sm font-black text-on-surface block mt-1">
                {allocatedBudget.toLocaleString()}
              </span>
              <span className="text-[8px] font-bold text-on-surface-variant/60">{t('sar', lang)}</span>
            </div>
            <div className="p-1 border-l border-outline-variant/20">
              <span className="block text-[9px] font-extrabold uppercase tracking-wide text-on-surface-variant/70 leading-normal">
                {lang === 'ar' ? 'إجمالي المصروفات' : 'Total Spent'}
              </span>
              <span className="text-sm font-black text-error block mt-1">
                {totalSpentInPhase.toLocaleString()}
              </span>
              <span className="text-[8px] font-bold text-on-surface-variant/60">{t('sar', lang)}</span>
            </div>
            <div className="p-1 border-l border-outline-variant/20">
              <span className="block text-[9px] font-extrabold uppercase tracking-wide text-on-surface-variant/70 leading-normal">
                {lang === 'ar' ? 'المتبقي' : 'Remaining'}
              </span>
              <span className={`text-sm font-black block mt-1 ${remainingPhaseBalance >= 0 ? 'text-primary' : 'text-error'}`}>
                {remainingPhaseBalance.toLocaleString()}
              </span>
              <span className="text-[8px] font-bold text-on-surface-variant/60">{t('sar', lang)}</span>
            </div>
          </div>
        </div>

        {/* Milestones / Goals Section */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="font-plus text-base font-bold text-on-surface flex items-center gap-1.5">
            <Icons.Layers className="w-4 h-4 text-secondary" /> {lang === 'ar' ? 'أهداف المرحلة' : 'Milestone Goals'}
          </h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[11px] font-extrabold uppercase text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            {showAddForm ? (
              t('cancel', lang)
            ) : (
              <>
                <Icons.Plus className="w-3.5 h-3.5" /> {lang === 'ar' ? 'إضافة هدف' : 'Add Goal'}
              </>
            )}
          </button>
        </div>

        {/* Dynamic add form directly embedded and assignment specific */}
        {showAddForm && (
          <form onSubmit={handleCreateMilestone} className="glass-card p-5 rounded-2xl border-2 border-primary/20 bg-white shadow-lg mb-6 animate-fade-in">
            <p className="text-xs font-black text-primary uppercase mb-4 tracking-wider flex items-center gap-1">
              ✏️ {lang === 'ar' ? `هدف جديد لمرحلة ${info.name}` : `New Milestone for ${info.name}`}
            </p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  {lang === 'ar' ? 'اسم الهدف' : 'Goal Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: حجز القاعة، شراء الشبكة' : 'e.g. Traditional Dinner, Rings Setup'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-sm focus:outline-primary placeholder-on-surface-variant/40 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  {lang === 'ar' ? 'القيمة المستهدفة (ر.س)' : 'Target (SAR)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-sm focus:outline-primary font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  {lang === 'ar' ? 'أيقونة التوضيح' : 'Representation Icon'}
                </label>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {AVAILABLE_ICONS.map((ico) => (
                    <button
                      key={ico.name}
                      type="button"
                      onClick={() => setNewIcon(ico.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        newIcon === ico.name 
                          ? 'border-primary bg-primary/10 text-primary scale-102 font-bold shadow-sm' 
                          : 'border-outline-variant/45 bg-white hover:bg-surface-container text-on-surface-variant/70 font-medium'
                      }`}
                    >
                      {renderIcon(ico.name, "w-5 h-5")}
                      <span className="text-[9px] text-center leading-tight tracking-wide font-semibold block">
                        {lang === 'ar' ? ico.labelAr : ico.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  {lang === 'ar' ? 'الحالة الأولية' : 'Initial Status'}
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setNewStatus('planning')}
                    className={`py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      newStatus === 'planning'
                        ? 'border-[#b18129] bg-[#b18129]/10 text-[#b18129] scale-[1.02]'
                        : 'border-outline-variant/45 bg-white hover:bg-surface-container text-on-surface-variant/60'
                    }`}
                  >
                    ⏳ {lang === 'ar' ? 'مخطط' : 'Planned'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('completed')}
                    className={`py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      newStatus === 'completed'
                        ? 'border-primary bg-primary/10 text-primary scale-[1.02]'
                        : 'border-outline-variant/45 bg-white hover:bg-surface-container text-on-surface-variant/60'
                    }`}
                  >
                    💍 {lang === 'ar' ? 'مكتمل' : 'Completed'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-opacity-95 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl mt-2 cursor-pointer transition-all active:scale-98"
              >
                {lang === 'ar' ? 'إنشاء هدف مالي' : 'Create'}
              </button>
            </div>
          </form>
        )}

        {/* Filtered Milestone Cards Feed Grid */}
        <div className="space-y-4">
          {filteredMilestones.length === 0 ? (
            <div className="text-center py-10 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
              <Icons.ShieldAlert className="w-8 h-8 mx-auto text-on-surface-variant/40 mb-2 animate-pulse" />
              <p className="text-xs font-bold text-on-surface-variant">
                {lang === 'ar' ? 'لم يتم إضافة أهداف مالية لهذه المرحلة بعد' : 'No custom expenses added for this phase'}
              </p>
              <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                {lang === 'ar' ? 'انقر على "إضافة هدف مالي" لتخصيص أهدافكم التقديرية!' : 'Click "Add Expense" above to allocate custom targets!'}
              </p>
            </div>
          ) : (
            filteredMilestones.map((m) => {
              const isExpanded = expandedId === m.id;
              const isEditing = editingId === m.id;
              
              const milestoneSpent = expenses
                .filter(e => e.category === m.category)
                .reduce((sum, e) => sum + e.amount, 0);
              const progressPercent = m.targetAmount > 0 
                ? Math.min(100, Math.round((milestoneSpent / m.targetAmount) * 100)) 
                : 0;

              let label = lang === 'ar' ? 'مخطط' : 'planned';
              let colorClasses = 'bg-surface-container-high text-on-surface-variant border-outline-variant/30';
              if (milestoneSpent >= m.targetAmount) {
                label = lang === 'ar' ? 'مكتمل' : 'completed';
                colorClasses = 'bg-primary/10 text-primary border-primary/20';
              } else if (milestoneSpent > 0) {
                label = lang === 'ar' ? 'قيد التنفيذ' : 'in progress';
                colorClasses = 'bg-[#b18129]/10 text-[#b18129] border-[#b18129]/20';
              }

              return (
                <div
                  key={m.id}
                  className={`rounded-2xl border p-4 shadow-sm transition-all bg-white relative overflow-hidden flex flex-col ${
                    milestoneSpent >= m.targetAmount
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-outline-variant/35'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant block">
                          {lang === 'ar' ? 'اسم الهدف' : 'Goal Name'}
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-surface-container rounded-lg px-2 py-1 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant block">
                          {lang === 'ar' ? 'السعر المستهدف (ر.س)' : 'Target Price (SAR)'}
                        </label>
                        <input
                          type="number"
                          value={editTarget}
                          onChange={(e) => setEditTarget(Number(e.target.value))}
                          className="w-full bg-surface-container rounded-lg px-2 py-1 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant block">
                          {lang === 'ar' ? 'الحالة' : 'Status'}
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as Milestone['status'])}
                          className="w-full bg-surface-container rounded-lg px-2 py-1 text-xs font-bold font-plus"
                        >
                          <option value="planning">{lang === 'ar' ? 'مخطط' : 'Planned'}</option>
                          <option value="completed">{lang === 'ar' ? 'مكتمل' : 'Completed'}</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(m)}
                          className="flex-1 bg-primary text-white text-[10px] font-black uppercase py-2 rounded-lg hover:brightness-95 transition-all"
                        >
                          {lang === 'ar' ? 'تطبيق التعديلات' : 'Apply Saved Settings'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 bg-surface-container-highest text-on-surface text-[10px] font-black uppercase py-2 rounded-lg hover:brightness-95"
                        >
                          {t('cancel', lang)}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Top viewable row */}
                      <div 
                        className="flex justify-between items-start cursor-pointer select-none"
                        onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      >
                        <div>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClasses} inline-block mb-1.5`}>
                            {label}
                          </span>
                          <h4 className="text-base font-extrabold text-on-surface font-plus">
                            {translateMilestoneName(m.name, lang)}
                          </h4>
                          <span className="text-[10px] font-semibold text-on-surface-variant/70 block mt-0.5 font-mono">
                            {lang === 'ar' ? `الفئة: #${m.category}` : `Category: #${m.category}`}
                          </span>
                        </div>

                        {/* Visual Circle Category Icon */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          milestoneSpent >= m.targetAmount 
                            ? 'bg-primary/10 border-primary/20 text-primary' 
                            : 'bg-surface-container border-outline-variant/30 text-on-surface-variant/80'
                        }`}>
                          {milestoneSpent >= m.targetAmount ? (
                            <Icons.CheckCircle className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            renderIcon(m.iconName, "w-4 h-4")
                          )}
                        </div>
                      </div>

                      {/* Progress slider bar */}
                      <div className="mt-4" onClick={() => setExpandedId(isExpanded ? null : m.id)}>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className="text-on-surface-variant font-medium">
                            {lang === 'ar' ? (
                              <>المدفوع: {milestoneSpent.toLocaleString()} / {m.targetAmount.toLocaleString()} ر.س</>
                            ) : (
                              <>Spent: {milestoneSpent.toLocaleString()} / {m.targetAmount.toLocaleString()} SAR</>
                            )}
                          </span>
                          <span className={milestoneSpent >= m.targetAmount ? 'text-primary' : 'text-on-surface'}>
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,110,28,0.2)]" 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Expandable items with recent transactions logic inside */}
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-outline-variant/20 flex flex-col gap-2 animate-fade-in text-xs font-semibold">
                          <div className="flex justify-between items-center bg-surface-container-low/50 p-2 rounded-lg text-[11px] text-on-surface-variant mb-1">
                            <span>{lang === 'ar' ? `الحالة: ${milestoneSpent >= m.targetAmount ? 'مكتمل' : 'مخطط'}` : `Status: ${milestoneSpent >= m.targetAmount ? 'Completed' : 'Planned'}`}</span>
                            <span>{lang === 'ar' ? `القيمة المستهدفة: ${m.targetAmount.toLocaleString()} ر.س` : `Target Amount: ${m.targetAmount.toLocaleString()} SAR`}</span>
                          </div>

                          {/* Related transactions list (Issue 4) */}
                          <div className="space-y-2 mt-2">
                            <p className="text-[10px] font-black text-on-surface-variant/70 uppercase tracking-widest">
                              {lang === 'ar' ? 'المصاريف المسجلة لهذا البند:' : 'Recorded Payments:'}
                            </p>
                            {(() => {
                              const milestoneExpenses = expenses.filter(e => e.category === m.category);
                              if (milestoneExpenses.length > 0) {
                                return (
                                  <div className="space-y-1.5">
                                    {milestoneExpenses.map(exp => (
                                      <div key={exp.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-outline-variant/20 shadow-2xs transition-all hover:border-outline-variant">
                                        <div>
                                          <p className="text-xs font-bold text-on-surface">
                                            {exp.note || (lang === 'ar' ? 'دفعة مباشرة' : 'Direct Payment')}
                                          </p>
                                          <p className="text-[9px] text-on-surface-variant/70 font-mono mt-0.5">{exp.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-error">-{exp.amount.toLocaleString()} {t('sar', lang)}</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const confirmMsg = lang === 'ar' ? 'هل أنت متأكد من حذف هذه الدفعة؟' : 'Delete this payment?';
                                              if (window.confirm(confirmMsg)) {
                                                onDeleteExpense(exp.id);
                                              }
                                            }}
                                            className="p-1 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-md transition-colors cursor-pointer"
                                            title={lang === 'ar' ? 'حذف الدفعة' : 'Delete Payment'}
                                          >
                                            <Icons.Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                              return (
                                <p className="text-[10px] italic text-on-surface-variant/50 text-center py-2 bg-surface-container-lowest/50 border border-outline-variant/10 rounded-xl">
                                  {lang === 'ar' ? 'لا توجد مدفوعات مسجلة بعد' : 'No payments recorded yet'}
                                </p>
                              );
                            })()}
                          </div>

                          {/* Action triggers */}
                          <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-outline-variant/10">
                            <button
                              type="button"
                              onClick={() => handleStartEditing(m)}
                              className="text-[10px] uppercase font-black text-[#b18129] hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <Icons.Edit3 className="w-3 h-3" /> {lang === 'ar' ? 'تعديل الهدف المالي' : 'Edit Milestone Bounds'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const confirmText = lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هدف التخطيط هذا؟' : 'Delete this milestone goal?';
                                if (window.confirm(confirmText)) {
                                  onDeleteMilestone(m.id);
                                }
                              }}
                              className="text-[10px] uppercase font-black text-error hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <Icons.Trash2 className="w-3 h-3" /> {lang === 'ar' ? 'حذف الهدف' : 'Remove Goal'}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>,
    document.body
  );
}

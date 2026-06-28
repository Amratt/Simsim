import React from 'react';
import * as Icons from 'lucide-react';
import { Expense, Milestone, WeddingSettings } from '../types';
import { PHASES_INFO } from './PhaseDetailScreen';
import { t, translatePhaseName } from '../lib/translations';

// SVG Polar Math helpers for traditional, clean pie/donut charts
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const getDonutSlicePath = (
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) => {
  if (endAngle - startAngle >= 359.99) {
    endAngle = startAngle + 359.99;
  }

  const startOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const startInner = polarToCartesian(x, y, innerRadius, startAngle);
  const endInner = polarToCartesian(x, y, innerRadius, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
};

interface AnalyticsViewProps {
  expenses: Expense[];
  milestones: Milestone[];
  settings: WeddingSettings;
  setTab: (tab: string) => void;
}

export default function AnalyticsView({
  expenses,
  milestones,
  settings,
  setTab,
}: AnalyticsViewProps) {
  const lang = settings.language || 'en';
  const [breakdownType, setBreakdownType] = React.useState<'planned' | 'completed'>('planned');

  // Filter milestones based on select box
  const pieMilestones = milestones.filter(m => {
    if (breakdownType === 'completed') {
      return m.status === 'completed';
    }
    return true; // 'planned' shows all assigned targets
  });

  // Global maths based on Completed milestones
  const totalSpent = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.targetAmount, 0);
  const totalBudget = settings.budgetLimit;
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const spendPercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  // Count planned goals
  const totalMilestonesCount = milestones.length;
  const completedMilestonesCount = milestones.filter(m => m.status === 'completed').length;

  // Calculate days left
  const today = new Date();
  const weddingDate = new Date(settings.weddingDate);
  const diffTime = weddingDate.getTime() - today.getTime();
  const daysToGo = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Define fixed proportional default budgets
  const phaseDefaultBudgets: Record<string, number> = {
    shofa: 5000,
    khutba: 15000,
    melka: 75000,
    wedding: 135500,
    honeymoon: 19500,
    house: 55000,
  };

  const currentPhases = settings.phases && settings.phases.length > 0
    ? settings.phases
    : [
        { id: 'shofa', name: 'Shofa', description: 'The foundation of your journey: vision, guests, and initial budgeting' }
      ];

  // Compile calculations for each phase
  const phaseStats = currentPhases.map((phase, idx) => {
    const budget = phase.allocatedBudget !== undefined ? phase.allocatedBudget : (phaseDefaultBudgets[phase.id] || 10000);
    const phaseMilestones = milestones.filter(m => m.phaseId === phase.id);
    const spent = phaseMilestones
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + m.targetAmount, 0);
    const completedM = phaseMilestones.filter(m => m.status === 'completed').length;

    const spentPercent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

    return {
      key: phase.id,
      name: translatePhaseName(phase.id, phase.name, lang),
      num: idx + 1,
      budget,
      spent,
      spentPercent,
      milestonesCount: phaseMilestones.length,
      completedCount: completedM,
    };
  });

  // Group milestones targetAmount by representation key (label of iconName)
  const ICON_LABELS: Record<string, string> = {
    Coins: 'Cash',
    Gem: 'Jewelry',
    Utensils: 'Catering & Feast',
    Video: 'Media & Photography',
    Flower: 'Flowers & Decor',
    Venue: 'Venues',
    Gift: 'Gifts',
    Plane: 'Travel & Tourism',
    Home: 'Housing & Furniture',
    Other: 'Other',
  };

  const ICON_LABELS_AR: Record<string, string> = {
    Coins: 'نقدية',
    Gem: 'مجوهرات وشبكة',
    Utensils: 'ضيافة ووليمة',
    Video: 'تصوير وإعلام',
    Flower: 'ورد وديكور',
    Venue: 'قاعات وأماكن',
    Gift: 'هدايا وتوزيعات',
    Plane: 'سفر وسياحة',
    Home: 'تأثيث ومنزل',
    Other: 'أخرى',
  };

  const representationDataMap: Record<string, number> = {};
  pieMilestones.forEach(m => {
    const label = lang === 'ar'
      ? (ICON_LABELS_AR[m.iconName] || m.iconName || 'أخرى')
      : (ICON_LABELS[m.iconName] || m.iconName || 'Other');
    representationDataMap[label] = (representationDataMap[label] || 0) + m.targetAmount;
  });

  const representationData = Object.entries(representationDataMap)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalRepresentationValue = representationData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = [
    '#006e1c', // Primary deep green
    '#b18129', // Gold/bronze
    '#0284c7', // Sky blue
    '#ec4899', // Pink
    '#8b5cf6', // Purple
    '#f97316', // Orange
    '#14b8a6', // Teal
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#eab308', // Yellow
  ];

  const getLabelIcon = (label: string) => {
    const labelToIconName: Record<string, string> = {
      // English keys
      'Cash': 'Coins',
      'Jewelry': 'Gem',
      'Catering & Feast': 'Utensils',
      'Media & Photography': 'Video',
      'Flowers & Decor': 'Flower',
      'Venues': 'Building',
      'Gifts': 'Gift',
      'Travel & Tourism': 'Plane',
      'Housing & Furniture': 'Home',
      'Other': 'MoreHorizontal',
      // Arabic keys
      'نقدية': 'Coins',
      'مجوهرات وشبكة': 'Gem',
      'ضيافة ووليمة': 'Utensils',
      'تصوير وإعلام': 'Video',
      'ورد وديكور': 'Flower',
      'قاعات وأماكن': 'Building',
      'هدايا وتوزيعات': 'Gift',
      'سفر وسياحة': 'Plane',
      'تأثيث ومنزل': 'Home',
      'أخرى': 'MoreHorizontal',
    };
    const iconName = labelToIconName[label] || 'HelpCircle';
    const IconComp = (Icons as any)[iconName] || Icons.HelpCircle;
    return <IconComp className="w-3.5 h-3.5" />;
  };

  return (
    <div className="relative z-10 pb-28" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Shell Pattern */}
      <div className="fixed inset-0 pointer-events-none turtle-shell-pattern z-0 opacity-70" />

      {/* Title */}
      <section className="mb-6 relative z-10">
        <h2 className="font-plus text-3xl font-extrabold text-on-surface tracking-tight">
          {lang === 'ar' ? 'لوحة تحليلات زفافكم' : 'Analytics Dashboard'}
        </h2>
        <p className="text-sm text-on-surface-variant font-medium mt-1">
          {lang === 'ar' ? 'نظرة بصرية معمقة وشاملة لجميع مراحل تخطيط الزواج.' : 'Deep visual insights across all wedding planning phases.'}
        </p>
      </section>

      {/* Two Horizontal Core Metrics Grid */}
      <section className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-sm text-center">
          <Icons.Layers className="w-6 h-6 text-primary mx-auto mb-1.5" />
          <span className="block text-xl font-black text-primary font-plus">
            {currentPhases.length}
          </span>
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
            {lang === 'ar' ? 'المراحل التي تم إنشاؤها' : 'Phases Created'}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-sm text-center">
          <Icons.Calendar className="w-6 h-6 text-primary mx-auto mb-1.5" />
          <span className="block text-xl font-black text-primary font-plus">
            {daysToGo}
          </span>
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
            {lang === 'ar' ? 'الأيام المتبقية' : 'Days Remaining'}
          </span>
        </div>
      </section>

      {/* Visual Phase Budgets Bar Chart (SVG Horizontal Layout) */}
      <section className="mb-6 relative z-10">
        <div className="glass-card rounded-2xl p-5 border border-primary/10 bg-white/70">
          <h3 className="font-plus text-base font-bold text-on-surface mb-4 flex items-center gap-1.5">
            <Icons.BarChart2 className="w-4 h-4 text-primary" /> {lang === 'ar' ? 'الميزانية مقابل المصروف الفعلي لكل مرحلة' : 'Budget vs. Spent by Phase'}
          </h3>

          <div className="space-y-4">
            {phaseStats.map(stat => (
              <div key={stat.key} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-on-surface leading-snug">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {stat.name}
                  </span>
                  <span className="text-on-surface-variant font-medium">
                    {stat.spent.toLocaleString()} / {stat.budget.toLocaleString()} {t('sar', lang)}
                  </span>
                </div>
                
                {/* Stacked comparison bar */}
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary/30 rounded-full"
                    style={{ width: '100%' }} // Represents budget allocated (relative full space)
                  />
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-800"
                    style={{ width: `${stat.spentPercent}%` }} // Actual Spent proportion
                  />
                </div>
                
                {/* Secondary detail row */}
                <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-on-surface-variant/70 uppercase">
                  <span>
                    {lang === 'ar' ? `${stat.spentPercent}% مصروف من المرحلة` : `${stat.spentPercent}% Spent in Phase`}
                  </span>
                  <span>
                    {lang === 'ar' ? `تم إنجاز ${stat.completedCount} من أصل ${stat.milestonesCount} من البنود` : `${stat.completedCount} of ${stat.milestonesCount} Goals Completed`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Pie Chart Breakdown Mode Filter */}
      <section className="mb-6 relative z-10">
        <div className="glass-card rounded-2xl p-4 border border-primary/15 bg-white/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Icons.SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-plus text-sm font-bold text-on-surface">
                {lang === 'ar' ? 'خيار استعراض الميزانية' : 'Breakdown View Option'}
              </h4>
              <p className="text-[10px] text-on-surface-variant font-medium">
                {lang === 'ar' ? 'اختر بين عرض مبالغ الميزانية المخططة أو المصروفات المكتملة فعلياً' : 'Select whether to display planned budget metrics or completed actuals'}
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-auto shrink-0">
            <select
              value={breakdownType}
              onChange={(e) => setBreakdownType(e.target.value as 'planned' | 'completed')}
              className="w-full sm:w-48 appearance-none bg-primary text-white font-black text-[11px] uppercase tracking-wider pl-4 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer shadow-md text-center"
            >
              <option value="planned" className="bg-white text-on-surface font-bold py-2">
                {lang === 'ar' ? 'مخطط' : 'Planned'}
              </option>
              <option value="completed" className="bg-white text-on-surface font-bold py-2">
                {lang === 'ar' ? 'مكتمل' : 'Completed'}
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-white">
              <Icons.ChevronDown className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </div>
      </section>

      {/* Representation Categories Distribution Pie Chart */}
      <section className="mb-6 relative z-10">
        <div className="glass-card rounded-2xl p-5 border border-primary/10 bg-white/70">
          <h3 className="font-plus text-base font-bold text-on-surface mb-4 flex items-center gap-1.5">
            <Icons.PieChart className="w-4 h-4 text-primary" /> {lang === 'ar' ? `توزيع الميزانية الإجمالية (${breakdownType === 'completed' ? 'المكتملة' : 'المخططة'})` : `Overall ${breakdownType === 'completed' ? 'Completed' : 'Planned'} Budget Distribution`}
          </h3>

          {totalRepresentationValue === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-primary/10 rounded-2xl bg-primary/5">
              <Icons.Inbox className="w-8 h-8 text-on-surface-variant/40 mb-2" />
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider text-center">
                {lang === 'ar' ? 'لا توجد بنود مضافة بعد' : 'No Categories Plotted'}
              </p>
              <p className="text-[10px] text-on-surface-variant/60 mt-1 text-center max-w-xs">
                {lang === 'ar' ? 'أضف بنود ميزانية أو أهدافاً مالية بفئات مختلفة لمشاهدة المخطط التوضيحي لتوزيع المصروفات.' : 'Add budget items or goals with representational categories to see your distribution breakdown.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Chart container */}
              <div className="relative shrink-0 w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 140 140" className="w-36 h-36">
                  {/* Background track circle */}
                  <path
                    d={getDonutSlicePath(70, 70, 38, 56, 0, 359.99)}
                    fill="#f1f5f9"
                  />
                  {(() => {
                    let runningAngle = 0;
                    return representationData.map((item, index) => {
                      const percent = (item.value / totalRepresentationValue) * 100;
                      const angleSweep = (percent / 100) * 360;
                      const startAngle = runningAngle;
                      const endAngle = runningAngle + angleSweep;
                      runningAngle = endAngle;
                      const color = COLORS[index % COLORS.length];

                      return (
                        <path
                          key={item.name}
                          d={getDonutSlicePath(70, 70, 38, 56, startAngle, endAngle)}
                          fill={color}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                        />
                      );
                    });
                  })()}
                </svg>
                {/* Center text for donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
                    {lang === 'ar' ? 'الإجمالي' : 'Total'}
                  </span>
                  <span className="text-xs font-black text-on-surface leading-tight mt-0.5">{totalRepresentationValue.toLocaleString()}</span>
                  <span className="text-[8px] font-bold text-on-surface-variant/70 uppercase">{t('sar', lang)}</span>
                </div>
              </div>

              {/* Legend container */}
              <div className="flex-1 w-full space-y-2.5">
                {representationData.map((item, index) => {
                  const percent = (item.value / totalRepresentationValue) * 100;
                  const color = COLORS[index % COLORS.length];
                  return (
                    <div key={item.name} className="flex items-center justify-between text-xs font-bold text-on-surface">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="flex items-center gap-1.5 text-on-surface-variant/90 font-medium">
                          {getLabelIcon(item.name)}
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono text-on-surface text-right shrink-0">
                        {item.value.toLocaleString()} {t('sar', lang)} ({Math.round(percent)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Individual Path-Specific Pie Charts */}
      {currentPhases.map((phase) => {
        const phaseMilestones = pieMilestones.filter(m => m.phaseId === phase.id);
        const phaseRepMap: Record<string, number> = {};
        phaseMilestones.forEach(m => {
          const label = lang === 'ar'
            ? (ICON_LABELS_AR[m.iconName] || m.iconName || 'أخرى')
            : (ICON_LABELS[m.iconName] || m.iconName || 'Other');
          phaseRepMap[label] = (phaseRepMap[label] || 0) + m.targetAmount;
        });

        const phaseRepData = Object.entries(phaseRepMap)
          .map(([name, value]) => ({ name, value }))
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value);

        const totalPhaseValue = phaseRepData.reduce((sum, item) => sum + item.value, 0);

        if (totalPhaseValue === 0) return null; // Only show if there is data

        return (
          <section key={phase.id} className="mb-6 relative z-10 animate-fade-in">
            <div className="glass-card rounded-2xl p-5 border border-primary/10 bg-white/70">
              <h3 className="font-plus text-base font-bold text-on-surface mb-4 flex items-center gap-1.5">
                <Icons.PieChart className="w-4 h-4 text-primary" /> {lang === 'ar' ? (
                  <>تفاصيل مصروفات ({breakdownType === 'completed' ? 'المكتملة' : 'المخططة'}) لمرحلة {translatePhaseName(phase.id, phase.name, lang)}</>
                ) : (
                  <>{translatePhaseName(phase.id, phase.name, lang)} {breakdownType === 'completed' ? 'Completed' : 'Planned'} Expense Breakdown</>
                )}
              </h3>

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Chart container */}
                <div className="relative shrink-0 w-32 h-32 flex items-center justify-center">
                  <svg viewBox="0 0 140 140" className="w-32 h-32">
                    {/* Background track circle */}
                    <path
                      d={getDonutSlicePath(70, 70, 38, 56, 0, 359.99)}
                      fill="#f1f5f9"
                    />
                    {(() => {
                      let runningAngle = 0;
                      return phaseRepData.map((item, index) => {
                        const percent = (item.value / totalPhaseValue) * 100;
                        const angleSweep = (percent / 100) * 360;
                        const startAngle = runningAngle;
                        const endAngle = runningAngle + angleSweep;
                        runningAngle = endAngle;
                        const color = COLORS[index % COLORS.length];

                        return (
                          <path
                            key={item.name}
                            d={getDonutSlicePath(70, 70, 38, 56, startAngle, endAngle)}
                            fill={color}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                          />
                        );
                      });
                    })()}
                  </svg>
                  {/* Center text for donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[7px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
                      {lang === 'ar' ? 'الإجمالي' : 'Total'}
                    </span>
                    <span className="text-[11px] font-black text-on-surface leading-tight mt-0.5">{totalPhaseValue.toLocaleString()}</span>
                    <span className="text-[7px] font-bold text-on-surface-variant/70 uppercase">{t('sar', lang)}</span>
                  </div>
                </div>

                {/* Legend container */}
                <div className="flex-1 w-full space-y-2">
                  {phaseRepData.map((item, index) => {
                    const percent = (item.value / totalPhaseValue) * 100;
                    const color = COLORS[index % COLORS.length];
                    return (
                      <div key={item.name} className="flex items-center justify-between text-xs font-bold text-on-surface">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className="flex items-center gap-1.5 text-on-surface-variant/90 font-medium">
                            {getLabelIcon(item.name)}
                            {item.name}
                          </span>
                        </div>
                        <span className="font-mono text-on-surface text-right shrink-0">
                          {item.value.toLocaleString()} {t('sar', lang)} ({Math.round(percent)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}

    </div>
  );
}

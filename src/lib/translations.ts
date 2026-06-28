export type Language = 'en' | 'ar';

export const TRANSLATIONS = {
  // Navigation
  oasis: {
    en: 'The Oasis',
    ar: 'الواحة',
  },
  analytics: {
    en: 'Analytics',
    ar: 'التحليلات',
  },
  settings: {
    en: 'Settings',
    ar: 'الإعدادات',
  },

  // Onboarding
  chooseLanguage: {
    en: 'Choose App Language',
    ar: 'اختر لغة التطبيق',
  },
  welcomeSimsim: {
    en: "Ahlan! I'm Simsim, your wedding companion. Let's customize your marital roadmap.",
    ar: "أهلاً بك! أنا سمسم، رفيقك في التخطيط للزواج. دعنا نخصص مسار رحلتك الزوجية.",
  },
  meetCompanion: {
    en: 'Meet your Companion',
    ar: 'اختر رفيقك',
  },
  weddingTimeline: {
    en: 'Your Wedding Timeline',
    ar: 'الجدول الزمني لزواجك',
  },
  stepIndicator: {
    en: 'Step {step} of {total}',
    ar: 'الخطوة {step} من {total}',
  },
  companionSpeechStep1: {
    en: "Ahlan! I'm Simsim, your wedding companion. Let's record your names to start preparing the perfect path! 🐢🌱",
    ar: "أهلاً! أنا سمسم رفيق دربك في التخطيط. دعنا نسجل أسماءكم لنبدأ برسم المسار المثالي! 🐢🌱",
  },
  companionSpeechStep2: {
    en: 'Terrific! Now, pick your dream date and maximum budget cap so I can draft your progress metrics!',
    ar: 'رائع! الآن، حدد موعد ليلة العمر وميزانيتك القصوى لأقوم بإنشاء لوحة المتابعة الخاصة بك!',
  },
  onboardingDescStep1: {
    en: "Tell Simsim the happy couple's names so we can customize your marital roadmap.",
    ar: "أخبر سمسم بأسماء العروسين لنتمكن من تخصيص مسار رحلتكم الزوجية.",
  },
  onboardingDescStep2: {
    en: "Let's establish the target budget limit and wedding date to set up the path.",
    ar: "دعنا نحدد الميزانية المستهدفة وتاريخ الزفاف لنمهد الطريق.",
  },
  yourName: {
    en: 'Your Name',
    ar: 'اسمك الكريم',
  },
  partnerName: {
    en: "Your Partner's Name",
    ar: 'اسم شريك حياتك',
  },
  chooseCompanion: {
    en: 'Choose Your Guardian Shell Companion 🐢',
    ar: 'اختر لون رفيقك الدرع الحامي 🐢',
  },
  budgetLimitSar: {
    en: 'Budget Allocation Cap (SAR)',
    ar: 'الحد الأقصى للميزانية (ريال سعودي)',
  },
  weddingDateProj: {
    en: 'Projected Wedding Date',
    ar: 'تاريخ الزفاف المتوقع',
  },
  continueSetup: {
    en: 'Continue Setup',
    ar: 'متابعة الإعداد',
  },
  buildOasisPath: {
    en: 'Build My Oasis Path',
    ar: 'أنشئ مسار واحتنا',
  },
  back: {
    en: 'Back',
    ar: 'رجوع',
  },
  placeholderYourName: {
    en: 'Enter your name',
    ar: 'أدخل اسمك',
  },
  placeholderPartnerName: {
    en: 'Enter partner name',
    ar: 'أدخل اسم الشريك',
  },
  validationNames: {
    en: '✨ Please provide both names to personalize your companion!',
    ar: '✨ يرجى إدخال الاسمين لتخصيص رفيقك!',
  },
  validationDate: {
    en: '📅 Please pick your magical wedding date.',
    ar: '📅 يرجى اختيار تاريخ الزفاف المميز.',
  },
  validationBudget: {
    en: '💰 Please set a reasonable budget capacity limit.',
    ar: '💰 يرجى تحديد ميزانية معقولة للبدء.',
  },
  footerOrnament: {
    en: 'Simsim Oasis — Hand-crafted wedding companion',
    ar: 'واحة سمسم — رفيق التخطيط المصمم بحب',
  },

  // Main screen/app bar
  totalBudget: {
    en: 'Total Budget',
    ar: 'الميزانية الكلية',
  },
  totalSpent: {
    en: 'Total Spent',
    ar: 'إجمالي المصاريف',
  },
  sar: {
    en: 'SAR',
    ar: 'ر.س',
  },
  daysRemaining: {
    en: '{days} Days Remaining',
    ar: 'متبقي {days} يوم',
  },
  daysAgo: {
    en: 'Wedding was {days} days ago',
    ar: 'أقيم الزفاف منذ {days} يوم',
  },
  weddingDay: {
    en: "Today is the Big Day! 💍✨",
    ar: "اليوم هو اليوم المنتظر! 💍✨",
  },

  // The Oasis View
  activeStage: {
    en: 'Active Stage',
    ar: 'المرحلة النشطة',
  },
  changeActiveStage: {
    en: 'Change Active Stage',
    ar: 'تغيير المرحلة النشطة',
  },
  activePhaseText: {
    en: 'Current Focus',
    ar: 'التركيز الحالي',
  },
  allocatedBudget: {
    en: 'Allocated Budget',
    ar: 'الميزانية المخصصة',
  },
  spent: {
    en: 'Spent',
    ar: 'المنصرف',
  },
  addPhase: {
    en: 'Add New Phase',
    ar: 'إضافة مرحلة جديدة',
  },
  addMilestone: {
    en: 'Add Custom Goal',
    ar: 'إضافة هدف مخصص',
  },
  noMilestonesYet: {
    en: 'No planning goals added to this phase yet.',
    ar: 'لم يتم إضافة أهداف تخطيط لهذه المرحلة بعد.',
  },
  addFirstMilestone: {
    en: 'Create a custom goal above to begin detailing this stage!',
    ar: 'أنشئ هدفاً مخصصاً أعلاه لبدء تفصيل هذه المرحلة!',
  },
  phaseBudgetEditPrompt: {
    en: 'Adjust Phase Allocated Budget',
    ar: 'تعديل الميزانية المخصصة للمرحلة',
  },
  save: {
    en: 'Save',
    ar: 'حفظ',
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء',
  },

  // Add Phase Modal
  addPhaseTitle: {
    en: 'Forge a New Stage',
    ar: 'تأسيس مرحلة جديدة',
  },
  addPhaseDesc: {
    en: 'Add a custom milestone stage to your marriage roadmap. Distribute your total budget accordingly.',
    ar: 'أضف مرحلة مخصصة جديدة إلى مسار زفافك. ووزّع ميزانيتك الإجمالية بناءً على ذلك.',
  },
  phaseNameLabel: {
    en: 'Phase Name',
    ar: 'اسم المرحلة',
  },
  phaseBudgetLabel: {
    en: 'Allocated Phase Budget (SAR)',
    ar: 'ميزانية المرحلة المخصصة (ر.س)',
  },
  phasePercentLabel: {
    en: 'Percentage of total budget',
    ar: 'النسبة المئوية من الميزانية الإجمالية',
  },
  createPhaseBtn: {
    en: 'Construct Stage',
    ar: 'تثبيت المرحلة',
  },

  // Phase suggestions (translated)
  phase_shofa_title: { en: 'Shofa', ar: 'الشوفه الشرعية' },
  phase_shofa_desc: { en: 'The foundation of your journey: vision, guests, and initial budgeting', ar: 'تأسيس رحلتكم: الرؤية، قائمة الضيوف الأولية، وتقدير الميزانية الأساسية' },
  phase_khutba_title: { en: 'Khutba', ar: 'الخطوبة' },
  phase_khutba_desc: { en: 'Engagement, proposal meetings, and personal wardrobe', ar: 'اللقاءات الرسمية، حفل الخطوبة، وتجهيز المظهر الخارجي والملابس' },
  phase_melka_title: { en: 'Melka', ar: 'عقد القران (الملكة)' },
  phase_melka_desc: { en: 'Dowry (Mahr) delivery, Shabka jewelry purchase, and official license', ar: 'تقديم المهر، شراء الشبكة والذهب، وإتمام عقد النكاح الرسمي' },
  phase_wedding_title: { en: 'The Wedding', ar: 'حفل الزفاف' },
  phase_wedding_desc: { en: 'Celebratory hall, photography, catering, and evening guest feast', ar: 'القاعة والضيافة، التصوير، الكوشة، ووجبة عشاء المدعوين' },
  phase_honeymoon_title: { en: 'Honeymoon', ar: 'شهر العسل' },
  phase_honeymoon_desc: { en: 'Flights, hotel bookings, and post-ceremony travels', ar: 'حجز الطيران، الفنادق، والرحلات الترفيهية بعد مراسم الزواج' },
  phase_house_title: { en: 'The House', ar: 'عش الزوجية' },
  phase_house_desc: { en: 'Appliances, living room layout, and essential home furnishing', ar: 'الأجهزة الكهربائية، أثاث المعيشة والغرف، وتجهيز المنزل بالكامل' },

  // Phase Detail Screen
  phaseDetailsTitle: {
    en: 'Phase Details',
    ar: 'تفاصيل المرحلة',
  },
  stopNumber: {
    en: 'Stop {num} of {total}',
    ar: 'المحطة {num} من {total}',
  },
  editStageDetails: {
    en: 'Edit Stage Details',
    ar: 'تعديل تفاصيل المرحلة',
  },
  goalsPlanned: {
    en: 'Goals Planned',
    ar: 'الأهداف المخططة',
  },
  spentOfBudget: {
    en: 'Spent of Budget',
    ar: 'المصروف من الميزانية',
  },
  goalsCompleted: {
    en: 'Goals Completed',
    ar: 'الأهداف المكتملة',
  },
  planningStatus: {
    en: 'Planning',
    ar: 'قيد التخطيط',
  },
  completedStatus: {
    en: 'Paid / Completed',
    ar: 'تم الدفع / مكتمل',
  },
  milestoneNameLabel: {
    en: 'Goal / Milestone Name',
    ar: 'اسم الهدف / المهمة',
  },
  targetAmountLabel: {
    en: 'Target Budget Cost (SAR)',
    ar: 'التكلفة المستهدفة (ر.س)',
  },
  categoryIconLabel: {
    en: 'Icon / Theme Style',
    ar: 'أيقونة ونوع المهمة',
  },
  addGoalBtn: {
    en: 'Assemble Goal',
    ar: 'إضافة الهدف',
  },
  recordExpenseBtn: {
    en: 'Record Direct Expense',
    ar: 'تسجيل مصاريف مباشرة',
  },
  deleteGoalConfirm: {
    en: 'Are you sure you want to delete this planning goal?',
    ar: 'هل أنت متأكد من رغبتك في حذف هذا الهدف التخطيطي؟',
  },
  noGoalsTitle: {
    en: 'No Goals Registered',
    ar: 'لا توجد أهداف مسجلة',
  },
  noGoalsDesc: {
    en: 'Add goals to divide this stage budget into clear tracking items.',
    ar: 'أضف أهدافاً لتقسيم ميزانية هذه المرحلة إلى بنود متابعة واضحة.',
  },

  // Add Expense Modal
  addExpenseTitle: {
    en: 'Record Real Expense',
    ar: 'تسجيل مصاريف حقيقية',
  },
  addExpenseDesc: {
    en: 'Deduct from your allocated budgets by tracking actual money spent on a milestone.',
    ar: 'خصم المبالغ من الميزانيات المخصصة عبر تسجيل الأموال المدفوعة فعلياً للهدف.',
  },
  selectGoalPrompt: {
    en: 'Select Targeted Goal',
    ar: 'اختر الهدف المستهدف',
  },
  amountSpentLabel: {
    en: 'Amount Spent (SAR)',
    ar: 'المبلغ المدفوع (ر.س)',
  },
  paymentDateLabel: {
    en: 'Payment Date',
    ar: 'تاريخ الدفع',
  },
  optionalNoteLabel: {
    en: 'Optional Note / Vendor details',
    ar: 'ملاحظة اختيارية / تفاصيل المورد',
  },
  placeholderNote: {
    en: 'e.g. Paid deposit to photographer',
    ar: 'مثال: تم دفع عربون المصور',
  },
  recordPaymentBtn: {
    en: 'Record Payment',
    ar: 'تسجيل الدفعة',
  },

  // Analytics View
  analyticsViewTitle: {
    en: 'Deep Visual Insights',
    ar: 'تحليلات مرئية عميقة',
  },
  analyticsSubtitle: {
    en: 'Comprehensive metrics across all created cultural phases.',
    ar: 'مقاييس شاملة عبر جميع مراحل التجهيز الحالية.',
  },
  phasesCreated: {
    en: 'Phases Created',
    ar: 'المراحل المنشأة',
  },
  budgetSpentOverview: {
    en: 'Budget Spent Overview',
    ar: 'نظرة عامة على المصاريف',
  },
  unallocatedCapacity: {
    en: 'Unallocated Capacity',
    ar: 'السعة غير المخصصة',
  },
  unallocatedDesc: {
    en: 'The remaining balance of your overall budget that hasn’t been assigned to any phase.',
    ar: 'الرصيد المتبقي من ميزانيتك الإجمالية الذي لم يتم تعيينه لأي مرحلة بعد.',
  },
  unallocatedWarn: {
    en: '⚠️ Overallocated by {amount} SAR! Your phase budgets exceed your total cap.',
    ar: '⚠️ تجاوزت الميزانية بمقدار {amount} ر.س! ميزانيات المراحل تتجاوز الحد الأقصى.',
  },
  unallocatedSafe: {
    en: 'You have {amount} SAR available to assign to future stages.',
    ar: 'لديك {amount} ر.س متاحة للتخصيص للمراحل القادمة.',
  },
  budgetVsSpentPhase: {
    en: 'Budget vs. Spent by Phase',
    ar: 'الميزانية مقابل المنصرف حسب المرحلة',
  },
  spentInPhase: {
    en: '{percent}% Spent in Phase',
    ar: 'تم صرف {percent}% في هذه المرحلة',
  },
  goalsPhaseCount: {
    en: '{completed} of {total} Goals Completed',
    ar: 'اكتمل {completed} من {total} من الأهداف',
  },
  breakdownViewOption: {
    en: 'Breakdown View Option',
    ar: 'خيارات تقسيم المصاريف',
  },
  breakdownViewDesc: {
    en: 'Select whether to display planned budget metrics or completed actuals',
    ar: 'اختر ما إذا كنت ترغب في عرض الميزانية المخططة أو المصاريف الفعلية المكتملة',
  },
  optionPlanned: {
    en: 'Planned',
    ar: 'المخطط',
  },
  optionCompleted: {
    en: 'Completed',
    ar: 'المكتمل',
  },
  overallDistribution: {
    en: 'Overall {type} Budget Distribution',
    ar: 'توزيع الميزانية {type} الإجمالية',
  },
  noDataPie: {
    en: 'No target amount data available for this view selection yet.',
    ar: 'لا توجد بيانات متاحة لهذا العرض التخطيطي بعد.',
  },
  legendTotal: {
    en: 'Total',
    ar: 'الإجمالي',
  },
  phaseExpenseBreakdown: {
    en: '{phase} {type} Expense Breakdown',
    ar: 'تفصيل مصاريف {phase} ({type})',
  },

  // Settings View
  profileConfigTitle: {
    en: 'Profile Settings',
    ar: 'إعدادات الملف الشخصي',
  },
  companionNameLabel: {
    en: 'Companion Name',
    ar: 'اسم رفيقك',
  },
  partnerNameLabel: {
    en: "Partner's Name",
    ar: 'اسم شريك الحياة',
  },
  capLimitLabel: {
    en: 'Maximum Cap Limit (SAR)',
    ar: 'الحد الأقصى للميزانية (ر.س)',
  },
  weddingDateLabel: {
    en: 'Wedding Date',
    ar: 'تاريخ الزفاف',
  },
  avatarChoiceLabel: {
    en: 'Avatar Identity',
    ar: 'شخصية رفيقك',
  },
  languageChoiceLabel: {
    en: 'App Language',
    ar: 'لغة التطبيق',
  },
  saveSettingsBtn: {
    en: 'Save Settings',
    ar: 'حفظ الإعدادات',
  },
  dangerActionsTitle: {
    en: 'Danger Actions',
    ar: 'إجراءات خطيرة',
  },
  resetInfoTitle: {
    en: 'Reset Information',
    ar: 'إعادة ضبط البيانات',
  },
  resetInfoDesc: {
    en: 'Wipes all settings, budgets, companion choice, milestones, and expenses. This brings you back to the very beginning of the onboarding experience.',
    ar: 'سيؤدي هذا إلى مسح كافة الإعدادات والميزانيات واختيار رفيقك والمهام والمصاريف بشكل نهائي، مما يعيدك لبداية إعداد التطبيق.',
  },
  resetInfoBtn: {
    en: 'Reset Information',
    ar: 'إعادة ضبط البيانات',
  },
  confirmResetTitle: {
    en: '🚨 Permamently Reset App?',
    ar: '🚨 هل تريد إعادة الضبط نهائياً؟',
  },
  confirmResetDesc: {
    en: 'All your custom phases, goals, and recorded expenses will be wiped out forever.',
    ar: 'سيتم مسح كافة المراحل المخصصة والخطط والمصاريف المسجلة نهائياً ولا يمكن استرجاعها.',
  },
  confirmResetYes: {
    en: 'Yes, Reset Settings',
    ar: 'نعم، امسح كل شيء',
  },
  confirmResetNo: {
    en: 'No, Keep My Data',
    ar: 'لا، احتفظ ببياناتي',
  },
  savedSuccess: {
    en: '✨ Settings updated successfully!',
    ar: '✨ تم حفظ الإعدادات بنجاح!',
  },

  // Category labels and icons
  cat_shofa_intro: { en: 'Intro Vision', ar: 'الرؤية المبدئية' },
  cat_khutba_feast: { en: 'Engagement Feast', ar: 'وليمة الخطوبة' },
  cat_mahr: { en: 'Mahr (Dowry)', ar: 'المهر الشرعي' },
  cat_shabka: { en: 'Shabka Jewelry', ar: 'الشبكة والذهب' },
  cat_venue: { en: 'Wedding Venue', ar: 'قاعة الزفاف' },
  cat_flowers: { en: 'Flowers & Decor', ar: 'الورد والديكور' },
  cat_photo: { en: 'Photography', ar: 'التصوير والفيديو' },
  cat_gifts: { en: 'Gifts & Favors', ar: 'الهدايا والتوزيعات' },
  cat_honeymoon_travel: { en: 'Honeymoon Travel', ar: 'سفر شهر العسل' },
  cat_house_furniture: { en: 'Home Furniture', ar: 'أثاث المنزل' },
  cat_other: { en: 'Other Expense', ar: 'مصاريف أخرى' },
};

export function t(key: keyof typeof TRANSLATIONS | string, lang: Language = 'en'): string {
  const record = (TRANSLATIONS as any)[key];
  if (record && record[lang]) {
    return record[lang];
  }
  return key;
}

export function translatePhaseName(id: string, name: string, lang: Language): string {
  const key = `phase_${id}_title`;
  const record = (TRANSLATIONS as any)[key];
  if (record && record[lang]) {
    return record[lang];
  }
  return name;
}

export function translatePhaseDesc(id: string, desc: string, lang: Language): string {
  const key = `phase_${id}_desc`;
  const record = (TRANSLATIONS as any)[key];
  if (record && record[lang]) {
    return record[lang];
}
  return desc;
}

export function translateCategory(category: string, lang: Language): string {
  const key = `cat_${category}`;
  const record = (TRANSLATIONS as any)[key];
  if (record && record[lang]) {
    return record[lang];
  }
  return category;
}

export const MILESTONE_NAME_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  'Initial Vision & Guest List Draft': { en: 'Initial Vision & Guest List Draft', ar: 'مسودة الرؤية الأولية وقائمة الضيوف' },
  'Engagement Feast & Wardrobe': { en: 'Engagement Feast & Wardrobe', ar: 'وليمة الخطوبة وتجهيز الملابس' },
  'Mahr (Dowry) Payment': { en: 'Mahr (Dowry) Payment', ar: 'تقديم المهر الشرعي' },
  'Shabka & Jewelry': { en: 'Shabka & Jewelry', ar: 'الشبكة والذهب والمجوهرات' },
  'The Venue & Feast': { en: 'The Venue & Feast', ar: 'حجز قاعة الزفاف والضيافة والوليمة' },
  'Flowers & Decoration': { en: 'Flowers & Decoration', ar: 'تنسيق الورد والديكورات والكوشة' },
  'Photography & Media': { en: 'Photography & Media', ar: 'التصوير الفوتوغرافي والفيديو والزفات' },
  'Gifts & Favors': { en: 'Gifts & Favors', ar: 'تجهيز الهدايا والتوزيعات التذكارية' },
  'Honeymoon Flights & Hotels': { en: 'Honeymoon Flights & Hotels', ar: 'تذاكر طيران وفنادق شهر العسل' },
  'Home Furniture & Appliances': { en: 'Home Furniture & Appliances', ar: 'تأثيث المنزل وشراء الأجهزة الكهربائية' },
};

export function translateMilestoneName(name: string, lang: Language): string {
  const record = MILESTONE_NAME_TRANSLATIONS[name];
  if (record && record[lang]) {
    return record[lang];
  }
  return name;
}


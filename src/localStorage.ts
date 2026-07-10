import { Expense, Milestone, WishlistItem, WeddingSettings } from './types';

export const DEFAULT_SETTINGS: WeddingSettings = {
  budgetLimit: 305000,
  weddingDate: '2027-06-20', // Pre-fill with a valid date so they have something nice initially (overriding empty)
  partnerName: 'Sarah',
  userName: 'Sami',
  isOnboarded: true, // Let them be onboarded with beautiful mock data or keep false. Let's default isOnboarded to true so it starts perfectly, or keep the initial flow intact but standard. Let's keep it false and when onboarding completes, assign default values.
  avatarId: 'green',
  activePhaseId: 'shofa',
  phases: [
    { 
      id: 'shofa', 
      name: 'Shofa', 
      description: 'The foundation of your journey: vision, guests, and initial budgeting',
      allocatedBudget: 5000,
      targetDate: '2026-07-20'
    },
    { 
      id: 'khutba', 
      name: 'Khutba', 
      description: 'Engagement, proposal meetings, and personal wardrobe',
      allocatedBudget: 15000,
      targetDate: '2026-09-15'
    },
    { 
      id: 'melka', 
      name: 'Melka', 
      description: 'Dowry (Mahr) delivery, Shabka jewelry purchase, and official license',
      allocatedBudget: 75000,
      targetDate: '2026-12-10'
    },
    { 
      id: 'wedding', 
      name: 'The Wedding', 
      description: 'Celebratory hall, photography, catering, and evening guest feast',
      allocatedBudget: 135500,
      targetDate: '2027-06-20'
    },
    { 
      id: 'honeymoon', 
      name: 'Honeymoon', 
      description: 'Flights, hotel bookings, and post-ceremony travels',
      allocatedBudget: 19500,
      targetDate: '2027-07-04'
    },
    { 
      id: 'house', 
      name: 'The House', 
      description: 'Appliances, living room layout, and essential home furnishing',
      allocatedBudget: 55000,
      targetDate: '2027-08-15'
    }
  ],
  language: 'en'
};

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'mil_shofa_1',
    name: 'Initial Vision & Guest List Draft',
    category: 'shofa_intro',
    targetAmount: 2000,
    color: '#006e1c',
    iconName: 'Sparkles',
    status: 'planning',
    phaseId: 'shofa',
  },
  {
    id: '1',
    name: 'Engagement Feast & Wardrobe',
    category: 'khutba_feast',
    targetAmount: 15000,
    color: '#006e1c',
    iconName: 'Heart',
    status: 'planning',
    phaseId: 'khutba',
  },
  {
    id: '2',
    name: 'Mahr (Dowry) Payment',
    category: 'mahr',
    targetAmount: 50000,
    color: '#006e1c',
    iconName: 'Coins',
    status: 'completed', // since we have a 50,000 SAR expense in Melka
    phaseId: 'melka',
  },
  {
    id: '3',
    name: 'Shabka & Jewelry',
    category: 'shabka',
    targetAmount: 25000,
    color: '#3c6842',
    iconName: 'Gem',
    status: 'planning',
    phaseId: 'melka',
  },
  {
    id: '4',
    name: 'The Venue & Feast',
    category: 'venue',
    targetAmount: 100000,
    color: '#3c6842',
    iconName: 'Utensils',
    status: 'planning',
    phaseId: 'wedding',
  },
  {
    id: '5',
    name: 'Flowers & Decoration',
    category: 'flowers',
    targetAmount: 15000,
    color: '#675d4d',
    iconName: 'Flower',
    status: 'planning',
    phaseId: 'wedding',
  },
  {
    id: '6',
    name: 'Photography & Media',
    category: 'photo',
    targetAmount: 15000,
    color: '#3a7f6f',
    iconName: 'Camera',
    status: 'planning',
    phaseId: 'wedding',
  },
  {
    id: '7',
    name: 'Gifts & Favors',
    category: 'gifts',
    targetAmount: 5500,
    color: '#675d4d',
    iconName: 'Gift',
    status: 'planning',
    phaseId: 'wedding',
  },
  {
    id: '8',
    name: 'Honeymoon Flights & Hotels',
    category: 'honeymoon_travel',
    targetAmount: 19500,
    color: '#3a7f6f',
    iconName: 'Plane',
    status: 'planning',
    phaseId: 'honeymoon',
  },
  {
    id: '9',
    name: 'Home Furniture & Appliances',
    category: 'house_furniture',
    targetAmount: 55000,
    color: '#675d4d',
    iconName: 'Home',
    status: 'planning',
    phaseId: 'house',
  }
];

export const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp_default_1',
    amount: 50000,
    category: 'mahr',
    date: '2026-06-10',
    note: 'Mahr (Dowry) Downpayment',
    phaseId: 'melka'
  }
];

export const DEFAULT_WISHLIST: WishlistItem[] = [];

export function loadSettings(): WeddingSettings {
  const data = localStorage.getItem('simsim_settings');
  if (data) {
    const parsed = JSON.parse(data);
    if (!parsed.activePhaseId) {
      parsed.activePhaseId = 'shofa';
    }
    if (!parsed.language) {
      parsed.language = 'en';
    }
    if (!parsed.phases || parsed.phases.length === 0) {
      parsed.phases = [
        { id: 'shofa', name: 'Shofa', description: 'The foundation of your journey: vision, guests, and initial budgeting' }
      ];
    }
    return parsed;
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: WeddingSettings): void {
  localStorage.setItem('simsim_settings', JSON.stringify(settings));
}

export function loadMilestones(): Milestone[] {
  const data = localStorage.getItem('simsim_milestones');
  if (data) {
    const parsed = JSON.parse(data);
    // Ensure legacy structures get upgraded nicely with default phase ids
    return parsed.map((m: any) => {
      if (!m.phaseId) {
        if (m.category === 'mahr' || m.category === 'shabka') m.phaseId = 'melka';
        else if (m.category === 'venue' || m.category === 'flowers' || m.category === 'photo' || m.category === 'entertainment') m.phaseId = 'wedding';
        else m.phaseId = 'khutba';
      }
      return m;
    });
  }
  return DEFAULT_MILESTONES;
}

export function saveMilestones(milestones: Milestone[]): void {
  localStorage.setItem('simsim_milestones', JSON.stringify(milestones));
}

export function loadExpenses(): Expense[] {
  const data = localStorage.getItem('simsim_expenses');
  if (data) {
    const parsed = JSON.parse(data);
    return parsed.map((e: any) => {
      if (!e.phaseId) {
        if (e.category === 'mahr' || e.category === 'shabka') e.phaseId = 'melka';
        else if (e.category === 'venue' || e.category === 'flowers' || e.category === 'photo' || e.category === 'entertainment') e.phaseId = 'wedding';
        else e.phaseId = 'khutba';
      }
      return e;
    });
  }
  return DEFAULT_EXPENSES;
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem('simsim_expenses', JSON.stringify(expenses));
}

export function loadWishlist(): WishlistItem[] {
  const data = localStorage.getItem('simsim_wishlist');
  if (data) return JSON.parse(data);
  return DEFAULT_WISHLIST;
}

export function saveWishlist(wishlist: WishlistItem[]): void {
  localStorage.setItem('simsim_wishlist', JSON.stringify(wishlist));
}

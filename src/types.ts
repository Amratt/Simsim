export interface Expense {
  id: string;
  amount: number;
  category: string; // matches milestone category identifier
  date: string; // ISO format
  note?: string;
  phaseId: string;
}

export interface Milestone {
  id: string;
  name: string;
  category: string; // unique identifier
  targetAmount: number;
  color: string;
  iconName: string;
  status: 'planning' | 'completed';
  phaseId: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  url?: string;
  purchased: boolean;
}

export interface WeddingSettings {
  budgetLimit: number;
  weddingDate: string; // YYYY-MM-DD
  partnerName: string;
  userName: string;
  isOnboarded?: boolean;
  avatarId?: 'green' | 'red' | 'blue';
  activePhaseId: string; // Active stage tracker
  phases?: WeddingPhase[];
  language?: 'en' | 'ar';
}

export interface WeddingPhase {
  id: string;
  name: string;
  description: string;
  allocatedBudget?: number;
  targetDate?: string; // YYYY-MM-DD format
}

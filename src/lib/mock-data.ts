import { User, Plant, Transaction, LeaderboardEntry } from '@/types';
import { SEED_CATALOG, BADGES } from '@/constants/seeds';

// Mock user data
export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Green',
  email: 'alex.green@example.com',
  walletBalance: 127.5,
  totalEarnings: 284.0,
  plantsGrown: 8,
  environmentalScore: 456,
  consecutiveStreak: 23,
  badges: [BADGES[0], BADGES[1], BADGES[3]],
  joinedDate: '2025-11-15',
};

// Mock plants
export const MOCK_PLANTS: Plant[] = [
  {
    id: 'plant-1',
    userId: 'user-1',
    seedType: SEED_CATALOG[0],
    plantedDate: '2025-12-01',
    status: 'growing',
    healthScore: 92,
    lastCheckIn: '2026-01-25',
    nextCheckIn: '2026-02-25',
    monthlyCheckIns: 2,
    totalEarned: 11,
    photos: [],
    isYieldingStage: false,
  },
  {
    id: 'plant-2',
    userId: 'user-1',
    seedType: SEED_CATALOG[1],
    plantedDate: '2025-10-15',
    status: 'yielding',
    healthScore: 88,
    lastCheckIn: '2026-01-20',
    nextCheckIn: '2026-02-20',
    monthlyCheckIns: 3,
    totalEarned: 31.5,
    photos: [],
    isYieldingStage: true,
  },
  {
    id: 'plant-3',
    userId: 'user-1',
    seedType: SEED_CATALOG[2],
    plantedDate: '2025-11-10',
    status: 'growing',
    healthScore: 95,
    lastCheckIn: '2026-01-15',
    nextCheckIn: '2026-02-15',
    monthlyCheckIns: 2,
    totalEarned: 14,
    photos: [],
    isYieldingStage: false,
  },
];

// Mock transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'user-1',
    type: 'reward',
    amount: 4,
    description: 'Monthly check-in reward - Neem Tree',
    plantId: 'plant-1',
    date: '2026-01-25',
    balance: 127.5,
  },
  {
    id: 'txn-2',
    userId: 'user-1',
    type: 'reward',
    amount: 20,
    description: 'Yielding stage reward - Tulsi',
    plantId: 'plant-2',
    date: '2026-01-20',
    balance: 123.5,
  },
  {
    id: 'txn-3',
    userId: 'user-1',
    type: 'purchase',
    amount: -20,
    description: 'Purchased Mango Tree seeds',
    date: '2026-01-15',
    balance: 103.5,
  },
  {
    id: 'txn-4',
    userId: 'user-1',
    type: 'reward',
    amount: 5,
    description: 'Planting reward - Neem Tree',
    plantId: 'plant-1',
    date: '2025-12-01',
    balance: 123.5,
  },
  {
    id: 'txn-5',
    userId: 'user-1',
    type: 'penalty',
    amount: -5,
    description: 'Plant death penalty - Bamboo',
    date: '2025-12-10',
    balance: 118.5,
  },
];

// Mock leaderboard
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-2',
    userName: 'Sarah Forest',
    totalPlants: 15,
    environmentalScore: 892,
    consecutiveStreak: 45,
    overallScore: 952,
  },
  {
    rank: 2,
    userId: 'user-3',
    userName: 'Mike Greenwood',
    totalPlants: 12,
    environmentalScore: 678,
    consecutiveStreak: 38,
    overallScore: 728,
  },
  {
    rank: 3,
    userId: 'user-1',
    userName: 'Alex Green',
    totalPlants: 8,
    environmentalScore: 456,
    consecutiveStreak: 23,
    overallScore: 487,
  },
  {
    rank: 4,
    userId: 'user-4',
    userName: 'Emma Woods',
    totalPlants: 7,
    environmentalScore: 412,
    consecutiveStreak: 31,
    overallScore: 450,
  },
  {
    rank: 5,
    userId: 'user-5',
    userName: 'John Leaf',
    totalPlants: 6,
    environmentalScore: 389,
    consecutiveStreak: 19,
    overallScore: 414,
  },
];

// Helper functions for localStorage
export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key: string, defaultValue: any = null) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Initialize mock data in localStorage
export const initializeMockData = () => {
  if (!getFromStorage('user')) {
    saveToStorage('user', MOCK_USER);
  }
  if (!getFromStorage('plants')) {
    saveToStorage('plants', MOCK_PLANTS);
  }
  if (!getFromStorage('transactions')) {
    saveToStorage('transactions', MOCK_TRANSACTIONS);
  }
  if (!getFromStorage('leaderboard')) {
    saveToStorage('leaderboard', MOCK_LEADERBOARD);
  }
};

export interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  totalEarnings: number;
  plantsGrown: number;
  environmentalScore: number;
  consecutiveStreak: number;
  badges: Badge[];
  joinedDate: string;
}

export interface Plant {
  id: string;
  userId: string;
  seedType: SeedType;
  plantedDate: string;
  status: 'seedling' | 'growing' | 'yielding' | 'died';
  healthScore: number;
  lastCheckIn: string;
  nextCheckIn: string;
  monthlyCheckIns: number;
  totalEarned: number;
  photos: PlantPhoto[];
  isYieldingStage: boolean;
}

export interface PlantPhoto {
  id: string;
  plantId: string;
  uploadDate: string;
  imageUrl: string;
  stage: 'planting' | 'monthly' | 'yielding';
  healthAssessment?: HealthAssessment;
  rewardEarned: number;
}

export interface HealthAssessment {
  growthRate: 'excellent' | 'good' | 'moderate' | 'poor';
  leavesColor: 'vibrant' | 'normal' | 'pale' | 'brown';
  issues: string[];
  overallHealth: number;
}

export interface SeedType {
  id: string;
  name: string;
  category: 'medicinal' | 'fruit' | 'vegetable' | 'purifier';
  description: string;
  price: number;
  plantingReward: number;
  monthlyReward: number;
  yieldingReward: number;
  environmentalImpact: number;
  growthDuration: number;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'reward' | 'penalty' | 'purchase' | 'withdrawal';
  amount: number;
  description: string;
  plantId?: string;
  date: string;
  balance: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  totalPlants: number;
  environmentalScore: number;
  consecutiveStreak: number;
  overallScore: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isUsed: boolean;
}

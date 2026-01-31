import { SeedType } from './index';

export interface CartItem {
  seed: SeedType;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

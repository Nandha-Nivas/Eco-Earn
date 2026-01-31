import { CartItem, Cart } from '@/types/cart';
import { SeedType } from '@/types';

const CART_KEY = 'shopping_cart';

export const getCart = (): Cart => {
  const stored = localStorage.getItem(CART_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { items: [], total: 0 };
};

export const saveCart = (cart: Cart): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (seed: SeedType): Cart => {
  const cart = getCart();
  const existingItem = cart.items.find(item => item.seed.id === seed.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ seed, quantity: 1 });
  }

  cart.total = cart.items.reduce((sum, item) => sum + (item.seed.price * item.quantity), 0);
  saveCart(cart);
  return cart;
};

export const removeFromCart = (seedId: string): Cart => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.seed.id !== seedId);
  cart.total = cart.items.reduce((sum, item) => sum + (item.seed.price * item.quantity), 0);
  saveCart(cart);
  return cart;
};

export const updateCartQuantity = (seedId: string, quantity: number): Cart => {
  const cart = getCart();
  const item = cart.items.find(item => item.seed.id === seedId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(seedId);
    }
    item.quantity = quantity;
  }

  cart.total = cart.items.reduce((sum, item) => sum + (item.seed.price * item.quantity), 0);
  saveCart(cart);
  return cart;
};

export const clearCart = (): Cart => {
  const emptyCart = { items: [], total: 0 };
  saveCart(emptyCart);
  return emptyCart;
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

import { useEffect, useState } from 'react';
import { Cart, CartItem } from '@/types/cart';
import { getCart, updateCartQuantity, removeFromCart, clearCart } from '@/lib/cart';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFromStorage, saveToStorage } from '@/lib/mock-data';
import { User, Transaction, Plant } from '@/types';
import { useNavigate } from 'react-router-dom';

interface CartSheetProps {
  itemCount: number;
  onCartUpdate: () => void;
}

export default function CartSheet({ itemCount, onCartUpdate }: CartSheetProps) {
  const [cart, setCart] = useState<Cart>(getCart());
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setCart(getCart());
    }
  }, [isOpen]);

  const handleUpdateQuantity = (seedId: string, newQuantity: number) => {
    const updatedCart = updateCartQuantity(seedId, newQuantity);
    setCart(updatedCart);
    onCartUpdate();
  };

  const handleRemoveItem = (seedId: string) => {
    const updatedCart = removeFromCart(seedId);
    setCart(updatedCart);
    onCartUpdate();
    toast({
      title: 'Item Removed',
      description: 'Item has been removed from your cart.',
    });
  };

  const handleCheckout = () => {
    const user: User = getFromStorage('user');
    
    if (cart.total === 0 || cart.items.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to your cart before checkout.',
        variant: 'destructive',
      });
      return;
    }

    if (user.walletBalance < cart.total) {
      toast({
        title: 'Insufficient Balance',
        description: `You need $${(cart.total - user.walletBalance).toFixed(2)} more to complete this purchase.`,
        variant: 'destructive',
      });
      return;
    }

    // Process purchase
    user.walletBalance -= cart.total;
    
    // Create plants for each seed
    const plants: Plant[] = getFromStorage('plants', []);
    const newPlants: Plant[] = [];

    cart.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        const newPlant: Plant = {
          id: `plant-${Date.now()}-${i}`,
          userId: user.id,
          seedType: item.seed,
          plantedDate: new Date().toISOString(),
          status: 'seedling',
          healthScore: 100,
          lastCheckIn: new Date().toISOString(),
          nextCheckIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          monthlyCheckIns: 0,
          totalEarned: 0,
          photos: [],
          isYieldingStage: false,
        };
        newPlants.push(newPlant);
      }
    });

    plants.push(...newPlants);
    user.plantsGrown += newPlants.length;

    // Create transaction
    const transactions: Transaction[] = getFromStorage('transactions', []);
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: user.id,
      type: 'purchase',
      amount: -cart.total,
      description: `Purchased ${cart.items.length} seed type(s) - ${newPlants.length} total seeds`,
      date: new Date().toISOString(),
      balance: user.walletBalance,
    };
    transactions.unshift(newTransaction);

    saveToStorage('user', user);
    saveToStorage('plants', plants);
    saveToStorage('transactions', transactions);

    // Clear cart
    clearCart();
    setCart({ items: [], total: 0 });
    onCartUpdate();

    toast({
      title: 'Purchase Successful!',
      description: `You've purchased ${newPlants.length} seeds. Start planting to earn rewards!`,
    });

    setIsOpen(false);
    setTimeout(() => navigate('/my-plants'), 1500);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cart.items.length === 0 ? 'Your cart is empty' : `${itemCount} item(s) in cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No items in cart</p>
            </div>
          ) : (
            <>
              {cart.items.map((item: CartItem) => (
                <div key={item.seed.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.seed.imageUrl}
                    alt={item.seed.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.seed.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{item.seed.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => handleUpdateQuantity(item.seed.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => handleUpdateQuantity(item.seed.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 ml-auto"
                        onClick={() => handleRemoveItem(item.seed.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.seed.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">${item.seed.price} each</p>
                  </div>
                </div>
              ))}

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    clearCart();
                    setCart({ items: [], total: 0 });
                    onCartUpdate();
                    toast({
                      title: 'Cart Cleared',
                      description: 'All items have been removed from your cart.',
                    });
                  }}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

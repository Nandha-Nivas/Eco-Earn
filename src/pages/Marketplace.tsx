import { useState } from 'react';
import { SEED_CATALOG } from '@/constants/seeds';
import { SeedType } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Sprout, TrendingUp, Calendar, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFromStorage, saveToStorage } from '@/lib/mock-data';
import { User, Transaction } from '@/types';

export default function Marketplace() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [couponCode, setCouponCode] = useState('');

  const categories = [
    { id: 'all', label: 'All Seeds' },
    { id: 'medicinal', label: 'Medicinal' },
    { id: 'fruit', label: 'Fruit' },
    { id: 'vegetable', label: 'Vegetable' },
    { id: 'purifier', label: 'Air Purifier' },
  ];

  const filteredSeeds = selectedCategory === 'all'
    ? SEED_CATALOG
    : SEED_CATALOG.filter(seed => seed.category === selectedCategory);

  const handlePurchase = (seed: SeedType) => {
    const user: User = getFromStorage('user');
    
    if (user.walletBalance < seed.price) {
      toast({
        title: 'Insufficient Balance',
        description: 'You need more funds to purchase this seed.',
        variant: 'destructive',
      });
      return;
    }

    // Deduct from wallet
    user.walletBalance -= seed.price;
    
    // Add transaction
    const transactions: Transaction[] = getFromStorage('transactions', []);
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: user.id,
      type: 'purchase',
      amount: -seed.price,
      description: `Purchased ${seed.name} seeds`,
      date: new Date().toISOString(),
      balance: user.walletBalance,
    };
    transactions.unshift(newTransaction);

    saveToStorage('user', user);
    saveToStorage('transactions', transactions);

    toast({
      title: 'Purchase Successful!',
      description: `You've purchased ${seed.name} seeds. Ready to plant!`,
    });

    // Reload page to update wallet display
    setTimeout(() => window.location.reload(), 1500);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'GREEN20') {
      toast({
        title: 'Coupon Applied!',
        description: '20% discount applied to your next purchase.',
      });
      setCouponCode('');
    } else {
      toast({
        title: 'Invalid Coupon',
        description: 'This coupon code is not valid.',
        variant: 'destructive',
      });
    }
  };

  const categoryColors: Record<string, string> = {
    medicinal: 'bg-purple-500',
    fruit: 'bg-orange-500',
    vegetable: 'bg-green-500',
    purifier: 'bg-blue-500',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Seed Marketplace</h1>
        <p className="text-muted-foreground">
          Purchase premium seeds and start earning rewards by planting trees
        </p>
      </div>

      {/* Coupon Section */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Have a coupon code?</h3>
              <p className="text-sm text-muted-foreground">Apply it to get discounts on seed purchases</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="md:w-48"
              />
              <Button onClick={applyCoupon}>Apply</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.id)}
            className="whitespace-nowrap"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Seed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeeds.map((seed) => (
          <Card key={seed.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden bg-muted">
                <img
                  src={seed.imageUrl}
                  alt={seed.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{seed.name}</CardTitle>
                <Badge className={`${categoryColors[seed.category]} text-white`}>
                  {seed.category}
                </Badge>
              </div>
              <CardDescription>{seed.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Sprout className="h-4 w-4" />
                  Planting Reward
                </span>
                <span className="font-semibold text-primary">${seed.plantingReward}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Monthly Reward
                </span>
                <span className="font-semibold text-primary">${seed.monthlyReward}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Growth Duration
                </span>
                <span className="font-semibold">{seed.growthDuration} months</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Leaf className="h-4 w-4" />
                  Environmental Impact
                </span>
                <span className="font-semibold">{seed.environmentalImpact}/100</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Yielding Reward</span>
                  <span className="text-xl font-bold text-primary">${seed.yieldingReward}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handlePurchase(seed)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy for ${seed.price}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

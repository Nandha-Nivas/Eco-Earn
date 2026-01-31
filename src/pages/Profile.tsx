import { useEffect, useState } from 'react';
import { User, Transaction } from '@/types';
import { getFromStorage } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Award } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setUser(getFromStorage('user'));
    setTransactions(getFromStorage('transactions', []));
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'reward':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'penalty':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'reward':
        return 'text-green-600';
      case 'penalty':
        return 'text-red-600';
      case 'purchase':
        return 'text-blue-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                    <p className="text-xl font-bold text-primary">${user?.walletBalance.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-xl font-bold">${user?.totalEarnings.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plants Grown</p>
                    <p className="text-xl font-bold">{user?.plantsGrown}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-xl font-bold">{user?.consecutiveStreak} days</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badges & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {user?.badges.map((badge) => (
                <Badge
                  key={badge.id}
                  variant="secondary"
                  className="text-lg px-4 py-2"
                >
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
            {user?.badges.length === 0 && (
              <p className="text-muted-foreground">No badges earned yet. Start planting to earn achievements!</p>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((txn, index) => (
                <div key={txn.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getTransactionIcon(txn.type)}
                      </div>
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(txn.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getTransactionColor(txn.type)}`}>
                        {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Balance: ${txn.balance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

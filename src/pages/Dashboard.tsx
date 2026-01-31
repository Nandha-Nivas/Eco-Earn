import { useEffect, useState } from 'react';
import { User, Plant } from '@/types';
import { getFromStorage, initializeMockData } from '@/lib/mock-data';
import { DollarSign, Sprout, Leaf, Flame } from 'lucide-react';
import StatsCard from '@/components/features/StatsCard';
import PlantCard from '@/components/features/PlantCard';
import heroImg from '@/assets/hero-planting.jpg';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    initializeMockData();
    setUser(getFromStorage('user'));
    setPlants(getFromStorage('plants', []));
  }, []);

  const activePlants = plants.filter(p => p.status !== 'died');

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Plant trees and earn rewards"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-green-400">Eco</span>{' '}
              <span className="text-blue-400">Earn</span> - Plant Trees, Earn Cash
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Track your plants, maintain their health, and get real cash rewards for making the planet greener. Turn environmental action into income today.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8"
              onClick={() => navigate('/marketplace')}
            >
              Start Planting
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">
            You have {activePlants.length} active plants. Keep up the great work!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Wallet Balance"
            value={`$${user?.walletBalance.toFixed(2)}`}
            icon={DollarSign}
            gradient
          />
          <StatsCard
            title="Active Plants"
            value={activePlants.length}
            icon={Sprout}
            trend={`${user?.plantsGrown} total grown`}
          />
          <StatsCard
            title="Environmental Score"
            value={user?.environmentalScore || 0}
            icon={Leaf}
            trend="CO2 offset & impact"
          />
          <StatsCard
            title="Streak"
            value={`${user?.consecutiveStreak} days`}
            icon={Flame}
            trend="Keep it going!"
          />
        </div>

        {/* Recent Plants */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Plants</h2>
            <Button variant="outline" onClick={() => navigate('/my-plants')}>
              View All
            </Button>
          </div>
          
          {activePlants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePlants.slice(0, 3).map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <Sprout className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No active plants yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your green journey by purchasing seeds from our marketplace
              </p>
              <Button onClick={() => navigate('/marketplace')}>
                Browse Seeds
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

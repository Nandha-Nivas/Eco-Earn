import { useEffect, useState } from 'react';
import { Plant } from '@/types';
import { getFromStorage } from '@/lib/mock-data';
import PlantCard from '@/components/features/PlantCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout } from 'lucide-react';

export default function MyPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    setPlants(getFromStorage('plants', []));
  }, []);

  const activePlants = plants.filter(p => p.status !== 'died');
  const yieldingPlants = plants.filter(p => p.status === 'yielding');
  const diedPlants = plants.filter(p => p.status === 'died');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Plants</h1>
        <p className="text-muted-foreground">
          Manage and track all your plants in one place
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="active">Active ({activePlants.length})</TabsTrigger>
          <TabsTrigger value="yielding">Yielding ({yieldingPlants.length})</TabsTrigger>
          <TabsTrigger value="died">Died ({diedPlants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activePlants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <Sprout className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No active plants</h3>
              <p className="text-muted-foreground">
                Your active plants will appear here
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="yielding">
          {yieldingPlants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yieldingPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <Sprout className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No yielding plants yet</h3>
              <p className="text-muted-foreground">
                Plants that reach yielding stage will appear here
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="died">
          {diedPlants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diedPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <Sprout className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Great job!</h3>
              <p className="text-muted-foreground">
                You haven't lost any plants yet. Keep up the good work!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

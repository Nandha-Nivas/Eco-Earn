import { Plant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const navigate = useNavigate();

  const statusColors = {
    seedling: 'bg-yellow-500',
    growing: 'bg-green-500',
    yielding: 'bg-blue-500',
    died: 'bg-red-500',
  };

  const statusLabels = {
    seedling: 'Seedling',
    growing: 'Growing',
    yielding: 'Yielding',
    died: 'Died',
  };

  const daysUntilCheckIn = Math.ceil(
    (new Date(plant.nextCheckIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{plant.seedType.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{plant.seedType.category}</p>
          </div>
          <Badge className={`${statusColors[plant.status]} text-white`}>
            {statusLabels[plant.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden bg-muted">
          <img
            src={plant.seedType.imageUrl}
            alt={plant.seedType.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Health Score</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${plant.healthScore}%` }}
                />
              </div>
              <span className="font-semibold">{plant.healthScore}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Next Check-in
            </span>
            <span className="font-semibold">
              {daysUntilCheckIn > 0 ? `${daysUntilCheckIn} days` : 'Due now'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Total Earned
            </span>
            <span className="font-semibold text-primary">${plant.totalEarned.toFixed(2)}</span>
          </div>

          <div className="pt-3 flex gap-2">
            <Button
              className="flex-1"
              onClick={() => navigate(`/check-in/${plant.id}`)}
              disabled={daysUntilCheckIn > 7}
            >
              <Camera className="h-4 w-4 mr-2" />
              Check-in
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/plant/${plant.id}`)}
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

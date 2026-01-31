import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant } from '@/types';
import { getFromStorage } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, TrendingUp, Camera } from 'lucide-react';

export default function PlantDetail() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);

  useEffect(() => {
    const plants: Plant[] = getFromStorage('plants', []);
    const foundPlant = plants.find(p => p.id === plantId);
    if (foundPlant) {
      setPlant(foundPlant);
    }
  }, [plantId]);

  if (!plant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Plant not found</p>
      </div>
    );
  }

  const statusColors = {
    seedling: 'bg-yellow-500',
    growing: 'bg-green-500',
    yielding: 'bg-blue-500',
    died: 'bg-red-500',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/my-plants')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Plants
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted mb-4">
              <img
                src={plant.seedType.imageUrl}
                alt={plant.seedType.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{plant.seedType.name}</h1>
                <p className="text-muted-foreground">{plant.seedType.description}</p>
              </div>
              <Badge className={`${statusColors[plant.status]} text-white`}>
                {plant.status}
              </Badge>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Health Score</span>
                  <span className="font-bold text-lg">{plant.healthScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planted Date</span>
                  <span className="font-semibold">
                    {new Date(plant.plantedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Check-ins</span>
                  <span className="font-semibold">{plant.monthlyCheckIns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Earned</span>
                  <span className="font-bold text-primary text-lg">
                    ${plant.totalEarned.toFixed(2)}
                  </span>
                </div>
                {plant.isYieldingStage && (
                  <Badge variant="secondary" className="w-full justify-center">
                    🌾 Yielding Stage - No more monthly rewards
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              onClick={() => navigate(`/check-in/${plant.id}`)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Check-in Now
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Growth Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {plant.photos.length > 0 ? (
                plant.photos.map((photo, index) => (
                  <div key={photo.id} className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={photo.imageUrl}
                        alt={`Check-in ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">
                            {photo.stage === 'planting' ? 'Initial Planting' : 'Monthly Check-in'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(photo.uploadDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +${photo.rewardEarned}
                        </Badge>
                      </div>
                      {photo.healthAssessment && (
                        <div className="text-sm text-muted-foreground">
                          <p>Growth: {photo.healthAssessment.growthRate}</p>
                          <p>Leaves: {photo.healthAssessment.leavesColor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No check-ins yet. Upload your first photo to start tracking growth!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

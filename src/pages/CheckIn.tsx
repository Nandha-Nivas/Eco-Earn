import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, HealthAssessment, User, Transaction } from '@/types';
import { getFromStorage, saveToStorage } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload } from 'lucide-react';

export default function CheckIn() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [assessment, setAssessment] = useState<Partial<HealthAssessment>>({
    growthRate: 'good',
    leavesColor: 'normal',
    issues: [],
  });
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    const plants: Plant[] = getFromStorage('plants', []);
    const foundPlant = plants.find(p => p.id === plantId);
    if (foundPlant) {
      setPlant(foundPlant);
    }
  }, [plantId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateHealthScore = (): number => {
    let score = 70; // Base score
    
    if (assessment.growthRate === 'excellent') score += 15;
    else if (assessment.growthRate === 'good') score += 10;
    else if (assessment.growthRate === 'moderate') score += 5;
    
    if (assessment.leavesColor === 'vibrant') score += 15;
    else if (assessment.leavesColor === 'normal') score += 10;
    else if (assessment.leavesColor === 'pale') score += 5;

    return Math.min(100, score);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview) {
      toast({
        title: 'Image Required',
        description: 'Please upload a photo of your plant.',
        variant: 'destructive',
      });
      return;
    }

    if (!plant) return;

    const healthScore = calculateHealthScore();
    const newMonthlyCheckIns = plant.monthlyCheckIns + 1;
    const willBeYielding = newMonthlyCheckIns >= plant.seedType.growthDuration;
    const isAlreadyYielding = plant.isYieldingStage;
    
    // Determine reward based on stage
    let reward = plant.seedType.monthlyReward;
    let rewardDescription = 'Monthly check-in';
    
    if (willBeYielding && !isAlreadyYielding) {
      // First time reaching yielding stage
      reward = plant.seedType.yieldingReward;
      rewardDescription = 'Yielding stage reached';
    } else if (isAlreadyYielding) {
      // Already in yielding stage, continue yielding rewards
      reward = plant.seedType.yieldingReward;
      rewardDescription = 'Yielding stage';
    }

    // Update plant
    const plants: Plant[] = getFromStorage('plants', []);
    const updatedPlants = plants.map(p => {
      if (p.id === plantId) {
        return {
          ...p,
          status: willBeYielding ? 'yielding' : 'growing',
          healthScore,
          lastCheckIn: new Date().toISOString(),
          nextCheckIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          monthlyCheckIns: newMonthlyCheckIns,
          totalEarned: p.totalEarned + reward,
          isYieldingStage: willBeYielding,
          photos: [
            ...p.photos,
            {
              id: `photo-${Date.now()}`,
              plantId: p.id,
              uploadDate: new Date().toISOString(),
              imageUrl: imagePreview,
              stage: willBeYielding ? 'yielding' : 'monthly',
              healthAssessment: {
                ...assessment,
                overallHealth: healthScore,
                notes: additionalNotes,
              } as HealthAssessment,
              rewardEarned: reward,
            },
          ],
        };
      }
      return p;
    });

    // Update user wallet
    const user: User = getFromStorage('user');
    user.walletBalance += reward;
    user.totalEarnings += reward;
    user.consecutiveStreak += 1;
    user.environmentalScore += 10;

    // Add transaction
    const transactions: Transaction[] = getFromStorage('transactions', []);
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: user.id,
      type: 'reward',
      amount: reward,
      description: `${rewardDescription} reward - ${plant.seedType.name}`,
      plantId: plant.id,
      date: new Date().toISOString(),
      balance: user.walletBalance,
    };
    transactions.unshift(newTransaction);

    saveToStorage('plants', updatedPlants);
    saveToStorage('user', user);
    saveToStorage('transactions', transactions);

    const stageMessage = willBeYielding && !isAlreadyYielding
      ? `🎉 Your plant has reached yielding stage! You earned $${reward.toFixed(2)}.`
      : `✅ Check-in successful! You earned $${reward.toFixed(2)}. Health score: ${healthScore}/100`;

    toast({
      title: 'Check-in Complete!',
      description: stageMessage,
    });

    setTimeout(() => navigate('/my-plants'), 2000);
  };

  if (!plant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Plant not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Plant Check-in</h1>
        <p className="text-muted-foreground mb-8">{plant.seedType.name}</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Plant Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                  <img
                    src={imagePreview}
                    alt="Plant preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Click to upload photo</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Health Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-3 block">Growth Rate</Label>
              <RadioGroup
                value={assessment.growthRate}
                onValueChange={(value) =>
                  setAssessment({ ...assessment, growthRate: value as any })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="growth-excellent" />
                  <Label htmlFor="growth-excellent">Excellent - Rapid growth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="growth-good" />
                  <Label htmlFor="growth-good">Good - Steady growth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="growth-moderate" />
                  <Label htmlFor="growth-moderate">Moderate - Slow growth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="growth-poor" />
                  <Label htmlFor="growth-poor">Poor - Minimal growth</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base mb-3 block">Leaves Color</Label>
              <RadioGroup
                value={assessment.leavesColor}
                onValueChange={(value) =>
                  setAssessment({ ...assessment, leavesColor: value as any })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vibrant" id="color-vibrant" />
                  <Label htmlFor="color-vibrant">Vibrant - Deep, rich color</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="color-normal" />
                  <Label htmlFor="color-normal">Normal - Healthy green</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pale" id="color-pale" />
                  <Label htmlFor="color-pale">Pale - Light green/yellow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="brown" id="color-brown" />
                  <Label htmlFor="color-brown">Brown - Dried/damaged</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes" className="text-base">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any issues or observations about the plant..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/my-plants')} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Check-in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

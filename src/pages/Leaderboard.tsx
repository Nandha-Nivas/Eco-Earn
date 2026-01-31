import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import { getFromStorage } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Sprout, Leaf, Flame } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getFromStorage('leaderboard', []));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-orange-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
    if (rank === 3) return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/50';
    return '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top eco-warriors making the planet greener
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Ranking Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Total healthy plants alive</li>
              <li>• Environmental impact score</li>
              <li>• Consecutive check-in streak</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-1">{leaderboard[0]?.userName}</p>
            <p className="text-sm text-muted-foreground">
              {leaderboard[0]?.totalPlants} plants • {leaderboard[0]?.environmentalScore} impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-1">
              {Math.max(...leaderboard.map(l => l.consecutiveStreak))} days
            </p>
            <p className="text-sm text-muted-foreground">
              Keep checking in daily!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {leaderboard.map((entry) => (
          <Card key={entry.userId} className={`${getRankBg(entry.rank)}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{entry.userName}</h3>
                    {entry.rank <= 3 && (
                      <Badge variant="secondary" className="text-xs">
                        Top {entry.rank}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Plants</p>
                      <p className="font-semibold text-lg">{entry.totalPlants}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Environmental Score</p>
                      <p className="font-semibold text-lg">{entry.environmentalScore}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Streak</p>
                      <p className="font-semibold text-lg">{entry.consecutiveStreak} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Overall Score</p>
                      <p className="font-semibold text-lg text-primary">{entry.overallScore}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

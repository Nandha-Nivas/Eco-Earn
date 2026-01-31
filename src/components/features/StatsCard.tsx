import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  gradient?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, gradient }: StatsCardProps) {
  return (
    <Card className={gradient ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground' : ''}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {title}
            </p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend && (
              <p className={`text-xs mt-2 ${gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${gradient ? 'bg-white/20' : 'bg-primary/10'}`}>
            <Icon className={`h-6 w-6 ${gradient ? 'text-white' : 'text-primary'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

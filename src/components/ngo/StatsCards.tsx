import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import type { Donation } from '@/types/firebase';

interface StatsCardsProps {
  claims: Donation[];
}

export function StatsCards({ claims }: StatsCardsProps) {
  const stats = {
    totalReceived: claims.filter(d => d.status === 'completed').length,
    activeClaims: claims.filter(d => d.status !== 'completed' && d.status !== 'cancelled').length,
    pendingPickups: claims.filter(d => d.status === 'claimed' || d.status === 'on_the_way').length,
    totalQuantity: claims.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.quantity, 0),
  };

  const statCards = [
    {
      title: 'Total Received',
      value: stats.totalReceived,
      icon: Package,
      color: 'text-success',
      description: 'Completed donations'
    },
    {
      title: 'Active Claims',
      value: stats.activeClaims,
      icon: Clock,
      color: 'text-warning',
      description: 'In progress'
    },
    {
      title: 'Pending Pickups',
      value: stats.pendingPickups,
      icon: CheckCircle,
      color: 'text-blue-500',
      description: 'Ready for pickup'
    },
    {
      title: 'Impact',
      value: stats.totalQuantity,
      icon: TrendingUp,
      color: 'text-primary',
      description: 'items received'
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
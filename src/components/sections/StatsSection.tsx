import { Package, TrendingUp, Users, Award, Globe, Target, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStatistics } from '@/hooks/useStatistics';
import { formatDistanceToNow } from 'date-fns';

export function StatsSection() {
  const { stats, refresh } = useStatistics(60000); // Refresh every minute

  const cards = [
    {
      title: 'Total Donations',
      value: stats.totalDonations,
      icon: <Package className="h-7 w-7 text-primary" />,
      bg: 'from-primary/10 to-primary/5 border-primary/20',
      subtitle: `+${stats.thisMonthDonations} this month`,
    },
    {
      title: 'Active Donations',
      value: stats.activeDonations,
      icon: <TrendingUp className="h-7 w-7 text-amber-500" />,
      bg: 'from-amber-100/20 to-amber-50/10 border-amber-200/30',
      subtitle: 'Currently available',
    },
    {
      title: 'Registered Donors',
      value: stats.registeredUsers,
      icon: <Users className="h-7 w-7 text-blue-500" />,
      bg: 'from-blue-100/20 to-blue-50/10 border-blue-200/30',
      subtitle: `+${stats.thisMonthUsers} new this month`,
    },
    {
      title: 'Partner NGOs',
      value: stats.registeredNGOs,
      icon: <Award className="h-7 w-7 text-pink-500" />,
      bg: 'from-pink-100/20 to-pink-50/10 border-pink-200/30',
      subtitle: `${stats.verifiedNGOs || 0} verified`,
    },
    {
      title: 'Meals Served',
      value: stats.totalMealsServed,
      icon: <Globe className="h-7 w-7 text-green-500" />,
      bg: 'from-green-100/20 to-green-50/10 border-green-200/30',
      subtitle: 'Estimated impact',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: <Target className="h-7 w-7 text-purple-500" />,
      bg: 'from-purple-100/20 to-purple-50/10 border-purple-200/30',
      subtitle: 'Donations completed',
    },
  ];

  return (
    <section id="stats" className="container mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold mb-3 text-foreground">Our Achievements</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
          Real-time impact data showing how together we're making a difference in fighting food waste and hunger.
        </p>
        
        {/* Live Data Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${stats.loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            <span>{stats.loading ? 'Updating...' : 'Live Data'}</span>
          </div>
          
          {stats.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDistanceToNow(stats.lastUpdated, { addSuffix: true })}</span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={stats.loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${stats.loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {stats.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6 max-w-md mx-auto">
            <p className="text-destructive text-sm">{stats.error}</p>
          </div>
        )}
      </div>

      {/* Unified Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.bg} border rounded-2xl p-8 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
              stats.loading ? 'opacity-75' : ''
            }`}
          >
            <div className="flex justify-center mb-4">{card.icon}</div>
            <div className={`text-4xl font-bold text-foreground mb-1 transition-all duration-500 ${
              stats.loading ? 'animate-pulse' : ''
            }`}>
              {typeof card.value === 'string' ? card.value : card.value.toLocaleString()}
            </div>
            <div className="text-lg font-medium text-foreground mb-1">{card.title}</div>
            {card.subtitle && (
              <div className="text-sm text-muted-foreground">{card.subtitle}</div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      {stats.averageDonationSize > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20 rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">Platform Impact</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-accent">{stats.averageDonationSize}</div>
                <div className="text-muted-foreground">Avg. Donation Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{stats.totalQuantityDonated}</div>
                <div className="text-muted-foreground">Total Quantity Donated</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

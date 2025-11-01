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
      icon: <Package className="h-7 w-7 text-raspberry-red" />,
      bg: 'from-raspberry-red/10 to-raspberry-red/5 border-raspberry-red/20',
      subtitle: `+${stats.thisMonthDonations} this month`,
    },
    {
      title: 'Active Donations',
      value: stats.activeDonations,
      icon: <TrendingUp className="h-7 w-7 text-mango-orange" />,
      bg: 'from-mango-orange/20 to-mango-orange/10 border-mango-orange/30',
      subtitle: 'Currently available',
    },
    {
      title: 'Registered Donors',
      value: stats.registeredUsers,
      icon: <Users className="h-7 w-7 text-peach" />,
      bg: 'from-peach/30 to-peach/20 border-peach/40',
      subtitle: `+${stats.thisMonthUsers} new this month`,
    },
    {
      title: 'Partner NGOs',
      value: stats.registeredNGOs,
      icon: <Award className="h-7 w-7 text-plum-purple" />,
      bg: 'from-plum-purple/20 to-plum-purple/10 border-plum-purple/30',
      subtitle: `${stats.verifiedNGOs || 0} verified`,
    },
    {
      title: 'Meals Served',
      value: stats.totalMealsServed,
      icon: <Globe className="h-7 w-7 text-banana-cream" />,
      bg: 'from-banana-cream/30 to-banana-cream/20 border-banana-cream/40',
      subtitle: 'Estimated impact',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: <Target className="h-7 w-7 text-secondary" />,
      bg: 'from-secondary/20 to-secondary/10 border-secondary/30',
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
            <div className={`w-2 h-2 rounded-full ${
              stats.loading ? 'bg-yellow-500 animate-pulse' : 
              stats.isStale ? 'bg-orange-500' : 'bg-green-500'
            }`} />
            <span>
              {stats.loading ? 'Updating...' : 
               stats.isStale ? 'Cached Data' : 'Live Data'}
            </span>
          </div>
          
          {stats.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDistanceToNow(stats.lastUpdated, { addSuffix: true })}</span>
            </div>
          )}
          
          {stats.queryDuration && stats.queryDuration > 0 && (
            <div className="text-xs text-muted-foreground">
              {stats.queryDuration}ms
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
          
          {/* (production) manual refresh */}
        </div>

        {stats.error && (
          <div className={`border rounded-lg p-3 mb-6 max-w-md mx-auto ${
            stats.isStale 
              ? 'bg-orange-50/50 border-orange-200/30'
              : 'bg-destructive/10 border-destructive/20'
          }`}>
            <p className={`text-sm flex items-center gap-2 ${
              stats.isStale ? 'text-orange-700' : 'text-destructive'
            }`}>
              {stats.isStale && (
                <>
                  <span>⚠️</span>
                  <span>Showing cached data - </span>
                </>
              )}
              {stats.error}
            </p>
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
          <div className="bg-gradient-peach border border-peach/30 rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">Platform Impact</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-raspberry-red">{stats.averageDonationSize}</div>
                <div className="text-muted-foreground">Avg. Donation Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-mango-orange">{stats.totalQuantityDonated}</div>
                <div className="text-muted-foreground">Total Quantity Donated</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

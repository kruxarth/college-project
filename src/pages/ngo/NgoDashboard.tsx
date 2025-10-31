import { Navbar } from '@/components/Navbar';
import { 
  DashboardHeader, 
  StatsCards, 
  AvailableDonationsSection, 
  RecentClaimsSection 
} from '@/components/ngo';
import { useNGODashboardData } from '@/hooks/useNGODashboardData';

export default function NgoDashboard() {
  const {
    claims,
    availableDonations,
    userProfile,
    loading,
    error,
    refresh,
    initDemoData,
  } = useNGODashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <DashboardHeader 
          error={error}
          loading={loading}
          onRefresh={refresh}
        />

        <StatsCards claims={claims} />

        <AvailableDonationsSection 
          donations={availableDonations}
          userProfile={userProfile}
          onInitDemoData={initDemoData}
          loading={loading}
        />

        <RecentClaimsSection claims={claims} />
      </main>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, Clock, CheckCircle, Search } from 'lucide-react';
import * as fs from '@/services/firestore';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { useState, useEffect } from 'react';
import type { Donation } from '@/types/firebase';

export default function NgoDashboard() {
  const { currentUser } = useAuth();
  const [myClaims, setMyClaims] = useState<Donation[]>([]);
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      const [claims, available, profile] = await Promise.all([
        fs.getDonationsByClaimer(currentUser.id),
        fs.getAvailableDonations(),
        fs.getUserProfile(currentUser.id)
      ]);
      
      setMyClaims(claims);
      setAvailableDonations(available);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const stats = {
    totalReceived: myClaims.filter(d => d.status === 'completed').length,
    activeClaims: myClaims.filter(d => d.status !== 'completed' && d.status !== 'cancelled').length,
    pendingPickups: myClaims.filter(d => d.status === 'claimed' || d.status === 'on_the_way').length,
    totalQuantity: myClaims.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.quantity, 0),
  };

  const nearbyDonations = userProfile ? availableDonations
    .map(d => ({
      ...d,
      distance: calculateDistance(userProfile.latitude, userProfile.longitude, d.pickupLatitude, d.pickupLongitude),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">NGO Dashboard</h1>
            <p className="text-muted-foreground">Browse and claim available food donations</p>
          </div>
          <Button size="lg" className="bg-gradient-warm" asChild>
            <Link to="/ngo/browse">
              <Search className="mr-2 h-5 w-5" />
              Browse Donations
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Received</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.totalReceived}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Claims</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.activeClaims}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Pickups</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.pendingPickups}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalQuantity}</div>
              <p className="text-xs text-muted-foreground mt-1">items received</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-medium mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Available Donations Nearby</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/ngo/browse">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {nearbyDonations.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No donations available</h3>
                <p className="text-muted-foreground">Check back later for new donations</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyDonations.map(donation => (
                  <Card key={donation.id} className="hover:shadow-soft transition-shadow">
                    <CardContent className="p-4">
                      {donation.images.length > 0 ? (
                        <img 
                          src={donation.images[0]} 
                          alt={donation.foodName}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <h4 className="font-semibold mb-1">{donation.foodName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {donation.quantity} {donation.quantityUnit} • {formatDistance(donation.distance)}
                      </p>
                      <div className="flex gap-2 text-xs mb-3">
                        {donation.allergens.map(a => (
                          <span key={a} className="bg-muted px-2 py-1 rounded">{a}</span>
                        ))}
                      </div>
                      <Button size="sm" className="w-full" asChild>
                        <Link to={`/donation/${donation.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Claims</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/ngo/my-claims">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myClaims.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No claims yet</h3>
                <p className="text-muted-foreground mb-6">Start browsing available donations</p>
                <Button asChild>
                  <Link to="/ngo/browse">Browse Donations</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myClaims.slice(0, 5).map(claim => (
                  <div
                    key={claim.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{claim.foodName}</h4>
                        <StatusBadge status={claim.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {claim.quantity} {claim.quantityUnit} from {claim.donorName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Claimed {formatDistanceToNow(new Date(claim.claimedAt!), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/donation/${claim.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

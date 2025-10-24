import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, CheckCircle, Clock, Plus } from 'lucide-react';
import storage from '@/services/localStorage';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const donations = currentUser ? storage.getDonations().filter(d => d.donorId === currentUser.id) : [];
  
  const stats = {
    total: donations.length,
    active: donations.filter(d => d.status === 'available' || d.status === 'claimed').length,
    completed: donations.filter(d => d.status === 'completed').length,
    totalQuantity: donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.quantity, 0),
  };

  const recentDonations = donations.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Donor Dashboard</h1>
            <p className="text-muted-foreground">Manage your food donations and track impact</p>
          </div>
          <Button size="lg" className="bg-gradient-warm" asChild>
            <Link to="/donor/create-donation">
              <Plus className="mr-2 h-5 w-5" />
              Create Donation
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalQuantity}</div>
              <p className="text-xs text-muted-foreground mt-1">items donated</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Donations</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/donor/donations">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentDonations.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-6">Start making a difference by creating your first donation</p>
                <Button asChild>
                  <Link to="/donor/create-donation">Create Donation</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDonations.map(donation => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{donation.foodName}</h4>
                        <StatusBadge status={donation.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {donation.quantity} {donation.quantityUnit} • {donation.category}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/donation/${donation.id}`}>View</Link>
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

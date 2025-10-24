import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import storage from '@/services/localStorage';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

export default function ManageDonations() {
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  
  const allDonations = currentUser ? storage.getDonations().filter(d => d.donorId === currentUser.id) : [];
  
  const donations = statusFilter === 'all' 
    ? allDonations 
    : allDonations.filter(d => d.status === statusFilter);

  const handleCancel = (donationId: string) => {
    storage.updateDonation(donationId, { status: 'cancelled' });
    toast.success('Donation cancelled');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Donations</h1>
            <p className="text-muted-foreground">Manage and track your donations</p>
          </div>
          <Button asChild>
            <Link to="/donor/create-donation">Create Donation</Link>
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
              <SelectItem value="on_the_way">On the Way</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {donations.length === 0 ? (
          <Card className="shadow-medium">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-20 w-20 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No donations found</h3>
              <p className="text-muted-foreground mb-6">
                {statusFilter === 'all' ? 'Start making a difference by creating your first donation' : `No ${statusFilter} donations`}
              </p>
              <Button asChild>
                <Link to="/donor/create-donation">Create Donation</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {donations.map(donation => (
              <Card key={donation.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {donation.images.length > 0 ? (
                      <img 
                        src={donation.images[0]} 
                        alt={donation.foodName}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{donation.foodName}</h3>
                          <p className="text-muted-foreground">{donation.description}</p>
                        </div>
                        <StatusBadge status={donation.status} />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>{' '}
                          <span className="font-medium">{donation.quantity} {donation.quantityUnit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>{' '}
                          <span className="font-medium">{donation.category}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires:</span>{' '}
                          <span className="font-medium">{format(new Date(donation.expiryTime), 'PPp')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>{' '}
                          <span className="font-medium">{formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>

                      {donation.claimedByName && (
                        <div className="bg-muted p-3 rounded-lg mb-4">
                          <p className="text-sm">
                            <span className="font-semibold">Claimed by:</span> {donation.claimedByName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(donation.claimedAt!), { addSuffix: true })}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/donation/${donation.id}`}>View Details</Link>
                        </Button>
                        {donation.status === 'available' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancel(donation.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

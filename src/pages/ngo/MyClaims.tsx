import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Phone, MapPin } from 'lucide-react';
import storage from '@/services/localStorage';
import { StatusBadge } from '@/components/StatusBadge';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { generateUUID } from '@/utils/image';

export default function MyClaims() {
  const { currentUser, user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  
  const allClaims = currentUser ? storage.getDonations().filter(d => d.claimedBy === currentUser.id) : [];
  
  const claims = statusFilter === 'all' 
    ? allClaims 
    : allClaims.filter(d => d.status === statusFilter);

  const updateStatus = (donationId: string, newStatus: string) => {
    const donation = storage.getDonationById(donationId);
    if (!donation) return;

    storage.updateDonation(donationId, { status: newStatus as any });
    
    storage.addStatusHistory({
      id: generateUUID(),
      donationId,
      status: newStatus,
      updatedBy: currentUser!.id,
      updatedByName: user!.organizationName || user!.fullName,
      notes: `Status updated to ${newStatus}`,
      createdAt: new Date().toISOString(),
    });

    storage.addNotification({
      id: generateUUID(),
      userId: donation.donorId,
      title: 'Status Update',
      message: `${donation.foodName} is now ${newStatus.replace('_', ' ')}`,
      type: 'status_update',
      isRead: false,
      relatedDonationId: donationId,
      createdAt: new Date().toISOString(),
    });

    toast.success('Status updated successfully');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Claims</h1>
          <p className="text-muted-foreground">Track and manage your claimed donations</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
              <SelectItem value="on_the_way">On the Way</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {claims.length === 0 ? (
          <Card className="shadow-medium">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-20 w-20 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No claims found</h3>
              <p className="text-muted-foreground mb-6">
                {statusFilter === 'all' ? 'Start browsing available donations' : `No ${statusFilter} claims`}
              </p>
              <Button asChild>
                <Link to="/ngo/browse">Browse Donations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {claims.map(claim => (
              <Card key={claim.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {claim.images.length > 0 ? (
                      <img 
                        src={claim.images[0]} 
                        alt={claim.foodName}
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
                          <h3 className="text-xl font-semibold mb-1">{claim.foodName}</h3>
                          <p className="text-muted-foreground">{claim.description}</p>
                        </div>
                        <StatusBadge status={claim.status} />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>{' '}
                          <span className="font-medium">{claim.quantity} {claim.quantityUnit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires:</span>{' '}
                          <span className="font-medium">{format(new Date(claim.expiryTime), 'PPp')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pickup:</span>{' '}
                          <span className="font-medium">
                            {format(new Date(claim.pickupTimeStart), 'p')} - {format(new Date(claim.pickupTimeEnd), 'p')}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Claimed:</span>{' '}
                          <span className="font-medium">{formatDistanceToNow(new Date(claim.claimedAt!), { addSuffix: true })}</span>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{claim.donorName}:</span>
                          <a href={`tel:${claim.donorPhone}`} className="text-primary hover:underline">
                            {claim.donorPhone}
                          </a>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{claim.pickupAddress}</span>
                        </div>
                        {claim.additionalNotes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-semibold">Note:</span> {claim.additionalNotes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/donation/${claim.id}`}>View Details</Link>
                        </Button>
                        
                        {claim.status === 'claimed' && (
                          <Button 
                            size="sm"
                            onClick={() => updateStatus(claim.id, 'on_the_way')}
                          >
                            Mark as On the Way
                          </Button>
                        )}
                        
                        {claim.status === 'on_the_way' && (
                          <Button 
                            size="sm"
                            onClick={() => updateStatus(claim.id, 'picked_up')}
                          >
                            Mark as Picked Up
                          </Button>
                        )}
                        
                        {claim.status === 'picked_up' && (
                          <Button 
                            size="sm"
                            className="bg-success"
                            onClick={() => updateStatus(claim.id, 'completed')}
                          >
                            Mark as Completed
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

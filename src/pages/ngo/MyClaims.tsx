import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as fs from '@/services/firestore';
import type { Donation } from '@/types/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';

export default function MyClaims() {
  const { currentUser } = useAuth();
  const [claims, setClaims] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadClaims();
    }
  }, [currentUser]);

  const loadClaims = async () => {
    if (!currentUser) return;
    
    try {
      const userClaims = await fs.getDonationsByClaimer(currentUser.id);
      setClaims(userClaims);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCollected = async (donationId: string) => {
    try {
      await fs.updateDonation(donationId, { status: 'picked_up' });
      // Refresh claims
      loadClaims();
    } catch (error) {
      console.error('Error marking as collected:', error);
    }
  };

  const handleMarkDelivered = async (donationId: string) => {
    try {
      await fs.updateDonation(donationId, { status: 'completed' });
      // Refresh claims
      loadClaims();
    } catch (error) {
      console.error('Error marking as delivered:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">Loading claims...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Claims</h1>
      </div>

      {claims.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">You haven't claimed any donations yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {claims.map((donation) => (
            <Card key={donation.id} className="h-fit">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{donation.foodName}</CardTitle>
                  <StatusBadge status={donation.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Donor</p>
                    <p className="font-medium">{donation.donorName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm">{donation.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="text-sm">{donation.quantity} {donation.quantityUnit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="text-sm">{donation.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Pickup Address</p>
                    <p className="text-sm">{donation.pickupAddress}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Pickup Time</p>
                    <p className="text-sm">
                      {new Date(donation.pickupTimeStart).toLocaleDateString()} - {' '}
                      {new Date(donation.pickupTimeStart).toLocaleTimeString()} to {' '}
                      {new Date(donation.pickupTimeEnd).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Expiry Time</p>
                    <p className="text-sm">
                      {new Date(donation.expiryTime).toLocaleDateString()} - {' '}
                      {new Date(donation.expiryTime).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {donation.allergens.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Allergens</p>
                      <div className="flex flex-wrap gap-1">
                        {donation.allergens.map((allergen, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {donation.additionalNotes && (
                    <div>
                      <p className="text-sm text-gray-600">Additional Notes</p>
                      <p className="text-sm">{donation.additionalNotes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    {donation.status === 'claimed' && (
                      <Button 
                        onClick={() => handleMarkCollected(donation.id)}
                        size="sm" 
                        className="flex-1"
                      >
                        Mark as Collected
                      </Button>
                    )}
                    {donation.status === 'picked_up' && (
                      <Button 
                        onClick={() => handleMarkDelivered(donation.id)}
                        size="sm" 
                        className="flex-1"
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

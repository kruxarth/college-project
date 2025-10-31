import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { calculateDistance, formatDistance } from '@/utils/distance';
import type { Donation, User } from '@/types/firebase';

interface AvailableDonationsSectionProps {
  donations: Donation[];
  userProfile: User | null;
  onInitDemoData: () => void;
  loading: boolean;
}

export function AvailableDonationsSection({ 
  donations, 
  userProfile, 
  onInitDemoData, 
  loading 
}: AvailableDonationsSectionProps) {
  const nearbyDonations = userProfile ? donations
    .map(d => ({
      ...d,
      distance: calculateDistance(
        userProfile.latitude, 
        userProfile.longitude, 
        d.pickupLatitude, 
        d.pickupLongitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6) : [];

  return (
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
          <EmptyDonationsState 
            totalDonations={donations.length}
            onInitDemoData={onInitDemoData}
            loading={loading}
          />
        ) : (
          <DonationsGrid donations={nearbyDonations} />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyDonationsState({ 
  totalDonations, 
  onInitDemoData, 
  loading 
}: { 
  totalDonations: number;
  onInitDemoData: () => void;
  loading: boolean;
}) {
  return (
    <div className="text-center py-12">
      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No donations available</h3>
      <p className="text-muted-foreground mb-4">Check back later for new donations</p>
      {totalDonations === 0 && (
        <Button 
          variant="outline" 
          onClick={onInitDemoData}
          disabled={loading}
        >
          Initialize Demo Data
        </Button>
      )}
    </div>
  );
}

function DonationsGrid({ donations }: { donations: (Donation & { distance: number })[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {donations.map(donation => (
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
              {donation.allergens.slice(0, 3).map(a => (
                <span key={a} className="bg-muted px-2 py-1 rounded">{a}</span>
              ))}
              {donation.allergens.length > 3 && (
                <span className="bg-muted px-2 py-1 rounded">+{donation.allergens.length - 3}</span>
              )}
            </div>
            <Button size="sm" className="w-full" asChild>
              <Link to={`/donation/${donation.id}`}>View Details</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  Clock, 
  MapPin, 
  Package, 
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import type { Donation } from '@/types';

interface DonationCardProps {
  donation: Donation;
  showDonor?: boolean;
  showClaimer?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({ 
  donation, 
  showDonor = false, 
  showClaimer = false 
}) => {
  const isExpiringSoon = () => {
    const expiryTime = new Date(donation.expiryTime);
    const now = new Date();
    const timeDiff = expiryTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 6 && hoursDiff > 0; // Expiring within 6 hours
  };

  const isExpired = () => {
    const expiryTime = new Date(donation.expiryTime);
    return expiryTime < new Date();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg">{donation.foodName}</h4>
            <p className="text-sm text-gray-600 mt-1">{donation.description}</p>
          </div>
          <StatusBadge status={donation.status} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{donation.quantity} {donation.quantityUnit}</span>
            <Badge variant="secondary" className="text-xs">
              {donation.category}
            </Badge>
          </div>

          {showDonor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Donor: {donation.donorName}</span>
            </div>
          )}

          {showClaimer && donation.claimedByName && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Claimed by: {donation.claimedByName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{donation.pickupAddress}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Pickup: {donation.pickupTimeStart} - {donation.pickupTimeEnd}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className={`${isExpired() ? 'text-red-600' : isExpiringSoon() ? 'text-orange-600' : 'text-gray-600'}`}>
              Expires {formatDistanceToNow(new Date(donation.expiryTime), { addSuffix: true })}
            </span>
            {isExpiringSoon() && (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
            {isExpired() && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        {donation.allergens && donation.allergens.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Allergens:</p>
            <div className="flex flex-wrap gap-1">
              {donation.allergens.map((allergen, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>Created {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}</span>
          {donation.updatedAt !== donation.createdAt && (
            <span>Updated {formatDistanceToNow(new Date(donation.updatedAt), { addSuffix: true })}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
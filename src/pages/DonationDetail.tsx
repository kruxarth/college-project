import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Clock, Phone, User, Calendar, AlertCircle } from 'lucide-react';
import storage from '@/services/localStorage';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateUUID } from '@/utils/image';
import { calculateDistance, formatDistance } from '@/utils/distance';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function DonationDetail() {
  const { id } = useParams();
  const { currentUser, user } = useAuth();
  const navigate = useNavigate();
  
  const donation = storage.getDonationById(id!);

  if (!donation) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Donation Not Found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </main>
      </div>
    );
  }

  const isDonor = currentUser?.role === 'donor' && donation.donorId === currentUser.id;
  const isNgo = currentUser?.role === 'ngo';
  const canClaim = isNgo && donation.status === 'available';
  const isClaimed = donation.claimedBy === currentUser?.id;

  const distance = isNgo ? calculateDistance(
    user!.latitude,
    user!.longitude,
    donation.pickupLatitude,
    donation.pickupLongitude
  ) : 0;

  const handleClaim = () => {
    storage.updateDonation(donation.id, {
      status: 'claimed',
      claimedBy: currentUser!.id,
      claimedByName: user!.organizationName || user!.fullName,
      claimedAt: new Date().toISOString(),
    });

    storage.addNotification({
      id: generateUUID(),
      userId: donation.donorId,
      title: 'Donation Claimed',
      message: `Your donation "${donation.foodName}" has been claimed by ${user!.organizationName || user!.fullName}`,
      type: 'donation_claimed',
      isRead: false,
      relatedDonationId: donation.id,
      createdAt: new Date().toISOString(),
    });

    storage.addStatusHistory({
      id: generateUUID(),
      donationId: donation.id,
      status: 'claimed',
      updatedBy: currentUser!.id,
      updatedByName: user!.organizationName || user!.fullName,
      notes: 'Donation claimed',
      createdAt: new Date().toISOString(),
    });

    toast.success('Donation claimed successfully!');
    navigate('/ngo/my-claims');
  };

  const statusHistory = storage.getStatusHistory(donation.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          ← Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-medium mb-6">
              <CardContent className="p-0">
                {donation.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {donation.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${donation.foodName} ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted flex items-center justify-center rounded-t-lg">
                    <Package className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{donation.foodName}</h1>
                      <p className="text-muted-foreground">{donation.description}</p>
                    </div>
                    <StatusBadge status={donation.status} className="text-sm" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{donation.quantity} {donation.quantityUnit}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-semibold">{donation.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Allergens</p>
                      <div className="flex flex-wrap gap-2">
                        {donation.allergens.map(a => (
                          <Badge key={a} variant="secondary">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {donation.additionalNotes && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Additional Notes</p>
                      <p className="text-sm">{donation.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {statusHistory.length > 0 && (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusHistory.map(history => (
                      <div key={history.id} className="flex gap-4 border-l-2 border-primary pl-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={history.status as any} />
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(history.createdAt), 'PPp')}
                            </span>
                          </div>
                          <p className="text-sm">Updated by {history.updatedByName}</p>
                          {history.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Pickup Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="font-semibold">{format(new Date(donation.expiryTime), 'PPp')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Window</p>
                    <p className="font-semibold">
                      {format(new Date(donation.pickupTimeStart), 'p')} - {format(new Date(donation.pickupTimeEnd), 'p')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(donation.pickupTimeStart), 'PP')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">{donation.pickupAddress}</p>
                    {isNgo && (
                      <p className="text-sm text-muted-foreground mt-1">
                        📍 {formatDistance(distance)} away
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Donor</p>
                    <p className="font-semibold">{donation.donorName}</p>
                  </div>
                </div>

                {(isDonor || isClaimed) && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${donation.donorPhone}`} className="font-semibold text-primary hover:underline">
                        {donation.donorPhone}
                      </a>
                    </div>
                  </div>
                )}

                {donation.claimedByName && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Claimed by</p>
                      <p className="font-semibold">{donation.claimedByName}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {canClaim && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" className="w-full bg-gradient-warm">
                    Claim This Donation
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Claim Donation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to claim this donation? You'll be responsible for picking it up within the specified timeframe.
                      <div className="mt-4 p-3 bg-muted rounded-lg space-y-2 text-sm">
                        <p><strong>Pickup:</strong> {format(new Date(donation.pickupTimeStart), 'PPp')}</p>
                        <p><strong>Contact:</strong> {donation.donorPhone}</p>
                        <p><strong>Address:</strong> {donation.pickupAddress}</p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClaim}>Confirm Claim</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

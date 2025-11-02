import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Clock, Phone, User, Calendar, AlertCircle } from 'lucide-react';
import * as fs from '@/services/firestore';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { useState, useEffect } from 'react';
import type { Donation, StatusHistory } from '@/types/firebase';
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [donation, setDonation] = useState<Donation | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadDonation();
    }
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) return;
    
    setProfileLoading(true);
    try {
      const profile = await fs.getUserProfile(currentUser.id);
      setUserProfile(profile);
    } catch (error) {
      // silently ignore profile load errors; UX is handled via disabled claim button
    } finally {
      setProfileLoading(false);
    }
  };

  const loadDonation = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const donationData = await fs.getDonationById(id);
      setDonation(donationData);
      
      if (donationData) {
        const history = await fs.getStatusHistory(id);
        setStatusHistory(history);
      }
    } catch (error) {
      // ignore load error; fallback UI will show Not Found if needed
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </main>
      </div>
    );
  }

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
  const isClaimed = donation.claimedBy === currentUser?.id;
  const canClaim = isNgo && donation.status === 'available' && !isClaimed;
  
  // Don't show claim button until profile is loaded
  const canShowClaimButton = canClaim && userProfile && !profileLoading;

  const distance = isNgo && userProfile ? calculateDistance(
    userProfile.latitude,
    userProfile.longitude,
    donation.pickupLatitude,
    donation.pickupLongitude
  ) : 0;

  const handleClaim = async () => {
    // Guard rails: bail out quietly if prerequisites aren't ready
    if (!currentUser) {
      toast.error('Please log in to claim this donation');
      return;
    }
    if (!donation) {
      // Should not happen on this page; quietly abort
      return;
    }
    if (profileLoading || !userProfile) {
      // Profile not ready yet – do not show error toast
      return;
    }

    setClaiming(true);

    // Phase 1: update main donation document. Only this determines success toast.
    try {
      await fs.updateDonation(donation.id, {
        status: 'claimed',
        claimedBy: currentUser.id,
        claimedByName: userProfile.organizationName || userProfile.fullName,
        claimedAt: new Date().toISOString(),
      });
    } catch (error) {
      toast.error('Failed to claim donation. Please try again.');
      setClaiming(false);
      return;
    }

    // Phase 2: fire-and-forget side effects. Do not block success or show error popups.
    Promise.allSettled([
      fs.addNotification({
        userId: donation.donorId,
        title: 'Donation Claimed',
        message: `Your donation "${donation.foodName}" has been claimed by ${userProfile.organizationName || userProfile.fullName}`,
        type: 'donation_claimed',
        isRead: false,
        relatedDonationId: donation.id,
      }),
      fs.addStatusHistory({
        donationId: donation.id,
        status: 'claimed',
        updatedBy: currentUser.id,
        updatedByName: userProfile.organizationName || userProfile.fullName,
        notes: 'Donation claimed',
      })
    ]);

    // UX: show lightweight inline success instead of popup
    setClaimSuccess(true);

    // Refresh on-page data (non-blocking) and navigate after a short delay
  loadDonation().catch(() => {});
    setTimeout(() => navigate('/ngo/my-claims'), 500);

    setClaiming(false);
  };

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
          </div>

          <div className="space-y-6">
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

            {claimSuccess && (
              <div className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 text-sm">
                Donation claimed. Redirecting to your claims...
              </div>
            )}

            {isNgo && profileLoading && (
              <Card className="shadow-medium">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">Loading your profile...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {canShowClaimButton && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-warm"
                    disabled={claiming || profileLoading}
                  >
                    {claiming ? 'Claiming...' : profileLoading ? 'Loading Profile...' : 'Claim This Donation'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Claim Donation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to claim this donation? You'll be responsible for picking it up within the specified timeframe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClaim}
                      disabled={claiming}
                    >
                      {claiming ? 'Claiming...' : 'Confirm Claim'}
                    </AlertDialogAction>
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
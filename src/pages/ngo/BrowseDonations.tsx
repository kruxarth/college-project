import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Search, SlidersHorizontal, Map as MapIcon, List, MapPin, AlertCircle, Navigation, Loader2 } from 'lucide-react';
import * as fs from '@/services/firestore';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Donation } from '@/types/firebase';

// Custom marker icons
const donorIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const myLocationIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const categories = ['All', 'Cooked Food', 'Raw Ingredients', 'Packaged Food', 'Baked Goods', 'Beverages', 'Fruits & Vegetables', 'Dairy Products', 'Other'];
const allergens = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Seafood', 'Shellfish'];
const distanceOptions = ['5', '10', '25', '50', '100'];

export default function BrowseDonations() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [excludeAllergens, setExcludeAllergens] = useState<string[]>([]);
  const [distanceFilter, setDistanceFilter] = useState('50');
  const [sortBy, setSortBy] = useState('nearest');
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapKey, setMapKey] = useState(0); // For forcing map re-render

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      const profile = await fs.getUserProfile(currentUser.id);
      setUserProfile(profile);
      // Set initial map center to user's location
      if (profile && profile.latitude && profile.longitude) {
        setMapCenter([profile.latitude, profile.longitude]);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadDonations = async () => {
    try {
      console.log('🔄 Loading available donations...');
      let donations;
      try {
        donations = await fs.getAvailableDonations();
      } catch (error) {
        console.log('Primary method failed, trying fallback method...');
        donations = await fs.getAvailableDonationsBasic();
      }
      console.log(`📦 Loaded ${donations.length} available donations`);
      
      if (donations.length > 0) {
        console.log('📝 Sample donations:', donations.slice(0, 2).map(d => ({
          id: d.id,
          name: d.foodName,
          status: d.status,
          created: d.createdAt
        })));
      }
      
      setAvailableDonations(donations);
    } catch (error) {
      console.error('❌ Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    setGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
          setMapCenter(newCenter);
          setMapKey(prev => prev + 1); // Force map to re-render with new center
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please ensure location services are enabled.');
          setGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setGettingLocation(false);
    }
  };

  const toggleAllergen = (allergen: string) => {
    setExcludeAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const filteredDonations = availableDonations
    .filter(d => {
      const matchesSearch = d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
      const matchesAllergens = excludeAllergens.length === 0 || 
        !d.allergens.some(a => excludeAllergens.includes(a) && a !== 'None');
      
      return matchesSearch && matchesCategory && matchesAllergens;
    })
    .map(d => {
      // Calculate distance only if userProfile is available
      const distance = userProfile 
        ? calculateDistance(userProfile.latitude, userProfile.longitude, d.pickupLatitude, d.pickupLongitude)
        : 0;
      return { ...d, distance };
    })
    .filter(d => !userProfile || d.distance <= Number(distanceFilter)) // Apply distance filter only if location is set
    .sort((a, b) => {
      if (sortBy === 'nearest' && userProfile) return a.distance - b.distance;
      if (sortBy === 'expiring') return new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime();
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
        <h1 className="text-4xl font-bold mb-2">Browse Donations</h1>
        <p className="text-muted-foreground mb-8">Find and claim available food donations nearby</p>

        {!userProfile && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Location Not Set</AlertTitle>
            <AlertDescription>
              Please update your profile with your organization's location to see distances and use the map view.
              <Link to="/profile" className="ml-2 underline font-medium">
                Go to Profile
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearest">Nearest First</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="quantity">Highest Quantity</SelectItem>
              <SelectItem value="recent">Recently Posted</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Options</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-3">
                  <Label>Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Distance (km)</Label>
                  <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {distanceOptions.map(dist => (
                        <SelectItem key={dist} value={dist}>Within {dist}km</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Exclude Allergens</Label>
                  <div className="space-y-2">
                    {allergens.map(allergen => (
                      <div key={allergen} className="flex items-center space-x-2">
                        <Checkbox
                          id={`filter-${allergen}`}
                          checked={excludeAllergens.includes(allergen)}
                          onCheckedChange={() => toggleAllergen(allergen)}
                        />
                        <Label htmlFor={`filter-${allergen}`} className="text-sm cursor-pointer">
                          {allergen}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''}
          {userProfile && ` within ${distanceFilter}km of your location`}
        </p>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'map')} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="mt-6">
            {filteredDonations.length === 0 ? (
              <Card className="shadow-medium">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-20 w-20 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No donations found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.map(donation => (
                  <Card key={donation.id} className="shadow-soft hover:shadow-medium transition-shadow">
                    <CardContent className="p-0">
                      {donation.images.length > 0 ? (
                        <img 
                          src={donation.images[0]} 
                          alt={donation.foodName}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                          <Package className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{donation.foodName}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {donation.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium">{donation.quantity} {donation.quantityUnit}</span>
                          </div>
                          {userProfile && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Distance:</span>
                              <span className="font-medium">{formatDistance(donation.distance)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium">{donation.category}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {donation.allergens.map(a => (
                            <span key={a} className="text-xs bg-muted px-2 py-1 rounded">{a}</span>
                          ))}
                        </div>

                        <Button className="w-full" asChild>
                          <Link to={`/donation/${donation.id}`}>View & Claim</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map" className="mt-6">
            {filteredDonations.length === 0 ? (
              <Card className="shadow-medium">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-20 w-20 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No donations found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Map Controls Header */}
                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm">Interactive Map View</h3>
                      <p className="text-xs text-muted-foreground">
                        {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''} visible on map
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={useMyLocation}
                    disabled={gettingLocation}
                    className="gap-2"
                  >
                    {gettingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4" />
                        Use My Location
                      </>
                    )}
                  </Button>
                </div>

                <Card className="shadow-medium">
                  <CardContent className="p-0">
                    <div className="h-[600px] rounded-lg overflow-hidden">
                      <MapContainer
                        key={mapKey}
                        center={mapCenter || (userProfile ? [userProfile.latitude, userProfile.longitude] : [19.8762, 75.3433])}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* User's location marker (if profile exists) */}
                        {userProfile && userProfile.latitude && userProfile.longitude && (
                          <Marker 
                            position={[userProfile.latitude, userProfile.longitude]}
                            icon={myLocationIcon}
                          >
                            <Popup>
                              <div className="text-center">
                                <strong>Your Organization</strong>
                                <p className="text-xs text-muted-foreground mt-1">{userProfile.address}</p>
                                <p className="text-xs text-muted-foreground">{userProfile.organizationName || userProfile.fullName}</p>
                              </div>
                            </Popup>
                          </Marker>
                        )}

                        {/* Donation markers */}
                        {filteredDonations.map((donation, index) => (
                          <Marker
                            key={donation.id}
                            position={[donation.pickupLatitude, donation.pickupLongitude]}
                            icon={donorIcon}
                          >
                            <Popup maxWidth={300}>
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-base flex-1">{donation.foodName}</h3>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    #{index + 1}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {donation.description}
                                </p>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Donor:</span>
                                    <span className="font-medium">{donation.donorName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <span className="font-medium">{donation.quantity} {donation.quantityUnit}</span>
                                  </div>
                                  {userProfile && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Distance:</span>
                                      <span className="font-medium text-primary">{formatDistance(donation.distance)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Category:</span>
                                    <span className="font-medium">{donation.category}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Address:</span>
                                    <span className="font-medium text-xs">{donation.pickupAddress.substring(0, 30)}...</span>
                                  </div>
                                </div>
                                <Button className="w-full mt-2" size="sm" asChild>
                                  <Link to={`/donation/${donation.id}`}>View & Claim</Link>
                                </Button>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Legend and Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="shadow-soft">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 text-sm">Map Legend</h4>
                      <div className="space-y-2">
                        {userProfile && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                            <span>Your Organization Location</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow"></div>
                          <span>Available Donations ({filteredDonations.length})</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 text-sm">How to Use</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Click on any red marker to view donation details</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Use "Use My Location" button to center map on your current position</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Click "View & Claim" in popup to claim a donation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Zoom and pan the map to explore more donations</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

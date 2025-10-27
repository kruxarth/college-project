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
import { Package, Search, SlidersHorizontal } from 'lucide-react';
import * as fs from '@/services/firestore';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Donation } from '@/types/firebase';

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
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadDonations = async () => {
    try {
      const donations = await fs.getAvailableDonations();
      setAvailableDonations(donations);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAllergen = (allergen: string) => {
    setExcludeAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const filteredDonations = userProfile ? availableDonations
    .filter(d => {
      const matchesSearch = d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
      const matchesAllergens = excludeAllergens.length === 0 || 
        !d.allergens.some(a => excludeAllergens.includes(a) && a !== 'None');
      
      return matchesSearch && matchesCategory && matchesAllergens;
    })
    .map(d => ({
      ...d,
      distance: calculateDistance(userProfile.latitude, userProfile.longitude, d.pickupLatitude, d.pickupLongitude),
    }))
    .filter(d => d.distance <= Number(distanceFilter))
    .sort((a, b) => {
      if (sortBy === 'nearest') return a.distance - b.distance;
      if (sortBy === 'expiring') return new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime();
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) : [];

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
        </p>

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
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{formatDistance(donation.distance)}</span>
                      </div>
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
      </main>
    </div>
  );
}

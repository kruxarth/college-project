import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import storage from '@/services/localStorage';
import { compressImage, generateUUID } from '@/utils/image';

const categories = [
  'Cooked Food',
  'Raw Ingredients',
  'Packaged Food',
  'Baked Goods',
  'Beverages',
  'Fruits & Vegetables',
  'Dairy Products',
  'Other',
];

const allergens = ['None', 'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Seafood', 'Shellfish'];

const units = ['kg', 'liters', 'servings', 'plates', 'boxes', 'pieces'];

export default function CreateDonation() {
  const { currentUser, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(['None']);
  
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    quantityUnit: 'kg',
    category: '',
    expiryTime: '',
    pickupAddress: user?.address || '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    additionalNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressImage(files[i]);
        newImages.push(compressed);
      } catch (error) {
        toast.error(`Failed to process image ${i + 1}`);
      }
    }

    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAllergen = (allergen: string) => {
    if (allergen === 'None') {
      setSelectedAllergens(['None']);
    } else {
      const filtered = selectedAllergens.filter(a => a !== 'None');
      if (selectedAllergens.includes(allergen)) {
        const newList = filtered.filter(a => a !== allergen);
        setSelectedAllergens(newList.length === 0 ? ['None'] : newList);
      } else {
        setSelectedAllergens([...filtered, allergen]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.expiryTime || !formData.pickupTimeStart || !formData.pickupTimeEnd) {
      toast.error('Please fill in all time fields');
      return;
    }

    setLoading(true);

    const donation = {
      id: generateUUID(),
      donorId: currentUser!.id,
      donorName: user!.fullName,
      donorPhone: user!.phone,
      foodName: formData.foodName,
      description: formData.description,
      quantity: Number(formData.quantity),
      quantityUnit: formData.quantityUnit,
      category: formData.category,
      allergens: selectedAllergens,
      expiryTime: new Date(formData.expiryTime).toISOString(),
      pickupAddress: formData.pickupAddress,
      pickupLatitude: user!.latitude,
      pickupLongitude: user!.longitude,
      pickupTimeStart: new Date(formData.pickupTimeStart).toISOString(),
      pickupTimeEnd: new Date(formData.pickupTimeEnd).toISOString(),
      status: 'available' as const,
      claimedBy: null,
      claimedByName: null,
      claimedAt: null,
      additionalNotes: formData.additionalNotes,
      images,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveDonation(donation);

    toast.success('Donation created successfully!');
    navigate('/donor/donations');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Create Donation</h1>
        <p className="text-muted-foreground mb-8">Share your surplus food with those in need</p>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle>Food Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="foodName">Food Name *</Label>
                <Input
                  id="foodName"
                  name="foodName"
                  required
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g., Fresh Sandwiches"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the food in detail"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantityUnit">Unit *</Label>
                  <Select value={formData.quantityUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, quantityUnit: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Allergen Information</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allergens.map(allergen => (
                    <div key={allergen} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergen}
                        checked={selectedAllergens.includes(allergen)}
                        onCheckedChange={() => toggleAllergen(allergen)}
                      />
                      <Label htmlFor={allergen} className="text-sm cursor-pointer">
                        {allergen}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryTime">Expiry / Best Before Time *</Label>
                <Input
                  id="expiryTime"
                  name="expiryTime"
                  type="datetime-local"
                  required
                  value={formData.expiryTime}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle>Pickup Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address *</Label>
                <Input
                  id="pickupAddress"
                  name="pickupAddress"
                  required
                  value={formData.pickupAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupTimeStart">Available From *</Label>
                  <Input
                    id="pickupTimeStart"
                    name="pickupTimeStart"
                    type="datetime-local"
                    required
                    value={formData.pickupTimeStart}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupTimeEnd">Available Until *</Label>
                  <Input
                    id="pickupTimeEnd"
                    name="pickupTimeEnd"
                    type="datetime-local"
                    required
                    value={formData.pickupTimeEnd}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Gate code, parking instructions"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle>Photos (Optional - Max 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length < 5 && (
                  <Label htmlFor="images" className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition-colors">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload images</span>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1 bg-gradient-warm" disabled={loading}>
              {loading ? 'Creating...' : 'Create Donation'}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={() => navigate('/donor/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

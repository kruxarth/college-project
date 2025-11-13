import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDonorStats } from '@/hooks/useProfileStats';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/StatusBadge';
import { DonationCard } from '@/components/DonationCard';
import EmailSettings from '@/components/EmailSettings';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X, 
  Camera, 
  Heart,
  Award,
  MapPinIcon,
  Calendar,
  Settings,
  Shield,
  Package,
  TrendingUp,
  Users,
  Clock,
  Loader2,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { User as UserType } from '@/types';

const ChangePasswordSection: React.FC = () => {
  const { changePassword } = useAuth();
  const [show, setShow] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'New password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        toast({ title: 'Success', description: 'Password changed successfully' });
        setShow(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({ title: 'Error', description: res.error || 'Failed to change password', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to change password', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return (
      <div className="flex items-center justify-between py-2">
        <div>
          <h4 className="font-medium">Change Password</h4>
          <p className="text-sm text-gray-600">Update your account password</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShow(true)}>Change</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Input type="password" placeholder="Confirm new" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleChange} disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
        <Button size="sm" variant="outline" onClick={() => setShow(false)}>Cancel</Button>
      </div>
    </div>
  );
};

const PrivacySettingsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showDonationHistory: true,
    showContactInfo: false,
    allowNGOContact: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    // Simulate saving to backend
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully.",
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="flex items-start justify-between py-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium">Public Profile</h4>
          </div>
          <p className="text-sm text-gray-600">
            Allow all NGOs to view your profile and donation statistics
          </p>
        </div>
        <Switch
          checked={settings.profileVisibility}
          onCheckedChange={() => handleToggle('profileVisibility')}
          disabled={isSaving}
        />
      </div>

      <Separator />

      {/* Donation History */}
      <div className="flex items-start justify-between py-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium">Show Donation History</h4>
          </div>
          <p className="text-sm text-gray-600">
            Display your past donations and impact statistics publicly
          </p>
        </div>
        <Switch
          checked={settings.showDonationHistory}
          onCheckedChange={() => handleToggle('showDonationHistory')}
          disabled={isSaving}
        />
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="flex items-start justify-between py-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium">Show Contact Information</h4>
          </div>
          <p className="text-sm text-gray-600">
            Display your phone number and email to all NGO partners
          </p>
        </div>
        <Switch
          checked={settings.showContactInfo}
          onCheckedChange={() => handleToggle('showContactInfo')}
          disabled={isSaving}
        />
      </div>

      <Separator />

      {/* NGO Contact Permission */}
      <div className="flex items-start justify-between py-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium">Allow NGO Contact</h4>
          </div>
          <p className="text-sm text-gray-600">
            Let NGOs contact you directly for donation opportunities
          </p>
        </div>
        <Switch
          checked={settings.allowNGOContact}
          onCheckedChange={() => handleToggle('allowNGOContact')}
          disabled={isSaving}
        />
      </div>

      {isSaving && (
        <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
};

const DonorProfile = () => {
  const { user, updateProfile, currentUser } = useAuth();
  const donorStats = useDonorStats(currentUser?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserType>>({});

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const handleDownloadData = () => {
    try {
      // Prepare data export
      const exportData = {
        profile: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          description: user.description,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        statistics: {
          totalDonations: donorStats.totalDonations,
          totalMealsShared: donorStats.totalMealsShared,
          ngoPartnersCount: donorStats.ngoPartnersCount,
          activeDonations: donorStats.activeDonations,
          completedDonations: donorStats.completedDonations,
          cancelledDonations: donorStats.cancelledDonations,
          totalQuantityDonated: donorStats.totalQuantityDonated,
        },
        recentDonations: donorStats.recentDonations.map(donation => ({
          id: donation.id,
          foodName: donation.foodName,
          quantity: donation.quantity,
          quantityUnit: donation.quantityUnit,
          category: donation.category,
          status: donation.status,
          pickupTimeStart: donation.pickupTimeStart,
          pickupTimeEnd: donation.pickupTimeEnd,
          expiryTime: donation.expiryTime,
          description: donation.description,
          createdAt: donation.createdAt,
          claimedBy: donation.claimedBy,
          claimedByName: donation.claimedByName,
          claimedAt: donation.claimedAt,
        })),
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
      };

      // Convert to JSON and create blob
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donor-data-${user.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Downloaded",
        description: "Your data has been successfully exported.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditStart = () => {
    setEditForm({
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      description: user.description || '',
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleEditSave = async () => {
    if (!editForm.fullName?.trim()) {
      toast({
        title: "Error",
        description: "Full name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      setEditForm({});
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            {!isEditing && (
              <Button onClick={handleEditStart} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleEditSave} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  onClick={handleEditCancel}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={user.profilePicture || ''} alt={user.fullName} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                        disabled
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? (
                          <Input
                            value={editForm.fullName || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                            className="text-2xl font-bold border-0 bg-white/80 p-2"
                            placeholder="Full Name"
                          />
                        ) : (
                          user.fullName
                        )}
                      </h2>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Heart className="h-3 w-3 mr-1" />
                        Donor
                      </Badge>
                      {user.isVerified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center md:justify-start">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Your contact details for donation coordination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your address"
                      rows={3}
                    />
                  ) : (
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      {user.address}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>
                  Tell others about your motivation for donating food
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Share your story and motivation for food donation..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {user.description || "No description provided yet. Add a description to let NGOs know more about you and your motivation for donating food."}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Donation Statistics
                </CardTitle>
                <CardDescription>
                  Your impact on the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {donorStats.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading statistics...</span>
                  </div>
                ) : donorStats.error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>{donorStats.error}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{donorStats.totalDonations}</div>
                        <div className="text-sm text-gray-600">Total Donations</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{donorStats.totalMealsShared}</div>
                        <div className="text-sm text-gray-600">Meals Shared</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{donorStats.ngoPartnersCount}</div>
                        <div className="text-sm text-gray-600">NGO Partners</div>
                      </div>
                    </div>
                    
                    {/* Detailed Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-700">Active</span>
                        </div>
                        <div className="text-xl font-bold text-orange-600">{donorStats.activeDonations}</div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Completed</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">{donorStats.completedDonations}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <X className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Cancelled</span>
                        </div>
                        <div className="text-xl font-bold text-gray-600">{donorStats.cancelledDonations}</div>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm font-medium text-gray-700">Total Quantity</span>
                        </div>
                        <div className="text-xl font-bold text-indigo-600">{donorStats.totalQuantityDonated}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest donation activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {donorStats.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading activities...</span>
                  </div>
                ) : donorStats.recentDonations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start donating to see your activity here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donorStats.recentDonations.map((donation) => (
                      <DonationCard 
                        key={donation.id} 
                        donation={donation} 
                        showClaimer={true}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Email Settings Card */}
            <EmailSettings />
            
            {/* Account Security Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChangePasswordSection />
              </CardContent>
            </Card>

            {/* Other Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your profile and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrivacySettingsSection />
              </CardContent>
            </Card>

            {/* Account Management Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Management
                </CardTitle>
                <CardDescription>
                  Manage your account and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Download My Data</h4>
                    <p className="text-sm text-gray-600">Export all your account data and donation history</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadData}
                    disabled={donorStats.loading}
                  >
                    {donorStats.loading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Download'
                    )}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        toast({
                          title: "Feature Coming Soon",
                          description: "Account deletion will be available in a future update.",
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DonorProfile;
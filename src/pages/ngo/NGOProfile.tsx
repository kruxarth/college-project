import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNGOStats } from '@/hooks/useProfileStats';
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
  Building2,
  Award,
  Calendar,
  Settings,
  Shield,
  FileText,
  Users,
  Package,
  TrendingUp,
  Clock,
  Loader2,
  MapPinIcon,
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
    showClaimedDonations: true,
    showContactInfo: false,
    allowDonorContact: true,
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
            <h4 className="font-medium">Public Organization Profile</h4>
          </div>
          <p className="text-sm text-gray-600">
            Allow all donors to view your organization profile and impact statistics
          </p>
        </div>
        <Switch
          checked={settings.profileVisibility}
          onCheckedChange={() => handleToggle('profileVisibility')}
          disabled={isSaving}
        />
      </div>

      <Separator />

      {/* Claimed Donations Visibility */}
      <div className="flex items-start justify-between py-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium">Show Claimed Donations</h4>
          </div>
          <p className="text-sm text-gray-600">
            Display donations you've claimed and your impact publicly
          </p>
        </div>
        <Switch
          checked={settings.showClaimedDonations}
          onCheckedChange={() => handleToggle('showClaimedDonations')}
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
            Display your phone number and email to all donors
          </p>
        </div>
        <Switch
          checked={settings.showContactInfo}
          onCheckedChange={() => handleToggle('showContactInfo')}
          disabled={isSaving}
        />
      </div>

      <Separator />

      {/* Donor Contact Permission */}
      <div className="flex items-start justify-between py-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium">Allow Donor Contact</h4>
          </div>
          <p className="text-sm text-gray-600">
            Let donors contact you directly about their donations
          </p>
        </div>
        <Switch
          checked={settings.allowDonorContact}
          onCheckedChange={() => handleToggle('allowDonorContact')}
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

const NGOProfile = () => {
  const { user, updateProfile, currentUser } = useAuth();
  const ngoStats = useNGOStats(currentUser?.id || null);
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
          organizationName: user.organizationName,
          registrationNumber: user.registrationNumber,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        statistics: {
          totalClaims: ngoStats.totalClaims,
          totalMealsReceived: ngoStats.totalMealsReceived,
          donorPartnersCount: ngoStats.donorPartnersCount,
          activeClaims: ngoStats.activeClaims,
          completedClaims: ngoStats.completedClaims,
          totalQuantityReceived: ngoStats.totalQuantityReceived,
          averageRating: ngoStats.avgRating,
        },
        recentClaims: ngoStats.recentClaims.map(claim => ({
          id: claim.id,
          foodName: claim.foodName,
          quantity: claim.quantity,
          quantityUnit: claim.quantityUnit,
          category: claim.category,
          status: claim.status,
          pickupTimeStart: claim.pickupTimeStart,
          pickupTimeEnd: claim.pickupTimeEnd,
          expiryTime: claim.expiryTime,
          description: claim.description,
          createdAt: claim.createdAt,
          claimedAt: claim.claimedAt,
          donorId: claim.donorId,
          donorName: claim.donorName,
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
      const orgName = user.organizationName || user.fullName;
      link.download = `ngo-data-${orgName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Downloaded",
        description: "Your organization data has been successfully exported.",
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
      organizationName: user.organizationName || '',
      registrationNumber: user.registrationNumber || '',
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
        description: "Contact person name is required",
        variant: "destructive",
      });
      return;
    }

    if (!editForm.organizationName?.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
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
              <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
              <p className="text-gray-600 mt-1">Manage your organization's information and settings</p>
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
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={user.profilePicture || ''} alt={user.organizationName || user.fullName} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        {getInitials(user.organizationName || user.fullName)}
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
                    <div className="space-y-2 mb-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? (
                          <Input
                            value={editForm.organizationName || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, organizationName: e.target.value }))}
                            className="text-2xl font-bold border-0 bg-white/80 p-2"
                            placeholder="Organization Name"
                          />
                        ) : (
                          user.organizationName || 'Organization Name Not Set'
                        )}
                      </h2>
                      <p className="text-gray-600">
                        Contact: {isEditing ? (
                          <Input
                            value={editForm.fullName || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                            className="inline-block w-48 border-0 bg-white/80 p-1 text-sm"
                            placeholder="Contact Person"
                          />
                        ) : (
                          user.fullName
                        )}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                        <Building2 className="h-3 w-3 mr-1" />
                        NGO
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

            {/* Organization Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Information
                </CardTitle>
                <CardDescription>
                  Official details about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    {isEditing ? (
                      <Input
                        id="orgName"
                        value={editForm.organizationName || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, organizationName: e.target.value }))}
                        placeholder="Enter organization name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {user.organizationName || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Registration Number</Label>
                    {isEditing ? (
                      <Input
                        id="regNumber"
                        value={editForm.registrationNumber || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, registrationNumber: e.target.value }))}
                        placeholder="Enter registration number"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {user.registrationNumber || 'Not provided'}
                      </div>
                    )}
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
                  Contact details for donation coordination
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
                      placeholder="Enter organization address"
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

            {/* About Organization */}
            <Card>
              <CardHeader>
                <CardTitle>About Our Organization</CardTitle>
                <CardDescription>
                  Tell donors about your mission and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your organization's mission, goals, and the communities you serve..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {user.description || "No description provided yet. Add a description to let donors know more about your organization's mission and the communities you serve."}
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
                  Impact Statistics
                </CardTitle>
                <CardDescription>
                  Your organization's impact in the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ngoStats.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading statistics...</span>
                  </div>
                ) : ngoStats.error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>{ngoStats.error}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-emerald-50 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">{ngoStats.totalClaims}</div>
                        <div className="text-sm text-gray-600">Claims Made</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{ngoStats.totalMealsReceived}</div>
                        <div className="text-sm text-gray-600">Meals Received</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{ngoStats.donorPartnersCount}</div>
                        <div className="text-sm text-gray-600">Donor Partners</div>
                      </div>
                    </div>
                    
                    {/* Detailed Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-700">Active Claims</span>
                        </div>
                        <div className="text-xl font-bold text-orange-600">{ngoStats.activeClaims}</div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Completed</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">{ngoStats.completedClaims}</div>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm font-medium text-gray-700">Total Quantity</span>
                        </div>
                        <div className="text-xl font-bold text-indigo-600">{ngoStats.totalQuantityReceived}</div>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-700">Rating</span>
                        </div>
                        <div className="text-xl font-bold text-yellow-600">{ngoStats.avgRating.toFixed(1)}★</div>
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
                  Your latest claim activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ngoStats.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading activities...</span>
                  </div>
                ) : ngoStats.recentClaims.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start claiming donations to see your activity here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ngoStats.recentClaims.map((claim) => (
                      <DonationCard 
                        key={claim.id} 
                        donation={claim} 
                        showDonor={true}
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
            
            {/* Organization Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Settings
                </CardTitle>
                <CardDescription>
                  Manage your organization preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Organization Verification</h4>
                    <p className="text-sm text-gray-600">Get verified to increase donor trust</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={user.isVerified}
                    onClick={() => {
                      if (!user.isVerified) {
                        toast({
                          title: "Verification Request",
                          description: "Please contact support to verify your organization.",
                        });
                      }
                    }}
                  >
                    {user.isVerified ? 'Verified ✓' : 'Request Verification'}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Download Organization Data</h4>
                    <p className="text-sm text-gray-600">Export your organization data and claim history</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadData}
                    disabled={ngoStats.loading}
                  >
                    {ngoStats.loading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Download'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your organization profile and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrivacySettingsSection />
              </CardContent>
            </Card>

            {/* Security Settings Card */}
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

            {/* Danger Zone Card */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-gray-600">Permanently delete your organization account and all data</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.')) {
                        toast({
                          title: "Feature Coming Soon",
                          description: "Account deletion will be available in a future update.",
                        });
                      }
                    }}
                  >
                    Delete Account
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

export default NGOProfile;
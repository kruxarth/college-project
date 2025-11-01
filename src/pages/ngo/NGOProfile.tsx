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
import { toast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/StatusBadge';
import { DonationCard } from '@/components/DonationCard';
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
  MapPinIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { User as UserType } from '@/types';

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your organization's account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about new donations</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Organization Verification</h4>
                    <p className="text-sm text-gray-600">Get verified to increase donor trust</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {user.isVerified ? 'Verified' : 'Verify Now'}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-gray-600">Control visibility of your organization</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-gray-600">Permanently delete your organization account</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete</Button>
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
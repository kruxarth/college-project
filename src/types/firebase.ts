export interface User {
  id: string;
  email: string;
  role: 'donor' | 'ngo';
  fullName: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  profilePicture: string | null;
  createdAt: string;
  organizationName: string | null;
  registrationNumber: string | null;
  description: string | null;
  isVerified: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  foodName: string;
  description: string;
  quantity: number;
  quantityUnit: string;
  category: string;
  allergens: string[];
  expiryTime: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  status: 'available' | 'claimed' | 'on_the_way' | 'picked_up' | 'completed' | 'cancelled';
  claimedBy: string | null;
  claimedByName: string | null;
  claimedAt: string | null;
  additionalNotes: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'donation_claimed' | 'status_update' | 'new_donation' | 'reminder';
  isRead: boolean;
  relatedDonationId: string | null;
  createdAt: string;
}

export interface StatusHistory {
  id: string;
  donationId: string;
  status: string;
  updatedBy: string;
  updatedByName: string;
  notes: string;
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: 'donor' | 'ngo';
}

export interface SignupData extends Omit<User, 'id' | 'createdAt'> {
  password: string;
}
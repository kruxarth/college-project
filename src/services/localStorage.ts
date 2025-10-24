export interface User {
  id: string;
  email: string;
  password: string;
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

const storage = {
  // Users
  getUsers: (): User[] => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch {
      return [];
    }
  },
  
  saveUser: (user: User): void => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },
  
  updateUser: (userId: string, updates: Partial<User>): void => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
    }
  },
  
  getUserById: (userId: string): User | null => {
    const users = storage.getUsers();
    return users.find(u => u.id === userId) || null;
  },
  
  getUserByEmail: (email: string): User | null => {
    const users = storage.getUsers();
    return users.find(u => u.email === email) || null;
  },
  
  // Session
  getCurrentUser: (): CurrentUser | null => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
      return null;
    }
  },
  
  setCurrentUser: (user: CurrentUser): void => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  clearCurrentUser: (): void => {
    localStorage.removeItem('currentUser');
  },
  
  // Donations
  getDonations: (): Donation[] => {
    try {
      return JSON.parse(localStorage.getItem('donations') || '[]');
    } catch {
      return [];
    }
  },
  
  saveDonation: (donation: Donation): void => {
    const donations = storage.getDonations();
    donations.push(donation);
    localStorage.setItem('donations', JSON.stringify(donations));
  },
  
  updateDonation: (donationId: string, updates: Partial<Donation>): void => {
    const donations = storage.getDonations();
    const index = donations.findIndex(d => d.id === donationId);
    if (index !== -1) {
      donations[index] = { ...donations[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('donations', JSON.stringify(donations));
    }
  },
  
  deleteDonation: (donationId: string): void => {
    let donations = storage.getDonations();
    donations = donations.filter(d => d.id !== donationId);
    localStorage.setItem('donations', JSON.stringify(donations));
  },
  
  getDonationById: (donationId: string): Donation | null => {
    const donations = storage.getDonations();
    return donations.find(d => d.id === donationId) || null;
  },
  
  // Notifications
  getNotifications: (userId: string): Notification[] => {
    try {
      const all = JSON.parse(localStorage.getItem('notifications') || '[]');
      return all.filter((n: Notification) => n.userId === userId).sort((a: Notification, b: Notification) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  },
  
  addNotification: (notification: Notification): void => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  },
  
  markNotificationRead: (notificationId: string): void => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const index = notifications.findIndex((n: Notification) => n.id === notificationId);
    if (index !== -1) {
      notifications[index].isRead = true;
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  },
  
  markAllNotificationsRead: (userId: string): void => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifications.map((n: Notification) => 
      n.userId === userId ? { ...n, isRead: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
  },
  
  // Status History
  getStatusHistory: (donationId: string): StatusHistory[] => {
    try {
      const all = JSON.parse(localStorage.getItem('statusHistory') || '[]');
      return all.filter((s: StatusHistory) => s.donationId === donationId).sort((a: StatusHistory, b: StatusHistory) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  },
  
  addStatusHistory: (entry: StatusHistory): void => {
    const history = JSON.parse(localStorage.getItem('statusHistory') || '[]');
    history.push(entry);
    localStorage.setItem('statusHistory', JSON.stringify(history));
  },
  
  // Clear all data
  clearAll: (): void => {
    localStorage.clear();
  },
};

export default storage;

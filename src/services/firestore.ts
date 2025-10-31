import { collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Donation, User, Notification, StatusHistory } from '@/types';

const donationsCol = collection(db, 'donations');
const usersCol = collection(db, 'users');
const notificationsCol = collection(db, 'notifications');
const statusHistoryCol = collection(db, 'statusHistory');

export async function createDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  const donationData = { ...donation, createdAt: now, updatedAt: now };
  
  try {
    const ref = await addDoc(donationsCol, donationData);
    const createdDonation = { id: ref.id, ...donationData } as Donation;
    return createdDonation;
  } catch (error) {
    console.error('Error creating donation in Firestore:', error);
    throw error;
  }
}

export async function updateDonation(donationId: string, updates: Partial<Donation>) {
  const ref = doc(db, 'donations', donationId);
  await updateDoc(ref, { ...updates, updatedAt: new Date().toISOString() });
}

export async function deleteDonation(donationId: string) {
  const ref = doc(db, 'donations', donationId);
  await deleteDoc(ref);
}

export async function getDonationById(donationId: string) {
  const ref = doc(db, 'donations', donationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Donation) } as Donation;
}

export async function getDonationsForUser(userId: string) {
  const q = query(donationsCol, where('donorId', '==', userId), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
}

export async function getDonationsByClaimer(userId: string) {
  try {
    // Try with orderBy first (requires compound index)
    const q = query(donationsCol, where('claimedBy', '==', userId), orderBy('createdAt', 'desc'));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
  } catch (error: any) {
    console.log('Compound index not available for claims, using fallback method...');
    
    // Fallback: simple query without orderBy
    try {
      const q = query(donationsCol, where('claimedBy', '==', userId));
      const snaps = await getDocs(q);
      const donations = snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
      
      // Sort in memory
      donations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log(`✅ Found ${donations.length} claimed donations (sorted in memory)`);
      return donations;
    } catch (fallbackError) {
      console.error('Simple query also failed, using manual filter...');
      
      // Last resort: get all donations and filter manually
      const allDonations = await getAllDonations();
      const claimedDonations = allDonations.filter(d => d.claimedBy === userId);
      console.log(`✅ Found ${claimedDonations.length} claimed donations (manual filter)`);
      return claimedDonations;
    }
  }
}

export async function getDonationsByStatus(status: string) {
  const q = query(donationsCol, where('status', '==', status), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
}

export async function getAvailableDonations() {
  try {
    // Try with orderBy first
    const q = query(donationsCol, where('status', '==', 'available'), orderBy('createdAt', 'desc'));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
  } catch (error: any) {
    console.error('Error with ordered query, trying without orderBy:', error);
    
    // If compound index doesn't exist, try without orderBy
    try {
      const q = query(donationsCol, where('status', '==', 'available'));
      const snaps = await getDocs(q);
      const donations = snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
      
      // Sort in memory instead
      donations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log(`✅ Found ${donations.length} available donations (sorted in memory)`);
      return donations;
    } catch (fallbackError) {
      console.error('Error even with simple query:', fallbackError);
      throw fallbackError;
    }
  }
}

export async function getAvailableDonationsBasic() {
  // Fallback method: get all donations and filter in memory
  try {
    console.log('🔄 Using fallback method: getting all donations and filtering...');
    const allDonations = await getAllDonations();
    const availableDonations = allDonations.filter(d => d.status === 'available');
    console.log(`✅ Filtered ${availableDonations.length} available from ${allDonations.length} total donations`);
    return availableDonations;
  } catch (error) {
    console.error('❌ Error in fallback method:', error);
    throw error;
  }
}

export async function testFirestoreConnection() {
  try {
    console.log('🔍 Testing Firestore connection...');
    const testQuery = query(donationsCol);
    const snapshot = await getDocs(testQuery);
    console.log('✅ Firestore connection successful, found', snapshot.docs.length, 'documents');
    return { success: true, count: snapshot.docs.length };
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getAllDonations() {
  const snaps = await getDocs(query(donationsCol, orderBy('createdAt', 'desc')));
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
}

// Users
export async function createUserProfile(uid: string, data: Omit<User, 'id' | 'createdAt'>) {
  const now = new Date().toISOString();
  const ref = doc(db, 'users', uid);
  const payload = { ...data, id: uid, createdAt: now } as User;
  await setDoc(ref, payload);
  return payload;
}

export async function getUserProfile(uid: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as User;
}

export async function updateUserProfile(uid: string, updates: Partial<User>) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, updates as any);
}

// Notifications & status history
export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
  const now = new Date().toISOString();
  const payload = { ...notification, createdAt: now } as Notification;
  const ref = await addDoc(notificationsCol, payload);
  return { id: ref.id, ...payload } as Notification;
}

export async function getNotificationsForUser(userId: string) {
  const q = query(notificationsCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Notification) }));
}

export async function markNotificationAsRead(notificationId: string) {
  const ref = doc(db, 'notifications', notificationId);
  await updateDoc(ref, { isRead: true });
}

export async function markAllNotificationsAsRead(userId: string) {
  const q = query(notificationsCol, where('userId', '==', userId), where('isRead', '==', false));
  const snaps = await getDocs(q);
  
  const updatePromises = snaps.docs.map(doc => 
    updateDoc(doc.ref, { isRead: true })
  );
  
  await Promise.all(updatePromises);
}

export async function addStatusHistory(entry: Omit<StatusHistory, 'id' | 'createdAt'>) {
  const now = new Date().toISOString();
  const payload = { ...entry, createdAt: now } as StatusHistory;
  const ref = await addDoc(statusHistoryCol, payload);
  return { id: ref.id, ...payload } as StatusHistory;
}

export async function getStatusHistory(donationId: string) {
  const q = query(statusHistoryCol, where('donationId', '==', donationId), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as StatusHistory) }));
}

export async function getDonationsByDonor(donorId: string) {
  try {
    // Try without orderBy first to see if it's an index issue
    const q = query(donationsCol, where('donorId', '==', donorId));
    const snaps = await getDocs(q);
    const donations = snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
    
    // Sort in memory for now
    donations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return donations;
  } catch (error) {
    console.error('Error fetching donations by donor:', error);
    throw error;
  }
}

// Statistics functions
export async function getStatistics() {
  try {
    // Use Promise.all for concurrent queries to improve performance
    const [allDonations, usersSnap] = await Promise.all([
      getAllDonations(),
      getDocs(query(usersCol))
    ]);
    
    const allUsers = usersSnap.docs.map(d => d.data() as User);
    
    // Calculate donation statistics
    const totalDonations = allDonations.length;
    const activeDonations = allDonations.filter(d => 
      d.status === 'available' || d.status === 'claimed' || d.status === 'on_the_way'
    ).length;
    const completedDonations = allDonations.filter(d => 
      d.status === 'completed' || d.status === 'picked_up'
    ).length;
    const cancelledDonations = allDonations.filter(d => 
      d.status === 'cancelled'
    ).length;
    
    // Calculate user statistics
    const registeredUsers = allUsers.filter(u => u.role === 'donor').length;
    const registeredNGOs = allUsers.filter(u => u.role === 'ngo').length;
    const verifiedNGOs = allUsers.filter(u => u.role === 'ngo' && u.isVerified).length;
    
    // Calculate impact metrics
    const totalQuantityDonated = completedDonations > 0 
      ? allDonations
          .filter(d => d.status === 'completed' || d.status === 'picked_up')
          .reduce((sum, donation) => sum + (donation.quantity || 0), 0)
      : 0;
    
    // Estimate meals served (different multipliers based on food type)
    const totalMealsServed = completedDonations > 0
      ? allDonations
          .filter(d => d.status === 'completed' || d.status === 'picked_up')
          .reduce((sum, donation) => {
            const quantity = donation.quantity || 0;
            // Different multipliers based on category
            switch (donation.category?.toLowerCase()) {
              case 'cooked food':
              case 'prepared meals':
                return sum + (quantity * 1); // 1 serving = 1 meal
              case 'raw ingredients':
              case 'vegetables':
              case 'fruits':
                return sum + Math.floor(quantity * 0.5); // Raw ingredients make fewer direct meals
              case 'packaged food':
              case 'canned goods':
                return sum + Math.floor(quantity * 2); // Packaged items often serve multiple
              default:
                return sum + Math.floor(quantity * 1.5); // Default multiplier
            }
          }, 0)
      : 0;
    
    // Calculate additional metrics
    const successRate = totalDonations > 0 
      ? Math.round((completedDonations / totalDonations) * 100)
      : 0;
    
    const averageDonationSize = completedDonations > 0
      ? Math.round(totalQuantityDonated / completedDonations)
      : 0;
    
    // Calculate this month's statistics for growth tracking
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthDonations = allDonations.filter(d => 
      new Date(d.createdAt) >= thisMonth
    ).length;
    
    const thisMonthUsers = allUsers.filter(u => 
      new Date(u.createdAt) >= thisMonth
    ).length;
    
    return {
      // Core metrics
      totalDonations,
      activeDonations,
      completedDonations,
      cancelledDonations,
      registeredUsers,
      registeredNGOs,
      verifiedNGOs,
      
      // Impact metrics
      totalMealsServed,
      totalQuantityDonated,
      successRate,
      averageDonationSize,
      
      // Growth metrics
      thisMonthDonations,
      thisMonthUsers,
      
      // Timestamp
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Failed to fetch statistics');
  }
}

export default {
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationById,
  getDonationsForUser,
  getDonationsByClaimer,
  getDonationsByStatus,
  getAvailableDonations,
  getAvailableDonationsBasic,
  getAllDonations,
  getDonationsByDonor,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  addNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addStatusHistory,
  getStatusHistory,
  getStatistics,
  testFirestoreConnection,
};

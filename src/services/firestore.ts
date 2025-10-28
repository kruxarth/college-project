import { collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Donation, User, Notification, StatusHistory } from '@/types';

const donationsCol = collection(db, 'donations');
const usersCol = collection(db, 'users');
const notificationsCol = collection(db, 'notifications');
const statusHistoryCol = collection(db, 'statusHistory');

export async function createDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  const created = { ...donation, createdAt: now, updatedAt: now } as Donation;
  const ref = await addDoc(donationsCol, created);
  return { id: ref.id, ...created } as Donation;
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
  const q = query(donationsCol, where('claimedBy', '==', userId), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
}

export async function getDonationsByStatus(status: string) {
  const q = query(donationsCol, where('status', '==', status), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
}

export async function getAvailableDonations() {
  const q = query(donationsCol, where('status', '==', 'available'), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
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
  const q = query(donationsCol, where('donorId', '==', donorId), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Donation) }));
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
};

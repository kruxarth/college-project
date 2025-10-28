import * as fs from '@/services/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';

export async function initializeDemoData() {
  try {
    // Check if demo data already exists
    const existingDonations = await fs.getAllDonations();
    if (existingDonations.length > 0) {
      console.log('Demo data already exists');
      return;
    }

    // Create demo donor account
    const donorCred = await createUserWithEmailAndPassword(auth, 'donor@example.com', 'password123');
    const donorProfile = await fs.createUserProfile(donorCred.user.uid, {
      email: 'donor@example.com',
      role: 'donor',
      fullName: "John's Restaurant",
      phone: '+1234567890',
      address: '123 Main St, Downtown',
      latitude: 40.7128,
      longitude: -74.006,
      profilePicture: null,
      organizationName: null,
      registrationNumber: null,
      description: null,
      isVerified: false,
    });

    // Create demo NGO account
    const ngoCred = await createUserWithEmailAndPassword(auth, 'ngo@example.com', 'password123');
    const ngoProfile = await fs.createUserProfile(ngoCred.user.uid, {
      email: 'ngo@example.com',
      role: 'ngo',
      fullName: 'Maria Garcia',
      phone: '+1234567891',
      address: '456 Oak Ave, Suburb',
      latitude: 40.7589,
      longitude: -73.9851,
      profilePicture: null,
      organizationName: 'Food Rescue Foundation',
      registrationNumber: 'NGO12345',
      description: 'Helping communities by reducing food waste',
      isVerified: true,
    });

    // Create sample donations
    const now = new Date();
    const donations = [
      {
        donorId: donorProfile.id,
        donorName: "John's Restaurant",
        donorPhone: '+1234567890',
        foodName: 'Fresh Sandwiches',
        description: '50 freshly made sandwiches from lunch buffet',
        quantity: 50,
        quantityUnit: 'servings',
        category: 'Cooked Food',
        allergens: ['Gluten', 'Dairy'],
        expiryTime: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        pickupAddress: '123 Main St, Downtown',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.006,
        pickupTimeStart: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
        pickupTimeEnd: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        status: 'available' as const,
        claimedBy: null,
        claimedByName: null,
        claimedAt: null,
        additionalNotes: 'Please bring insulated bags',
        images: [],
      },
      {
        donorId: donorProfile.id,
        donorName: "John's Restaurant",
        donorPhone: '+1234567890',
        foodName: 'Fresh Vegetables',
        description: 'Assorted fresh vegetables - carrots, lettuce, tomatoes',
        quantity: 15,
        quantityUnit: 'kg',
        category: 'Raw Ingredients',
        allergens: ['None'],
        expiryTime: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        pickupAddress: '123 Main St, Downtown',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.006,
        pickupTimeStart: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        pickupTimeEnd: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'available' as const,
        claimedBy: null,
        claimedByName: null,
        claimedAt: null,
        additionalNotes: 'Side entrance pickup',
        images: [],
      },
      {
        donorId: donorProfile.id,
        donorName: "John's Restaurant",
        donorPhone: '+1234567890',
        foodName: 'Packaged Pasta',
        description: 'Unopened boxes of pasta - various shapes',
        quantity: 20,
        quantityUnit: 'boxes',
        category: 'Packaged Food',
        allergens: ['Gluten'],
        expiryTime: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        pickupAddress: '123 Main St, Downtown',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.006,
        pickupTimeStart: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
        pickupTimeEnd: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        status: 'available' as const,
        claimedBy: null,
        claimedByName: null,
        claimedAt: null,
        additionalNotes: '',
        images: [],
      },
    ];

    // Create donations in Firebase
    for (const donation of donations) {
      await fs.createDonation(donation);
    }

    console.log('Demo data initialized successfully!');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
}

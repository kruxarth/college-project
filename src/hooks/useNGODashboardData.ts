import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as fs from '@/services/firestore';
import type { Donation, User } from '@/types/firebase';
import { toast } from 'sonner';

interface DashboardData {
  claims: Donation[];
  availableDonations: Donation[];
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

export function useNGODashboardData() {
  const { currentUser } = useAuth();
  const [data, setData] = useState<DashboardData>({
    claims: [],
    availableDonations: [],
    userProfile: null,
    loading: true,
    error: null,
  });

  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      console.log('🔄 Loading NGO dashboard data for user:', currentUser.id);
      
      // Test Firestore connection first
      const connectionTest = await fs.testFirestoreConnection();
      if (!connectionTest.success) {
        throw new Error(`Firestore connection failed: ${connectionTest.error}`);
      }
      console.log('✅ Firestore connection successful');
      
      // Load user profile
      console.log('📋 Loading user profile...');
      const profile = await fs.getUserProfile(currentUser.id);
      console.log('✅ Profile loaded:', profile ? 'Success' : 'Failed');
      
      // Load user claims with fallback
      console.log('📋 Loading user claims...');
      const claims = await fs.getDonationsByClaimer(currentUser.id);
      console.log('✅ Claims loaded:', claims.length);
      
      // Load available donations with fallback
      console.log('📋 Loading available donations...');
      let available: Donation[] = [];
      
      try {
        available = await fs.getAvailableDonations();
        console.log('✅ Available donations loaded (primary method):', available.length);
      } catch (primaryError) {
        console.log('⚠️ Primary method failed, trying fallback...');
        try {
          available = await fs.getAvailableDonationsBasic();
          console.log('✅ Available donations loaded (fallback method):', available.length);
        } catch (fallbackError) {
          console.error('❌ Both methods failed, using manual filter...');
          const allDonations = await fs.getAllDonations();
          available = allDonations.filter(d => d.status === 'available');
          console.log('✅ Available donations loaded (manual filter):', available.length);
        }
      }
      
      setData({
        claims,
        availableDonations: available,
        userProfile: profile,
        loading: false,
        error: null,
      });
      
      console.log('📊 Final data summary:', {
        profile: !!profile,
        claims: claims.length,
        available: available.length,
        userRole: profile?.role,
        userId: currentUser.id
      });
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      const errorMessage = `Failed to load dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      toast.error('Failed to load data');
    }
  };

  const refresh = () => {
    loadData();
  };

  const initDemoData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      const { initializeDemoData } = await import('@/utils/initData');
      await initializeDemoData();
      toast.success('Demo data initialized successfully!');
      loadData();
    } catch (error) {
      console.error('Error initializing demo data:', error);
      toast.error('Failed to initialize demo data');
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  return {
    ...data,
    refresh,
    initDemoData,
  };
}
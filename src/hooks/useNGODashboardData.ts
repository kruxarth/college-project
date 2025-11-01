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
      // Load user profile
      const profile = await fs.getUserProfile(currentUser.id);
      
      // Load user claims with fallback
      const claims = await fs.getDonationsByClaimer(currentUser.id);
      
      // Load available donations with fallback
      let available: Donation[] = [];
      
      try {
        available = await fs.getAvailableDonations();
        // primary method succeeded
      } catch (primaryError) {
        try {
          available = await fs.getAvailableDonationsBasic();
        } catch (fallbackError) {
          // fallback to manual filter
          const allDonations = await fs.getAllDonations();
          available = allDonations.filter(d => d.status === 'available');
        }
      }
      
      setData({
        claims,
        availableDonations: available,
        userProfile: profile,
        loading: false,
        error: null,
      });
      
      // finished loading
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
import { useState, useEffect } from 'react';
import * as fs from '@/services/firestore';

interface Statistics {
  totalDonations: number;
  activeDonations: number;
  completedDonations: number;
  cancelledDonations: number;
  registeredUsers: number;
  registeredNGOs: number;
  verifiedNGOs: number;
  totalMealsServed: number;
  totalQuantityDonated: number;
  successRate: number;
  averageDonationSize: number;
  thisMonthDonations: number;
  thisMonthUsers: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useStatistics(refreshInterval = 30000) { // 30 seconds default
  const [stats, setStats] = useState<Statistics>({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    cancelledDonations: 0,
    registeredUsers: 0,
    registeredNGOs: 0,
    verifiedNGOs: 0,
    totalMealsServed: 0,
    totalQuantityDonated: 0,
    successRate: 0,
    averageDonationSize: 0,
    thisMonthDonations: 0,
    thisMonthUsers: 0,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const statistics = await fs.getStatistics();
      
      setStats({
        totalDonations: statistics.totalDonations || 0,
        activeDonations: statistics.activeDonations || 0,
        completedDonations: statistics.completedDonations || 0,
        cancelledDonations: statistics.cancelledDonations || 0,
        registeredUsers: statistics.registeredUsers || 0,
        registeredNGOs: statistics.registeredNGOs || 0,
        verifiedNGOs: statistics.verifiedNGOs || 0,
        totalMealsServed: statistics.totalMealsServed || 0,
        totalQuantityDonated: statistics.totalQuantityDonated || 0,
        successRate: statistics.successRate || 0,
        averageDonationSize: statistics.averageDonationSize || 0,
        thisMonthDonations: statistics.thisMonthDonations || 0,
        thisMonthUsers: statistics.thisMonthUsers || 0,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load statistics',
      }));
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
  }, []);

  // Set up automatic refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  // Manual refresh function
  const refresh = () => {
    fetchStats();
  };

  return { stats, refresh };
}
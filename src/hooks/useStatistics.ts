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
  isStale?: boolean;
  queryDuration?: number;
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
    isStale: false,
    queryDuration: 0,
  });

  const fetchStats = async (useCache = true) => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const statistics = await fs.getStatistics(useCache);
      
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
        error: statistics.error || null,
        lastUpdated: new Date(),
        isStale: statistics.isStale || false,
        queryDuration: statistics.queryDuration || 0,
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load statistics',
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
      const interval = setInterval(() => fetchStats(true), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  // Manual refresh function (force fresh data)
  const refresh = () => {
    fs.clearStatisticsCache(); // Clear cache to force fresh data
    fetchStats(false);
  };

  return { stats, refresh };
}
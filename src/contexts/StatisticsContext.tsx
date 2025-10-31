import React, { createContext, useContext, ReactNode } from 'react';
import { useStatistics } from '@/hooks/useStatistics';

interface StatisticsContextType {
  stats: {
    totalDonations: number;
    activeDonations: number;
    completedDonations: number;
    registeredUsers: number;
    registeredNGOs: number;
    verifiedNGOs: number;
    totalMealsServed: number;
    successRate: number;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    thisMonthDonations: number;
    thisMonthUsers: number;
    totalQuantityDonated: number;
    averageDonationSize: number;
  };
  refresh: () => void;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export function StatisticsProvider({ children }: { children: ReactNode }) {
  const statisticsData = useStatistics(30000); // Refresh every 30 seconds

  return (
    <StatisticsContext.Provider value={statisticsData}>
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatisticsContext() {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatisticsContext must be used within a StatisticsProvider');
  }
  return context;
}
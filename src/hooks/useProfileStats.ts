import { useState, useEffect } from 'react';
import * as fs from '@/services/firestore';
import type { Donation } from '@/types';

interface DonorStats {
  totalDonations: number;
  activeDonations: number;
  completedDonations: number;
  cancelledDonations: number;
  totalMealsShared: number;
  totalQuantityDonated: number;
  ngoPartnersCount: number;
  avgRating: number;
  recentDonations: Donation[];
  loading: boolean;
  error: string | null;
}

export function useDonorStats(donorId: string | null) {
  const [stats, setStats] = useState<DonorStats>({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    cancelledDonations: 0,
    totalMealsShared: 0,
    totalQuantityDonated: 0,
    ngoPartnersCount: 0,
    avgRating: 0,
    recentDonations: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!donorId) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    const loadStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all donations by this donor
        const donations = await fs.getDonationsByDonor(donorId);

        // Calculate statistics
        const totalDonations = donations.length;
        const activeDonations = donations.filter(d => 
          ['available', 'claimed', 'on_the_way'].includes(d.status)
        ).length;
        const completedDonations = donations.filter(d => 
          ['completed', 'picked_up'].includes(d.status)
        ).length;
        const cancelledDonations = donations.filter(d => 
          d.status === 'cancelled'
        ).length;

        // Calculate total quantity donated from completed donations
        const totalQuantityDonated = donations
          .filter(d => ['completed', 'picked_up'].includes(d.status))
          .reduce((sum, donation) => sum + (donation.quantity || 0), 0);

        // Estimate meals shared based on completed donations
        const totalMealsShared = donations
          .filter(d => ['completed', 'picked_up'].includes(d.status))
          .reduce((sum, donation) => {
            const quantity = donation.quantity || 0;
            // Different multipliers based on category
            switch (donation.category?.toLowerCase()) {
              case 'cooked food':
              case 'prepared meals':
                return sum + (quantity * 1);
              case 'raw ingredients':
              case 'vegetables':
              case 'fruits':
                return sum + Math.floor(quantity * 0.5);
              case 'packaged food':
              case 'canned goods':
                return sum + Math.floor(quantity * 2);
              default:
                return sum + Math.floor(quantity * 1.5);
            }
          }, 0);

        // Count unique NGO partners (from claimed donations)
        const uniqueNGOs = new Set(
          donations
            .filter(d => d.claimedBy)
            .map(d => d.claimedBy)
        );
        const ngoPartnersCount = uniqueNGOs.size;

        // Get recent donations (last 5)
        const recentDonations = donations.slice(0, 5);

        setStats({
          totalDonations,
          activeDonations,
          completedDonations,
          cancelledDonations,
          totalMealsShared,
          totalQuantityDonated,
          ngoPartnersCount,
          avgRating: 4.8, // Placeholder for future rating system
          recentDonations,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading donor stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load donation statistics'
        }));
      }
    };

    loadStats();
  }, [donorId]);

  return stats;
}

interface NGOStats {
  totalClaims: number;
  activeClaims: number;
  completedClaims: number;
  totalMealsReceived: number;
  totalQuantityReceived: number;
  donorPartnersCount: number;
  avgRating: number;
  recentClaims: Donation[];
  loading: boolean;
  error: string | null;
}

export function useNGOStats(ngoId: string | null) {
  const [stats, setStats] = useState<NGOStats>({
    totalClaims: 0,
    activeClaims: 0,
    completedClaims: 0,
    totalMealsReceived: 0,
    totalQuantityReceived: 0,
    donorPartnersCount: 0,
    avgRating: 0,
    recentClaims: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!ngoId) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    const loadStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all donations claimed by this NGO
        const claims = await fs.getDonationsByClaimer(ngoId);

        // Calculate statistics
        const totalClaims = claims.length;
        const activeClaims = claims.filter(d => 
          ['claimed', 'on_the_way'].includes(d.status)
        ).length;
        const completedClaims = claims.filter(d => 
          ['completed', 'picked_up'].includes(d.status)
        ).length;

        // Calculate total quantity received from completed claims
        const totalQuantityReceived = claims
          .filter(d => ['completed', 'picked_up'].includes(d.status))
          .reduce((sum, donation) => sum + (donation.quantity || 0), 0);

        // Estimate meals received based on completed claims
        const totalMealsReceived = claims
          .filter(d => ['completed', 'picked_up'].includes(d.status))
          .reduce((sum, donation) => {
            const quantity = donation.quantity || 0;
            switch (donation.category?.toLowerCase()) {
              case 'cooked food':
              case 'prepared meals':
                return sum + (quantity * 1);
              case 'raw ingredients':
              case 'vegetables':
              case 'fruits':
                return sum + Math.floor(quantity * 0.5);
              case 'packaged food':
              case 'canned goods':
                return sum + Math.floor(quantity * 2);
              default:
                return sum + Math.floor(quantity * 1.5);
            }
          }, 0);

        // Count unique donor partners
        const uniqueDonors = new Set(
          claims.map(d => d.donorId)
        );
        const donorPartnersCount = uniqueDonors.size;

        // Get recent claims (last 5)
        const recentClaims = claims.slice(0, 5);

        setStats({
          totalClaims,
          activeClaims,
          completedClaims,
          totalMealsReceived,
          totalQuantityReceived,
          donorPartnersCount,
          avgRating: 4.7, // Placeholder for future rating system
          recentClaims,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading NGO stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load claim statistics'
        }));
      }
    };

    loadStats();
  }, [ngoId]);

  return stats;
}
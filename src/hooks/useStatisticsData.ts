import { useState, useCallback, useMemo, useEffect } from 'react';
import { getApprovedJobs } from '../api/user_job';
import { getUserProfiles } from '../api/user';
import { getPunishments } from '../api/punishment';
import { BarData, ChartUser, LineChartData } from '../types/chart_data';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';
import { Punishment } from '../types/punishment';
import { useRealtime } from '../context/RealtimeContext';

interface UseStatisticsDataReturn {
  lineChartData: LineChartData[];
  barData: BarData[];
  chartUsers: ChartUser[];
  isLoading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
}

export const useStatisticsData = (): UseStatisticsDataReturn => {
  const [rawData, setRawData] = useState<{
    jobs: UserJob[];
    profiles: User[];
    punishments: Punishment[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { subscribeTo } = useRealtime();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [jobs, profiles, punishments] = await Promise.all([
        getApprovedJobs(),
        getUserProfiles(),
        getPunishments(),
      ]);

      setRawData({ jobs, profiles, punishments });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading statistics data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Subscribe to relevant tables for statistics
    const unsubscribe = subscribeTo(
      ['user_jobs', 'profiles', 'punishment'],
      loadData,
    );

    return unsubscribe;
  }, [loadData, subscribeTo]);

  const processedData = useMemo(() => {
    if (!rawData) {
      return {
        lineChartData: [],
        barData: [],
        chartUsers: [],
      };
    }

    const { jobs, profiles, punishments } = rawData;

    // Create chart users
    const chartUsers = [...profiles]
      .map((user) => ({
        name:
          user.name.length > 15 ? user.name.slice(0, 15) + '...' : user.name,
        id: user.id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const userMap = Object.fromEntries(chartUsers.map((u) => [u.id, u.name]));

    // Get all unique times and sort them
    const deliveryTimes = jobs
      .map((job) => job.delivery?.slice(0, 5))
      .filter(Boolean) as string[];

    const punishmentTimes = punishments
      .map((punishment) => {
        if (punishment.created_at) {
          const date = new Date(punishment.created_at);
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }
        return null;
      })
      .filter(Boolean) as string[];

    const allTimes = Array.from(
      new Set([...deliveryTimes, ...punishmentTimes]),
    ).sort();

    // Group jobs and punishments by time
    const jobsByTime = new Map<string, UserJob[]>();
    const punishmentsByTime = new Map<string, Punishment[]>();

    // Initialize maps
    allTimes.forEach((time) => {
      jobsByTime.set(time, []);
      punishmentsByTime.set(time, []);
    });

    // Populate jobs by time
    jobs.forEach((job) => {
      const deliveryKey = job.delivery?.slice(0, 5);
      if (deliveryKey && jobsByTime.has(deliveryKey)) {
        jobsByTime.get(deliveryKey)!.push(job);
      }
    });

    // Populate punishments by time
    punishments.forEach((punishment) => {
      if (punishment.created_at) {
        const date = new Date(punishment.created_at);
        const timeKey = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        if (punishmentsByTime.has(timeKey)) {
          punishmentsByTime.get(timeKey)!.push(punishment);
        }
      }
    });

    // Build line chart data
    const userIds = profiles.map((u) => u.id);
    const cumulative: Record<string, number> = {};
    userIds.forEach((id) => (cumulative[id] = 0));

    const lineChartData: LineChartData[] = allTimes.map((time) => {
      const row: LineChartData = { delivery: time };

      // Add jobs earnings
      jobsByTime.get(time)?.forEach((job) => {
        if (job.user_id) {
          cumulative[job.user_id] += job.money || 0;
        }
      });

      // Subtract punishment amounts
      punishmentsByTime.get(time)?.forEach((punishment) => {
        if (punishment.user_id) {
          cumulative[punishment.user_id] -= punishment.amount || 0;
        }
      });

      // Set cumulative values for each user
      userIds.forEach((userId) => {
        const userName = userMap[userId];
        if (userName) {
          row[userName] = cumulative[userId];
        }
      });

      return row;
    });

    // Calculate bar chart data
    const jobCounts: Record<string, number> = {};
    const moneyEarned: Record<string, number> = {};
    const punishmentAmounts: Record<string, number> = {};

    jobs.forEach((job) => {
      const uid = job.user_id;
      if (uid) {
        jobCounts[uid] = (jobCounts[uid] || 0) + 1;
        moneyEarned[uid] = (moneyEarned[uid] || 0) + (job.money || 0);
      }
    });

    punishments.forEach((punishment) => {
      const uid = punishment.user_id;
      if (uid) {
        punishmentAmounts[uid] =
          (punishmentAmounts[uid] || 0) + punishment.amount;
      }
    });

    const barData = profiles
      .map((user) => ({
        name:
          user.name.length > 15 ? user.name.slice(0, 15) + '...' : user.name,
        jobs: jobCounts[user.id] || 0,
        money: moneyEarned[user.id] || 0,
        punishments: punishmentAmounts[user.id] || 0,
        netEarnings:
          (moneyEarned[user.id] || 0) - (punishmentAmounts[user.id] || 0),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      lineChartData,
      barData,
      chartUsers,
    };
  }, [rawData]);

  return {
    ...processedData,
    isLoading,
    error,
    loadData,
  };
};

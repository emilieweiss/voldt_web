import { useState, useCallback, useMemo, useEffect } from 'react';
import { getApprovedJobs } from '../api/user_job';
import { getUserProfiles, supabase } from '../api/user';
import { getPunishments } from '../api/punishment';
import { BarData, ChartUser, LineChartData } from '../types/chart_data';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';
import { Punishment } from '../types/punishment';

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

    const channel = supabase
      .channel('statistics_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_jobs' },
        () => loadData(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => loadData(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'punishment' },
        () => loadData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

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

    // Get all unique event times and sort them
    const deliveryTimes = jobs
      .map((job) => {
        if (job.approved_time) {
          // Convert timestampz to HH:mm format
          const date = new Date(job.approved_time);
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }
        return job.delivery?.slice(0, 5);
      })
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

    const allEventTimes = Array.from(
      new Set([...deliveryTimes, ...punishmentTimes]),
    ).sort();

    // Create complete X-axis timeline from first event to 00:00
    let completeTimeline: string[] = [];
    if (allEventTimes.length > 0) {
      const startTime = allEventTimes[0];
      const [startHour] = startTime.split(':').map(Number);

      // Generate hourly intervals from start hour to 23:00, then add 00:00
      for (let hour = startHour; hour < 24; hour++) {
        const timeStr = `${String(hour).padStart(2, '0')}:00`;
        completeTimeline.push(timeStr);
      }
      // Add 00:00 as the final point
      completeTimeline.push('00:00');
    }

    // Group jobs and punishments by actual event times only
    const jobsByTime = new Map<string, UserJob[]>();
    const punishmentsByTime = new Map<string, Punishment[]>();

    // Initialize maps with actual event times only
    allEventTimes.forEach((time) => {
      jobsByTime.set(time, []);
      punishmentsByTime.set(time, []);
    });

    // Populate jobs by time
    jobs.forEach((job) => {
      let timeKey: string | undefined;
      if (job.approved_time) {
        // Convert timestampz to HH:mm format
        const date = new Date(job.approved_time);
        timeKey = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      } else {
        timeKey = job.delivery?.slice(0, 5);
      }

      if (timeKey && jobsByTime.has(timeKey)) {
        jobsByTime.get(timeKey)!.push(job);
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

    // Create the final timeline data - only hourly intervals for positioning
    const lineChartData: LineChartData[] = [];
    let cumulativeByUser: Record<string, number> = {};

    // Define userIds here, before using it
    const userIds = profiles.map((u) => u.id);

    // Initialize with zeros
    userIds.forEach((userId) => {
      const userName = userMap[userId];
      if (userName) {
        cumulativeByUser[userName] = 0;
      }
    });

    // Process each hourly slot
    completeTimeline.forEach((hourSlot) => {
      const hourSlotNum =
        hourSlot === '00:00' ? 0 : parseInt(hourSlot.split(':')[0]);
      let hasEventsInThisHour = false;

      // Find all events that fall within this hour
      const eventsInThisHour = allEventTimes.filter((eventTime) => {
        const eventHour = parseInt(eventTime.split(':')[0]);
        return (
          eventHour === hourSlotNum || (hourSlot === '00:00' && eventHour === 0)
        );
      });

      // Sort events within this hour chronologically
      eventsInThisHour.sort();

      // Process all events within this hour
      eventsInThisHour.forEach((eventTime) => {
        hasEventsInThisHour = true;

        // Add jobs earnings for this event
        jobsByTime.get(eventTime)?.forEach((job) => {
          if (job.user_id) {
            const userName = userMap[job.user_id];
            if (userName) {
              cumulativeByUser[userName] += job.money || 0;
            }
          }
        });

        // Subtract punishment amounts for this event
        punishmentsByTime.get(eventTime)?.forEach((punishment) => {
          if (punishment.user_id) {
            const userName = userMap[punishment.user_id];
            if (userName) {
              cumulativeByUser[userName] -= punishment.amount || 0;
            }
          }
        });
      });

      // Create the hourly data point
      const row: LineChartData = {
        delivery: hourSlot,
        hasEvents: hasEventsInThisHour,
        isHourlySlot: true,
        eventsInHour: eventsInThisHour, // Store which events happened in this hour
      };

      // Set cumulative values for all users
      userIds.forEach((userId) => {
        const userName = userMap[userId];
        if (userName) {
          row[userName] = cumulativeByUser[userName] || 0;
        }
      });

      lineChartData.push(row);
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
        netEarnings: (moneyEarned[user.id] || 0) - (punishmentAmounts[user.id] || 0),
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

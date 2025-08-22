import { useCallback, useEffect, useState } from 'react';
import { getUserProfiles, supabase } from '../api/user';
import { getPunishments } from '../api/punishment';
import { User } from '../types/user';
import type { Punishment } from '../types/punishment';
import BarLoader from 'react-spinners/BarLoader';
import { toast } from 'sonner';
import PunishmentHistory from '../components/punishment-components/PunishmentHistory';
import CurrentBalances from '../components/punishment-components/CurrentBalances';
import GivePunishment from '../components/punishment-components/GivePunishment';

const Punishment = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [punishments, setPunishments] = useState<
    (Punishment & { profiles: { name: string } })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const initialLoad = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading data...');

      const [profiles, punishmentsData] = await Promise.all([
        getUserProfiles(),
        getPunishments(),
      ]);

      console.log('Profiles:', profiles);
      console.log('Punishments:', punishmentsData);

      setUsers(profiles || []);
      setPunishments(punishmentsData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Kunne ikke hente data');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = useCallback(async () => {
    try {
      setUpdating(true);
      console.log('Updating data...');

      const [profiles, punishmentsData] = await Promise.all([
        getUserProfiles(),
        getPunishments(),
      ]);

      console.log('Updated Profiles:', profiles);
      console.log('Updated Punishments:', punishmentsData);

      setUsers(profiles || []);
      setPunishments(punishmentsData || []);
    } catch (err) {
      console.error('Error updating data:', err);
      // Don't show error toast for background updates to avoid spam
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    initialLoad();

    const channel = supabase
      .channel('punishment_page_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'punishment',
        },
        (payload) => {
          console.log('Realtime event (punishment):', payload);
          updateData();
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Realtime event (profiles general):', payload);
          updateData();
        },
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscriptions');
      supabase.removeChannel(channel);
    };
  }, [initialLoad, updateData]);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="mb-0">Straf</h1>
        {updating && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Opdaterer...</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <BarLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Apply Penalty Form */}
          <GivePunishment users={users} onPunishmentAdded={updateData} />

          {/* User Money Display */}
          <CurrentBalances users={users} />

          {/* Recent Penalties */}
          <PunishmentHistory punishments={punishments} />
        </div>
      )}
    </div>
  );
};

export default Punishment;

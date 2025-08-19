import { useCallback, useEffect, useState } from 'react';
import { getUserProfiles, supabase } from '../api/user';
import { addPunishment, getPunishments } from '../api/punishment';
import { User } from '../types/user';
import type { Punishment } from '../types/punishment';
import BarLoader from 'react-spinners/BarLoader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { toast } from 'sonner';
import { Minus, DollarSign } from 'lucide-react';
import { PunishmentFormData, punishmentSchema } from '../validation/punishmentSchema';

const Punishment = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [punishments, setPunishments] = useState<(Punishment & { profiles: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyReason, setPenaltyReason] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof PunishmentFormData, string>>>({});

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
          table: 'punishment'
        },
        (payload) => {
          console.log('Realtime event (punishment):', payload);
          updateData();
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: 'money=neq.null'
        },
        (payload) => {
          console.log('Realtime event (profiles money update):', payload);
          updateData();
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
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

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const handleApplyPenalty = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form data
    const formData = {
      selectedUserId,
      penaltyAmount: penaltyAmount ? parseInt(penaltyAmount) : NaN,
      penaltyReason,
    };

    console.log('Form data:', formData);

    const validation = punishmentSchema.safeParse(formData);

    if (!validation.success) {
      console.log('Validation errors:', validation.error.errors);
      const fieldErrors: Partial<Record<keyof PunishmentFormData, string>> = {};
      validation.error.errors.forEach((error) => {
        const field = error.path[0] as keyof PunishmentFormData;
        fieldErrors[field] = error.message;
      });
      console.log('Field errors:', fieldErrors);
      setErrors(fieldErrors);
      toast.error('Ret fejlene i formularen');
      return;
    }

    const { selectedUserId: userId, penaltyAmount: amount, penaltyReason: reason } = validation.data;

    // Additional validation: Check if user has enough money
    const selectedUser = users.find(u => u.id === userId);
    if (!selectedUser) {
      toast.error('Bruger ikke fundet');
      return;
    }

    if (amount > (selectedUser.money || 0)) {
      setErrors({ penaltyAmount: 'Bøden kan ikke være højere end brugerens saldo' });
      toast.error('Bøden kan ikke være højere end brugerens saldo');
      return;
    }

    try {
      await addPunishment(userId, amount, reason);
      toast.success(`Bøde på ${amount} kr. givet til ${selectedUser.name}`);

      // Reset form
      setSelectedUserId('');
      setPenaltyAmount('');
      setPenaltyReason('');
      setErrors({});

      // Refresh data
      await updateData();
    } catch (error) {
      console.error('Error applying penalty:', error);
      toast.error('Kunne ikke give bøde');
    }
  };

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
          <div className="border border-(--border) rounded-xl p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Minus className="text-red-500" />
              Giv straf
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Vælg bruger</Label>
                <Select
                  options={userOptions}
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  placeholder="Vælg bruger..."
                />
                {errors.selectedUserId && (
                  <p className="text-red-500 text-sm mt-1">{errors.selectedUserId}</p>
                )}
              </div>

              <div>
                <Label>Strafbeløb (kr.)</Label>
                <Input
                  type="number"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(e.target.value)}
                  placeholder="Indtast beløb..."
                  min="1"
                  className={`w-full ${errors.penaltyAmount ? 'border-red-500' : ''}`}
                />
                {errors.penaltyAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.penaltyAmount}</p>
                )}
              </div>

              <div>
                <Label>Årsag til straf</Label>
                <Textarea
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  placeholder="Beskriv årsagen til straffen..."
                  rows={3}
                  className={`w-full ${errors.penaltyReason ? 'border-red-500' : ''}`}
                />
                {errors.penaltyReason && (
                  <p className="text-red-500 text-sm mt-1">{errors.penaltyReason}</p>
                )}
              </div>

              <Button
                onClick={handleApplyPenalty}
                variant="destructive"
                className="w-full"
              >
                Giv straf
              </Button>
            </div>
          </div>

          {/* User Money Display */}
          <div className="border border-(--border) rounded-xl p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-green-500" />
              Saldi
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users
                .sort((a, b) => (b.money || 0) - (a.money || 0))
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-(--input-bg) border border-(--border) rounded-xl"
                  >
                    <span className="font-medium truncate max-w-xs">{user.name}</span>
                    <span className={`font-semibold ${(user.money || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {user.money || 0} kr.
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Penalties */}
          <div className="lg:col-span-2 border border-(--border) rounded-xl p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Seneste straffe</h2>

            {punishments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Ingen straffer givet endnu</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 w-[15%]">Tid</th>
                      <th className="text-left py-2 px-4 w-[30%]">Bruger</th>
                      <th className="text-left py-2 px-4 w-[20%]">Beløb</th>
                      <th className="text-left py-2 px-4 w-[40%]">Årsag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {punishments.map((punishment) => (
                      <tr key={punishment.id} className="border-b">
                        <td className="py-2 px-4">
                          {punishment.created_at ? new Date(punishment.created_at).toLocaleTimeString('da-DK', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          }) : ''}
                        </td>
                        <td className="py-2 px-4">{punishment.profiles?.name || 'Ukendt'}</td>
                        <td className="py-2 px-4 text-red-600 font-semibold">-{punishment.amount} kr.</td>
                        <td className="py-2 px-4">{punishment.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Punishment;
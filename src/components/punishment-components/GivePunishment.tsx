import { useState } from 'react';
import { Minus } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { toast } from 'sonner';
import { addPunishment } from '../../api/punishment';
import { User } from '../../types/user';
import {
  PunishmentFormData,
  punishmentSchema,
} from '../../validation/punishmentSchema';

interface GivePunishmentProps {
  users: User[];
  onPunishmentAdded: () => void;
}

const GivePunishment = ({ users, onPunishmentAdded }: GivePunishmentProps) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyReason, setPenaltyReason] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof PunishmentFormData, string>>
  >({});

  const userOptions = users
    .map((user) => ({
      value: user.id,
      label: user.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleApplyPenalty = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form data
    const formData = {
      selectedUserId,
      penaltyAmount: penaltyAmount ? parseInt(penaltyAmount) : NaN,
      penaltyReason,
    };

    const validation = punishmentSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof PunishmentFormData, string>> = {};
      validation.error.errors.forEach((error) => {
        const field = error.path[0] as keyof PunishmentFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      toast.error('Ret fejlene i formularen');
      return;
    }

    const {
      selectedUserId: userId,
      penaltyAmount: amount,
      penaltyReason: reason,
    } = validation.data;

    // Additional validation: Check if user has enough money
    const selectedUser = users.find((u) => u.id === userId);
    if (!selectedUser) {
      toast.error('Bruger ikke fundet');
      return;
    }

    if (amount > (selectedUser.money || 0)) {
      setErrors({
        penaltyAmount: 'Bøden kan ikke være højere end brugerens saldo',
      });
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

      // Notify parent component
      onPunishmentAdded();
    } catch (error) {
      console.error('Error applying penalty:', error);
      toast.error('Kunne ikke give bøde');
    }
  };

  return (
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
  );
};

export default GivePunishment;

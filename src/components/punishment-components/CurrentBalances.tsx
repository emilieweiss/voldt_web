import { DollarSign } from 'lucide-react';
import { User } from '../../types/user';

interface CurrentBalancesProps {
  users: User[];
}

const CurrentBalances = ({ users }: CurrentBalancesProps) => {
  return (
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
              <span
                className={`font-semibold ${(user.money || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {user.money || 0} kr.
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CurrentBalances;

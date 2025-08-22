import type { Punishment } from '../../types/punishment';

interface PunishmentHistoryProps {
  punishments: (Punishment & { profiles: { name: string } })[];
}

const PunishmentHistory = ({ punishments }: PunishmentHistoryProps) => {
  return (
    <div className="lg:col-span-2 border border-(--border) rounded-xl p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Seneste straffe</h2>

      {punishments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Ingen straffer givet endnu
        </p>
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
                    {punishment.created_at
                      ? new Date(punishment.created_at)
                          .toLocaleTimeString('da-DK', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          .replace('.', ':')
                      : ''}
                  </td>
                  <td className="py-2 px-4">
                    {punishment.profiles?.name || 'Ukendt'}
                  </td>
                  <td className="py-2 px-4 text-red-600 font-semibold">
                    -{punishment.amount} kr.
                  </td>
                  <td className="py-2 px-4">{punishment.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PunishmentHistory;

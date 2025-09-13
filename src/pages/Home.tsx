import { useCallback, useEffect, useState } from 'react';
import { getApprovedJobs, getLatest15UserJobs } from '../api/user_job';
import { getLatest15Punishments } from '../api/punishment';
import { getUserProfiles, supabase } from '../api/user';
import { TableData } from '../types/chart_data';
import BarLoader from 'react-spinners/BarLoader';

const Home = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [jobs, profiles, latestUserJobs, latestPunishments] = await Promise.all([
        getApprovedJobs(),
        getUserProfiles(),
        getLatest15UserJobs(),
        getLatest15Punishments(),
      ]);

      const jobCounts: Record<string, number> = {};
      const moneyEarned: Record<string, number> = {};

      for (const job of jobs) {
        const uid = job.user_id;
        if (!uid) continue;
        jobCounts[uid] = (jobCounts[uid] || 0) + 1;
        moneyEarned[uid] = (moneyEarned[uid] || 0) + (job.money || 0);
      }

      const tableData = profiles
        .map((user) => ({
          name: user.name,
          jobs: jobCounts[user.id] || 0,
          totalEarned: moneyEarned[user.id] || 0,
          currentBalance: user.money || 0,
        }))
        .sort((a, b) => b.currentBalance - a.currentBalance);

      const combinedEvents = [
        ...latestUserJobs.map((job) => ({
          ...job,
          timestamp: job.approved_time ? new Date(job.approved_time).getTime() : 0,
          type: 'Job',
        })),
        ...latestPunishments.map((punishment) => ({
          ...punishment,
          timestamp: punishment.created_at ? new Date(punishment.created_at).getTime() : 0,
          type: 'Straf',
        })),
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 15);

      setTableData(tableData);
      setLatestEvents(combinedEvents);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('home_user_overview')
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

  return (
    <div className="">
      <h1 className="">Hjem</h1>

      {loading ? (
        <div className="mt-6 flex flex-col items-center justify-center w-full min-h-[400px]">
          <BarLoader color="#009DF4" />
          <p className="mt-4 text-gray-600">Indlæser jobliste...</p>
        </div>
      ) : (
        <>
          <h2 className="mb-4">Brugeroversigt</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg text-lg">
              <thead>
                <tr className="bg-gray-300">
                  <th className="py-2 px-4 text-left">Navn</th>
                  <th className="py-2 px-4 text-left">Færdige jobs</th>
                  <th className="py-2 px-4 text-left">Nuværende saldo (kr.)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((user) => {
                  // Check if all users have the same balance
                  const allSameBalance = tableData.every(u => u.currentBalance === tableData[0].currentBalance);

                  // Find highest and lowest balances
                  const highestBalance = tableData[0].currentBalance; // Already sorted desc
                  const lowestBalance = tableData[tableData.length - 1].currentBalance;

                  // Determine if user has highest or lowest balance (considering ties)
                  const hasHighestBalance = user.currentBalance === highestBalance && !allSameBalance;
                  const hasLowestBalance = user.currentBalance === lowestBalance && !allSameBalance && highestBalance !== lowestBalance;

                  let rowClass = 'border-t';
                  if (hasHighestBalance) {
                    rowClass += ' bg-green-300 border-b';
                  } else if (hasLowestBalance) {
                    rowClass += ' bg-red-300';
                  }

                  return (
                    <tr key={user.name} className={rowClass}>
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.jobs}</td>
                      <td className="py-2 px-4">{user.currentBalance.toLocaleString('da-DK')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 mb-4">Seneste begivenheder</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg text-lg">
              <thead>
                <tr className="bg-gray-300">
                  <th className="py-2 px-4 text-left w-[15%]">Tidspunkt</th>
                  <th className="py-2 px-4 text-left w-[15%]">Type</th>
                  <th className="py-2 px-4 text-left w-[30%]">Beskrivelse</th>
                  <th className="py-2 px-4 text-left w-[15%]">Løn</th>
                </tr>
              </thead>
              <tbody>
                {latestEvents.map((event, index) => (
                  <tr
                    key={index}
                    className={`border-t ${index % 2 === 1 ? 'bg-gray-200' : ''}`}
                  >
                    <td className="px-4">
                      {new Date(event.type === 'Job' ? event.approved_time : event.created_at)
                        .toLocaleTimeString('da-DK', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                        .replace('.', ':')}
                    </td>
                    <td className="px-4">
                      {event.type}
                    </td>
                    <td className="px-4">
                      {event.type === 'Job' ? `${event.title}` : event.reason || 'Ingen beskrivelse'}
                    </td>
                    <td className="px-4">
                      <span className={event.type === 'Job' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {event.type === 'Job'
                          ? event.money.toLocaleString('da-DK') + ' kr.'
                          : event.amount ? '-' + event.amount.toLocaleString('da-DK') + ' kr.' : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

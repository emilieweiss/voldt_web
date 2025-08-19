import { useCallback, useEffect, useState } from 'react';
import { getApprovedJobs } from '../api/user_job';
import { getUserProfiles, supabase } from '../api/user';
import { TableData } from '../types/chart_data';
import BarLoader from 'react-spinners/BarLoader';

const Home = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [jobs, profiles] = await Promise.all([
        getApprovedJobs(),
        getUserProfiles(),
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

      setTableData(tableData);
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
        (payload) => {
          console.log('Realtime event (home):', payload);
          loadData();
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Realtime event (profiles - home):', payload);
          loadData();
        },
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
        <div className="flex justify-center">
          <BarLoader />
        </div>
      ) : (
        <>
          <h2 className="mb-4">Brugeroversigt</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg text-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Navn</th>
                  <th className="py-2 px-4 text-left">Færdige jobs</th>
                  <th className="py-2 px-4 text-left">Nuværende saldo (kr.)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((user, index) => {
                  const totalUsers = tableData.length;
                  const bottomThirdStart = Math.ceil(totalUsers * 2 / 3);
                  const isFirstPlace = index === 0;
                  const isBottomThird = index >= bottomThirdStart;

                  let rowClass = "border-t";
                  if (isFirstPlace) {
                    rowClass += " bg-green-100 border-b";
                  } else if (isBottomThird) {
                    rowClass += " bg-red-100";
                  }

                  return (
                    <tr key={user.name} className={rowClass}>
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.jobs}</td>
                      <td className="py-2 px-4">
                        {user.currentBalance}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
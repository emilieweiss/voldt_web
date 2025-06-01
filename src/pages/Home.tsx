import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { getApprovedJobs } from '../api/user_job';
import { getUserProfiles } from '../api/user';
import {
  BarData,
  ChartUser,
  LineChartData,
  TableData,
} from '../types/chart_data';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#f97316', '#10b981'];

const Home = () => {
  const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
  const [barData, setBarData] = useState<BarData[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [chartUsers, setChartUsers] = useState<ChartUser[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [jobs, profiles] = await Promise.all([
        getApprovedJobs(),
        getUserProfiles(),
      ]);

      const chartUsers = [...profiles]
        .map((user) => ({
          name: user.name,
          id: user.id,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setChartUsers(chartUsers);

      const userMap = Object.fromEntries(
        profiles.map((u: User) => [u.id, u.name]),
      );

      const jobCounts: Record<string, number> = {};
      const moneyEarned: Record<string, number> = {};
      // Prepare delivery times (sorted)
      const deliveryTimes = Array.from(
        new Set(
          jobs.map((job: UserJob) => job.delivery?.slice(0, 5)).filter(Boolean),
        ),
      ).sort();

      // Prepare cumulative money per user per delivery time
      const userIds = profiles.map((u: User) => u.id);

      // Initialize cumulative sums
      const cumulative: Record<string, number> = {};
      userIds.forEach((id) => (cumulative[id] = 0));

      // Prepare jobs grouped by delivery time and user
      const jobsByTime: Record<string, UserJob[]> = {};
      for (const time of deliveryTimes) {
        jobsByTime[time] = [];
      }
      for (const job of jobs) {
        const deliveryKey = job.delivery?.slice(0, 5);
        if (deliveryKey) jobsByTime[deliveryKey].push(job);
      }

      // Build line chart data
      const lineChartData: LineChartData[] = [];
      for (const time of deliveryTimes) {
        const row: LineChartData = { delivery: time };
        // Add jobs at this delivery time to cumulative sum
        for (const job of jobsByTime[time]) {
          if (job.user_id) {
            cumulative[job.user_id] += job.money || 0;
          }
        }
        // Set cumulative sum for each user at this time
        for (const userId of userIds) {
          const userName = userMap[userId];
          row[userName] = cumulative[userId];
        }
        lineChartData.push(row);
      }
      setLineChartData(lineChartData);

      for (const job of jobs) {
        const uid = job.user_id;
        if (!uid) continue;
        jobCounts[uid] = (jobCounts[uid] || 0) + 1;
        moneyEarned[uid] = (moneyEarned[uid] || 0) + (job.money || 0);
      }

      // Original mapping
      const unsortedBarData = profiles.map((user) => ({
        name: user.name,
        jobs: jobCounts[user.id] || 0,
        money: moneyEarned[user.id] || 0,
      }));

      // Til grafer – alfabetisk
      const barChartData = [...unsortedBarData].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      // Til tabel – flest jobs øverst
      const tableData = [...unsortedBarData].sort((a, b) => b.jobs - a.jobs);

      setBarData(barChartData);
      setTableData(tableData);
    };

    loadData();
  }, []);

  return (
    <div className="">
      <h1>Statistik</h1>

      <h2 className="mb-2">Brugeroversigt</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full border rounded-lg text-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Navn</th>
              <th className="py-2 px-4 text-left">Færdiggjorte jobs</th>
              <th className="py-2 px-4 text-left">Saldo (kr.)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((user) => (
              <tr key={user.name} className="border-t">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.jobs}</td>
                <td className="py-2 px-4">{user.money}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8">
        <h2 className="mb-2">Indtjening pr. leveringstidspunkt</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="delivery" />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartUsers.map((user, index) => (
              <Line
                key={user.name}
                type="monotone"
                dataKey={user.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="mt-6">
          <h2 className="mb-2">Færdiggjorte jobs</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                label={{
                  value: 'Antal jobs',
                  position: 'insideBottom',
                  offset: -10,
                }}
              />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="jobs">
                {barData.map((_entry, index) => (
                  <Cell
                    key={`cell-jobs-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h2 className="mb-2">Indtjening pr. bruger</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                label={{
                  value: 'Antal jobs',
                  position: 'insideBottom',
                  offset: -10,
                }}
              />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="money">
                {barData.map((_entry, index) => (
                  <Cell
                    key={`cell-money-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default Home;

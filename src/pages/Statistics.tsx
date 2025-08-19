import { useCallback, useEffect, useState } from 'react';
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
import { getUserProfiles, supabase } from '../api/user';
import { getPunishments } from '../api/punishment';
import {
    BarData,
    ChartUser,
    LineChartData,
} from '../types/chart_data';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';
import BarLoader from 'react-spinners/BarLoader';
import { Punishment } from '../types/punishment';

const colors = [
    '#E68A8A', // Blød rød/rosa
    '#F2A97E', // Fersken
    '#F2C97E', // Varm gul-orange (læsbar)
    '#8FD19E', // Mint grøn
    '#7DB5E6', // Baby blå men mørkere
    '#B28FE6', // Lavendel
    '#E69EC4', // Pastel pink men mørkere
    '#7ED6D4', // Aqua pastel
    '#E6B47E', // Lys orange/brunlig
    '#A6E67E', // Pastel grøn
    '#6FD6E6', // Pastel turkis
    '#7E9EE6', // Blød blå
    '#9C8FE6', // Blød lilla
    '#C48FE6'  // Varm lilla
];


const Statistics = () => {
    const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
    const [barData, setBarData] = useState<BarData[]>([]);
    const [chartUsers, setChartUsers] = useState<ChartUser[]>([]);

    const loadData = useCallback(async () => {
        const [jobs, profiles, punishments] = await Promise.all([
            getApprovedJobs(),
            getUserProfiles(),
            getPunishments(),
        ]);

        const chartUsers = [...profiles]
            .map((user) => ({
                name: user.name.length > 15 ? user.name.slice(0, 15) + '...' : user.name,
                id: user.id,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        setChartUsers(chartUsers);

        // Use the same name mapping for both chart users and line chart data
        const userMap = Object.fromEntries(
            chartUsers.map((u) => [u.id, u.name]),
        );

        const jobCounts: Record<string, number> = {};
        const moneyEarned: Record<string, number> = {};
        const punishmentAmounts: Record<string, number> = {};

        // Prepare delivery times (sorted)
        const deliveryTimes = Array.from(
            new Set(
                jobs.map((job: UserJob) => job.delivery?.slice(0, 5)).filter(Boolean),
            ),
        ).sort();

        // Get punishment times and add them to the timeline
        const punishmentTimes = Array.from(
            new Set(
                punishments.map((punishment) => {
                    if (punishment.created_at) {
                        const date = new Date(punishment.created_at);
                        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    }
                    return null;
                }).filter(Boolean) as string[]
            ),
        );

        // Combine and sort all times
        const allTimes = Array.from(new Set([...deliveryTimes, ...punishmentTimes])).sort();

        // Prepare cumulative money per user per time
        const userIds = profiles.map((u: User) => u.id);

        // Initialize cumulative sums
        const cumulative: Record<string, number> = {};
        userIds.forEach((id) => (cumulative[id] = 0));

        // Prepare jobs and punishments grouped by time
        const jobsByTime: Record<string, UserJob[]> = {};
        const punishmentsByTime: Record<string, Punishment[]> = {};

        for (const time of allTimes) {
            jobsByTime[time] = [];
            punishmentsByTime[time] = [];
        }

        for (const job of jobs) {
            const deliveryKey = job.delivery?.slice(0, 5);
            if (deliveryKey && jobsByTime[deliveryKey]) {
                jobsByTime[deliveryKey].push(job);
            }
        }

        for (const punishment of punishments) {
            if (punishment.created_at) {
                const date = new Date(punishment.created_at);
                const timeKey = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                if (punishmentsByTime[timeKey]) {
                    punishmentsByTime[timeKey].push(punishment);
                }
            }
        }

        // Build line chart data with net earnings
        const lineChartData: LineChartData[] = [];
        for (const time of allTimes) {
            const row: LineChartData = { delivery: time };

            // Add jobs at this time to cumulative sum
            for (const job of jobsByTime[time] || []) {
                if (job.user_id) {
                    cumulative[job.user_id] += job.money || 0;
                }
            }

            // Subtract punishments at this time from cumulative sum
            for (const punishment of punishmentsByTime[time] || []) {
                if (punishment.user_id) {
                    cumulative[punishment.user_id] -= punishment.amount || 0;
                }
            }

            // Set cumulative net earnings for each user at this time
            for (const userId of userIds) {
                const userName = userMap[userId];
                if (userName) {
                    row[userName] = cumulative[userId];
                }
            }
            lineChartData.push(row);
        }

        console.log('Chart Users:', chartUsers);
        console.log('Sample Line Chart Data:', lineChartData[0]);
        console.log('User Map:', userMap);

        setLineChartData(lineChartData);

        for (const job of jobs) {
            const uid = job.user_id;
            if (!uid) continue;
            jobCounts[uid] = (jobCounts[uid] || 0) + 1;
            moneyEarned[uid] = (moneyEarned[uid] || 0) + (job.money || 0);
        }

        // Calculate punishment amounts per user
        for (const punishment of punishments) {
            const uid = punishment.user_id;
            if (!uid) continue;
            punishmentAmounts[uid] = (punishmentAmounts[uid] || 0) + punishment.amount;
        }

        // Original mapping - now includes net earnings
        const unsortedBarData = profiles.map((user) => ({
            name: user.name.length > 15 ? user.name.slice(0, 15) + '...' : user.name,
            jobs: jobCounts[user.id] || 0,
            money: moneyEarned[user.id] || 0,
            punishments: punishmentAmounts[user.id] || 0,
            netEarnings: (moneyEarned[user.id] || 0) - (punishmentAmounts[user.id] || 0),
        }));

        // Til grafer – alfabetisk
        const barChartData = [...unsortedBarData].sort((a, b) =>
            a.name.localeCompare(b.name),
        );

        setBarData(barChartData);
    }, []);

    useEffect(() => {
        loadData();

        const channel = supabase
            .channel('statistics_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'user_jobs' },
                (payload) => {
                    console.log('Realtime event (statistics - jobs):', payload);
                    loadData();
                },
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log('Realtime event (statistics - profiles):', payload);
                    loadData();
                },
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'punishment' },
                (payload) => {
                    console.log('Realtime event (statistics - punishments):', payload);
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
            <h1>Statistik</h1>
            {chartUsers.length < 1 && (
                <div className="flex justify-center">
                    <BarLoader />
                </div>
            )}

            <section>
                <h2 className="mb-2">Netto indtjening over tid (efter straf)</h2>
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

            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
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
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={80}
                                tick={{ fontSize: 16, width: 80 }}
                                interval={0}
                            />
                            <Tooltip />
                            <Bar dataKey="jobs" name="Jobs">
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
                    <h2 className="mb-2">Total indtjening pr. bruger</h2>
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
                                    value: 'Kroner (kr.)',
                                    position: 'insideBottom',
                                    offset: -10,
                                }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={80}
                                tick={{ fontSize: 16, width: 80 }}
                                interval={0}
                            />
                            <Tooltip />
                            <Bar dataKey="money" name="Total indtjening (kr.)">
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

                <div className="mt-6">
                    <h2 className="mb-2">Netto indtjening (efter straf)</h2>
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
                                    value: 'Kroner (kr.)',
                                    position: 'insideBottom',
                                    offset: -10,
                                }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={80}
                                tick={{ fontSize: 16, width: 80 }}
                                interval={0}
                            />
                            <Tooltip />
                            <Bar dataKey="netEarnings" name="Netto indtjening (kr.)">
                                {barData.map((entry, index) => (
                                    <Cell
                                        key={`cell-net-${index}`}
                                        fill={entry.netEarnings >= 0 ? colors[index % colors.length] : '#EF4444'}
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

export default Statistics;
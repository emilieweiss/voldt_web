import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
} from 'recharts';
import { LineChartData, ChartUser } from '../../types/chart_data';

// Custom tooltip that shows event details
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    if (!dataPoint?.hasEvents) {
      return null;
    }

    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Tid: ${label}`}</p>
        {dataPoint.eventsInHour && dataPoint.eventsInHour.length > 0 && (
          <p className="text-xs text-gray-500 mb-2">
            Events: {dataPoint.eventsInHour.join(', ')}
          </p>
        )}
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${typeof entry.value === 'number'
              ? entry.value.toLocaleString('da-DK')
              : entry.value
              } kr.`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom dot component - show at hourly slots if events occurred
const CustomDot = (props: any) => {
  const { cx, cy, payload, stroke } = props;

  // Only render dot if this hourly slot had events
  if (!payload?.hasEvents) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={stroke}
      stroke="white"
      strokeWidth={2}
    />
  );
};

interface LineChartProps {
  data: LineChartData[];
  chartUsers: ChartUser[];
  colors: string[];
  title: string;
  height?: number;
}

const LineChart = ({
  data,
  chartUsers,
  colors,
  title,
  height = 400,
}: LineChartProps) => {
  return (
    <section>
      <h2 className="mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="delivery" type="category" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 'dataMax']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {chartUsers.map((user, index) => (
            <Line
              key={user.name}
              type="monotone"
              dataKey={user.name}
              stroke={colors[index % colors.length]}
              strokeWidth={4}
              dot={<CustomDot stroke={colors[index % colors.length]} />}
              connectNulls={false}
              activeDot={{
                r: 4,
                stroke: colors[index % colors.length],
                strokeWidth: 2,
              }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default LineChart;

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
        </RechartsLineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default LineChart;

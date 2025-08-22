import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  Cell,
} from 'recharts';
import { BarData } from '../../types/chart_data';

interface BarChartProps {
  data: BarData[];
  dataKey: keyof BarData;
  colors: string[];
  title: string;
  xAxisLabel: string;
  barName: string;
  height?: number;
  useNegativeColors?: boolean;
}

const BarChart = ({
  data,
  dataKey,
  colors,
  title,
  xAxisLabel,
  barName,
  height = 300,
  useNegativeColors = false,
}: BarChartProps) => {
  return (
    <div className="mt-6">
      <h2 className="mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            label={{
              value: xAxisLabel,
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
          <Bar dataKey={dataKey} name={barName}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${dataKey}-${index}`}
                fill={
                  useNegativeColors &&
                  dataKey === 'netEarnings' &&
                  entry.netEarnings < 0
                    ? '#EF4444'
                    : colors[index % colors.length]
                }
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;

export interface ChartUser {
  name: string;
  id: string;
}

export interface BarData {
  name: string;
  jobs: number;
  money: number;
  punishments: number;
  netEarnings: number;
}

export interface TableData {
  name: string;
  jobs: number;
  totalEarned: number;
  currentBalance: number;
}

export interface LineChartData {
  delivery: string;
  hasEvents?: boolean;
  isHourlySlot?: boolean;
  eventsInHour?: string[];
  [userName: string]: string | number | boolean | string[] | undefined;
}

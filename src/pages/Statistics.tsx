import BarLoader from 'react-spinners/BarLoader';
import LineChart from '../components/statistics-components/LineChart';
import BarChart from '../components/statistics-components/BarChart';
import { useStatisticsData } from '../hooks/useStatisticsData';

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
  '#C48FE6', // Varm lilla
];

const Statistics = () => {
  const { lineChartData, barData, chartUsers, isLoading, error, loadData } =
    useStatisticsData();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Fejl ved indlæsning af data
          </h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            Prøv igen
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <BarLoader color="#3B82F6" />
        <p className="mt-4 text-gray-600">Indlæser statistikker...</p>
      </div>
    );
  }

  if (chartUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 text-lg">Ingen data tilgængelig</p>
      </div>
    );
  }

  return (
    <div className="">
      <h1>Statistik</h1>

      <LineChart
        data={lineChartData}
        chartUsers={chartUsers}
        colors={colors}
        title="Netto indtjening over tid (efter straf)"
        height={400}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
        <BarChart
          data={barData}
          dataKey="jobs"
          colors={colors}
          title="Færdiggjorte jobs"
          xAxisLabel="Antal jobs"
          barName="Jobs"
        />

        <BarChart
          data={barData}
          dataKey="money"
          colors={colors}
          title="Total indtjening pr. bruger"
          xAxisLabel="Kroner (kr.)"
          barName="Total indtjening (kr.)"
        />

        <BarChart
          data={barData}
          dataKey="netEarnings"
          colors={colors}
          title="Netto indtjening (efter straf)"
          xAxisLabel="Kroner (kr.)"
          barName="Netto indtjening (kr.)"
          useNegativeColors={true}
        />
      </section>
    </div>
  );
};

export default Statistics;

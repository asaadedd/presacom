import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { GroupBy, ProfitData } from '@presacom/models';
import { ChartData, ChartOptions } from 'chart.js';
import { getMonth, getWeek, getYear } from 'date-fns';

const MONTHS = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie'
]

interface ProfitChartProps {
  profits: ProfitData[];
  filters: {
    startTime: Date,
    endTime: Date,
    groupBy: GroupBy
  };
}

function ProfitChart({ profits, filters }: ProfitChartProps) {
  const [data, setData] = useState<ChartData<'line'> | null>(null);
  const [options, setOptions] = useState<ChartOptions<'line'> | null>(null);

  useEffect(() => {
    const getLabelsFromFilter = () => {
      if (filters.groupBy === GroupBy.BY_MONTH) {
        return profits.map((profit) => MONTHS[getMonth(new Date(profit.start))]);
      } else if (filters.groupBy === GroupBy.BY_WEEK) {
        return profits.map((profit) => getWeek(new Date(profit.start)));
      } else {
        return profits.map((profit) => getYear(new Date(profit.start)));
      }
    }
    if (!profits.length || !filters) {
      return;
    }
    
    const labels = getLabelsFromFilter();
    const datasets = [
      {
        data: profits.map((profit) => profit.value),
        borderColor: '#1cc88a',
        backgroundColor: '#1cc88a',
  
      }
    ];
    setData({
      labels,
      datasets,
    });
    setOptions({
      plugins: {
        legend: {
          display: false
        }
      }
    })
  }, [profits, filters])

  if (!data || !options) return null;

  return (
    <Line data={data} options={options}/>
  );
}

export default ProfitChart;
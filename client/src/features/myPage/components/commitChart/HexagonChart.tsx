import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// 필요한 Chart.js 컴포넌트를 등록
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface HexagonChartProps {
  data: number[];
}

const HexagonChart: React.FC<HexagonChartProps> = ({ data }) => {
  const chartData = {
    labels: ['feat', 'design', 'refactor', 'test', 'chore', 'fix'],
    datasets: [
      {
        label: 'Commit 분포',
        data: data,
        backgroundColor: 'rgba(76, 175, 80, 0.4)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default HexagonChart;

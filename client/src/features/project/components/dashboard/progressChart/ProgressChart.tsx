// ProgressChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';
import styles from './ProgressChart.module.css';
ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
  label: string;
  progress: number;
  
}
interface ChartDataProps {
  chartsData : ChartData[]
}

const ProgressChart: React.FC<ChartDataProps> = ({chartsData}) => {
  // const chartsData: ChartDataProps[] = [
  //   { label: 'Backend', progress: 70 },
  //   { label: 'Frontend', progress: 45 },
  // ];
  // const {userId } = useUserStore();
  // const {projectId} = useDashboardStore();
  // const {data : projectListData} = useProjectListData(userId);
  // const chartsData: ChartDataProps[] = [{label : 'Backend', progress : projectListData?.find(project => project.id === projectId)?.progressBack ||0},{label : 'Frontend', progress : projectListData?.find(project => project.id === projectId)?.progressFront || 0}]
  const createChartData = (progress: number) => ({
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ['#4CAF50', '#DDDDDD'],
        hoverBackgroundColor: ['#66BB6A', '#EEEEEE'],
      },
    ],
  });

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className={styles.chartWrapper}>
      {chartsData?.map((chart, index) => (
        <div key={index} className={styles.chartContainer}>
          <h3>{chart.label}</h3>
          <Doughnut data={createChartData(chart.progress)} options={options} />
          <div className={styles.progressText}>{chart.progress}%</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressChart;

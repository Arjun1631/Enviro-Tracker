import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AccuracyMetrics } from '../contexts/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AccuracyChartProps {
  metrics: AccuracyMetrics;
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ metrics }) => {
  const chartData = {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'],
    datasets: [
      {
        label: 'Metrics',
        data: [
          metrics.accuracy * 100, 
          metrics.precision * 100, 
          metrics.recall * 100, 
          metrics.f1Score * 100
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(245, 158, 11, 0.7)', // Amber
          'rgba(139, 92, 246, 0.7)', // Purple
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AccuracyChart;
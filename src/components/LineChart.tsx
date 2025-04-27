import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SensorData } from '../utils/dataGenerator';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: SensorData[];
  label: string;
  color: string;
  thresholdMin?: number;
  thresholdMax?: number;
  unit: string;
  timeFormat?: 'hour' | 'day';
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  label,
  color,
  thresholdMin,
  thresholdMax,
  unit,
  timeFormat = 'hour',
}) => {
  // Prepare data for chart
  const chartData = {
    labels: data.map(d => 
      timeFormat === 'hour' 
        ? format(d.timestamp, 'HH:mm') 
        : format(d.timestamp, 'MMM dd')
    ),
    datasets: [
      {
        label,
        data: data.map(d => d.value),
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency to color
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  // Add threshold lines if provided
  if (thresholdMin !== undefined || thresholdMax !== undefined) {
    const thresholds = [];
    
    if (thresholdMin !== undefined) {
      thresholds.push({
        label: `Min Threshold (${thresholdMin} ${unit})`,
        data: Array(data.length).fill(thresholdMin),
        borderColor: 'rgba(255, 99, 132, 0.7)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        tension: 0,
      });
    }
    
    if (thresholdMax !== undefined) {
      thresholds.push({
        label: `Max Threshold (${thresholdMax} ${unit})`,
        data: Array(data.length).fill(thresholdMax),
        borderColor: 'rgba(255, 99, 132, 0.7)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        tension: 0,
      });
    }
    
    chartData.datasets = [...chartData.datasets, ...thresholds];
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)} ${unit}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return `${value} ${unit}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
      }
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
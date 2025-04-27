import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import LineChart from '../components/LineChart';
import { SensorType, getSensorName } from '../utils/dataGenerator';

const HistoricalData: React.FC = () => {
  const { historicalData, thresholds } = useData();
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('temperature');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  
  // Chart colors for different sensor types
  const chartColors = {
    temperature: '#ef4444', // Red
    humidity: '#3b82f6', // Blue
    airQuality: '#f59e0b', // Amber
    soilQuality: '#10b981', // Green
  };
  
  // Filter data based on time range
  const getFilteredData = () => {
    const allData = historicalData[selectedSensor];
    
    switch (timeRange) {
      case '24h':
        // Last 24 data points (assuming hourly data)
        return allData.slice(-24);
      case '7d':
        // Last 168 data points (7 days * 24 hours)
        return allData.slice(-168);
      case '30d':
        // Last 720 data points (30 days * 24 hours)
        return allData.slice(-720);
      default:
        return allData;
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historical Data</h1>
        <p className="text-gray-600">
          View and analyze past environmental metrics.
        </p>
      </div>
      
      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="sensor-select" className="block text-sm font-medium text-gray-700 mb-1">
            Sensor Type
          </label>
          <select
            id="sensor-select"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value as SensorType)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            {(Object.keys(historicalData) as SensorType[]).map((type) => (
              <option key={type} value={type}>
                {getSensorName(type)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <div className="flex space-x-1">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '24h'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '7d'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '30d'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30d
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="card p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {getSensorName(selectedSensor)} History - {timeRange === '24h' ? 'Last 24 Hours' : timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
        </h2>
        
        <LineChart
          data={getFilteredData()}
          label={getSensorName(selectedSensor)}
          color={chartColors[selectedSensor]}
          thresholdMin={thresholds[selectedSensor].min}
          thresholdMax={thresholds[selectedSensor].max}
          unit={historicalData[selectedSensor][0]?.unit || ''}
          timeFormat={timeRange === '24h' ? 'hour' : 'day'}
        />
      </div>
      
      {/* Statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard
          title="Average"
          value={calculateAverage(getFilteredData()).toFixed(1)}
          unit={historicalData[selectedSensor][0]?.unit || ''}
        />
        <StatCard
          title="Maximum"
          value={calculateMax(getFilteredData()).toFixed(1)}
          unit={historicalData[selectedSensor][0]?.unit || ''}
        />
        <StatCard
          title="Minimum"
          value={calculateMin(getFilteredData()).toFixed(1)}
          unit={historicalData[selectedSensor][0]?.unit || ''}
        />
      </div>
    </div>
  );
};

// Helper functions for calculations
const calculateAverage = (data: Array<{ value: number }>) => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + item.value, 0);
  return sum / data.length;
};

const calculateMax = (data: Array<{ value: number }>) => {
  if (data.length === 0) return 0;
  return Math.max(...data.map(item => item.value));
};

const calculateMin = (data: Array<{ value: number }>) => {
  if (data.length === 0) return 0;
  return Math.min(...data.map(item => item.value));
};

// StatCard component for displaying statistics
const StatCard: React.FC<{ title: string; value: string; unit: string }> = ({
  title,
  value,
  unit,
}) => {
  return (
    <div className="card px-4 py-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  );
};

export default HistoricalData;
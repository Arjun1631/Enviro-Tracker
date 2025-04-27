import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SensorCard from '../components/SensorCard';
import LineChart from '../components/LineChart';
import { SensorType } from '../utils/dataGenerator';

const Dashboard: React.FC = () => {
  const { currentData, historicalData, thresholds } = useData();
  const [selectedSensor, setSelectedSensor] = useState<SensorType | null>(null);
  
  // Get the previous data point for comparison
  const getPreviousData = (type: SensorType) => {
    const data = historicalData[type];
    if (data.length < 2) return null;
    return data[data.length - 2];
  };
  
  // Chart colors for different sensor types
  const chartColors = {
    temperature: '#ef4444', // Red
    humidity: '#3b82f6', // Blue
    airQuality: '#f59e0b', // Amber
    soilQuality: '#10b981', // Green
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Monitoring environmental metrics in real time.
        </p>
      </div>
      
      {/* Sensor cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {(Object.keys(currentData) as SensorType[]).map((type) => (
          <SensorCard
            key={type}
            type={type}
            data={currentData[type]}
            previousData={getPreviousData(type)}
            threshold={thresholds[type]}
            onClick={() => setSelectedSensor(selectedSensor === type ? null : type)}
            expanded={selectedSensor === type}
          />
        ))}
      </div>
      
      {/* Chart section */}
      <div className="card p-5">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Real-Time Monitoring
          </h2>
          <p className="text-sm text-gray-600">
            Last 24 hours of sensor data
          </p>
        </div>
        
        {selectedSensor ? (
          <LineChart
            data={historicalData[selectedSensor].slice(-24)} // Last 24 data points
            label={selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)}
            color={chartColors[selectedSensor]}
            thresholdMin={thresholds[selectedSensor].min}
            thresholdMax={thresholds[selectedSensor].max}
            unit={currentData[selectedSensor].unit}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-center">
              Select a sensor card above to view detailed data charts
            </p>
          </div>
        )}
      </div>
      
      {/* System status */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-4 py-2 bg-green-50 text-green-700 rounded-md">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-slow"></div>
            <span className="font-medium">System operating normally</span>
          </div>
          <div className="text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
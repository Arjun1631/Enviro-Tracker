import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sprout,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { SensorData, SensorType, formatSensorValue, getSensorStatus, getStatusColor } from '../utils/dataGenerator';
import { Threshold } from '../contexts/DataContext';

interface SensorCardProps {
  type: SensorType;
  data: SensorData;
  previousData?: SensorData | null;
  threshold: Threshold;
  expanded?: boolean;
  onClick?: () => void;
}

const SensorCard: React.FC<SensorCardProps> = ({
  type,
  data,
  previousData,
  threshold,
  expanded = false,
  onClick,
}) => {
  const { min, max } = threshold;
  const status = getSensorStatus(data.value, min, max);
  const statusColor = getStatusColor(status);
  
  // Calculate change percentage if we have previous data
  let changePercent = 0;
  let isIncreasing = false;
  
  if (previousData) {
    const change = data.value - previousData.value;
    changePercent = Math.abs((change / previousData.value) * 100);
    isIncreasing = change > 0;
  }
  
  // Determine the icon based on sensor type
  const iconMap = {
    temperature: <Thermometer size={expanded ? 28 : 24} className="text-red-500" />,
    humidity: <Droplets size={expanded ? 28 : 24} className="text-blue-500" />,
    airQuality: <Wind size={expanded ? 28 : 24} className="text-amber-500" />,
    soilQuality: <Sprout size={expanded ? 28 : 24} className="text-green-500" />,
  };
  
  // Determine label based on sensor type
  const labelMap = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    airQuality: 'Air Quality',
    soilQuality: 'Soil Quality',
  };
  
  return (
    <div 
      className={`card ${expanded ? 'col-span-2' : ''} ${onClick ? 'cursor-pointer' : ''} transition-all duration-300 transform hover:shadow-lg animate-fade-in`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${statusColor}-100`}>
            {iconMap[type]}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-800">{labelMap[type]}</h3>
            <div className="mt-1 flex items-center">
              <span className="text-2xl font-bold text-gray-900">{formatSensorValue(data)}</span>
              
              {previousData && (
                <div className={`ml-2 flex items-center text-sm ${isIncreasing ? 'text-red-500' : 'text-green-500'}`}>
                  {isIncreasing ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  <span>{changePercent.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded text-xs font-medium text-${statusColor}-800 bg-${statusColor}-100`}>
          {status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'Critical'}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Threshold Range</p>
              <p className="font-medium">
                {min} - {max} {data.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">
                {data.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center">
                <Activity size={16} className={`mr-1 text-${statusColor}-500`} />
                <p className={`font-medium text-${statusColor}-600`}>
                  {status === 'normal' 
                    ? 'Within range' 
                    : status === 'warning' 
                    ? 'Outside threshold' 
                    : 'Critical level'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorCard;
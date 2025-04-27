import React from 'react';
import { Alert } from '../contexts/DataContext';
import { formatSensorValue } from '../utils/dataGenerator';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sprout,
  CheckCircle
} from 'lucide-react';

interface AlertItemProps {
  alert: Alert;
  onMarkAsRead: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onMarkAsRead }) => {
  const { id, sensorType, value, expectedRange, timestamp, read } = alert;
  
  // Determine the icon based on sensor type
  const iconMap = {
    temperature: <Thermometer size={20} className="text-red-500" />,
    humidity: <Droplets size={20} className="text-blue-500" />,
    airQuality: <Wind size={20} className="text-amber-500" />,
    soilQuality: <Sprout size={20} className="text-green-500" />,
  };
  
  // Determine label based on sensor type
  const labelMap = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    airQuality: 'Air Quality',
    soilQuality: 'Soil Quality',
  };
  
  const formattedDate = new Date(timestamp).toLocaleString();
  
  return (
    <div className={`card mb-3 transition-colors ${!read ? 'border-l-4 border-l-amber-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="mr-3">
            {iconMap[sensorType]}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Abnormal {labelMap[sensorType]} Detected
            </h3>
            <p className="text-sm text-gray-500">
              {formattedDate}
            </p>
          </div>
        </div>
        {!read && (
          <button 
            onClick={() => onMarkAsRead(id)}
            className="text-teal-600 hover:text-teal-700 flex items-center text-sm"
            aria-label="Mark as read"
          >
            <CheckCircle size={16} className="mr-1" />
            Mark as read
          </button>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Detected Value</p>
          <p className="font-medium">{value.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expected Range</p>
          <p className="font-medium">{expectedRange}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
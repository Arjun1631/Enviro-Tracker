import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateSensorData, SensorData, SensorType } from '../utils/dataGenerator';
import { addMinutes, subDays } from 'date-fns';

interface DataContextType {
  currentData: Record<SensorType, SensorData>;
  historicalData: Record<SensorType, SensorData[]>;
  alerts: Alert[];
  accuracy: AccuracyMetrics;
  thresholds: Record<SensorType, Threshold>;
  updateThreshold: (type: SensorType, min: number, max: number) => void;
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;
}

export interface Alert {
  id: string;
  timestamp: Date;
  sensorType: SensorType;
  value: number;
  expectedRange: string;
  read: boolean;
}

export interface Threshold {
  min: number;
  max: number;
}

export interface AccuracyMetrics {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

const defaultThresholds: Record<SensorType, Threshold> = {
  temperature: { min: 18, max: 30 },
  humidity: { min: 30, max: 60 },
  airQuality: { min: 0, max: 50 },
  soilQuality: { min: 40, max: 80 },
};

const initialAccuracyMetrics: AccuracyMetrics = {
  truePositives: 85,
  falsePositives: 12,
  trueNegatives: 145,
  falseNegatives: 8,
  accuracy: 0.92,
  precision: 0.88,
  recall: 0.91,
  f1Score: 0.89,
};

const DataContext = createContext<DataContextType>({
  currentData: {
    temperature: { value: 0, unit: '°C', timestamp: new Date() },
    humidity: { value: 0, unit: '%', timestamp: new Date() },
    airQuality: { value: 0, unit: 'AQI', timestamp: new Date() },
    soilQuality: { value: 0, unit: 'SQI', timestamp: new Date() },
  },
  historicalData: {
    temperature: [],
    humidity: [],
    airQuality: [],
    soilQuality: [],
  },
  alerts: [],
  accuracy: initialAccuracyMetrics,
  thresholds: defaultThresholds,
  updateThreshold: () => {},
  markAlertAsRead: () => {},
  clearAllAlerts: () => {},
});

export const useData = () => useContext(DataContext);

const generateHistoricalData = (sensorType: SensorType): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  const startDate = subDays(now, 7);
  
  let currentDate = startDate;
  while (currentDate <= now) {
    data.push(generateSensorData(sensorType, currentDate));
    currentDate = addMinutes(currentDate, 60);
  }
  
  return data;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentData, setCurrentData] = useState<Record<SensorType, SensorData>>({
    temperature: generateSensorData('temperature'),
    humidity: generateSensorData('humidity'),
    airQuality: generateSensorData('airQuality'),
    soilQuality: generateSensorData('soilQuality'),
  });

  const [historicalData, setHistoricalData] = useState<Record<SensorType, SensorData[]>>({
    temperature: generateHistoricalData('temperature'),
    humidity: generateHistoricalData('humidity'),
    airQuality: generateHistoricalData('airQuality'),
    soilQuality: generateHistoricalData('soilQuality'),
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [thresholds, setThresholds] = useState<Record<SensorType, Threshold>>(defaultThresholds);
  const [accuracy, setAccuracy] = useState<AccuracyMetrics>(initialAccuracyMetrics);

  const sendEmailAlert = async (sensorType: SensorType, value: number, expectedRange: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          sensorType,
          value,
          expectedRange,
          timestamp: new Date().toLocaleString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send alert email: ${errorText}`);
      }

      const data = await response.json();
      console.log('Alert email sent successfully:', data);
    } catch (error) {
      console.error('Error sending alert email:', error);
      // Continue execution even if email fails - don't block the alert creation
    }
  };

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const newCurrentData = {
        temperature: generateSensorData('temperature'),
        humidity: generateSensorData('humidity'),
        airQuality: generateSensorData('airQuality'),
        soilQuality: generateSensorData('soilQuality'),
      };
      
      setCurrentData(newCurrentData);
      
      setHistoricalData(prev => {
        const updated = { ...prev };
        Object.entries(newCurrentData).forEach(([key, value]) => {
          const sensorType = key as SensorType;
          updated[sensorType] = [...prev[sensorType], value];
        });
        return updated;
      });
      
      Object.entries(newCurrentData).forEach(([key, data]) => {
        const sensorType = key as SensorType;
        const { min, max } = thresholds[sensorType];
        
        if (data.value < min || data.value > max) {
          const newAlert: Alert = {
            id: Math.random().toString(36).substring(2, 11),
            timestamp: new Date(),
            sensorType,
            value: data.value,
            expectedRange: `${min}-${max} ${data.unit}`,
            read: false,
          };
          
          setAlerts(prev => [newAlert, ...prev].slice(0, 20));
          
          // Don't await the email sending - let it happen in the background
          sendEmailAlert(sensorType, data.value, `${min}-${max} ${data.unit}`);
          
          setAccuracy(prev => {
            const isRealAnomaly = Math.random() > 0.1;
            
            if (isRealAnomaly) {
              return {
                ...prev,
                truePositives: prev.truePositives + 1,
                accuracy: ((prev.truePositives + 1) + prev.trueNegatives) / 
                          ((prev.truePositives + 1) + prev.falsePositives + prev.trueNegatives + prev.falseNegatives),
                precision: (prev.truePositives + 1) / ((prev.truePositives + 1) + prev.falsePositives),
                recall: (prev.truePositives + 1) / ((prev.truePositives + 1) + prev.falseNegatives),
                f1Score: 2 * ((prev.precision * prev.recall) / (prev.precision + prev.recall)),
              };
            } else {
              return {
                ...prev,
                falsePositives: prev.falsePositives + 1,
                accuracy: (prev.truePositives + prev.trueNegatives) / 
                          (prev.truePositives + (prev.falsePositives + 1) + prev.trueNegatives + prev.falseNegatives),
                precision: prev.truePositives / (prev.truePositives + (prev.falsePositives + 1)),
                recall: prev.recall,
                f1Score: 2 * ((prev.precision * prev.recall) / (prev.precision + prev.recall)),
              };
            }
          });
        }
      });
    }, 10000);
    
    return () => clearInterval(updateInterval);
  }, [thresholds]);

  const updateThreshold = (type: SensorType, min: number, max: number) => {
    setThresholds(prev => ({
      ...prev,
      [type]: { min, max },
    }));
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <DataContext.Provider 
      value={{ 
        currentData, 
        historicalData, 
        alerts, 
        accuracy, 
        thresholds, 
        updateThreshold,
        markAlertAsRead,
        clearAllAlerts
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
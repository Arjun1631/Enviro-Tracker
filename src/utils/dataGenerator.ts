import { faker } from '@faker-js/faker';

export type SensorType = 'temperature' | 'humidity' | 'airQuality' | 'soilQuality';

export interface SensorData {
  value: number;
  unit: string;
  timestamp: Date;
}

// Sensor value ranges
const sensorRanges = {
  temperature: { min: 15, max: 35, unit: '°C' },
  humidity: { min: 20, max: 80, unit: '%' },
  airQuality: { min: 0, max: 150, unit: 'AQI' },
  soilQuality: { min: 30, max: 90, unit: 'SQI' },
};

// Function to generate random sensor data
export const generateSensorData = (
  sensorType: SensorType,
  timestamp = new Date()
): SensorData => {
  const range = sensorRanges[sensorType];
  
  // Generate a somewhat realistic value (not completely random)
  // This creates more realistic data patterns
  const value = faker.number.float({
    min: range.min,
    max: range.max,
    multipleOf: 0.1,
  });
  
  return {
    value,
    unit: range.unit,
    timestamp,
  };
};

// Function to format a sensor value with the appropriate unit
export const formatSensorValue = (data: SensorData): string => {
  return `${data.value.toFixed(1)} ${data.unit}`;
};

// Get a descriptive name for the sensor type
export const getSensorName = (type: SensorType): string => {
  const names = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    airQuality: 'Air Quality',
    soilQuality: 'Soil Quality',
  };
  return names[type];
};

// Get an icon name for a sensor type (for use with Lucide icons)
export const getSensorIcon = (type: SensorType): string => {
  const icons = {
    temperature: 'Thermometer',
    humidity: 'Droplets',
    airQuality: 'Wind',
    soilQuality: 'Sprout',
  };
  return icons[type];
};

// Get status based on value and thresholds
export const getSensorStatus = (
  value: number,
  min: number,
  max: number
): 'normal' | 'warning' | 'critical' => {
  if (value < min * 0.8 || value > max * 1.2) {
    return 'critical';
  } else if (value < min || value > max) {
    return 'warning';
  }
  return 'normal';
};

// Get status color for UI
export const getStatusColor = (status: 'normal' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'normal':
      return 'green';
    case 'warning':
      return 'amber';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
};
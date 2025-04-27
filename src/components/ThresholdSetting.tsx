import React, { useState } from 'react';
import { SensorType, getSensorName } from '../utils/dataGenerator';
import { Threshold } from '../contexts/DataContext';

interface ThresholdSettingProps {
  sensorType: SensorType;
  threshold: Threshold;
  unit: string;
  onUpdate: (type: SensorType, min: number, max: number) => void;
}

const ThresholdSetting: React.FC<ThresholdSettingProps> = ({
  sensorType,
  threshold,
  unit,
  onUpdate,
}) => {
  const [min, setMin] = useState<number>(threshold.min);
  const [max, setMax] = useState<number>(threshold.max);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (min >= max) {
      alert('Minimum value must be less than maximum value');
      return;
    }
    
    onUpdate(sensorType, min, max);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMin(threshold.min);
    setMax(threshold.max);
    setIsEditing(false);
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{getSensorName(sensorType)}</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline text-sm px-3 py-1"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor={`${sensorType}-min`} className="label">
                Minimum Value
              </label>
              <input
                id={`${sensorType}-min`}
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="input"
                step="0.1"
                required
              />
            </div>
            <div>
              <label htmlFor={`${sensorType}-max`} className="label">
                Maximum Value
              </label>
              <input
                id={`${sensorType}-max`}
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="input"
                step="0.1"
                required
              />
            </div>
          </div>
          <div className="flex space-x-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Threshold Range</p>
            <p className="font-medium">
              {threshold.min} - {threshold.max} {unit}
            </p>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
            Active
          </div>
        </div>
      )}
    </div>
  );
};

export default ThresholdSetting;
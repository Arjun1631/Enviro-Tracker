import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import ThresholdSetting from '../components/ThresholdSetting';
import { SensorType } from '../utils/dataGenerator';
import { User, Mail, Bell, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  const { thresholds, updateThreshold, currentData } = useData();
  const { user } = useAuth();
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Configure system preferences and alert thresholds.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - User settings */}
        <div className="lg:col-span-1">
          <div className="card p-5 mb-6">
            <div className="flex items-center mb-4">
              <User size={20} className="text-teal-600 mr-2" />
              <h2 className="text-lg font-medium">User Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input 
                  type="text" 
                  value={user?.name || ''}
                  readOnly
                  className="input bg-gray-50" 
                />
              </div>
              
              <div>
                <label className="label">Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  readOnly
                  className="input bg-gray-50" 
                />
              </div>
            </div>
          </div>
          
          <div className="card p-5 mb-6">
            <div className="flex items-center mb-4">
              <Mail size={20} className="text-blue-600 mr-2" />
              <h2 className="text-lg font-medium">Email Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alert Emails</p>
                  <p className="text-sm text-gray-500">Receive emails for abnormal readings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-gray-500">Receive daily reports</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={false} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="card p-5">
            <div className="flex items-center mb-4">
              <Shield size={20} className="text-green-600 mr-2" />
              <h2 className="text-lg font-medium">System Status</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">System Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Last Update</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-green-600 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-slow"></span>
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Alert thresholds */}
        <div className="lg:col-span-2">
          <div className="card p-5 mb-6">
            <div className="flex items-center mb-4">
              <Bell size={20} className="text-amber-600 mr-2" />
              <h2 className="text-lg font-medium">Alert Thresholds</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Configure thresholds for each sensor. Alerts will be triggered when values go outside these ranges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(thresholds) as SensorType[]).map((type) => (
                <ThresholdSetting
                  key={type}
                  sensorType={type}
                  threshold={thresholds[type]}
                  unit={currentData[type].unit}
                  onUpdate={updateThreshold}
                />
              ))}
            </div>
          </div>
          
          <div className="card p-5">
            <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              
              <div>
                <label className="label">Alert Frequency</label>
                <select className="input">
                  <option>Immediately</option>
                  <option>Every hour</option>
                  <option>Daily summary</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  How often should alerts be sent for persistent issues
                </p>
              </div>
              
              <div>
                <label className="label">Alert Priority</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="priority" checked className="mr-2" />
                    <span>All alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="priority" className="mr-2" />
                    <span>Critical only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
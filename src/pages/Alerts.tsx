import React from 'react';
import { useData } from '../contexts/DataContext';
import AlertItem from '../components/AlertItem';
import { Bell, BellOff, Trash2 } from 'lucide-react';

const Alerts: React.FC = () => {
  const { alerts, markAlertAsRead, clearAllAlerts } = useData();
  
  const unreadAlerts = alerts.filter(alert => !alert.read);
  const readAlerts = alerts.filter(alert => alert.read);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600">
            Notifications of abnormal environmental conditions.
          </p>
        </div>
        
        {alerts.length > 0 && (
          <button
            onClick={clearAllAlerts}
            className="btn btn-outline flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Clear All
          </button>
        )}
      </div>
      
      {/* Unread alerts section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Bell size={20} className="text-amber-500 mr-2" />
          <h2 className="text-lg font-medium">Unread Alerts</h2>
          {unreadAlerts.length > 0 && (
            <span className="ml-2 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unreadAlerts.length}
            </span>
          )}
        </div>
        
        {unreadAlerts.length > 0 ? (
          <div>
            {unreadAlerts.map(alert => (
              <AlertItem 
                key={alert.id} 
                alert={alert} 
                onMarkAsRead={markAlertAsRead} 
              />
            ))}
          </div>
        ) : (
          <div className="card p-5 text-center text-gray-500">
            <p>No unread alerts.</p>
          </div>
        )}
      </div>
      
      {/* Read alerts section */}
      <div>
        <div className="flex items-center mb-3">
          <BellOff size={20} className="text-gray-500 mr-2" />
          <h2 className="text-lg font-medium">Read Alerts</h2>
          {readAlerts.length > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {readAlerts.length}
            </span>
          )}
        </div>
        
        {readAlerts.length > 0 ? (
          <div>
            {readAlerts.map(alert => (
              <AlertItem 
                key={alert.id} 
                alert={alert} 
                onMarkAsRead={markAlertAsRead} 
              />
            ))}
          </div>
        ) : (
          <div className="card p-5 text-center text-gray-500">
            <p>No read alerts.</p>
          </div>
        )}
      </div>
      
      {/* Email notification preview */}
      {alerts.length > 0 && (
        <div className="mt-8 card p-5 border-l-4 border-l-blue-500">
          <h3 className="text-lg font-medium mb-3">Email Alert Example</h3>
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <p className="font-medium">Subject: ⚠️ Alert: Abnormal {alerts[0].sensorType} Detected</p>
            <div className="mt-3 pl-3 border-l-2 border-l-gray-300">
              <p>Hi User,</p>
              <p className="mt-2">An unusual {alerts[0].sensorType} level was detected at {new Date(alerts[0].timestamp).toLocaleString()}.</p>
              <p className="mt-2">📍 Value Detected: {alerts[0].value.toFixed(1)}<br />
              📊 Expected Range: {alerts[0].expectedRange}</p>
              <p className="mt-2">Please take necessary action.</p>
              <p className="mt-2">- EnviroTrack AI Monitoring System</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
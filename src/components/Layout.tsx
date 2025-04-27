import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  LayoutDashboard, 
  History, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  Bell,
  X
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { alerts } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const unreadAlerts = alerts.filter(alert => !alert.read).length;

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Historical Data', path: '/historical', icon: <History size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <AlertTriangle size={20} /> },
    { name: 'Accuracy Matrix', path: '/accuracy', icon: <BarChart3 size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setNotificationsOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for large screens */}
      <aside className={`bg-white border-r border-gray-200 w-64 fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:w-64`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-teal-600">EnviroTrack</h1>
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-1"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-teal-50 text-teal-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                end={item.path === '/'}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
                {item.name === 'Alerts' && unreadAlerts > 0 && (
                  <span className="ml-auto bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                    {unreadAlerts}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          
          {/* User section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 text-teal-600">
                <User size={18} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut size={18} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={20} className="text-gray-500" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-2 lg:hidden">
              EnviroTrack
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-500" />
                {unreadAlerts > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadAlerts > 9 ? '9+' : unreadAlerts}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-30">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {alerts.length > 0 ? (
                      alerts.slice(0, 5).map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-4 border-b border-gray-100 ${!alert.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start">
                            <AlertTriangle 
                              size={18} 
                              className={`mr-3 ${
                                alert.sensorType === 'temperature' ? 'text-red-500' :
                                alert.sensorType === 'humidity' ? 'text-blue-500' :
                                alert.sensorType === 'airQuality' ? 'text-amber-500' :
                                'text-green-500'
                              }`} 
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                Abnormal {alert.sensorType} detected
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Value: {alert.value.toFixed(1)} • Expected: {alert.expectedRange}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-200">
                    <button 
                      onClick={() => navigate('/alerts')}
                      className="w-full py-2 text-sm text-center text-teal-600 hover:text-teal-700"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
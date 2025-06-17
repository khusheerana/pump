import React from 'react';
import { X, Bell, Clock, AlertTriangle } from 'lucide-react';
import { AlertData } from '../types/anomaly';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertData[];
  onAcknowledge: (alertId: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose, 
  alerts, 
  onAcknowledge 
}) => {
  if (!isOpen) return null;

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'border-l-red-500 bg-red-50';
      case 'Medium': return 'border-l-amber-500 bg-amber-50';
      case 'Low': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-800';
      case 'Medium': return 'text-amber-800';
      case 'Low': return 'text-orange-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden mt-16 mr-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unacknowledgedAlerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Unacknowledged Alerts */}
          {unacknowledgedAlerts.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">New Alerts</h3>
              <div className="space-y-3">
                {unacknowledgedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border-l-4 p-3 rounded-r-lg ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className={`w-4 h-4 ${getSeverityTextColor(alert.severity)}`} />
                          <span className={`text-sm font-medium ${getSeverityTextColor(alert.severity)}`}>
                            {alert.severity} Priority
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          {alert.pump_id}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className={`
                        mt-2 w-full px-3 py-1 rounded text-sm font-medium transition-colors
                        ${alert.severity === 'High' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : alert.severity === 'Medium'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'}
                      `}
                    >
                      Acknowledge
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acknowledged Alerts */}
          {acknowledgedAlerts.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {acknowledgedAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-gray-50 rounded-lg opacity-75"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-gray-500">
                        {alert.severity} Priority
                      </span>
                      <span className="text-xs text-green-600">✓ Acknowledged</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {alert.pump_id}
                    </p>
                    <p className="text-xs text-gray-600">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {alerts.length === 0 && (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications</p>
              <p className="text-sm text-gray-400">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
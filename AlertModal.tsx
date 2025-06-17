import React, { useEffect } from 'react';
import { X, AlertTriangle, Clock } from 'lucide-react';
import { AlertData } from '../types/anomaly';

interface AlertModalProps {
  alert: AlertData;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ alert, isOpen, onClose, onAcknowledge }) => {
  useEffect(() => {
    if (isOpen) {
      // Play alert sound (you can add an actual audio file here)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR2/LMeSwFJHfH8N2QQAoUY73w5KlMIAlPp+PwtGMcBjiR2/LNeSsFJHfH8N2QQAoUY73w5KlMIAlPp+PwtGMcBjiR2/LNeSsFJHfH8N2QQAoUY73w5KlMIAlPp+PwtGMcBjiR2/LNeSsFJHfH8N2QQAoUY73w5KlMIAlPp+PwtGMcBjiR2/LNeSsFJHfH8N2QQAoUY73w5KlMIA==');
      audio.play().catch(() => {
        // Ignore if audio play fails (browser restrictions)
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'border-red-500 bg-red-50';
      case 'Medium': return 'border-amber-500 bg-amber-50';
      case 'Low': return 'border-orange-500 bg-orange-50';
      default: return 'border-gray-500 bg-gray-50';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl border-2 ${getSeverityColor(alert.severity)} max-w-lg w-full mx-4 animate-pulse`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`w-6 h-6 ${getSeverityTextColor(alert.severity)}`} />
              <h2 className={`text-xl font-bold ${getSeverityTextColor(alert.severity)}`}>
                {alert.severity} Priority Alert
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className={`text-lg font-semibold ${getSeverityTextColor(alert.severity)} mb-2`}>
              {alert.pump_id}
            </p>
            <p className="text-gray-700 text-base">
              {alert.message}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onAcknowledge(alert.id)}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                ${alert.severity === 'High' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : alert.severity === 'Medium'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'}
              `}
            >
              Acknowledge Alert
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
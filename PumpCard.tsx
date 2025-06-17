import React from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PumpStatus } from '../types/anomaly';

interface PumpCardProps {
  pump: PumpStatus;
  isSelected: boolean;
  onClick: () => void;
}

const PumpCard: React.FC<PumpCardProps> = ({ pump, isSelected, onClick }) => {
  const getStatusIcon = () => {
    switch (pump.status) {
      case 'Normal':
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case 'Warning':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'Critical':
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (pump.status) {
      case 'Normal':
        return 'border-emerald-200 bg-emerald-50';
      case 'Warning':
        return 'border-amber-200 bg-amber-50';
      case 'Critical':
        return 'border-red-200 bg-red-50';
    }
  };

  const getHealthScoreColor = () => {
    if (pump.healthScore >= 80) return 'text-emerald-600';
    if (pump.healthScore >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div
      className={`
        border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg
        ${isSelected ? 'border-sky-500 bg-sky-50 shadow-md' : `border-gray-200 bg-white hover:border-gray-300`}
        ${pump.status !== 'Normal' ? getStatusColor() : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8 text-sky-600" />
          <h3 className="text-xl font-semibold text-gray-800">{pump.name}</h3>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Health Score</span>
          <span className={`text-lg font-bold ${getHealthScoreColor()}`}>
            {pump.healthScore}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status</span>
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${pump.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 
              pump.status === 'Warning' ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'}
          `}>
            {pump.status}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Anomalies (30d)</span>
          <span className="text-sm font-medium text-gray-800">{pump.anomalyCount}</span>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Last check: {new Date(pump.lastCheck).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PumpCard;
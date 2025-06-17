import React from 'react';
import { AlertTriangle, Clock, Wrench, TrendingUp } from 'lucide-react';
import { AnomalyData } from '../types/anomaly';

interface AnomalyExplanationProps {
  anomaly: AnomalyData;
}

const AnomalyExplanation: React.FC<AnomalyExplanationProps> = ({ anomaly }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    const iconClass = "w-5 h-5";
    switch (severity) {
      case 'High': return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case 'Medium': return <AlertTriangle className={`${iconClass} text-amber-500`} />;
      case 'Low': return <TrendingUp className={`${iconClass} text-orange-500`} />;
      default: return <AlertTriangle className={`${iconClass} text-gray-500`} />;
    }
  };

  const getExplanation = (metric: string, severity: string, value: number) => {
    const explanations = {
      temperature: {
        High: `🔴 Critical temperature spike detected! The ${metric} reached ${value}°F, which is significantly above normal operating range. This could indicate bearing failure, insufficient cooling, or mechanical issues.`,
        Medium: `🟡 Elevated temperature detected. The ${metric} reading of ${value}°F is higher than expected. This may suggest developing mechanical issues or reduced cooling efficiency.`,
        Low: `🟠 Minor temperature increase observed at ${value}°F. While not immediately concerning, this trend should be monitored for potential developing issues.`
      },
      pressure: {
        High: `🔴 Dangerous pressure levels detected! The system pressure reached ${value} PSI, which exceeds safe operating limits. Immediate shutdown may be required to prevent damage.`,
        Medium: `🟡 Abnormal pressure fluctuation detected at ${value} PSI. This could indicate seal problems, blockages, or pump wear that requires attention.`,
        Low: `🟠 Minor pressure variation observed at ${value} PSI. This is within acceptable limits but worth monitoring for trends.`
      },
      flow_rate: {
        High: `🔴 Severe flow rate anomaly detected! Flow rate of ${value} GPM is critically outside normal parameters. This could indicate major blockages or pump failure.`,
        Medium: `🟡 Unusual flow rate pattern detected at ${value} GPM. This may suggest developing blockages, impeller issues, or system restrictions.`,
        Low: `🟠 Minor flow rate variation observed at ${value} GPM. This is typically normal but worth tracking for patterns.`
      },
      vibration: {
        High: `🔴 Dangerous vibration levels detected! Vibration reading of ${value} mm/s indicates severe mechanical issues. Immediate inspection required to prevent catastrophic failure.`,
        Medium: `🟡 Elevated vibration detected at ${value} mm/s. This suggests developing mechanical problems such as misalignment, unbalance, or bearing wear.`,
        Low: `🟠 Slight vibration increase observed at ${value} mm/s. While not immediately concerning, this should be monitored for deterioration.`
      }
    };
    
    return explanations[metric as keyof typeof explanations]?.[severity as keyof typeof explanations.temperature] || 
           `Anomaly detected in ${metric} with value ${value}. Please review and assess.`;
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getSeverityColor(anomaly.severity)}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          {getSeverityIcon(anomaly.severity)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-lg font-semibold">
              {anomaly.severity} Risk Alert - {anomaly.pump_id}
            </h3>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${anomaly.severity === 'High' ? 'bg-red-100 text-red-800' : 
                anomaly.severity === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                'bg-orange-100 text-orange-800'}
            `}>
              {anomaly.severity} Priority
            </span>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            {getExplanation(anomaly.metric, anomaly.severity, anomaly.value)}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Detected: {new Date(anomaly.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Anomaly Score: {(anomaly.anomaly_score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 p-3 bg-white bg-opacity-50 rounded-md">
            <Wrench className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Recommended Action:</p>
              <p className="text-sm text-gray-600">{anomaly.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyExplanation;
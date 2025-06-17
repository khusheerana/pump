import React from 'react';
import { TrendingUp, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { AnomalyData } from '../types/anomaly';
import { subDays, isAfter } from 'date-fns';

interface SummaryMetricsProps {
  data: AnomalyData[];
  pumpId?: string;
}

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ data, pumpId }) => {
  const filteredData = pumpId ? data.filter(d => d.pump_id === pumpId) : data;
  const anomalies = filteredData.filter(d => d.anomaly === 1);
  
  // Calculate metrics for last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentAnomalies = anomalies.filter(a => 
    isAfter(new Date(a.timestamp), thirtyDaysAgo)
  );
  
  const totalAnomalies = recentAnomalies.length;
  const highSeverityCount = recentAnomalies.filter(a => a.severity === 'High').length;
  const mediumSeverityCount = recentAnomalies.filter(a => a.severity === 'Medium').length;
  const lowSeverityCount = recentAnomalies.filter(a => a.severity === 'Low').length;
  
  // Get most recent anomaly
  const mostRecentAnomaly = recentAnomalies.length > 0 
    ? recentAnomalies.reduce((latest, current) => 
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
      )
    : null;
  
  // Average anomaly score
  const avgAnomalyScore = recentAnomalies.length > 0
    ? recentAnomalies.reduce((sum, a) => sum + a.anomaly_score, 0) / recentAnomalies.length
    : 0;

  const metrics = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      title: 'Total Anomalies',
      value: totalAnomalies.toString(),
      subtitle: 'Last 30 days',
      color: 'text-gray-800'
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: 'Last Anomaly',
      value: mostRecentAnomaly 
        ? new Date(mostRecentAnomaly.timestamp).toLocaleDateString()
        : 'None',
      subtitle: mostRecentAnomaly?.severity || 'No recent anomalies',
      color: 'text-gray-800'
    },
    {
      icon: <Activity className="w-8 h-8 text-emerald-600" />,
      title: 'Avg. Score',
      value: (avgAnomalyScore * 100).toFixed(1) + '%',
      subtitle: 'Average anomaly intensity',
      color: 'text-gray-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {metric.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-sm text-gray-500 mt-1">{metric.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Severity Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Anomaly Breakdown (Last 30 Days)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{highSeverityCount}</div>
            <div className="text-sm text-red-700">High Severity</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">{mediumSeverityCount}</div>
            <div className="text-sm text-amber-700">Medium Severity</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{lowSeverityCount}</div>
            <div className="text-sm text-orange-700">Low Severity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryMetrics;
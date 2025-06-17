import { AnomalyData, PumpStatus, AlertData } from '../types/anomaly';
import { format, subDays, subHours } from 'date-fns';

// Generate realistic pump data
const generateTimeSeriesData = (pumpId: string, metric: string, days: number = 30): AnomalyData[] => {
  const data: AnomalyData[] = [];
  const now = new Date();
  
  for (let i = 0; i < days * 24; i++) {
    const timestamp = format(subHours(now, i), 'yyyy-MM-dd HH:mm:ss');
    let baseValue = 0;
    let anomalyProbability = 0.05; // 5% chance of anomaly
    
    // Different baseline values for different metrics
    switch (metric) {
      case 'temperature':
        baseValue = 75 + Math.sin(i / 12) * 5; // Daily temperature cycle
        break;
      case 'pressure':
        baseValue = 45 + Math.sin(i / 6) * 3; // Pressure variations
        break;
      case 'flow_rate':
        baseValue = 120 + Math.sin(i / 8) * 10; // Flow rate variations
        break;
      case 'vibration':
        baseValue = 2.5 + Math.random() * 0.5; // Low vibration baseline
        break;
    }
    
    // Add some random noise
    const noise = (Math.random() - 0.5) * (baseValue * 0.1);
    let value = baseValue + noise;
    
    // Introduce anomalies
    const isAnomaly = Math.random() < anomalyProbability;
    let anomaly = 0;
    let anomaly_score = 0;
    let severity: 'Low' | 'Medium' | 'High' = 'Low';
    
    if (isAnomaly) {
      anomaly = 1;
      const anomalyMultiplier = 1.5 + Math.random() * 1.5; // 1.5x to 3x normal value
      value = value * anomalyMultiplier;
      anomaly_score = Math.min(1, (anomalyMultiplier - 1) / 2);
      
      if (anomaly_score > 0.7) severity = 'High';
      else if (anomaly_score > 0.4) severity = 'Medium';
      else severity = 'Low';
    }
    
    data.push({
      id: `${pumpId}_${metric}_${i}`,
      pump_id: pumpId,
      metric,
      timestamp,
      value: Math.round(value * 100) / 100,
      anomaly,
      anomaly_score: Math.round(anomaly_score * 100) / 100,
      severity,
      recommendation: getRecommendation(metric, severity)
    });
  }
  
  return data.reverse(); // Most recent first
};

const getRecommendation = (metric: string, severity: 'Low' | 'Medium' | 'High'): string => {
  const recommendations = {
    temperature: {
      Low: 'Monitor temperature over next 24 hours',
      Medium: 'Check cooling system and schedule inspection',
      High: 'Immediate inspection required - potential overheating'
    },
    pressure: {
      Low: 'Monitor pressure readings',
      Medium: 'Check for leaks and inspect seals',
      High: 'Stop pump immediately - pressure critical'
    },
    flow_rate: {
      Low: 'Monitor flow rate trends',
      Medium: 'Check for blockages or pump efficiency',
      High: 'Investigate flow restrictions immediately'
    },
    vibration: {
      Low: 'Schedule routine vibration analysis',
      Medium: 'Inspect bearings and alignment',
      High: 'Stop pump - potential bearing failure'
    }
  };
  
  return recommendations[metric as keyof typeof recommendations]?.[severity] || 'Monitor and assess';
};

// Generate mock data for all pumps and metrics
export const generateMockData = (): AnomalyData[] => {
  const pumps = ['PUMP_1', 'PUMP_2', 'PUMP_3'];
  const metrics = ['temperature', 'pressure', 'flow_rate', 'vibration'];
  const allData: AnomalyData[] = [];
  
  pumps.forEach(pump => {
    metrics.forEach(metric => {
      allData.push(...generateTimeSeriesData(pump, metric));
    });
  });
  
  return allData;
};

export const pumpStatuses: PumpStatus[] = [
  {
    id: 'PUMP_1',
    name: 'Pump 1',
    status: 'Normal',
    healthScore: 92,
    lastCheck: format(subHours(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    anomalyCount: 2
  },
  {
    id: 'PUMP_2',
    name: 'Pump 2',
    status: 'Warning',
    healthScore: 78,
    lastCheck: format(subHours(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
    anomalyCount: 8
  },
  {
    id: 'PUMP_3',
    name: 'Pump 3',
    status: 'Critical',
    healthScore: 45,
    lastCheck: format(subHours(new Date(), 0.5), 'yyyy-MM-dd HH:mm:ss'),
    anomalyCount: 15
  }
];

export const recentAlerts: AlertData[] = [
  {
    id: 'alert_1',
    pump_id: 'PUMP_3',
    message: 'High temperature detected - potential bearing wear',
    severity: 'High',
    timestamp: format(subHours(new Date(), 0.5), 'yyyy-MM-dd HH:mm:ss'),
    acknowledged: false
  },
  {
    id: 'alert_2',
    pump_id: 'PUMP_2',
    message: 'Pressure fluctuation detected - check seals',
    severity: 'Medium',
    timestamp: format(subHours(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    acknowledged: false
  },
  {
    id: 'alert_3',
    pump_id: 'PUMP_1',
    message: 'Minor vibration increase - schedule inspection',
    severity: 'Low',
    timestamp: format(subHours(new Date(), 6), 'yyyy-MM-dd HH:mm:ss'),
    acknowledged: true
  }
];
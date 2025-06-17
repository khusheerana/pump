export interface AnomalyData {
  id: string;
  pump_id: string;
  metric: string;
  timestamp: string;
  value: number;
  anomaly: number;
  anomaly_score: number;
  severity: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface PumpStatus {
  id: string;
  name: string;
  status: 'Normal' | 'Warning' | 'Critical';
  healthScore: number;
  lastCheck: string;
  anomalyCount: number;
}

export interface AlertData {
  id: string;
  pump_id: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High';
  timestamp: string;
  acknowledged: boolean;
}
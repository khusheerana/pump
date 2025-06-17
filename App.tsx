import React, { useState, useEffect } from 'react';
import { Settings, Bell, ToggleLeft, ToggleRight, HelpCircle } from 'lucide-react';
import PumpCard from './components/PumpCard';
import AnomalyChart from './components/AnomalyChart';
import AnomalyExplanation from './components/AnomalyExplanation';
import SummaryMetrics from './components/SummaryMetrics';
import AlertModal from './components/AlertModal';
import DataTable from './components/DataTable';
import HelpModal from './components/HelpModal';
import NotificationPanel from './components/NotificationPanel';
import { generateMockData, pumpStatuses, recentAlerts } from './data/mockData';
import { AnomalyData, PumpStatus, AlertData } from './types/anomaly';

function App() {
  const [selectedPump, setSelectedPump] = useState<string>('PUMP_1');
  const [showTableView, setShowTableView] = useState(false);
  const [anomalyData, setAnomalyData] = useState<AnomalyData[]>([]);
  const [pumps, setPumps] = useState<PumpStatus[]>(pumpStatuses);
  const [alerts, setAlerts] = useState<AlertData[]>(recentAlerts);
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  useEffect(() => {
    // Generate mock data on component mount
    const data = generateMockData();
    setAnomalyData(data);
    
    // Check for unacknowledged alerts
    const unacknowledgedAlert = alerts.find(alert => !alert.acknowledged);
    if (unacknowledgedAlert) {
      setActiveAlert(unacknowledgedAlert);
      setAlertModalOpen(true);
    }
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new data updates (in real app, this would be API calls)
      // For demo purposes, we'll just update the timestamp
      const now = new Date().toISOString();
      setPumps(prevPumps => 
        prevPumps.map(pump => ({
          ...pump,
          lastCheck: now
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    setAlertModalOpen(false);
    setActiveAlert(null);
  };

  const handleNotificationClick = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  const handleHelpClick = () => {
    setHelpModalOpen(true);
  };

  const selectedPumpData = anomalyData.filter(d => d.pump_id === selectedPump);
  
  // Get today's anomalies for explanations
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todaysAnomalies = selectedPumpData.filter(d => 
    d.anomaly === 1 && d.timestamp.startsWith(todayStr)
  ).slice(0, 3);
  
  const metrics = ['temperature', 'pressure', 'flow_rate', 'vibration'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-sky-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pump Monitoring System</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Table View</span>
                <button
                  onClick={() => setShowTableView(!showTableView)}
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                >
                  {showTableView ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
              
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="text-gray-600 hover:text-gray-800 transition-colors relative"
                >
                  <Bell className="w-6 h-6" />
                  {alerts.some(alert => !alert.acknowledged) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </button>
              </div>
              
              <button 
                onClick={handleHelpClick}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Pump Monitoring Dashboard
          </h2>
          <p className="text-lg text-gray-600">
            Real-time anomaly detection and health monitoring for your industrial pumps
          </p>
        </div>

        {/* Pump Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Select a Pump to Monitor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pumps.map((pump) => (
              <PumpCard
                key={pump.id}
                pump={pump}
                isSelected={selectedPump === pump.id}
                onClick={() => setSelectedPump(pump.id)}
              />
            ))}
          </div>
        </div>

        {/* Summary Metrics */}
        <SummaryMetrics data={anomalyData} pumpId={selectedPump} />

        {showTableView ? (
          /* Data Table View */
          <DataTable data={anomalyData} pumpId={selectedPump} />
        ) : (
          /* Chart and Explanation View */
          <div className="space-y-8">
            {/* Charts */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Sensor Data Visualization - {selectedPump}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {metrics.map((metric) => (
                  <AnomalyChart
                    key={metric}
                    data={anomalyData}
                    metric={metric}
                    pumpId={selectedPump}
                  />
                ))}
              </div>
            </div>

            {/* Today's Anomaly Explanations */}
            {todaysAnomalies.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Today's Anomaly Explanations
                </h3>
                <div className="space-y-4">
                  {todaysAnomalies.map((anomaly) => (
                    <AnomalyExplanation key={anomaly.id} anomaly={anomaly} />
                  ))}
                </div>
              </div>
            )}

            {todaysAnomalies.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-emerald-600 mb-4">
                  <Settings className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Anomalies Detected Today
                </h3>
                <p className="text-gray-600">
                  {selectedPump} is running smoothly today! Check the charts above for historical data or use the table view to explore past anomalies.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Alert Modal */}
      {activeAlert && (
        <AlertModal
          alert={activeAlert}
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          onAcknowledge={handleAcknowledgeAlert}
        />
      )}

      {/* Help Modal */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        alerts={alerts}
        onAcknowledge={handleAcknowledgeAlert}
      />
    </div>
  );
}

export default App;
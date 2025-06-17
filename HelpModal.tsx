import React from 'react';
import { X, HelpCircle, AlertTriangle, Activity, BarChart3, Settings } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-bold text-gray-900">Help & Documentation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Getting Started */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-sky-600" />
              Getting Started
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>Welcome to the Pump Monitoring System! This dashboard helps you monitor your industrial pumps and detect anomalies in real-time.</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Select a pump from the pump cards to view its data</li>
                <li>Review the anomaly metrics and breakdown</li>
                <li>Examine sensor data charts for detailed analysis</li>
                <li>Read today's anomaly explanations for actionable insights</li>
                <li>Use the table view for detailed data exploration</li>
              </ol>
            </div>
          </section>

          {/* Anomaly Severity Levels */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
              Anomaly Severity Levels
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                <h4 className="font-semibold text-red-800">High Severity</h4>
                <p className="text-red-700 text-sm">Immediate attention required. May indicate equipment failure or safety risk.</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50">
                <h4 className="font-semibold text-amber-800">Medium Severity</h4>
                <p className="text-amber-700 text-sm">Schedule inspection soon. Developing issues that need monitoring.</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                <h4 className="font-semibold text-orange-800">Low Severity</h4>
                <p className="text-orange-700 text-sm">Minor deviation from normal. Monitor trends over time.</p>
              </div>
            </div>
          </section>

          {/* Chart Interpretation */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Reading the Charts
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>The sensor data charts show:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Green line:</strong> Normal sensor readings over time</li>
                <li><strong>Colored diamonds:</strong> Detected anomalies (red=high, amber=medium, orange=low)</li>
                <li><strong>Hover over points:</strong> See exact values and timestamps</li>
                <li><strong>Zoom and pan:</strong> Use chart controls to explore data in detail</li>
              </ul>
            </div>
          </section>

          {/* Sensor Types */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sensor Types Monitored</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800">Temperature (°F)</h4>
                <p className="text-sm text-gray-600">Monitors bearing and motor temperature to detect overheating</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800">Pressure (PSI)</h4>
                <p className="text-sm text-gray-600">Tracks system pressure for leaks and blockages</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800">Flow Rate (GPM)</h4>
                <p className="text-sm text-gray-600">Measures fluid flow to detect pump efficiency issues</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800">Vibration (mm/s)</h4>
                <p className="text-sm text-gray-600">Detects mechanical issues like misalignment or bearing wear</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">How often is data updated?</h4>
                <p className="text-gray-600 text-sm">Data is updated every 30 seconds with real-time sensor readings.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">What should I do when I see a high severity anomaly?</h4>
                <p className="text-gray-600 text-sm">Follow the recommended action in the anomaly explanation. For high severity, consider immediate inspection or shutdown if safety is at risk.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Can I export the data?</h4>
                <p className="text-gray-600 text-sm">Yes! Use the table view and click "Export CSV" to download anomaly data for further analysis.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">How do I acknowledge alerts?</h4>
                <p className="text-gray-600 text-sm">Click the bell icon to view alerts, then click "Acknowledge" on each alert to mark it as seen.</p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">Need additional help? Contact support at <a href="mailto:support@pumpmonitoring.com" className="text-sky-600 hover:text-sky-700">support@pumpmonitoring.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
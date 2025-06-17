import React from 'react';
import Plot from 'react-plotly.js';
import { AnomalyData } from '../types/anomaly';

interface AnomalyChartProps {
  data: AnomalyData[];
  metric: string;
  pumpId: string;
}

const AnomalyChart: React.FC<AnomalyChartProps> = ({ data, metric, pumpId }) => {
  // Filter data for the specific metric
  const filteredData = data.filter(d => d.metric === metric && d.pump_id === pumpId);
  
  // Separate normal and anomalous data
  const normalData = filteredData.filter(d => d.anomaly === 0);
  const anomalyData = filteredData.filter(d => d.anomaly === 1);
  
  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'temperature': return '°F';
      case 'pressure': return 'PSI';
      case 'flow_rate': return 'GPM';
      case 'vibration': return 'mm/s';
      default: return '';
    }
  };

  const traces = [
    {
      x: normalData.map(d => d.timestamp),
      y: normalData.map(d => d.value),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'Normal',
      line: { color: '#10B981', width: 2 },
      marker: { size: 4, color: '#10B981' },
      hovertemplate: '<b>%{x}</b><br>Value: %{y} ' + getMetricUnit(metric) + '<br>Status: Normal<extra></extra>',
    }
  ];

  if (anomalyData.length > 0) {
    traces.push({
      x: anomalyData.map(d => d.timestamp),
      y: anomalyData.map(d => d.value),
      type: 'scatter' as const,
      mode: 'markers' as const,
      name: 'Anomalies',
      marker: { 
        size: 10, 
        color: anomalyData.map(d => {
          switch(d.severity) {
            case 'High': return '#EF4444';
            case 'Medium': return '#F59E0B';
            case 'Low': return '#F97316';
            default: return '#EF4444';
          }
        }),
        symbol: 'diamond',
        line: { width: 2, color: 'white' }
      },
      hovertemplate: '<b>%{x}</b><br>Value: %{y} ' + getMetricUnit(metric) + 
                   '<br>Anomaly Score: %{customdata}<br>Status: Anomaly<extra></extra>',
      customdata: anomalyData.map(d => d.anomaly_score.toFixed(2)),
    });
  }

  const layout = {
    title: {
      text: `${metric.replace('_', ' ')} - ${pumpId}`,
      font: { size: 18, color: '#1F2937' }
    },
    xaxis: {
      title: 'Time',
      type: 'date' as const,
      showgrid: true,
      gridcolor: '#E5E7EB'
    },
    yaxis: {
      title: `${metric.replace('_', ' ')} (${getMetricUnit(metric)})`,
      showgrid: true,
      gridcolor: '#E5E7EB'
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: { family: 'Inter, system-ui, sans-serif' },
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)'
    },
    margin: { l: 60, r: 20, t: 50, b: 50 },
    hovermode: 'closest' as const
  };

  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    responsive: true
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Plot
        data={traces}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};

export default AnomalyChart;
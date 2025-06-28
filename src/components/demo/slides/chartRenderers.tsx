
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts';
import { DataScenario, ChartData } from '../types';

interface ChartRendererProps {
  chartData: ChartData;
  scenario: DataScenario;
}

export const renderChart = ({ chartData, scenario }: ChartRendererProps) => {
  if (!chartData) return null;

  const commonProps = {
    data: chartData,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  const tooltipStyle = {
    backgroundColor: '#FAFAFB',
    border: '1px solid #e2e8f0',
    borderRadius: '8px'
  };

  switch (scenario.chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#3A3D4D" fontSize={12} />
            <YAxis stroke="#3A3D4D" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill="#5A2EFF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#30F2B3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" stroke="#3A3D4D" fontSize={12} />
            <YAxis stroke="#3A3D4D" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="conversions" stroke="#30F2B3" strokeWidth={3} dot={{ fill: '#30F2B3', strokeWidth: 2, r: 6 }} />
            <Line type="monotone" dataKey="clicks" stroke="#5A2EFF" strokeWidth={2} dot={{ fill: '#5A2EFF', strokeWidth: 2, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" stroke="#3A3D4D" fontSize={12} />
            <YAxis stroke="#3A3D4D" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="actual" stackId="1" stroke="#5A2EFF" fill="#5A2EFF" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      );
    
    default:
      return null;
  }
};

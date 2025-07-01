import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SlideChartProps {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: string;
}

export const SlideChart = (props: any) => {
  const { type, title, data } = props;
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    parsedData = [{ name: 'Error', value: 0 }];
  }

  const colors = ['hsl(var(--electric-indigo))', 'hsl(var(--neon-mint))', 'hsl(var(--soft-coral))', '#8884d8', '#82ca9d'];

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--electric-indigo))" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--electric-indigo))" strokeWidth={2} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={parsedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {parsedData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--electric-indigo))" fill="hsl(var(--electric-indigo) / 0.3)" />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-gray mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
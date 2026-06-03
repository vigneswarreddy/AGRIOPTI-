import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomPieChart = ({ products = [] }) => {
  // Group products by type and calculate total sales per type
  const typeMap = products.reduce((acc, p) => {
    const type = p.productType || 'Other';
    acc[type] = (acc[type] || 0) + (p.sale || 0);
    return acc;
  }, {});

  const data = Object.keys(typeMap).map(name => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: typeMap[name]
  })).filter(d => d.value > 0);

  // Fallback if no sales data
  const chartData = data.length > 0 ? data : [{ name: 'No Sales Yet', value: 1 }];

  const total = chartData.reduce((acc, entry) => acc + entry.value, 0);
  const dataWithPercentage = chartData.map(entry => ({
    ...entry,
    percentage: data.length > 0 ? ((entry.value / total) * 100).toFixed(1) + '%' : '0%'
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={8}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={data.length > 0 ? COLORS[index % COLORS.length] : '#f3f4f6'} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;

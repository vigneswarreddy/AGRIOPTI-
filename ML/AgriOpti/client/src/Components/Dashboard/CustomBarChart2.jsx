import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomBarChart2 = ({ products = [] }) => {
  const data = products.map(product => ({
    name: product.name,
    sale: product.sale || 0,
    price: product.price || 0,
    stock: product.stock || 0,
    revenue: (product.sale || 0) * (product.price || 0),
  })).slice(0, 8); // Limit to top 8 for readability

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          interval={0}
          angle={-15}
          textAnchor="end"
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#9ca3af' }}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
        <Bar dataKey="sale" radius={[4, 4, 0, 0]} barSize={20} fill="#10b981" />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={20} fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart2;

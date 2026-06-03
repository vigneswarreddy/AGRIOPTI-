import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 300, pv: 2400, amt: 2400 },
  { name: 'Mar', uv: 200, pv: 2400, amt: 2400 },
  { name: 'Apr', uv: 278, pv: 2400, amt: 2400 },
  { name: 'May', uv: 189, pv: 2400, amt: 2400 },
  { name: 'Jun', uv: 239, pv: 2400, amt: 2400 },
];

const CustomLineChart = () => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF'];

const CustomPieChart2 = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from backend
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/survey/user/${user._id}`); // Adjust endpoint as per your backend setup

        // Extract data fields from response
        const { nitrogen, phosphorus, potassium, calcium, magnesium, sulphur, phValue } = response.data.surveys[0];
        console.log(response.data)

        // Prepare chart data
        const chartData = [
          { name: 'Nitrogen', value: nitrogen },
          { name: 'Phosphorus', value: phosphorus },
          { name: 'Potassium', value: potassium },
          { name: 'Calcium', value: calcium },
          { name: 'Magnesium', value: magnesium },
          { name: 'Sulphur', value: sulphur },
          { name: 'pH Value', value: phValue },
        ];

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const total = data.reduce((acc, entry) => acc + entry.value, 0);
  const dataWithPercentage = data.map(entry => ({
    ...entry,
    percentage: ((entry.value / total) * 100).toFixed(2) + '%'
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="40%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percentage }) => `${name}: ${percentage}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart2;

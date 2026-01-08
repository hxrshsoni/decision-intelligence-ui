import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';

const RevenueChart = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd')
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Trends</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#888" 
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#888" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value) => `$${value.toFixed(2)}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            fillOpacity={1}
            fill="url(#colorIncome)"
            name="Income"
          />
          <Area 
            type="monotone" 
            dataKey="expense" 
            stroke="#ef4444" 
            fillOpacity={1}
            fill="url(#colorExpense)"
            name="Expenses"
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="#6366f1" 
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Net Cash Flow"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

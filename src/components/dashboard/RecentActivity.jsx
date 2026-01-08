import React from 'react';
import { format, parseISO } from 'date-fns';

const RecentActivity = ({ transactions }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍔',
      transport: '🚗',
      shopping: '🛍️',
      entertainment: '🎬',
      utilities: '💡',
      healthcare: '🏥',
      education: '📚',
      salary: '💰',
      freelance: '💼',
      investment: '📈'
    };
    return icons[category?.toLowerCase()] || '💳';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((transaction, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {transaction.description || transaction.category}
                </p>
                <p className="text-sm text-gray-500">
                  {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
              </p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {transaction.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

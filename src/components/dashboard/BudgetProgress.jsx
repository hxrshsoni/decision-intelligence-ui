import React from 'react';

const BudgetProgress = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Budget vs Actual</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (parseFloat(item.actual) / parseFloat(item.budget)) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {item.category}
                </span>
                <span className="text-sm text-gray-500">
                  ${parseFloat(item.actual).toFixed(2)} / ${parseFloat(item.budget).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {percentage.toFixed(1)}% used
                </span>
                <span className={`${isOverBudget ? 'text-red-600' : 'text-gray-500'}`}>
                  ${Math.abs(parseFloat(item.remaining)).toFixed(2)} {isOverBudget ? 'over' : 'remaining'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;

import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    teal: 'from-teal-500 to-teal-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white text-opacity-90 text-sm font-medium mb-1">
              {title}
            </p>
            <h3 className="text-white text-3xl font-bold">
              {value}
            </h3>
            {subtitle && (
              <p className="text-white text-opacity-80 text-sm mt-2">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-white text-opacity-20 text-5xl">
              {icon}
            </div>
          )}
        </div>
      </div>
      {trend && (
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center text-sm">
            <span className={`font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;

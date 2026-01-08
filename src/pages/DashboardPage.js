import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetricCard from '../components/dashboard/MetricCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import SpendingChart from '../components/dashboard/SpendingChart';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import RecentActivity from '../components/dashboard/RecentActivity';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [metricsRes, trendsRes, spendingRes, budgetRes, transactionsRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/key-metrics`, config),
        axios.get(`${API_URL}/api/analytics/revenue-trends?period=${period}`, config),
        axios.get(`${API_URL}/api/analytics/spending-by-category?period=${period}`, config),
        axios.get(`${API_URL}/api/analytics/budget-vs-actual`, config),
        axios.get(`${API_URL}/api/analytics/recent-transactions?limit=10`, config)
      ]);

      setMetrics(metricsRes.data.data);
      setRevenueTrends(trendsRes.data.data);
      setSpendingData(spendingRes.data.data);
      setBudgetData(budgetRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Your financial overview at a glance</p>
        
        {/* Period Selector */}
        <div className="mt-4 flex space-x-2">
          {['7', '30', '90', '365'].map(days => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {days === '7' ? '7 Days' : days === '30' ? '30 Days' : days === '90' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Income"
            value={`$${metrics.income.toFixed(2)}`}
            subtitle="Last 30 days"
            icon="💰"
            color="green"
          />
          <MetricCard
            title="Total Expenses"
            value={`$${metrics.expenses.toFixed(2)}`}
            subtitle="Last 30 days"
            icon="💸"
            color="red"
          />
          <MetricCard
            title="Net Cash Flow"
            value={`$${metrics.netCashFlow.toFixed(2)}`}
            subtitle={`${metrics.savingsRate}% savings rate`}
            icon="📊"
            color={metrics.netCashFlow >= 0 ? 'green' : 'red'}
          />
          <MetricCard
            title="Active Goals"
            value={metrics.activeGoals}
            subtitle={`${metrics.activeSubscriptions} subscriptions`}
            icon="🎯"
            color="purple"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {revenueTrends.length > 0 && <RevenueChart data={revenueTrends} />}
        {spendingData.length > 0 && <SpendingChart data={spendingData} />}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgetData.length > 0 && <BudgetProgress data={budgetData} />}
        {recentTransactions.length > 0 && <RecentActivity transactions={recentTransactions} />}
      </div>
    </div>
  );
};

export default DashboardPage;

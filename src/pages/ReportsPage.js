import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [latestReport, setLatestReport] = useState(null);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/reports/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.data) {
        setLatestReport(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching latest report:', err);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/api/reports/generate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReport(response.data.data);
      setLatestReport(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return 'High Risk';
    if (score >= 50) return 'Medium Risk';
    return 'Low Risk';
  };

  const displayReport = report || latestReport;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Financial Report</h1>
            <p className="text-gray-600">AI-powered insights and risk analysis</p>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              '🔄 Generate New Report'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Report Display */}
        {displayReport ? (
          <div className="space-y-6">
            {/* Risk Score Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Risk Score</h2>
                  <p className="text-gray-600">Overall financial health assessment</p>
                </div>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getRiskColor(displayReport.risk_score)} rounded-full w-32 h-32 flex items-center justify-center`}>
                    {displayReport.risk_score}
                  </div>
                  <p className="mt-3 font-semibold text-gray-700">
                    {getRiskLabel(displayReport.risk_score)}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            {displayReport.metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {displayReport.metrics.total_transactions || 0}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Transaction</h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${parseFloat(displayReport.metrics.avg_transaction_amount || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Amount</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    ${parseFloat(displayReport.metrics.total_amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Warnings */}
            {displayReport.warnings && displayReport.warnings.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Warnings</h3>
                <div className="space-y-3">
                  {displayReport.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
                    >
                      <p className="font-semibold text-red-800">{warning.type}</p>
                      <p className="text-red-700 text-sm mt-1">{warning.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {displayReport.opportunities && displayReport.opportunities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Opportunities</h3>
                <div className="space-y-3">
                  {displayReport.opportunities.map((opportunity, index) => (
                    <div
                      key={index}
                      className="p-4 bg-green-50 border-l-4 border-green-500 rounded"
                    >
                      <p className="font-semibold text-green-800">{opportunity.type}</p>
                      <p className="text-green-700 text-sm mt-1">{opportunity.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Date */}
            <div className="text-center text-gray-500 text-sm">
              Report generated on {new Date(displayReport.generated_at).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Report Yet</h3>
            <p className="text-gray-600 mb-6">Click "Generate New Report" to create your first financial analysis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;

import React, { useState, useEffect } from 'react';
import { reportsAPI, dataAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { AlertTriangle, TrendingUp, Database, RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const DashboardPage = () => {
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportRes, summaryRes] = await Promise.all([
        reportsAPI.getLatest(),
        dataAPI.getSummary()
      ]);
      setReport(reportRes.data.data);
      setSummary(summaryRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const response = await reportsAPI.generate();
      setReport(response.data.data);
      alert('Report generated successfully!');
    } catch (error) {
      alert('Failed to generate report: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
    }
  };

  const getSeverityColor = (band) => {
    if (band === 'healthy') return 'bg-green-100 text-green-800 border-green-300';
    if (band === 'attention') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600 mt-1">Your business intelligence at a glance</p>
              </div>
              <Button onClick={handleGenerateReport} disabled={generating}>
                <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
                {generating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>

            {/* Data Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Database size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clients</p>
                    <p className="text-2xl font-bold text-gray-800">{summary?.clients || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Engagements</p>
                    <p className="text-2xl font-bold text-gray-800">{summary?.engagements || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Database size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payments</p>
                    <p className="text-2xl font-bold text-gray-800">{summary?.payments || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Database size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Work Requests</p>
                    <p className="text-2xl font-bold text-gray-800">{summary?.workRequests || 0}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Risk Score */}
            {report ? (
              <>
                <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="text-center">
                    <p className="text-sm uppercase tracking-wide mb-2 opacity-90">Overall Risk Score</p>
                    <h2 className="text-6xl font-bold mb-2">{report.riskScore}<span className="text-3xl">/100</span></h2>
                    <p className="text-xl font-semibold">{report.severityLabel}</p>
                    <p className="text-sm opacity-80 mt-2">
                      Report generated: {new Date(report.generatedAt).toLocaleString()}
                    </p>
                  </div>
                </Card>

                {/* Warnings */}
                <Card className="mb-8" title={`⚠️ Warnings (${report.warnings.length})`}>
                  {report.warnings.length === 0 ? (
                    <p className="text-green-600 font-semibold">✅ No critical warnings this week!</p>
                  ) : (
                    <div className="space-y-4">
                      {report.warnings.map((warning, index) => (
                        <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="text-red-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-bold text-red-900 mb-1">{warning.rule_name}</h4>
                              <p className="text-sm text-red-800 mb-2">
                                <strong>Client:</strong> {warning.client_name}
                              </p>
                              <p className="text-sm text-red-700 mb-2">{warning.explanation}</p>
                              <p className="text-sm text-red-900 font-semibold">→ {warning.action}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Opportunities */}
                <Card title={`💡 Opportunities (${report.opportunities.length})`}>
                  {report.opportunities.length === 0 ? (
                    <p className="text-gray-600">No new opportunities detected this week.</p>
                  ) : (
                    <div className="space-y-4">
                      {report.opportunities.map((opp, index) => (
                        <div key={index} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                          <div className="flex items-start gap-3">
                            <TrendingUp size={20} className="text-green-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-bold text-green-900 mb-1">{opp.rule_name}</h4>
                              <p className="text-sm text-green-800 mb-2">
                                <strong>Client:</strong> {opp.client_name}
                              </p>
                              <p className="text-sm text-green-700 mb-2">{opp.explanation}</p>
                              <p className="text-sm text-green-900 font-semibold">→ {opp.action}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Report Available</h3>
                  <p className="text-gray-600 mb-6">Generate your first report to see insights</p>
                  <Button onClick={handleGenerateReport} disabled={generating}>
                    Generate Report Now
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

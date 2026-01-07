import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import Card from '../components/common/Card';
import { FileText, Calendar } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const ReportsPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await reportsAPI.getHistory();
      setHistory(response.data.data);
    } catch (error) {
      console.error('Failed to load report history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (band) => {
    if (band === 'healthy') return 'bg-green-500';
    if (band === 'attention') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600">Loading reports...</p>
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Report History</h2>
              <p className="text-gray-600 mt-1">View past weekly reports</p>
            </div>

            {history.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Reports Yet</h3>
                  <p className="text-gray-600">Generate your first report from the dashboard</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {history.map((report) => (
                  <Card key={report.reportId}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${getSeverityColor(report.severityBand)} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                          {report.riskScore}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{report.severityLabel}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Calendar size={16} />
                            <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Report ID</p>
                        <p className="font-mono text-sm text-gray-800">#{report.reportId}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;

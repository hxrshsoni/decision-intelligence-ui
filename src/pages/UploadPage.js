import React, { useState } from 'react';
import { dataAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const UploadPage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState({});

  const handleFileUpload = async (type, file) => {
    if (!file) return;

    setUploading(true);
    try {
      let response;
      if (type === 'clients') response = await dataAPI.uploadClients(file);
      if (type === 'engagements') response = await dataAPI.uploadEngagements(file);
      if (type === 'payments') response = await dataAPI.uploadPayments(file);
      if (type === 'work-requests') response = await dataAPI.uploadWorkRequests(file);

      setUploadResults(prev => ({
        ...prev,
        [type]: {
          success: true,
          message: response.data.message,
          data: response.data.data
        }
      }));
    } catch (error) {
      setUploadResults(prev => ({
        ...prev,
        [type]: {
          success: false,
          message: error.response?.data?.error || 'Upload failed'
        }
      }));
    } finally {
      setUploading(false);
    }
  };

  const UploadSection = ({ type, title, description }) => {
    const result = uploadResults[type];

    return (
      <Card className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(type, e.target.files[0])}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload CSV file</p>
            </div>
          </label>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <XCircle size={20} className="text-red-600" />
              )}
              <p className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
            </div>
            {result.data && (
              <div className="mt-2 text-sm text-gray-700">
                <p>Total rows: {result.data.totalRows}</p>
                <p>Inserted: {result.data.inserted}</p>
                <p>Skipped: {result.data.skipped}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Upload Data</h2>
              <p className="text-gray-600 mt-1">Import your business data via CSV files</p>
            </div>

            <UploadSection
              type="clients"
              title="Upload Clients"
              description="CSV with columns: name, email, contract_value, start_date, status"
            />

            <UploadSection
              type="engagements"
              title="Upload Engagements"
              description="CSV with columns: client_name, type, date, notes"
            />

            <UploadSection
              type="payments"
              title="Upload Payments"
              description="CSV with columns: client_name, amount, due_date, paid_date, status"
            />

            <UploadSection
              type="work-requests"
              title="Upload Work Requests"
              description="CSV with columns: client_name, request_type, effort_hours, revenue_generated"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadPage;

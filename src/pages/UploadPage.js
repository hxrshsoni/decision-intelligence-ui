import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState('transactions');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const uploadTypes = [
    { value: 'transactions', label: 'Transactions', icon: '💳' },
    { value: 'budgets', label: 'Budgets', icon: '💰' },
    { value: 'goals', label: 'Goals', icon: '🎯' },
    { value: 'subscriptions', label: 'Subscriptions', icon: '📱' },
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/data/upload/${uploadType}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.message || 'File uploaded successfully!');
      setFile(null);
      // Reset file input
      document.getElementById('fileInput').value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Upload Data</h1>
          <p className="text-gray-600">Import your financial data from CSV files</p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Upload Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Data Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setUploadType(type.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    uploadType === type.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                id="fileInput"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-lg font-medium text-gray-700">
                  {file ? file.name : 'Click to browse or drag and drop'}
                </span>
                <span className="text-sm text-gray-500 mt-2">CSV files only</span>
              </label>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ❌ {error}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              !file || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
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
                Uploading...
              </span>
            ) : (
              '📤 Upload File'
            )}
          </button>
        </div>

        {/* CSV Format Guide */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-3">📋 CSV Format Guide</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Transactions:</strong> amount, category, description, date, type (income/expense)</p>
            <p><strong>Budgets:</strong> category, amount, period (monthly/yearly)</p>
            <p><strong>Goals:</strong> name, target_amount, deadline, current_amount</p>
            <p><strong>Subscriptions:</strong> name, amount, billing_cycle, next_billing_date</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;

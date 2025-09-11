// API Status component to check backend connection
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'failed'
  const [error, setError] = useState('');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStatus('connected');
          setError('');
        } else {
          setStatus('failed');
          setError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        setStatus('failed');
        setError(err.message);
      }
    };

    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader className="h-4 w-4 animate-spin text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'connected':
        return 'Backend API Status ✅ Connected';
      case 'failed':
        return 'Backend API Status ❌ Connection Failed';
      default:
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {status === 'failed' && error && (
        <span className="text-xs opacity-75">
          Error: {error}
        </span>
      )}
    </div>
  );
};

export default ApiStatus;



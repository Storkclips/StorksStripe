import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, LogOut, ExternalLink } from 'lucide-react';

const AlertsTestPage = () => {
  const navigate = useNavigate();
  const [testAmount, setTestAmount] = useState('25.00');
  const [testName, setTestName] = useState('TestUser');
  const [testMessage, setTestMessage] = useState('This is a test tip!');
  const [status, setStatus] = useState('');

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const handleTestAlert = () => {
    // Open alerts page in new window/tab
    const alertsWindow = window.open('/alerts', 'AlertsWindow', 'width=1920,height=1080');
    
    // Wait a bit then trigger test
    setTimeout(() => {
      if (alertsWindow && alertsWindow.triggerTestAlert) {
        alertsWindow.triggerTestAlert();
        setStatus('Test alert triggered!');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Please open the alerts page first');
        setTimeout(() => setStatus(''), 3000);
      }
    }, 1000);
  };

  const handleTestCustomAlert = () => {
    const alertsWindow = window.open('/alerts', 'AlertsWindow', 'width=1920,height=1080');
    
    setTimeout(() => {
      if (alertsWindow && alertsWindow.showAlert) {
        alertsWindow.showAlert({
          type: 'tip',
          username: testName,
          amount: parseFloat(testAmount),
          message: testMessage
        });
        setStatus('Custom alert triggered!');
        setTimeout(() => setStatus(''), 3000);
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
      paddingTop: '3rem',
      paddingBottom: '3rem'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Alert Testing Dashboard</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/settings')}
              className="btn btn-outline"
              data-testid="settings-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m-9-9h6m6 0h6m-9 9-4.24-4.24m12.48 0L18 16.24M7.76 7.76 3.52 3.52m16.96 16.96-4.24-4.24"></path></svg>
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              data-testid="logout-button"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Quick Test Card */}
        <div className="card fade-in" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap style={{ color: '#667eea' }} size={24} />
            Quick Test
          </h2>
          <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
            Trigger a test alert with default values
          </p>
          <button
            onClick={handleTestAlert}
            className="btn btn-primary"
            data-testid="test-alert-button"
            style={{ width: '100%' }}
          >
            <Zap size={20} />
            Trigger Test Alert
          </button>
        </div>

        {/* Custom Test Card */}
        <div className="card fade-in" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Custom Alert Test
          </h2>
          
          <div className="input-group">
            <label htmlFor="test-amount">Tip Amount</label>
            <input
              id="test-amount"
              data-testid="test-amount-input"
              type="text"
              className="input"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="test-name">Tipper Name</label>
            <input
              id="test-name"
              data-testid="test-name-input"
              type="text"
              className="input"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="test-message">Message</label>
            <textarea
              id="test-message"
              data-testid="test-message-input"
              className="textarea"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
            />
          </div>

          <button
            onClick={handleTestCustomAlert}
            className="btn btn-primary"
            data-testid="test-custom-alert-button"
            style={{ width: '100%' }}
          >
            <Zap size={20} />
            Trigger Custom Alert
          </button>
        </div>

        {/* Alerts Page Link */}
        <div className="card fade-in">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            Alerts Display Page
          </h3>
          <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
            Open this page in OBS Browser Source or in a separate window for streaming
          </p>
          <a
            href="/alerts"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <ExternalLink size={20} />
            Open Alerts Page
          </a>
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <strong>OBS Browser Source URL:</strong><br />
            <code style={{ background: '#e5e7eb', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
              {window.location.origin}/alerts
            </code>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            background: '#10b981',
            color: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: '600',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsTestPage;
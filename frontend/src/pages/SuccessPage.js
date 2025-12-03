import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader2, XCircle, Home } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('checking'); // checking, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus(sessionId);
    } else {
      setStatus('failed');
      setError('No payment session found');
    }
  }, [sessionId]);

  const checkPaymentStatus = async (sessionId, attempt = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000; // 2 seconds

    try {
      const response = await axios.get(`${API}/checkout/status/${sessionId}`);
      const data = response.data;

      if (data.payment_status === 'paid') {
        setPaymentData(data);
        setStatus('success');
      } else if (data.status === 'expired') {
        setStatus('failed');
        setError('Payment session expired');
      } else if (attempt < maxAttempts) {
        // Continue polling
        setTimeout(() => checkPaymentStatus(sessionId, attempt + 1), pollInterval);
      } else {
        setStatus('failed');
        setError('Payment verification timed out. Please check your email for confirmation.');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setStatus('failed');
      setError('Failed to verify payment status');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card fade-in" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        {status === 'checking' && (
          <>
            <Loader2 className="spinner" size={64} style={{ margin: '0 auto 2rem', color: '#667eea' }} />
            <h1 data-testid="status-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Verifying Payment...</h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Please wait while we confirm your tip.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={64} style={{ margin: '0 auto 2rem', color: '#10b981' }} />
            <h1 data-testid="status-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#10b981' }}>Thank You!</h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
              Your tip of <strong style={{ color: '#1a1a1a' }}>${paymentData?.amount.toFixed(2)}</strong> has been successfully processed.
            </p>
            <p style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '2rem' }}>
              Your support means the world! 💜
            </p>
            <button
              data-testid="go-home-button"
              onClick={handleGoHome}
              className="btn btn-primary"
              style={{ margin: '0 auto' }}
            >
              <Home size={20} />
              Back to Home
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle size={64} style={{ margin: '0 auto 2rem', color: '#ef4444' }} />
            <h1 data-testid="status-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#ef4444' }}>Payment Failed</h1>
            <p data-testid="error-message" style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
              {error}
            </p>
            <button
              data-testid="go-home-button"
              onClick={handleGoHome}
              className="btn btn-outline"
              style={{ margin: '0 auto' }}
            >
              <Home size={20} />
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
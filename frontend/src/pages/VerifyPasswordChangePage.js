import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VerifyPasswordChangePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token');
      return;
    }

    verifyPasswordChange();
  }, [token]);

  const verifyPasswordChange = async () => {
    try {
      // Get the new password from URL params (if passed) or prompt
      const newPassword = searchParams.get('new_password');
      
      if (!newPassword) {
        setStatus('error');
        setMessage('Password verification requires complete parameters');
        return;
      }

      const response = await axios.post(`${API}/admin/verify-password-change`, {
        token,
        new_password: newPassword
      });

      if (response.data.success) {
        setStatus('success');
        setMessage('Your password has been changed successfully!');
        
        // Clear admin session
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminId');
        sessionStorage.removeItem('adminEmail');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to verify password change');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <Loader2 className="spinner" size={64} style={{ margin: '0 auto 2rem', color: '#667eea' }} />
            <h1 data-testid="status-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
              Verifying...
            </h1>
            <p style={{ color: '#6b7280' }}>Please wait while we verify your password change</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={64} style={{ margin: '0 auto 2rem', color: '#10b981' }} />
            <h1 data-testid="status-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#10b981' }}>
              Success!
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
              {message}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Redirecting to login page...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={64} style={{ margin: '0 auto 2rem', color: '#ef4444' }} />
            <h1 data-testid="status-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#ef4444' }}>
              Verification Failed
            </h1>
            <p data-testid="error-message" style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
              {message}
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="btn btn-outline"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPasswordChangePage;

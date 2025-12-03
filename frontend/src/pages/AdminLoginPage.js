import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simple password (you can change this)
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      // Store auth in sessionStorage
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/dashboard');
    } else {
      setError('Incorrect password');
      setPassword('');
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
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Lock size={36} color="white" />
          </div>
          <h1 data-testid="login-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Admin Access
          </h1>
          <p style={{ color: '#6b7280' }}>Enter password to view alerts</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                data-testid="password-input"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div data-testid="error-message" style={{
              padding: '0.875rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              color: '#dc2626',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            data-testid="login-button"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Lock size={20} />
            Access Alerts
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <strong>Default Password:</strong> admin123<br />
          (Change in AdminLoginPage.js)
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
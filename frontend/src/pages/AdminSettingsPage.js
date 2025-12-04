import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const email = sessionStorage.getItem('adminEmail');
    if (email) {
      setAdminEmail(email);
    }
  }, []);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  const handleNewPasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      const adminId = sessionStorage.getItem('adminId');
      
      const response = await axios.post(`${API}/admin/request-password-change`, {
        admin_id: parseInt(adminId),
        current_password: currentPassword,
        new_password: newPassword
      });

      if (response.data.success) {
        setSuccess('Verification email sent! Check your inbox to complete the password change.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength(0);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
      paddingTop: '3rem',
      paddingBottom: '3rem'
    }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline"
          style={{ marginBottom: '2rem' }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="card fade-in">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Account Settings
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Manage your admin account security
          </p>

          {/* Current Email Display */}
          <div style={{
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Mail size={20} style={{ color: '#667eea' }} />
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email Address</div>
              <div style={{ fontWeight: '600' }}>{adminEmail}</div>
            </div>
          </div>

          {/* Change Password Form */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock style={{ color: '#667eea' }} size={24} />
            Change Password
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                data-testid="current-password-input"
                type={showPasswords ? 'text' : 'password'}
                className="input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                data-testid="new-password-input"
                type={showPasswords ? 'text' : 'password'}
                className="input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
              {newPassword && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ height: '4px', flex: 1, background: '#e5e7eb', borderRadius: '2px' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${passwordStrength}%`,
                          background: passwordStrength < 40 ? '#ef4444' : passwordStrength < 70 ? '#f59e0b' : '#10b981',
                          borderRadius: '2px',
                          transition: 'all 0.3s'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Use 8+ characters with uppercase, lowercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                data-testid="confirm-password-input"
                type={showPasswords ? 'text' : 'password'}
                className="input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="showPasswords"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="showPasswords" style={{ fontSize: '0.875rem', margin: 0, cursor: 'pointer' }}>
                Show passwords
              </label>
            </div>

            {error && (
              <div data-testid="error-message" style={{
                padding: '1rem',
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

            {success && (
              <div data-testid="success-message" style={{
                padding: '1rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
                color: '#16a34a',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={20} />
                {success}
              </div>
            )}

            <button
              type="submit"
              data-testid="change-password-button"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Request Password Change
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#92400e'
          }}>
            <strong>🔒 Security Note:</strong><br />
            You'll receive a verification email to complete the password change. The link expires in 15 minutes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DollarSign, Heart, Loader2, Lock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const HomePage = () => {
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [recentTips, setRecentTips] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [tipperName, setTipperName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCreatorProfile();
    fetchRecentTips();
  }, []);

  const fetchCreatorProfile = async () => {
    try {
      const response = await axios.get(`${API}/creator`);
      setCreator(response.data);
    } catch (err) {
      console.error('Error fetching creator profile:', err);
    }
  };

  const fetchRecentTips = async () => {
    try {
      const response = await axios.get(`${API}/tips/recent?limit=5`);
      setRecentTips(response.data);
    } catch (err) {
      console.error('Error fetching recent tips:', err);
    }
  };

  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (!amount || amount <= 0) {
      setError('Please select or enter a valid amount');
      return;
    }

    if (amount > 10000) {
      setError('Maximum tip amount is $10,000');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const originUrl = window.location.origin;
      const response = await axios.post(`${API}/checkout/session`, {
        amount: parseFloat(amount.toFixed(2)),
        message: message || null,
        tipper_name: tipperName || null,
        origin_url: originUrl
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err.response?.data?.detail || 'Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!creator) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader2 className="spinner" size={32} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Creator Profile Section */}
        <div className="card fade-in" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <img
            data-testid="creator-avatar"
            src={creator.avatar_url}
            alt={creator.name}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 1.5rem',
              border: '4px solid #f3f4f6'
            }}
          />
          <h1 data-testid="creator-name" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1a1a1a' }}>
            {creator.name}
          </h1>
          <p data-testid="creator-bio" style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            {creator.bio}
          </p>
        </div>

        {/* Tipping Form */}
        <div className="card fade-in" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart style={{ color: '#667eea' }} size={24} />
            Send a Tip
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Preset Amounts */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#374151' }}>
                Choose an amount
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    data-testid={`preset-amount-${amount}`}
                    onClick={() => handlePresetClick(amount)}
                    style={{
                      padding: '1rem',
                      border: selectedAmount === amount ? '2px solid #667eea' : '2px solid #e5e7eb',
                      background: selectedAmount === amount ? '#f0f4ff' : 'white',
                      borderRadius: '0.75rem',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: selectedAmount === amount ? '#667eea' : '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="input-group">
              <label htmlFor="custom-amount">Or enter a custom amount</label>
              <div style={{ position: 'relative' }}>
                <DollarSign
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    pointerEvents: 'none'
                  }}
                  size={20}
                />
                <input
                  id="custom-amount"
                  data-testid="custom-amount-input"
                  type="text"
                  className="input"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="input-group">
              <label htmlFor="tipper-name">Your name (optional)</label>
              <input
                id="tipper-name"
                data-testid="tipper-name-input"
                type="text"
                className="input"
                placeholder="Anonymous"
                value={tipperName}
                onChange={(e) => setTipperName(e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="input-group">
              <label htmlFor="message">Leave a message (optional)</label>
              <textarea
                id="message"
                data-testid="message-input"
                className="textarea"
                placeholder="Say something nice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={280}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div data-testid="error-message" style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#dc2626', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              data-testid="submit-tip-button"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.125rem',
                padding: '1rem'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Heart size={20} />
                  Send Tip
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Tips */}
        {recentTips.length > 0 && (
          <div className="card fade-in" data-testid="recent-tips-section">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>Recent Tips</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentTips.map((tip, index) => (
                <div
                  key={index}
                  data-testid={`tip-item-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{tip.tipper_name || 'Anonymous'}</span>
                      <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>•</span>
                      <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{formatTimeAgo(tip.timestamp)}</span>
                    </div>
                    {tip.message && (
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>"{tip.message}"</p>
                    )}
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#667eea' }}>
                    ${tip.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
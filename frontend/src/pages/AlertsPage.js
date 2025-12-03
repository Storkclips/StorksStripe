import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AlertsPage = () => {
  const [lastProcessedId, setLastProcessedId] = useState(null);
  const alertElRef = useRef(null);
  const titleElRef = useRef(null);
  const msgElRef = useRef(null);
  const detailElRef = useRef(null);
  const iconElRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    // Poll for new tips every 3 seconds
    const pollInterval = setInterval(() => {
      checkForNewTips();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [lastProcessedId]);

  const checkForNewTips = async () => {
    try {
      const response = await axios.get(`${API}/tips/recent?limit=1`);
      const tips = response.data;
      
      if (tips.length > 0) {
        const latestTip = tips[0];
        const tipId = `${latestTip.timestamp}_${latestTip.amount}`;
        
        if (tipId !== lastProcessedId) {
          setLastProcessedId(tipId);
          showAlert({
            type: 'tip',
            username: latestTip.tipper_name || 'Anonymous',
            amount: latestTip.amount,
            message: latestTip.message
          });
        }
      }
    } catch (error) {
      console.error('Error checking for tips:', error);
    }
  };

  const showAlert = (opts) => {
    const o = Object.assign({
      type: 'tip',
      username: 'EdgeRunner',
      amount: null,
      message: null
    }, opts || {});

    const alertEl = alertElRef.current;
    const titleEl = titleElRef.current;
    const msgEl = msgElRef.current;
    const detailEl = detailElRef.current;
    const iconEl = iconElRef.current;

    if (!alertEl) return;

    // Reset animation
    alertEl.classList.remove('alert-show');
    alertEl.classList.remove('alert-hide');
    void alertEl.offsetWidth;

    // Set content
    titleEl.textContent = 'NEW TIP';
    iconEl.textContent = '$';

    if (o.message) {
      msgEl.textContent = `${o.username}: "${o.message}"`;
    } else {
      msgEl.textContent = `${o.username} sent $${o.amount ?? 0}`;
    }

    detailEl.textContent = 'Night City // Live Data Feed';

    // Remove old type classes
    alertEl.classList.remove('alert-follow', 'alert-sub', 'alert-raid', 'alert-host', 'alert-tip', 'alert-cheer', 'alert-gift');
    alertEl.classList.add('alert-tip');
    alertEl.classList.add('alert-show');

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    hideTimeoutRef.current = setTimeout(() => {
      alertEl.classList.remove('alert-show');
      void alertEl.offsetWidth;
      alertEl.classList.add('alert-hide');
    }, 6000);
  };

  // Expose showAlert to window for testing
  useEffect(() => {
    window.triggerTestAlert = () => {
      showAlert({
        type: 'tip',
        username: 'TestUser',
        amount: 25.00,
        message: 'This is a test alert!'
      });
    };
    
    window.showAlert = showAlert;
  }, []);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100%',
      height: '100vh',
      background: 'transparent',
      overflow: 'hidden',
      fontFamily: '"Rajdhani", sans-serif'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap" rel="stylesheet" />
      
      <style>{`
        :root {
          --cp-yellow: #f6e200;
          --cp-panel-bg: rgba(0, 0, 0, 0.85);
        }

        #alert-root {
          position: absolute;
          left: 50%;
          top: 10%;
          transform: translate(-50%, 0);
          pointer-events: none;
        }

        .alert {
          position: relative;
          min-width: 500px;
          max-width: 900px;
          padding: 18px 32px;
          background: var(--cp-panel-bg);
          border: 2px solid var(--cp-yellow);
          color: var(--cp-yellow);
          text-shadow: 0 0 10px rgba(246,226,0,0.9);
          box-shadow:
            0 0 20px rgba(246,226,0,0.7),
            0 0 60px rgba(246,226,0,0.4);
          border-radius: 4px;

          clip-path: polygon(
            0% 0%,
            93% 0%,
            100% 20%,
            100% 100%,
            7% 100%,
            0% 80%
          );

          display: flex;
          align-items: center;
          gap: 20px;

          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }

        .alert-icon {
          width: 56px;
          height: 56px;
          border: 2px solid var(--cp-yellow);
          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 4px;
          clip-path: polygon(
            15% 0%,
            85% 0%,
            100% 25%,
            100% 75%,
            85% 100%,
            15% 100%,
            0% 75%,
            0% 25%
          );
          font-size: 28px;
          font-weight: 700;
        }

        .alert-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .alert-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .alert-message {
          font-size: 22px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff7a0;
        }

        .alert-detail {
          font-size: 16px;
          opacity: 0.9;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .alert-line {
          position: absolute;
          bottom: -10px;
          left: 10%;
          width: 45%;
          height: 2px;
          background: var(--cp-yellow);
          box-shadow: 0 0 16px rgba(246,226,0,0.8);
        }

        .alert-line::after {
          content: "";
          position: absolute;
          right: -25%;
          width: 25%;
          height: 2px;
          background: var(--cp-yellow);
          opacity: 0.6;
        }

        .alert-show {
          animation: alertEnter 0.6s cubic-bezier(.16,.93,.46,1.21) forwards,
                     alertGlow 1.6s ease-in-out infinite alternate;
        }

        .alert-hide {
          animation: alertExit 0.4s ease-out forwards;
        }

        @keyframes alertEnter {
          0%   { opacity: 0; transform: translateY(40px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0px)  scale(1); }
        }

        @keyframes alertExit {
          0%   { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
        }

        @keyframes alertGlow {
          0% {
            box-shadow:
              0 0 20px rgba(246,226,0,0.7),
              0 0 60px rgba(246,226,0,0.4);
          }
          100% {
            box-shadow:
              0 0 30px rgba(246,226,0,0.95),
              0 0 80px rgba(246,226,0,0.75);
          }
        }

        .alert-tip { --cp-yellow:#ffb600; }
      `}</style>

      <div id="alert-root">
        <div ref={alertElRef} id="alert" className="alert">
          <div className="alert-icon" ref={iconElRef}>$</div>
          <div className="alert-text">
            <div className="alert-title" ref={titleElRef}>NEW TIP</div>
            <div className="alert-message" ref={msgElRef}>Waiting for tips...</div>
            <div className="alert-detail" ref={detailElRef}>Night City // Live Data Feed</div>
          </div>
          <div className="alert-line"></div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
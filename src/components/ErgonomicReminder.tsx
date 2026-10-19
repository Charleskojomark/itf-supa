import React, { useState, useEffect } from 'react';
import { Eye, HeartPulse, X } from 'lucide-react';

export const ErgonomicReminder: React.FC = () => {
  const [showNudge, setShowNudge] = useState<boolean>(false);

  useEffect(() => {
    // Show nudge after 45 minutes of study (or after 5 minutes in demo mode)
    const timer = setTimeout(() => {
      setShowNudge(true);
    }, 1000 * 60 * 45);

    return () => clearTimeout(timer);
  }, []);

  if (!showNudge) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '74px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        zIndex: 40,
        animation: 'pulseGlow 3s infinite',
      }}
    >
      <div 
        className="card"
        style={{
          background: 'rgba(14, 41, 28, 0.95)',
          border: '1px solid var(--accent-gold)',
          padding: '12px 14px',
          boxShadow: 'var(--shadow-gold-glow)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <div 
          style={{ 
            width: 34, 
            height: 34, 
            borderRadius: 8, 
            background: 'rgba(255, 158, 27, 0.2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            flexShrink: 0,
          }}
        >
          <HeartPulse size={20} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--accent-gold)' }}>
              ⚡ 45-Min Ergonomic Nudge (Criterion A.1.2)
            </span>
            <button 
              onClick={() => setShowNudge(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              aria-label="Dismiss reminder"
            >
              <X size={16} />
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Stand up, roll your shoulders, and look at an object 20 feet away for 20 seconds. 
            Protect your spine so you can build AI models in week 15!
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowNudge(false)}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              <Eye size={12} />
              I Rested My Eyes (Dismiss)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

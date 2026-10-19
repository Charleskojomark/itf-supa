import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Download, Trash2, X } from 'lucide-react';

export const NDPAConsentModal: React.FC = () => {
  const { 
    showNdpaModal, 
    setShowNdpaModal, 
    confirmNdpaConsent, 
    exportData, 
    eraseData,
    profile 
  } = useApp();

  if (!showNdpaModal) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-bright)',
          boxShadow: 'var(--shadow-glow)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setShowNdpaModal(false)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div 
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12, 
              background: 'rgba(0, 230, 118, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-green)'
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800 }}>
              Nigeria Data Protection Act (NDPA)
            </h2>
            <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Your Privacy & Sovereign Rights in AI Naija
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          <p style={{ marginBottom: '10px' }}>
            Welcome! In compliance with the <strong>Nigeria Data Protection Act (NDPA 2023)</strong> and the 
            <strong> ITF SUPA Vocational Standard</strong>, AI Naija Academy respects your absolute right to digital privacy.
          </p>

          <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '4px' }}>
              🔒 What We Store (Locally in Your Browser)
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '12px' }}>
              <li>Your learning progress across the 7-step pedagogical cycle</li>
              <li>Your Python code submissions & quiz scores for SUPA evidence</li>
              <li>Your 20% Theory / 80% Practical study time logs</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '4px' }}>
              🚫 What We NEVER Collect
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '12px' }}>
              <li>No GPS tracking or continuous location harvesting</li>
              <li>No commercial ad trackers or third-party behavioral profiling</li>
              <li>No bank details or credit card requirements (100% free forever)</li>
            </ul>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Under NDPA Sections 34–37, you maintain sovereign control over your data. You may download a copy or erase all local records at any moment below.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="btn btn-primary"
            onClick={confirmNdpaConsent}
            style={{ width: '100%' }}
          >
            I Consent & Enter AI Naija
          </button>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={exportData}
              style={{ flex: 1 }}
              title="Download your full offline evidence record as JSON"
            >
              <Download size={14} />
              Export My Data
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={eraseData}
              style={{ flex: 1, borderColor: 'rgba(255, 71, 87, 0.4)', color: 'var(--accent-crimson)' }}
              title="Erase all local learning progress from this browser"
            >
              <Trash2 size={14} />
              Erase Data
            </button>
          </div>
        </div>

        {profile?.ndpaConsent?.consented && (
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
            ✓ Previously consented on {new Date(profile.ndpaConsent.timestamp).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

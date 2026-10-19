import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileCheck2, 
  Award, 
  Code, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Download,
  Calendar
} from 'lucide-react';
import { ITF_CRITERIA_LIST } from '../data/criteria';

export const PortfolioView: React.FC = () => {
  const { profile, practicalRatioPercent, exportData } = useApp();

  const completedCriteria = ITF_CRITERIA_LIST.filter(
    (c) => c.status === 'competent' || c.status === 'confident'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Portfolio Profile Card */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(10, 31, 20, 0.95))',
          border: '1px solid var(--border-bright)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: 52, 
              height: 52, 
              borderRadius: '50%', 
              background: 'rgba(0, 230, 118, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '26px',
              border: '2px solid var(--accent-green)',
            }}
          >
            {profile?.avatar || '🚀'}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800 }}>
              {profile?.fullName || 'Chidi Okonkwo'}
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Level {profile?.level || 1} AI Specialist Cadet • Batch 26-03
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Standard: 27ITFVS26-3 (Level 3 Vocational Standard)
            </div>
          </div>
        </div>

        {/* Practical Ratio & Hours Pill */}
        <div 
          style={{
            marginTop: '14px',
            background: 'var(--bg-primary)',
            padding: '10px 12px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Verified Time Ratio:</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-green)' }}>
              {practicalRatioPercent}% Practical / {100 - practicalRatioPercent}% Theory
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Total Hands-On:</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {Math.round((profile?.totalPracticalSeconds || 7200) / 60)} mins
            </div>
          </div>
        </div>

        {/* Export JSON / Backup Button */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={exportData}
          style={{ width: '100%', marginTop: '12px', gap: '6px' }}
        >
          <Download size={14} />
          Download Offline JSON Evidence Pack
        </button>
      </div>

      {/* Verified Competencies Accordion */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700 }}>
            Verified Criteria Competencies ({completedCriteria.length})
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 700 }}>
            Assessor Ready
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {completedCriteria.map((c) => (
            <div
              key={c.code}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid rgba(0, 230, 118, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="var(--accent-green)" />
                  <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', fontWeight: 800, color: 'var(--accent-green)' }}>
                    {c.code}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>{c.title}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', paddingLeft: '20px' }}>
                  {c.domain} • Verified in Week {c.taughtInWeeks.join(', ')}
                </div>
              </div>
              <span 
                style={{ 
                  fontSize: '9px', 
                  fontWeight: 800, 
                  color: '#0A2619', 
                  background: 'var(--accent-green)',
                  padding: '2px 6px',
                  borderRadius: '4px' 
                }}
              >
                PASS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Collected Project Artifacts */}
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
          Assessed Practical Artifacts & Code
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Danfo Stage Fare Router Function
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 800 }}>
                100% Tests Passed
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '6px 8px', borderRadius: '4px', marginTop: '6px' }}>
              def get_danfo_fare(stages, has_exact_change): ...
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Standard D.1.3 • Saved locally in IndexedDB
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Workstation Ergonomic Calibration Checklist
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 800 }}>
                Verified
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Spine strain calibration: 18% (Optimal Green) • Neck angle: 12°
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Standard A.1.1 & A.1.2 • OHS Compliance Record
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

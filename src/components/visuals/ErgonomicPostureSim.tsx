import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

export const ErgonomicPostureSim: React.FC = () => {
  const [chairHeight, setChairHeight] = useState<number>(45); // cm (optimal: 48-52)
  const [screenDistance, setScreenDistance] = useState<number>(35); // cm (optimal: 50-60)
  const [neckAngle, setNeckAngle] = useState<number>(35); // degrees (optimal: 0-15)

  // Compute strain score: 0 (optimal) to 100 (severe danger)
  const chairStrain = Math.abs(chairHeight - 50) * 2;
  const screenStrain = Math.abs(screenDistance - 55) * 1.5;
  const neckStrain = neckAngle * 1.8;
  const totalStrain = Math.min(100, Math.round(chairStrain + screenStrain + neckStrain));

  const isOptimal = totalStrain < 25;
  const isModerate = totalStrain >= 25 && totalStrain < 60;

  return (
    <div 
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: 'var(--accent-green)' }}>
          Workstation Calibration & Spine Strain Meter
        </h4>
        <span 
          style={{ 
            fontSize: '11px', 
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)',
            background: isOptimal ? 'var(--accent-green)' : isModerate ? 'var(--accent-gold)' : 'var(--accent-crimson)',
            color: '#0A2619',
          }}
        >
          {isOptimal ? 'Optimal Green' : isModerate ? 'Moderate Strain' : 'Severe Danger'}
        </span>
      </div>

      {/* Strain Meter Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span>Cervical Spine Pressure:</span>
          <span>{totalStrain}% Strain</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${totalStrain}%`, 
              height: '100%', 
              background: isOptimal 
                ? 'var(--accent-green)' 
                : isModerate 
                ? 'var(--accent-gold)' 
                : 'var(--accent-crimson)',
              transition: 'all 0.2s ease-out' 
            }} 
          />
        </div>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>Neck Tilt Angle:</span>
            <strong>{neckAngle}° {neckAngle <= 15 ? '✓ (Good)' : '⚠️ (Craning down)'}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={neckAngle}
            onChange={(e) => setNeckAngle(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-green)', marginTop: '4px' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>Screen Distance:</span>
            <strong>{screenDistance} cm {screenDistance >= 50 ? '✓ (Safe)' : '⚠️ (Too close)'}</strong>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            value={screenDistance}
            onChange={(e) => setScreenDistance(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-green)', marginTop: '4px' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>Chair Height:</span>
            <strong>{chairHeight} cm {chairHeight >= 48 && chairHeight <= 52 ? '✓ (Elbows 90°)' : '⚠️'}</strong>
          </div>
          <input
            type="range"
            min="35"
            max="65"
            value={chairHeight}
            onChange={(e) => setChairHeight(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-green)', marginTop: '4px' }}
          />
        </div>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '6px' }}>
        💡 <strong>Instruction:</strong> Adjust the sliders to bring Cervical Spine Pressure below 25% to fulfill Criterion A.1.1.
      </div>
    </div>
  );
};

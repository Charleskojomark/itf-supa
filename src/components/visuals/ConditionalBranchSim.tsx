import React, { useState } from 'react';
import { CloudRain, Sun, Zap, AlertTriangle } from 'lucide-react';

export const ConditionalBranchSim: React.FC = () => {
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [isRushHour, setIsRushHour] = useState<boolean>(false);
  const [hasExactChange, setHasExactChange] = useState<boolean>(true);

  // Compute branch
  let activeBranch = 'normal';
  let baseFare = 300;

  if (isRaining && isRushHour) {
    activeBranch = 'rain_and_rush';
    baseFare = 1200;
  } else if (isRaining) {
    activeBranch = 'rain';
    baseFare = 700;
  } else if (isRushHour) {
    activeBranch = 'rush';
    baseFare = 600;
  } else {
    activeBranch = 'normal';
    baseFare = 300;
  }

  const surcharge = !hasExactChange ? 100 : 0;
  const totalFare = baseFare + surcharge;

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
          Danfo Conditional Branch Simulator
        </h4>
        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>
          Interactive Flowchart
        </span>
      </div>

      {/* Control Switches */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={() => setIsRaining(!isRaining)}
          style={{
            flex: 1,
            minWidth: '130px',
            background: isRaining ? 'rgba(46, 213, 115, 0.2)' : 'var(--bg-primary)',
            border: isRaining ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: isRaining ? 'var(--accent-green)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {isRaining ? <CloudRain size={16} /> : <Sun size={16} />}
          {isRaining ? 'Rain: Heavy' : 'Weather: Sunny'}
        </button>

        <button
          onClick={() => setIsRushHour(!isRushHour)}
          style={{
            flex: 1,
            minWidth: '130px',
            background: isRushHour ? 'rgba(255, 158, 27, 0.2)' : 'var(--bg-primary)',
            border: isRushHour ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: isRushHour ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <Zap size={16} />
          {isRushHour ? 'Rush Hour (5 PM)' : 'Off-Peak (1 PM)'}
        </button>

        <button
          onClick={() => setHasExactChange(!hasExactChange)}
          style={{
            width: '100%',
            background: !hasExactChange ? 'rgba(255, 71, 87, 0.15)' : 'var(--bg-primary)',
            border: !hasExactChange ? '1px solid var(--accent-crimson)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: !hasExactChange ? 'var(--accent-crimson)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <AlertTriangle size={16} />
          {hasExactChange ? 'Passenger Has Exact Change' : 'No Change (N1000 Note Surcharge +N100)'}
        </button>
      </div>

      {/* Code Tree Representation with Active Highlight */}
      <div 
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          fontFamily: 'var(--font-code)',
          fontSize: '12px',
          lineHeight: 1.8,
        }}
      >
        <div style={{ color: activeBranch === 'rain_and_rush' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
          {activeBranch === 'rain_and_rush' ? '▶ ' : '  '}
          <strong>if</strong> is_raining <strong>and</strong> is_rush_hour: fare = 1200
        </div>
        <div style={{ color: activeBranch === 'rain' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
          {activeBranch === 'rain' ? '▶ ' : '  '}
          <strong>elif</strong> is_raining: fare = 700
        </div>
        <div style={{ color: activeBranch === 'rush' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
          {activeBranch === 'rush' ? '▶ ' : '  '}
          <strong>elif</strong> is_rush_hour: fare = 600
        </div>
        <div style={{ color: activeBranch === 'normal' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
          {activeBranch === 'normal' ? '▶ ' : '  '}
          <strong>else</strong>: fare = 300
        </div>
        <div style={{ color: !hasExactChange ? 'var(--accent-crimson)' : 'var(--text-muted)', marginTop: '4px' }}>
          {!hasExactChange ? '▶ ' : '  '}
          <strong>if not</strong> has_exact_change: fare += 100
        </div>
      </div>

      {/* Output Fare Display */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(10, 31, 20, 0.9))',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Computed Danfo Fare:</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, color: 'var(--accent-green)' }}>
            ₦{totalFare}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div>Base Fare: ₦{baseFare}</div>
          {surcharge > 0 && <div style={{ color: 'var(--accent-crimson)' }}>Change Surcharge: +₦{surcharge}</div>}
        </div>
      </div>
    </div>
  );
};

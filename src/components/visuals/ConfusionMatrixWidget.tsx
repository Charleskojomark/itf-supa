import React, { useState } from 'react';

export const ConfusionMatrixWidget: React.FC = () => {
  const [tp, setTp] = useState<number>(85); // True Positives (Malaria detected correctly)
  const [fp, setFp] = useState<number>(15); // False Positives (Healthy misdiagnosed as malaria)
  const [fn, setFn] = useState<number>(10); // False Negatives (Sick misdiagnosed as healthy - DANGEROUS!)
  const [tn, setTn] = useState<number>(190); // True Negatives (Healthy diagnosed healthy)

  const total = tp + fp + fn + tn;
  const precision = (tp + fp) > 0 ? ((tp / (tp + fp)) * 100).toFixed(1) : '0';
  const recall = (tp + fn) > 0 ? ((tp / (tp + fn)) * 100).toFixed(1) : '0';
  const pNum = parseFloat(precision) / 100;
  const rNum = parseFloat(recall) / 100;
  const f1 = (pNum + rNum) > 0 ? (((2 * pNum * rNum) / (pNum + rNum)) * 100).toFixed(1) : '0';

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
          Malaria Diagnostic Confusion Matrix
        </h4>
        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>
          Standard F.2.1
        </span>
      </div>

      {/* 2x2 Interactive Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <div style={{ background: 'rgba(0, 230, 118, 0.15)', border: '1px solid var(--accent-green)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700 }}>TRUE POSITIVE (TP)</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{tp}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Has Malaria & Tested Positive</div>
          <input 
            type="range" min="10" max="150" value={tp} 
            onChange={(e) => setTp(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--accent-green)', marginTop: '4px' }} 
          />
        </div>

        <div style={{ background: 'rgba(255, 158, 27, 0.15)', border: '1px solid var(--accent-gold)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700 }}>FALSE POSITIVE (FP)</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{fp}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Healthy & Tested Positive (Type I)</div>
          <input 
            type="range" min="0" max="80" value={fp} 
            onChange={(e) => setFp(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--accent-gold)', marginTop: '4px' }} 
          />
        </div>

        <div style={{ background: 'rgba(255, 71, 87, 0.2)', border: '1px solid var(--accent-crimson)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: 'var(--accent-crimson)', fontWeight: 700 }}>FALSE NEGATIVE (FN) ⚠️</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{fn}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sick & Missed by Test (Type II)</div>
          <input 
            type="range" min="0" max="50" value={fn} 
            onChange={(e) => setFn(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--accent-crimson)', marginTop: '4px' }} 
          />
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700 }}>TRUE NEGATIVE (TN)</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{tn}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Healthy & Tested Negative</div>
          <input 
            type="range" min="50" max="300" value={tn} 
            onChange={(e) => setTn(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--text-muted)', marginTop: '4px' }} 
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Precision (TP/(TP+FP))</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-green)' }}>{precision}%</div>
        </div>
        <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Recall (TP/(TP+FN))</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-gold)' }}>{recall}%</div>
        </div>
        <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>F1-Score</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-blue)' }}>{f1}%</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
        In medical diagnosis in Nigeria, <strong>Recall</strong> is critical because missing a sick patient (False Negative) can be fatal!
      </div>
    </div>
  );
};

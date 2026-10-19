import React, { useState } from 'react';
import { VariableMemoryBox } from '../components/visuals/VariableMemoryBox';
import { ConditionalBranchSim } from '../components/visuals/ConditionalBranchSim';
import { ErgonomicPostureSim } from '../components/visuals/ErgonomicPostureSim';
import { ConfusionMatrixWidget } from '../components/visuals/ConfusionMatrixWidget';
import { Cpu, Box, GitFork, HeartPulse, Grid } from 'lucide-react';

export const VisualLabView: React.FC = () => {
  const [activeWidget, setActiveWidget] = useState<'memory' | 'branch' | 'posture' | 'matrix'>('memory');

  const widgets = [
    { id: 'memory', name: 'Variable Boxes', icon: Box, itf: 'D.1.1' },
    { id: 'branch', name: 'Branch Router', icon: GitFork, itf: 'D.1.3' },
    { id: 'posture', name: 'Spine Calibrator', icon: HeartPulse, itf: 'A.1.1' },
    { id: 'matrix', name: 'Confusion Matrix', icon: Grid, itf: 'F.2.1' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(10, 31, 20, 0.95))',
          border: '1px solid var(--border-bright)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{ 
              width: 38, 
              height: 38, 
              borderRadius: 10, 
              background: 'rgba(0, 230, 118, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-green)',
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800 }}>
              Interactive Visual Lab
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              See AI & Code In Action Before Any Math
            </div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Play with interactive widgets designed for complete beginners on mobile. Touch, slide, and mutate data live.
        </p>
      </div>

      {/* Widget Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {widgets.map((w) => {
          const Icon = w.icon;
          const isSelected = activeWidget === w.id;
          return (
            <button
              key={w.id}
              onClick={() => setActiveWidget(w.id as any)}
              style={{
                flexShrink: 0,
                background: isSelected ? 'var(--accent-green)' : 'var(--bg-surface)',
                color: isSelected ? '#0A2619' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition-fast)',
              }}
            >
              <Icon size={14} />
              <span>{w.name}</span>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>({w.itf})</span>
            </button>
          );
        })}
      </div>

      {/* Active Visual Widget */}
      <div>
        {activeWidget === 'memory' && <VariableMemoryBox />}
        {activeWidget === 'branch' && <ConditionalBranchSim />}
        {activeWidget === 'posture' && <ErgonomicPostureSim />}
        {activeWidget === 'matrix' && <ConfusionMatrixWidget />}
      </div>
    </div>
  );
};

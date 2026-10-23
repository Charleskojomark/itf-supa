import React, { useState } from 'react';

interface VariableItem {
  name: string;
  value: any;
  type: 'int' | 'float' | 'str' | 'bool';
  address: string;
  color: string;
}

export const VariableMemoryBox: React.FC = () => {
  const [vars, setVars] = useState<VariableItem[]>([
    { name: 'rice_bags', value: 12, type: 'int', address: '0x7ffd91a', color: '#00E676' },
    { name: 'price_per_bag', value: 85000.5, type: 'float', address: '0x7ffd92b', color: '#FF9E1B' },
    { name: 'market_name', value: '"Balogun Lagos"', type: 'str', address: '0x7ffd93c', color: '#2ED573' },
    { name: 'is_in_stock', value: true, type: 'bool', address: '0x7ffd94d', color: '#9B51E0' },
  ]);

  const [activeVar, setActiveVar] = useState<VariableItem>(vars[0]);
  const [inputVal, setInputVal] = useState<string>('15');

  const updateActiveValue = () => {
    let parsed: any = inputVal;
    if (activeVar.type === 'int') parsed = parseInt(inputVal, 10) || 0;
    if (activeVar.type === 'float') parsed = parseFloat(inputVal) || 0.0;
    if (activeVar.type === 'bool') parsed = inputVal.toLowerCase() === 'true';

    setVars((prev) =>
      prev.map((v) => (v.name === activeVar.name ? { ...v, value: parsed } : v))
    );
    setActiveVar((prev) => ({ ...prev, value: parsed }));
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)', whiteSpace: 'nowrap' }}>
          RAM Memory State (Simulation)
        </h4>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Tap a box to inspect
        </span>
      </div>

      {/* Grid of Memory Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
        {vars.map((v) => {
          const isSelected = activeVar.name === v.name;
          return (
            <div
              key={v.name}
              onClick={() => {
                setActiveVar(v);
                setInputVal(String(v.value).replace(/"/g, ''));
              }}
              style={{
                background: isSelected ? 'rgba(0, 230, 118, 0.15)' : 'var(--bg-primary)',
                border: isSelected ? `2px solid ${v.color}` : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                <span 
                  style={{ 
                    fontFamily: 'var(--font-code)', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    color: v.color,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    minWidth: 0,
                  }}
                  title={v.name}
                >
                  {v.name}
                </span>
                <span 
                  style={{ 
                    fontSize: '9px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    background: 'rgba(255,255,255,0.08)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}
                >
                  {v.type}
                </span>
              </div>

              <div 
                style={{ 
                  fontFamily: 'var(--font-code)', 
                  fontSize: typeof v.value === 'string' && String(v.value).length > 10 ? '13px' : '15px', 
                  fontWeight: 800, 
                  marginTop: '6px',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: 1.25,
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {String(v.value)}
              </div>

              <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-code)', marginTop: '4px' }}>
                loc: {v.address}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Mutation Panel */}
      <div 
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Change Value of <code style={{ color: activeVar.color }}>{activeVar.name}</code> ({activeVar.type}):
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              padding: '8px 12px',
              fontFamily: 'var(--font-code)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button 
            className="btn btn-primary"
            onClick={updateActiveValue}
            style={{
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minHeight: '38px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            Assign =
          </button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
          Notice how memory address <code>{activeVar.address}</code> updates immediately without rewriting your code!
        </div>
      </div>
    </div>
  );
};

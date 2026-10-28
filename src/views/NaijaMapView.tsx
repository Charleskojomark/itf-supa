import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Lock, 
  CheckCircle2, 
  Swords, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  Map
} from 'lucide-react';
import { NAIJA_ZONES, type Zone } from '../data/zones';

export const NaijaMapView: React.FC<{ onSelectZone: (zone: Zone) => void }> = ({ onSelectZone }) => {
  const { profile } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Map Header Card */}
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
            <Map size={22} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800 }}>
              The 15 Naija Zones
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              19 Oct 2026 – 30 Jan 2027 • Standard 27ITFVS26-3
            </div>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px' }}>
          Every week is a journey to a new Nigerian city. Pass the daily lessons and defeat the Friday Boss Battle to unlock the next territory.
        </p>
      </div>

      {/* 15 Zones Path List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
        {NAIJA_ZONES.map((zone, idx) => {
          const effectiveZone = Math.max(profile?.currentZone ?? 2, 2);
          const isCurrent = effectiveZone === zone.weekNumber;
          const isPassed = effectiveZone > zone.weekNumber;
          // Week 1 and Week 2 are unlocked; Week 3+ unlocks as student advances
          const isLocked = zone.weekNumber > 2 && effectiveZone < zone.weekNumber;

          return (
            <div 
              key={zone.id}
              onClick={() => {
                if (!isLocked) onSelectZone(zone);
              }}
              className="card"
              style={{
                marginBottom: 0,
                background: isCurrent 
                  ? 'linear-gradient(135deg, rgba(0, 230, 118, 0.12), rgba(18, 45, 32, 0.9))' 
                  : 'var(--bg-card)',
                border: isCurrent 
                  ? '1px solid var(--border-bright)' 
                  : isPassed 
                  ? '1px solid rgba(0, 230, 118, 0.3)' 
                  : '1px solid var(--border-subtle)',
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                position: 'relative',
              }}
            >
              {/* Connected Line Marker */}
              {idx < NAIJA_ZONES.length - 1 && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: -13,
                    left: 28,
                    width: 2,
                    height: 14,
                    background: isPassed ? 'var(--accent-green)' : 'var(--border-subtle)',
                    zIndex: 2,
                  }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {/* City Icon Badge */}
                  <div 
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: isPassed 
                        ? 'var(--accent-green)' 
                        : isCurrent 
                        ? 'var(--accent-gold)' 
                        : 'rgba(255, 255, 255, 0.08)',
                      color: isPassed ? '#0A2619' : isCurrent ? '#1A0D00' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      flexShrink: 0,
                    }}
                  >
                    {isPassed ? <CheckCircle2 size={18} /> : isLocked ? <Lock size={16} /> : zone.weekNumber}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800 }}>
                        Week {zone.weekNumber}: {zone.cityName}
                      </span>
                      {isCurrent && (
                        <span 
                          style={{ 
                            background: 'var(--accent-green)', 
                            color: '#0A2619', 
                            fontSize: '10px', 
                            fontWeight: 800, 
                            padding: '1px 6px', 
                            borderRadius: 'var(--radius-pill)' 
                          }}
                        >
                          ACTIVE ZONE
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600, marginTop: '2px' }}>
                      {zone.theme}
                    </div>

                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '11px', 
                        color: 'var(--text-muted)', 
                        marginTop: '4px' 
                      }}
                    >
                      <Calendar size={12} />
                      {zone.dateRange}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      📍 <em>{zone.landmark}</em>
                    </div>
                  </div>
                </div>

                <div>
                  {!isLocked && <ChevronRight size={18} color="var(--accent-green)" />}
                </div>
              </div>

              {/* Boss Battle Info Bar */}
              <div 
                style={{
                  marginTop: '10px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Swords size={13} color="var(--accent-crimson)" />
                  <span>Boss Battle: <strong>{zone.bossBattleTitle}</strong></span>
                </div>
                <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
                  {zone.itfCodes.join(', ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

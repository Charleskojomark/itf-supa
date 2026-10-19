import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  BookOpen, 
  GraduationCap, 
  Award,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    profile, 
    role, 
    setRole, 
    isOnline, 
    theme, 
    toggleTheme, 
    useGraceToken 
  } = useApp();

  return (
    <header className="app-header">
      <div className="brand-badge">
        <div className="brand-logo-icon">🇳🇬</div>
        <div>
          <div className="brand-title">AI Naija</div>
          <div className="brand-subtitle">ITF SUPA • L3</div>
        </div>
      </div>

      <div className="header-stats">
        {/* Network indicator pill */}
        <div 
          className="stat-chip" 
          title={isOnline ? 'Online (Ready to sync)' : 'Offline (All lessons & code runner working)'}
          style={{ 
            fontSize: '11px', 
            padding: '3px 8px',
            borderColor: isOnline ? 'rgba(0,230,118,0.3)' : 'rgba(255,158,27,0.5)',
            color: isOnline ? 'var(--accent-green)' : 'var(--accent-gold)'
          }}
        >
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{isOnline ? 'LIVE' : 'OFFLINE'}</span>
        </div>

        {/* XP Chip */}
        <div className="stat-chip xp" title="Your Experience Points">
          <Sparkles size={12} />
          <span>{profile?.xp ?? 0}</span>
        </div>

        {/* Streak & Grace Token Chip */}
        <div 
          className="stat-chip streak" 
          title={`${profile?.streakDays ?? 0} day streak • ${profile?.graceTokens ?? 0} Grace Tokens remaining`}
          onClick={async () => {
            if (profile && profile.graceTokens > 0) {
              const used = await useGraceToken();
              if (used) {
                alert(`Protected your streak with a Grace Token! (${profile.graceTokens - 1} left)`);
              }
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <Flame size={13} fill="currentColor" />
          <span>{profile?.streakDays ?? 0}</span>
          <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '2px' }}>
            🛡️{profile?.graceTokens ?? 0}
          </span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          aria-label="Toggle dark/light mode"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Role Selector */}
        <div className="role-badge-selector">
          <button 
            className={`role-pill-btn ${role === 'learner' ? 'active' : ''}`}
            onClick={() => setRole('learner')}
            title="Learner View"
          >
            <BookOpen size={11} style={{ display: 'inline', marginRight: 2 }} />
            Learner
          </button>
          <button 
            className={`role-pill-btn ${role === 'tutor' ? 'active' : ''}`}
            onClick={() => setRole('tutor')}
            title="Tutor Hub"
          >
            <GraduationCap size={11} style={{ display: 'inline', marginRight: 2 }} />
            Tutor
          </button>
          <button 
            className={`role-pill-btn ${role === 'assessor' ? 'active' : ''}`}
            onClick={() => setRole('assessor')}
            title="SUPA Assessor Portal"
          >
            <Award size={11} style={{ display: 'inline', marginRight: 2 }} />
            SUPA
          </button>
        </div>
      </div>
    </header>
  );
};

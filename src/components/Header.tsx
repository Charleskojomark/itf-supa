import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  BookOpen, 
  GraduationCap, 
  Award,
  Sparkles,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { ROLE_CONFIGS } from '../types/rbac';

export const Header: React.FC = () => {
  const { 
    profile, 
    role, 
    currentUser,
    openAuthModal, 
    isOnline, 
    theme, 
    toggleTheme, 
    useGraceToken 
  } = useApp();

  return (
    <header className="app-header">
      <div className="header-main-bar">
        <div className="brand-badge">
          <div className="brand-logo-icon">🇳🇬</div>
          <div className="brand-text">
            <div className="brand-title">AI Naija</div>
            <div className="brand-subtitle">
              {currentUser.name.split(' ')[0]} • {ROLE_CONFIGS[role].badgeLabel}
            </div>
          </div>
        </div>

        <div className="header-stats">
          {/* Network indicator pill */}
          <div 
            className="stat-chip network-chip" 
            title={isOnline ? 'Online (Ready to sync)' : 'Offline (All lessons & code runner working)'}
            style={{ 
              borderColor: isOnline ? 'rgba(0,230,118,0.3)' : 'rgba(255,158,27,0.5)',
              color: isOnline ? 'var(--accent-green)' : 'var(--accent-gold)'
            }}
          >
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span className="network-label">{isOnline ? 'LIVE' : 'OFFLINE'}</span>
          </div>

          {/* XP Chip (only relevant for learner / cadet) */}
          {role === 'learner' ? (
            <div className="stat-chip xp" title="Your Experience Points">
              <Sparkles size={12} />
              <span>{profile?.xp ?? 0}</span>
            </div>
          ) : (
            <div 
              className="stat-chip" 
              style={{ borderColor: 'rgba(0, 230, 118, 0.4)', color: 'var(--accent-green)' }}
              title="Official Clearance Verified"
            >
              <ShieldCheck size={12} />
              <span>Auth</span>
            </div>
          )}

          {/* Streak & Grace Token Chip */}
          {role === 'learner' && (
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
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Role Clearance Bar */}
      <div className="header-role-bar">
        <div className="role-badge-selector">
          <button 
            className={`role-pill-btn ${role === 'learner' ? 'active' : ''}`}
            onClick={() => openAuthModal('learner')}
            title="Switch to Cadet Learner View"
          >
            <BookOpen size={12} />
            <span>Learner</span>
          </button>

          <button 
            className={`role-pill-btn ${role === 'tutor' ? 'active' : ''}`}
            onClick={() => openAuthModal('tutor')}
            title="Enter Tutor Facilitator Hub (Requires PIN)"
          >
            <GraduationCap size={12} />
            <span>Tutor Hub</span>
            {role !== 'tutor' && <Lock size={10} style={{ opacity: 0.7 }} />}
          </button>

          <button 
            className={`role-pill-btn ${role === 'assessor' ? 'active' : ''}`}
            onClick={() => openAuthModal('assessor')}
            title="Enter SUPA Assessor Portal (Requires PIN)"
          >
            <Award size={12} />
            <span>SUPA Assessor</span>
            {role !== 'assessor' && <Lock size={10} style={{ opacity: 0.7 }} />}
          </button>
        </div>
      </div>
    </header>
  );
};

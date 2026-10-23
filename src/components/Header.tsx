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
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';
import { ROLE_CONFIGS } from '../types/rbac';

export const Header: React.FC = () => {
  const { 
    profile, 
    role, 
    currentUser,
    isAuthenticated,
    logoutUser,
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
              {isAuthenticated ? (
                `${(profile?.fullName || currentUser.name).split(' ')[0]} • ${ROLE_CONFIGS[role].badgeLabel}`
              ) : (
                'ITF SUPA Portal'
              )}
            </div>
          </div>
        </div>

        <div className="header-stats">
          {/* Network indicator pill */}
          <div 
            className="stat-chip network-chip" 
            title={isOnline ? 'Online (Connected to SUPA Cloud DB)' : 'Offline (Local storage active)'}
            style={{ 
              borderColor: isOnline ? 'rgba(0,230,118,0.3)' : 'rgba(255,158,27,0.5)',
              color: isOnline ? 'var(--accent-green)' : 'var(--accent-gold)'
            }}
          >
            {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
            <span className="network-label">{isOnline ? 'LIVE' : 'OFF'}</span>
          </div>

          {isAuthenticated ? (
            <>
              {/* XP Chip (only relevant for learner / cadet) */}
              {role === 'learner' && (
                <div className="stat-chip xp" title="Your Experience Points">
                  <Sparkles size={11} />
                  <span>{profile?.xp ?? 0}</span>
                </div>
              )}

              {/* Student Profile Identity Chip */}
              <div 
                className="stat-chip"
                title={`Active account: ${profile?.fullName || currentUser.name}`}
                style={{ borderColor: 'rgba(0, 230, 118, 0.4)', color: 'var(--accent-green)' }}
              >
                <span>{profile?.avatar || '👤'}</span>
                <span className="header-user-name">
                  {(profile?.fullName || currentUser.name).split(' ')[0]}
                </span>
              </div>

              {/* Sign Out Button */}
              <button 
                onClick={logoutUser}
                className="stat-chip logout-chip"
                title="Sign out of account & return to entrance gate"
                style={{ 
                  cursor: 'pointer',
                  borderColor: 'rgba(255, 107, 107, 0.4)', 
                  color: '#FF6B6B',
                  background: 'transparent'
                }}
              >
                <LogOut size={11} />
                <span className="logout-label">Exit</span>
              </button>
            </>
          ) : (
            <div 
              className="stat-chip" 
              style={{ borderColor: 'var(--border-medium)', color: 'var(--accent-gold)' }}
            >
              <ShieldCheck size={11} />
              <span>Login Required</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Role Clearance Bar - Only visible when authenticated */}
      {isAuthenticated && (
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
              <span>Assessor</span>
              {role !== 'assessor' && <Lock size={10} style={{ opacity: 0.7 }} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

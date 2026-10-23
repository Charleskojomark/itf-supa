import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { ROLE_CONFIGS } from '../types/rbac';
import type { UserRole } from '../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  screenName?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  screenName = 'Restricted Screen' 
}) => {
  const { role, setRole, setActiveTab, openAuthModal } = useApp();

  const isAuthorized = allowedRoles.includes(role);

  if (isAuthorized) {
    return <>{children}</>;
  }

  const currentRoleConfig = ROLE_CONFIGS[role];
  const targetRole = allowedRoles[0];
  const targetRoleConfig = ROLE_CONFIGS[targetRole];

  return (
    <div 
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px 20px',
        background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.12), rgba(18, 45, 32, 0.95))',
        border: '1px solid rgba(255, 71, 87, 0.4)',
        borderRadius: 'var(--radius-lg)',
        margin: '16px 0',
      }}
    >
      <div 
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(255, 71, 87, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-crimson, #FF4757)',
          marginBottom: '16px',
          boxShadow: '0 0 20px rgba(255, 71, 87, 0.3)',
        }}
      >
        <ShieldAlert size={30} />
      </div>

      <span 
        style={{
          fontSize: '11px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--accent-crimson, #FF4757)',
          background: 'rgba(255, 71, 87, 0.15)',
          padding: '3px 10px',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '8px',
        }}
      >
        Security Level Clearance Required
      </span>

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
        Access Restricted: {screenName}
      </h2>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '340px', lineHeight: 1.4, marginBottom: '18px' }}>
        This module is reserved for <strong>{allowedRoles.map(r => ROLE_CONFIGS[r].title).join(' or ')}</strong>.
        Your current session is authenticated as <strong>{currentRoleConfig.title}</strong> ({currentRoleConfig.badgeLabel}).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
        <button
          onClick={() => openAuthModal(targetRole)}
          className="btn btn-primary"
          style={{ width: '100%', gap: '8px', fontSize: '13px', minHeight: '42px' }}
        >
          <KeyRound size={16} />
          Authenticate as {targetRoleConfig.title}
        </button>

        <button
          onClick={() => setActiveTab(currentRoleConfig.defaultTab as any)}
          className="btn btn-secondary"
          style={{ width: '100%', gap: '8px', fontSize: '13px', minHeight: '42px' }}
        >
          <ArrowLeft size={16} />
          Return to My {currentRoleConfig.title} Hub
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '11px', color: 'var(--text-muted)' }}>
        🔒 ITF SUPA Standard 27ITFVS26-3 • RBAC Policy Active
      </div>
    </div>
  );
};

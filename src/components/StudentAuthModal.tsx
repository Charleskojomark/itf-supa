import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserPlus, 
  LogIn, 
  X, 
  Phone, 
  Mail, 
  Lock, 
  User, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { registerStudentAccount, loginStudentAccount } from '../services/cloudDb';
import { BATCH_SQUADS } from '../data/squads';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'register' | 'login';
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'register',
}) => {
  const { setProfile, profile } = useApp();
  const [mode, setMode] = useState<'register' | 'login'>(defaultMode);
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [squadId, setSquadId] = useState<string>(BATCH_SQUADS[0]?.id || 'squad_eko');
  const [avatar, setAvatar] = useState<string>('👨🏾‍💻');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const avatarsList = ['👨🏾‍💻', '👩🏾‍💻', '👨🏾‍🎓', '👩🏾‍🎓', '🧕🏾', '⚡'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!phoneNumber.trim() || !password.trim()) {
      setErrorMsg('Phone number and password are required.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setErrorMsg('Full name is required to enroll in ITF SUPA.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        const user = await registerStudentAccount({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim() || undefined,
          password: password.trim(),
          squadId,
          avatar,
        });

        const newProfile: any = {
          id: user.id,
          fullName: user.fullName,
          displayName: user.fullName.split(' ')[0],
          phoneNumber: user.phoneNumber,
          avatar: user.avatar,
          squadId: user.squadId,
          role: 'learner',
          currentZone: user.currentZone || 1,
          xp: user.xp || 50,
          level: user.level || 1,
          streakDays: user.streakDays || 1,
          graceTokens: 3,
          totalTheorySeconds: 0,
          totalPracticalSeconds: 0,
          ndpaConsent: { consented: true, timestamp: Date.now(), version: '1.0-2026' },
          accessibility: { readSimply: false, voiceEnabled: false, highContrast: false, speechRate: 1.0 },
          lastActive: Date.now(),
        };

        const { saveProfile } = await import('../services/db');
        await saveProfile(newProfile);
        setProfile(newProfile);

        setSuccessMsg('Account created successfully! Enrolled in Batch 26-03.');
        setTimeout(onClose, 800);
      } else {
        const user = await loginStudentAccount(phoneNumber.trim(), password.trim());

        const loggedInProfile: any = {
          id: user.id,
          fullName: user.fullName,
          displayName: user.fullName.split(' ')[0],
          phoneNumber: user.phoneNumber,
          avatar: user.avatar,
          squadId: user.squadId,
          role: user.role || 'learner',
          currentZone: user.currentZone || 1,
          xp: user.xp || 0,
          level: user.level || 1,
          streakDays: user.streakDays || 1,
          graceTokens: user.graceTokens || 3,
          totalTheorySeconds: user.totalTheorySeconds || 0,
          totalPracticalSeconds: user.totalPracticalSeconds || 0,
          ndpaConsent: { consented: true, timestamp: Date.now(), version: '1.0-2026' },
          accessibility: { readSimply: false, voiceEnabled: false, highContrast: false, speechRate: 1.0 },
          lastActive: Date.now(),
        };

        const { saveProfile } = await import('../services/db');
        await saveProfile(loggedInProfile);
        setProfile(loggedInProfile);

        setSuccessMsg(`Welcome back, ${user.fullName.split(' ')[0]}! Progress synced.`);
        setTimeout(onClose, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-bright)',
          boxShadow: 'var(--shadow-glow)',
          position: 'relative',
          padding: '22px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div 
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 10, 
              background: 'rgba(0, 230, 118, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-green)',
            }}
          >
            {mode === 'register' ? <UserPlus size={20} /> : <LogIn size={20} />}
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: 800 }}>
              {mode === 'register' ? 'Create Cadet Student Account' : 'Student Cadet Sign In'}
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
              ITF SUPA Standard 27ITFVS26-3 • Progress Tracking
            </div>
          </div>
        </div>

        {/* Toggle Mode */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: 'var(--radius-pill)', padding: '2px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            style={{
              flex: 1,
              background: mode === 'register' ? 'var(--accent-green)' : 'transparent',
              color: mode === 'register' ? '#0A2619' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '6px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            style={{
              flex: 1,
              background: mode === 'login' ? 'var(--accent-green)' : 'transparent',
              color: mode === 'login' ? '#0A2619' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '6px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Full Name (as registered with ITF):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chidi Okonkwo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      padding: '8px 12px 8px 32px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <User size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Choose Your Cadet Avatar:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
                  {avatarsList.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        aspectRatio: '1',
                        maxHeight: '44px',
                        borderRadius: '8px',
                        border: avatar === av ? '2px solid var(--accent-green)' : '1px solid var(--border-subtle)',
                        background: avatar === av ? 'rgba(0, 230, 118, 0.15)' : 'var(--bg-primary)',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        padding: '2px',
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Squad Selection */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Assigned Training Squad:
                </label>
                <select
                  value={squadId}
                  onChange={(e) => setSquadId(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  {BATCH_SQUADS.map((sq) => (
                    <option key={sq.id} value={sq.id}>
                      {sq.name} ({sq.zone})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Phone Number */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              Nigerian Phone Number:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                required
                placeholder="0803 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  padding: '8px 12px 8px 32px',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Phone size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Email (Optional for register, or login identifier) */}
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Email Address (optional):
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="cadet@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    padding: '8px 12px 8px 32px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <Mail size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {mode === 'register' ? 'Create Password / PIN:' : 'Enter Password / PIN:'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  padding: '8px 12px 8px 32px',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Lock size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
            </div>
          </div>

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-crimson)', fontSize: '12px', marginTop: '4px' }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '12px', marginTop: '4px', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '6px', minHeight: '42px', fontSize: '13px', fontWeight: 800, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading 
              ? 'Connecting to Postgres...' 
              : mode === 'register' 
              ? 'Enroll & Create Student Account' 
              : 'Sign In to Student Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
          🔒 Connected to ITF SUPA Cloud Database • All Progress Synced
        </div>
      </div>
    </div>
  );
};

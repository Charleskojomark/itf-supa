import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Phone, 
  Lock, 
  User, 
  Mail, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  registerStudentAccount, 
  loginStudentAccount, 
  verifyRolePinWithServer 
} from '../services/cloudDb';
import { BATCH_SQUADS } from '../data/squads';

export const AuthGateView: React.FC = () => {
  const { loginUser, setRoleWithAuth } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'staff'>('login');

  // Student Login State
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Student Register State
  const [regFullName, setRegFullName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regSquadId, setRegSquadId] = useState<string>(BATCH_SQUADS[0]?.id || 'squad-eko-01');
  const [regAvatar, setRegAvatar] = useState<string>('👨🏾‍💻');

  // Staff Clearance State
  const [staffRole, setStaffRole] = useState<'tutor' | 'assessor'>('tutor');
  const [staffPin, setStaffPin] = useState<string>('');

  // Status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const avatarsList = ['👨🏾‍💻', '👩🏾‍💻', '👨🏾‍🎓', '👩🏾‍🎓', '🧕🏾', '⚡'];

  // Handle Student Login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter your registered Nigerian phone number and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginStudentAccount(loginPhone.trim(), loginPassword.trim());
      setSuccessMsg(`Welcome back, ${user.fullName.split(' ')[0]}! Loading your mission...`);
      setTimeout(() => {
        loginUser(user);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials or register a new account.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Student Registration
  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regFullName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Full name, phone number, and password are required to enroll.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerStudentAccount({
        fullName: regFullName.trim(),
        phoneNumber: regPhone.trim(),
        email: regEmail.trim() || undefined,
        password: regPassword.trim(),
        squadId: regSquadId,
        avatar: regAvatar,
      });

      setSuccessMsg(`Account created for ${user.fullName}! Connected to ITF SUPA PostgreSQL database.`);
      setTimeout(() => {
        loginUser(user);
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. A student with this phone number may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Staff PIN Clearance
  const handleStaffClearance = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!staffPin.trim()) {
      setErrorMsg('Please enter your official Security PIN.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyRolePinWithServer(staffRole, staffPin.trim());
      setSuccessMsg(`Security PIN Verified. Clearance granted for ${staffRole === 'tutor' ? 'Tutor Hub' : 'SUPA Assessor'}.`);
      setTimeout(() => {
        setRoleWithAuth(staffRole);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Security Clearance Denied. Invalid PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px 14px 40px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '85vh' }}>
      {/* Official Government & Program Badge */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.12), rgba(10, 38, 25, 0.95))',
          border: '1px solid var(--border-medium)',
          textAlign: 'center',
          padding: '18px 14px',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 230, 118, 0.15)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: '10px', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
          <span>🇳🇬 FEDERAL REPUBLIC OF NIGERIA</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, lineHeight: 1.2, margin: '2px 0 6px' }}>
          ITF SUPA AI Specialist
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Vocational Training Portal & National Progress Registry
        </div>
        
        <div 
          style={{
            marginTop: '12px',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '8px',
            padding: '8px 10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}
        >
          🔒 <strong style={{ color: 'var(--accent-gold)' }}>Account Required:</strong> All cadets must create an account or sign in to record verified 80/20 practical progress in the live Supabase PostgreSQL database.
        </div>
      </div>

      {/* Auth Navigation Tabs */}
      <div 
        style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-pill)',
          padding: '3px',
          gap: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 4px',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            background: tab === 'login' ? 'var(--accent-green)' : 'transparent',
            color: tab === 'login' ? '#000000' : 'var(--text-secondary)',
          }}
        >
          <LogIn size={13} />
          <span>Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 4px',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            background: tab === 'register' ? 'var(--accent-green)' : 'transparent',
            color: tab === 'register' ? '#000000' : 'var(--text-secondary)',
          }}
        >
          <UserPlus size={13} />
          <span>Create Account</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab('staff'); setErrorMsg(null); setSuccessMsg(null); }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 4px',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            background: tab === 'staff' ? 'var(--accent-gold)' : 'transparent',
            color: tab === 'staff' ? '#000000' : 'var(--text-secondary)',
          }}
        >
          <ShieldCheck size={13} />
          <span>Staff PIN</span>
        </button>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div 
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 68, 68, 0.15)',
            border: '1px solid #FF4444',
            color: '#FF6B6B',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div 
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(0, 230, 118, 0.15)',
            border: '1px solid var(--accent-green)',
            color: 'var(--accent-green)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: STUDENT SIGN IN */}
      {tab === 'login' && (
        <form onSubmit={handleStudentLogin} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Cadet Sign In
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Enter your registered phone number or email to resume your training streak.
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Nigerian Phone Number or Email:
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                placeholder="08031234567 or student@itf.gov.ng"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Phone size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Password:
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Lock size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '4px', gap: '8px', fontSize: '14px', fontWeight: 800 }}
          >
            {isLoading ? 'Verifying Account...' : 'Sign In to Mission'}
            <ArrowRight size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setTab('register')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-green)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Don't have an account yet? Register here
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: CREATE STUDENT ACCOUNT */}
      {tab === 'register' && (
        <form onSubmit={handleStudentRegister} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Create Student Account
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Enroll in ITF SUPA AI Specialist Batch 26-03 to record your vocational progress.
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Full Legal Name (For Certification):
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                placeholder="e.g. Babatunde Adeyemi"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <User size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Nigerian Phone Number:
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="tel"
                placeholder="e.g. 0802 345 6789"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Phone size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Email Address (Optional):
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email"
                placeholder="cadet@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Mail size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Create Password:
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Lock size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Squad Choice */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Squad Assignment:
            </label>
            <select
              value={regSquadId}
              onChange={(e) => setRegSquadId(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
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

          {/* Avatar Choice */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Choose Cadet Avatar:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {avatarsList.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setRegAvatar(av)}
                  style={{
                    flex: 1,
                    fontSize: '20px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: regAvatar === av ? '2px solid var(--accent-green)' : '1px solid var(--border-subtle)',
                    background: regAvatar === av ? 'rgba(0, 230, 118, 0.15)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px', gap: '8px', fontSize: '14px', fontWeight: 800 }}
          >
            {isLoading ? 'Creating Account in Cloud DB...' : 'Create Account & Begin Training'}
            <Sparkles size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setTab('login')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-green)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Already have an account? Sign in here
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: STAFF CLEARANCE PORTAL (Tutors & Assessors) */}
      {tab === 'staff' && (
        <form onSubmit={handleStaffClearance} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-gold)' }}>
              Official Staff Clearance Portal
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Tutors, Facilitators, and SUPA Assessors must verify their official Security PIN.
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Select Clearance Role:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setStaffRole('tutor')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: staffRole === 'tutor' ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  background: staffRole === 'tutor' ? 'rgba(255, 158, 27, 0.15)' : 'var(--bg-primary)',
                  color: staffRole === 'tutor' ? 'var(--accent-gold)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <GraduationCap size={15} />
                <span>Tutor Hub</span>
              </button>

              <button
                type="button"
                onClick={() => setStaffRole('assessor')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: staffRole === 'assessor' ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  background: staffRole === 'assessor' ? 'rgba(255, 158, 27, 0.15)' : 'var(--bg-primary)',
                  color: staffRole === 'assessor' ? 'var(--accent-gold)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Award size={15} />
                <span>SUPA Assessor</span>
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
              Enter Official Security PIN:
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                placeholder="Enter 6-digit security PIN"
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
                maxLength={6}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--accent-gold)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  letterSpacing: '3px',
                  outline: 'none',
                }}
              />
              <Lock size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--accent-gold)' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              * PIN is verified against the secure database. Demo auto-fill has been removed.
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-gold"
            style={{ width: '100%', padding: '12px', marginTop: '4px', gap: '8px', fontSize: '14px', fontWeight: 800 }}
          >
            {isLoading ? 'Verifying Clearance...' : 'Verify PIN & Enter Portal'}
            <ShieldCheck size={16} />
          </button>
        </form>
      )}
    </div>
  );
};

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { 
  LearnerProfile, 
  Lesson, 
  LessonProgress, 
  UserRole, 
  StepType 
} from '../types';
import { 
  getOrCreateCurrentProfile, 
  saveProfile, 
  getLessonProgress, 
  saveStepProgress, 
  logSessionTime,
  exportLearnerDataJSON,
  eraseLearnerData
} from '../services/db';
import { SEED_LESSONS } from '../data/lessons';
import { NAIJA_ZONES, type Zone } from '../data/zones';

import { ROLE_CONFIGS, type AppUser } from '../types/rbac';
import { SYSTEM_USERS } from '../data/mockUsers';
import { syncStudentProgressToCloud } from '../services/cloudDb';

export type ActiveTab = 'today' | 'zones' | 'lab' | 'squad' | 'portfolio' | 'assessor_matrix' | 'tutor_dash';

interface AppContextType {
  profile: LearnerProfile | null;
  setProfile: (profile: LearnerProfile | null) => void;
  isAuthenticated: boolean;
  loginUser: (user: any) => Promise<void>;
  logoutUser: () => void;
  role: UserRole;
  currentUser: AppUser;
  setRole: (role: UserRole) => void;
  setRoleWithAuth: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  targetAuthRole: UserRole | null;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;
  isStudentAuthModalOpen: boolean;
  studentAuthMode: 'register' | 'login';
  openStudentAuthModal: (mode?: 'register' | 'login') => void;
  closeStudentAuthModal: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOnline: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeLesson: Lesson | null;
  setActiveLesson: (lesson: Lesson | null) => void;
  activeStepNumber: number;
  setActiveStepNumber: (step: number) => void;
  currentLessonProgress: LessonProgress | null;
  practicalRatioPercent: number; // e.g. 80%
  zones: Zone[];
  saveStep: (
    stepType: StepType,
    score: number,
    answer?: any,
    codeSnapshot?: string,
    explanationText?: string
  ) => Promise<void>;
  useGraceToken: () => Promise<boolean>;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  readSimply: boolean;
  toggleReadSimply: () => void;
  showNdpaModal: boolean;
  setShowNdpaModal: (show: boolean) => void;
  confirmNdpaConsent: () => Promise<void>;
  exportData: () => Promise<void>;
  eraseData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRoleState] = useState<UserRole>('learner');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [targetAuthRole, setTargetAuthRole] = useState<UserRole | null>(null);
  const [isStudentAuthModalOpen, setIsStudentAuthModalOpen] = useState<boolean>(false);
  const [studentAuthMode, setStudentAuthMode] = useState<'register' | 'login'>('register');
  const [activeTab, setActiveTabState] = useState<ActiveTab>('today');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(SEED_LESSONS[1]); // Default to Week 2 Day 1
  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);
  const [currentLessonProgress, setCurrentLessonProgress] = useState<LessonProgress | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showNdpaModal, setShowNdpaModal] = useState<boolean>(false);
  const [readSimply, setReadSimply] = useState<boolean>(false);

  // Active User Persona mapped to current Role
  const currentUser: AppUser = useMemo(() => {
    return SYSTEM_USERS[role] || SYSTEM_USERS.learner;
  }, [role]);

  const openAuthModal = (desiredRole?: UserRole) => {
    if (desiredRole) {
      setTargetAuthRole(desiredRole);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setTargetAuthRole(null);
  };

  const openStudentAuthModal = (mode: 'register' | 'login' = 'register') => {
    setStudentAuthMode(mode);
    setIsStudentAuthModalOpen(true);
  };

  const closeStudentAuthModal = () => {
    setIsStudentAuthModalOpen(false);
  };

  const loginUser = async (user: any) => {
    const newProfile: LearnerProfile = {
      id: user.id,
      fullName: user.fullName,
      displayName: user.fullName ? user.fullName.split(' ')[0] : 'Cadet',
      phoneNumber: user.phoneNumber || '',
      avatar: user.avatar || '👨🏾‍💻',
      squadId: user.squadId || 'squad-eko-01',
      role: (user.role as UserRole) || 'learner',
      currentZone: user.currentZone || 1,
      xp: user.xp || 50,
      level: user.level || 1,
      streakDays: user.streakDays || 1,
      graceTokens: user.graceTokens ?? 3,
      totalTheorySeconds: user.totalTheorySeconds || 0,
      totalPracticalSeconds: user.totalPracticalSeconds || 0,
      ndpaConsent: { consented: true, timestamp: Date.now(), version: '1.0-2026' },
      accessibility: { readSimply: false, voiceEnabled: true, highContrast: false, speechRate: 1.0 },
      lastActive: Date.now(),
    };
    await saveProfile(newProfile);
    localStorage.setItem('itf_supa_active_session', JSON.stringify({ id: user.id, role: newProfile.role }));
    setProfile(newProfile);
    setRoleState(newProfile.role);
    setIsAuthenticated(true);
    setActiveTabState('today');
  };

  const logoutUser = () => {
    localStorage.removeItem('itf_supa_active_session');
    setProfile(null);
    setRoleState('learner');
    setIsAuthenticated(false);
    setActiveTabState('today');
  };

  const setRoleWithAuth = (newRole: UserRole) => {
    setRoleState(newRole);
    setIsAuthenticated(true);
    localStorage.setItem('itf_supa_active_session', JSON.stringify({ id: 'staff_' + newRole, role: newRole }));
    if (profile) {
      saveProfile({ ...profile, role: newRole });
    }
    const defaultTab = ROLE_CONFIGS[newRole]?.defaultTab as ActiveTab;
    if (defaultTab) {
      setActiveTabState(defaultTab);
    }
  };

  const setRole = (newRole: UserRole) => {
    // If switching to higher clearance without authentication, trigger auth modal
    if (newRole !== 'learner') {
      openAuthModal(newRole);
    } else {
      setRoleWithAuth('learner');
    }
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
  };

  const saveStep = async (
    stepType: StepType,
    score: number,
    answer?: any,
    codeSnapshot?: string,
    explanationText?: string
  ) => {
    if (!profile || !activeLesson) return;

    const currentStepConfig = activeLesson.steps.find((s) => s.stepType === stepType);
    const isPractical = currentStepConfig?.isPractical ?? true;
    const timeSpent = currentStepConfig?.estimatedSeconds || 120;

    const updatedProg = await saveStepProgress(
      profile.id,
      activeLesson.id,
      activeLesson.weekNumber,
      activeLesson.dayNumber,
      stepType,
      activeStepNumber,
      isPractical,
      timeSpent,
      score,
      answer,
      codeSnapshot,
      explanationText
    );

    setCurrentLessonProgress(updatedProg);
    const updatedProfile = await getOrCreateCurrentProfile();
    setProfile(updatedProfile);

    // Auto-advance to next step if not step 7
    if (activeStepNumber < 7) {
      setActiveStepNumber(activeStepNumber + 1);
    }

    // Log session time for 80/20 auditing
    const theoryMins = isPractical ? 0 : Math.ceil(timeSpent / 60);
    const practicalMins = isPractical ? Math.ceil(timeSpent / 60) : 0;
    await logSessionTime(profile.id, theoryMins, practicalMins);

    // Sync to PostgreSQL cloud database on Supabase so instructors and assessors see real-time progress
    const totalSecs = (updatedProfile.totalPracticalSeconds || 0) + (updatedProfile.totalTheorySeconds || 0);
    const ratio = totalSecs > 0 ? Math.round(((updatedProfile.totalPracticalSeconds || 0) / totalSecs) * 100) : 80;
    syncStudentProgressToCloud({
      userId: updatedProfile.id,
      xp: updatedProfile.xp,
      currentZone: updatedProfile.currentZone,
      streakDays: updatedProfile.streakDays,
      totalPracticalSeconds: updatedProfile.totalPracticalSeconds,
      totalTheorySeconds: updatedProfile.totalTheorySeconds,
      practicalRatioPercent: ratio,
      lastLessonId: activeLesson.id,
    });
  };

  const useGraceToken = async (): Promise<boolean> => {
    if (!profile || profile.graceTokens <= 0) return false;
    const updated = {
      ...profile,
      graceTokens: profile.graceTokens - 1,
      streakDays: profile.streakDays + 1,
      lastActive: Date.now(),
    };
    await saveProfile(updated);
    setProfile(updated);
    return true;
  };

  const confirmNdpaConsent = async () => {
    if (!profile) return;
    const updated = {
      ...profile,
      ndpaConsent: {
        consented: true,
        timestamp: Date.now(),
        version: '1.0-2026',
        ipLocationApprox: 'Lagos, Nigeria',
      },
    };
    await saveProfile(updated);
    setProfile(updated);
    setShowNdpaModal(false);
  };

  const exportData = async () => {
    if (!profile) return;
    const jsonString = await exportLearnerDataJSON(profile.id);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Naija_Evidence_Record_${profile.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const eraseData = async () => {
    if (!profile) return;
    const confirmed = window.confirm(
      'Are you sure you want to permanently erase all your progress and portfolio records under NDPA Right to Erasure?'
    );
    if (confirmed) {
      await eraseLearnerData(profile.id);
      window.location.reload();
    }
  };

  // Initialize DB and restore active session if present
  useEffect(() => {
    async function loadData() {
      try {
        const rawSession = localStorage.getItem('itf_supa_active_session');
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session?.role && session.role !== 'learner') {
            setRoleState(session.role);
            setIsAuthenticated(true);
            return;
          }
          if (session?.id) {
            const { db } = await import('../services/db');
            const p = await db.profiles.get(session.id);
            if (p) {
              setProfile(p);
              setRoleState(p.role || 'learner');
              setIsAuthenticated(true);
              setReadSimply(p.accessibility?.readSimply ?? false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Could not restore user session:', err);
      }
      // No active session -> require login
      setIsAuthenticated(false);
      setProfile(null);
    }
    loadData();
  }, []);

  // Sync theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load progress when activeLesson changes
  useEffect(() => {
    if (profile && activeLesson) {
      getLessonProgress(profile.id, activeLesson.id).then((prog) => {
        if (prog) {
          setCurrentLessonProgress(prog);
          setActiveStepNumber(Math.min(prog.currentStep, 7));
        } else {
          setCurrentLessonProgress(null);
          setActiveStepNumber(1);
        }
      });
    }
  }, [profile, activeLesson]);

  // Compute live 20/80 practical ratio
  const practicalRatioPercent = useMemo(() => {
    if (!profile) return 80;
    const total = profile.totalPracticalSeconds + profile.totalTheorySeconds;
    if (total === 0) return 80; // default benchmark
    return Math.round((profile.totalPracticalSeconds / total) * 100);
  }, [profile]);

  // Web Speech API Narrator (zero cost, zero data)
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = profile?.accessibility.speechRate || 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleReadSimply = async () => {
    const nextVal = !readSimply;
    setReadSimply(nextVal);
    if (profile) {
      const updated = {
        ...profile,
        accessibility: { ...profile.accessibility, readSimply: nextVal },
      };
      await saveProfile(updated);
      setProfile(updated);
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        isAuthenticated,
        loginUser,
        logoutUser,
        role,
        currentUser,
        setRole,
        setRoleWithAuth,
        isAuthModalOpen,
        targetAuthRole,
        openAuthModal,
        closeAuthModal,
        isStudentAuthModalOpen,
        studentAuthMode,
        openStudentAuthModal,
        closeStudentAuthModal,
        activeTab,
        setActiveTab,
        isOnline,
        theme,
        toggleTheme,
        activeLesson,
        setActiveLesson,
        activeStepNumber,
        setActiveStepNumber,
        currentLessonProgress,
        practicalRatioPercent,
        zones: NAIJA_ZONES,
        saveStep,
        useGraceToken,
        speakText,
        stopSpeaking,
        isSpeaking,
        readSimply,
        toggleReadSimply,
        showNdpaModal,
        setShowNdpaModal,
        confirmNdpaConsent,
        exportData,
        eraseData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

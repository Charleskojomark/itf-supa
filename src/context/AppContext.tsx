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

export type ActiveTab = 'today' | 'zones' | 'lab' | 'squad' | 'portfolio' | 'assessor_matrix' | 'tutor_dash';

interface AppContextType {
  profile: LearnerProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
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
  const [role, setRoleState] = useState<UserRole>('learner');
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(SEED_LESSONS[1]); // Default to Week 2 Day 1
  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);
  const [currentLessonProgress, setCurrentLessonProgress] = useState<LessonProgress | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showNdpaModal, setShowNdpaModal] = useState<boolean>(false);
  const [readSimply, setReadSimply] = useState<boolean>(false);

  // Initialize DB and load profile
  useEffect(() => {
    async function loadData() {
      const p = await getOrCreateCurrentProfile();
      setProfile(p);
      setRoleState(p.role);
      setReadSimply(p.accessibility?.readSimply ?? false);
      if (!p.ndpaConsent?.consented) {
        setShowNdpaModal(true);
      }
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

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'assessor') {
      setActiveTab('assessor_matrix');
    } else if (newRole === 'tutor') {
      setActiveTab('tutor_dash');
    } else {
      setActiveTab('today');
    }
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

  return (
    <AppContext.Provider
      value={{
        profile,
        role,
        setRole,
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

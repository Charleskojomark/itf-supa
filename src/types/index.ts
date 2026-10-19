// Types for AI Naija Academy - ITF SUPA Level 3 LMS

export type UserRole = 'learner' | 'tutor' | 'assessor';

export interface NDPAConsent {
  consented: boolean;
  timestamp: number;
  version: string;
  ipLocationApprox?: string;
}

export interface LearnerProfile {
  id: string;
  fullName: string;
  displayName: string;
  phoneNumber: string;
  avatar: string;
  squadId: string;
  role: UserRole;
  currentZone: number; // 1 to 15
  xp: number;
  level: number;
  streakDays: number;
  graceTokens: number; // Max 3 for power/data outages
  totalTheorySeconds: number;
  totalPracticalSeconds: number;
  ndpaConsent: NDPAConsent;
  accessibility: {
    readSimply: boolean;
    voiceEnabled: boolean;
    highContrast: boolean;
    speechRate: number;
  };
  lastActive: number;
}

export type CriterionMastery = 'not_started' | 'practicing' | 'competent' | 'confident';

export interface ITFCriterion {
  code: string; // e.g. "A.1.1", "D.1.4", "F.1.2"
  domain: string; // e.g. "Mission A: Occupational Health & QA", "Domain D: Software Dev"
  subDomain: string;
  title: string;
  description: string;
  taughtInWeeks: number[];
  practicedInWeeks: number[];
  assessedInWeeks: number[];
  status?: CriterionMastery;
}

export type StepType = 
  | 'hook' 
  | 'see_it' 
  | 'predict' 
  | 'try_it' 
  | 'break_it' 
  | 'explain_it' 
  | 'build_it';

export interface ParsonBlock {
  id: string;
  text: string;
  indent: number;
}

export interface UnitTest {
  name: string;
  testCode: string;
  expectedOutput: string;
}

export interface StuckLadder {
  hint1: string;
  hint2: string;
  workedExample: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  naijaAnalogy: string;
}

export interface LessonStep {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  stepType: StepType;
  title: string;
  instruction: string;
  readSimplyInstruction?: string;
  isPractical: boolean; // Counts toward the 80% practical rule
  estimatedSeconds: number;
  
  // Specific interactive step configurations
  widgetId?: string;
  widgetConfig?: Record<string, any>;
  
  predictOptions?: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  
  codeStarter?: string;
  codeSolution?: string;
  parsonsBlocks?: ParsonBlock[];
  unitTests?: UnitTest[];
  
  buggyCode?: string;
  bugHint?: string;
  bugSolution?: string;
  
  explainPrompt?: string;
  explainKeyTerms?: string[];
  peerAnalogies?: string[];
  
  stuckLadder: StuckLadder;
}

export interface BossBattleQuestion {
  id: string;
  criterionCode: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  practicalTask?: {
    starterCode: string;
    testCases: { input: string; expected: string }[];
  };
}

export interface BossBattleConfig {
  id: string;
  title: string;
  scenario: string;
  timeLimitSeconds: number;
  passPercentage: number;
  questions: BossBattleQuestion[];
}

export interface Lesson {
  id: string;
  weekNumber: number;
  dayNumber: number;
  title: string;
  subtitle: string;
  zoneName: string;
  criteriaCodes: string[];
  durationMinutes: number;
  theoryMinutes: number;
  practicalMinutes: number;
  glossary: GlossaryItem[];
  steps: LessonStep[];
  bossBattle?: BossBattleConfig;
}

export interface StepProgressData {
  completed: boolean;
  score: number;
  answer?: any;
  timeSpentSec: number;
  timestamp: number;
}

export interface LessonProgress {
  id: string; // composite userId_lessonId
  userId: string;
  lessonId: string;
  weekNumber: number;
  dayNumber: number;
  currentStep: number;
  completed: boolean;
  score: number;
  theoryTimeSec: number;
  practicalTimeSec: number;
  stepProgress: Record<StepType, StepProgressData>;
  codeSnapshot: string;
  explanationText?: string;
  stuckLevelReached: number; // 0=none, 1=hint1, 2=hint2, 3=worked, 4=tutor flagged
  tutorFeedback?: string;
  lastUpdated: number;
  synced: boolean;
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  helpfulPoints: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface Squad {
  id: string;
  name: string;
  motto: string;
  zone: string;
  batchNumber: string;
  members: SquadMember[];
  weeklyQuest: {
    title: string;
    description: string;
    goal: number;
    current: number;
    rewardXp: number;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteriaCode?: string;
  unlockedAt?: number;
}

export interface TimeLog {
  id?: number;
  userId: string;
  date: string; // YYYY-MM-DD
  theoryMinutes: number;
  practicalMinutes: number;
  activitiesCount: number;
}

export interface CriterionEvidence {
  criterionCode: string;
  userId: string;
  lessonId: string;
  score: number;
  mastery: CriterionMastery;
  codeSnippet?: string;
  timestamp: number;
}

import Dexie, { type Table } from 'dexie';
import type { 
  LearnerProfile, 
  LessonProgress, 
  TimeLog, 
  CriterionEvidence, 
  Badge, 
  StepType 
} from '../types';

export class AINaijaDatabase extends Dexie {
  profiles!: Table<LearnerProfile, string>;
  lessonProgress!: Table<LessonProgress, string>;
  timeLogs!: Table<TimeLog, number>;
  criterionEvidence!: Table<CriterionEvidence, string>;
  badges!: Table<Badge & { userId: string }, string>;

  constructor() {
    super('AINaijaAcademyDB');
    this.version(1).stores({
      profiles: 'id, role, currentZone, xp, streakDays',
      lessonProgress: 'id, userId, lessonId, weekNumber, dayNumber, completed, synced',
      timeLogs: '++id, userId, date',
      criterionEvidence: '[criterionCode+userId], criterionCode, userId, mastery',
      badges: 'id, userId, unlockedAt',
    });
  }
}

export const db = new AINaijaDatabase();

const DEFAULT_PROFILE_ID = 'learner-chidi-001';

export const INITIAL_PROFILE: LearnerProfile = {
  id: DEFAULT_PROFILE_ID,
  fullName: 'Chidi Okonkwo',
  displayName: 'Chidi AI',
  phoneNumber: '+234 803 123 4567',
  avatar: '🚀',
  squadId: 'squad-eko-01',
  role: 'learner',
  currentZone: 1, // Lagos Island
  xp: 120,
  level: 1,
  streakDays: 4,
  graceTokens: 3, // 3 grace tokens for power cuts
  totalTheorySeconds: 1800, // 30 mins
  totalPracticalSeconds: 7200, // 120 mins (80% practical ratio!)
  ndpaConsent: {
    consented: true,
    timestamp: Date.now() - 86400000 * 3,
    version: '1.0-2026',
    ipLocationApprox: 'Lagos, Nigeria',
  },
  accessibility: {
    readSimply: false,
    voiceEnabled: true,
    highContrast: false,
    speechRate: 1.0,
  },
  lastActive: Date.now(),
};

// Ensure initial profile exists
export async function getOrCreateCurrentProfile(): Promise<LearnerProfile> {
  const existing = await db.profiles.get(DEFAULT_PROFILE_ID);
  if (existing) {
    return existing;
  }
  await db.profiles.put(INITIAL_PROFILE);
  return INITIAL_PROFILE;
}

export async function saveProfile(profile: LearnerProfile): Promise<void> {
  await db.profiles.put(profile);
}

export async function getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined> {
  const compositeId = `${userId}_${lessonId}`;
  return await db.lessonProgress.get(compositeId);
}

export async function saveStepProgress(
  userId: string,
  lessonId: string,
  weekNumber: number,
  dayNumber: number,
  stepType: StepType,
  stepNumber: number,
  isPractical: boolean,
  timeSpentSec: number,
  score: number,
  answer?: any,
  codeSnapshot?: string,
  explanationText?: string
): Promise<LessonProgress> {
  const compositeId = `${userId}_${lessonId}`;
  let progress = await db.lessonProgress.get(compositeId);

  if (!progress) {
    progress = {
      id: compositeId,
      userId,
      lessonId,
      weekNumber,
      dayNumber,
      currentStep: stepNumber,
      completed: false,
      score: 0,
      theoryTimeSec: 0,
      practicalTimeSec: 0,
      stepProgress: {
        hook: { completed: false, score: 0, timeSpentSec: 0, timestamp: 0 },
        see_it: { completed: false, score: 0, timeSpentSec: 0, timestamp: 0 },
        predict: { completed: false, score: 0, timeSpentSec: 0, timestamp: 0 },
        try_it: { completed: false, score: 0, timeSpentSec: 0, timestamp: 0 },
        break_it: { completed: false, score: 0, timeSpentSec: 0, timestamp: 0 },
        explain_it: { completed: false, score: 0, timeSpentSec: 0, timestamp: 0 },
        build_it: { completed: false, score: 0, timeSpentSec: 0, timestamp: 0 },
      },
      codeSnapshot: '',
      stuckLevelReached: 0,
      lastUpdated: Date.now(),
      synced: false,
    };
  }

  // Update step
  progress.stepProgress[stepType] = {
    completed: true,
    score,
    answer,
    timeSpentSec: (progress.stepProgress[stepType]?.timeSpentSec || 0) + timeSpentSec,
    timestamp: Date.now(),
  };

  if (isPractical) {
    progress.practicalTimeSec += timeSpentSec;
  } else {
    progress.theoryTimeSec += timeSpentSec;
  }

  if (codeSnapshot) {
    progress.codeSnapshot = codeSnapshot;
  }
  if (explanationText) {
    progress.explanationText = explanationText;
  }

  progress.currentStep = Math.max(progress.currentStep, stepNumber + 1);

  // Check if all 7 steps are done
  const allSteps = ['hook', 'see_it', 'predict', 'try_it', 'break_it', 'explain_it', 'build_it'] as StepType[];
  const isAllComplete = allSteps.every((s) => progress!.stepProgress[s]?.completed);
  if (isAllComplete) {
    progress.completed = true;
  }

  progress.lastUpdated = Date.now();
  await db.lessonProgress.put(progress);

  // Also update user's profile total time logs
  const profile = await db.profiles.get(userId);
  if (profile) {
    if (isPractical) {
      profile.totalPracticalSeconds += timeSpentSec;
    } else {
      profile.totalTheorySeconds += timeSpentSec;
    }
    profile.xp += score * 10;
    profile.lastActive = Date.now();
    await db.profiles.put(profile);
  }

  return progress;
}

export async function getAllProgressForUser(userId: string): Promise<LessonProgress[]> {
  return await db.lessonProgress.where('userId').equals(userId).toArray();
}

export async function logSessionTime(
  userId: string, 
  theoryMins: number, 
  practicalMins: number
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const existing = await db.timeLogs.where({ userId, date: today }).first();
  if (existing && existing.id) {
    await db.timeLogs.update(existing.id, {
      theoryMinutes: existing.theoryMinutes + theoryMins,
      practicalMinutes: existing.practicalMinutes + practicalMins,
      activitiesCount: existing.activitiesCount + 1,
    });
  } else {
    await db.timeLogs.add({
      userId,
      date: today,
      theoryMinutes: theoryMins,
      practicalMinutes: practicalMins,
      activitiesCount: 1,
    });
  }
}

export async function getTimeLogs(userId: string): Promise<TimeLog[]> {
  return await db.timeLogs.where('userId').equals(userId).toArray();
}

// NDPA Compliance: Export all local learner data to a downloadable JSON file
export async function exportLearnerDataJSON(userId: string): Promise<string> {
  const profile = await db.profiles.get(userId);
  const progress = await db.lessonProgress.where('userId').equals(userId).toArray();
  const timeLogs = await db.timeLogs.where('userId').equals(userId).toArray();
  const badges = await db.badges.where('userId').equals(userId).toArray();
  const criteria = await db.criterionEvidence.where('userId').equals(userId).toArray();

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    standard: 'ITF Artificial Intelligence Specialist (Level 3) 27ITFVS26-3',
    ndpaComplianceNotice: 'Personal data collected under NDPA lawful basis for vocational training.',
    profile,
    progress,
    timeLogs,
    badges,
    criteriaEvidence: criteria,
  };

  return JSON.stringify(exportPayload, null, 2);
}

// NDPA Compliance: One-click right to erasure
export async function eraseLearnerData(userId: string): Promise<void> {
  await db.lessonProgress.where('userId').equals(userId).delete();
  await db.timeLogs.where('userId').equals(userId).delete();
  await db.criterionEvidence.where('userId').equals(userId).delete();
  await db.badges.where('userId').equals(userId).delete();
  await db.profiles.delete(userId);
}

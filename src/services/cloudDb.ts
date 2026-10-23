// Client Cloud Database Service for ITF SUPA
// Connects to Postgres database via API routes with offline fallback

export interface CloudStudent {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  role: string;
  squadId: string;
  avatar: string;
  batchId?: string;
  createdAt: string;
  lastActive: string;
  currentZone: number;
  xp: number;
  level: number;
  streakDays: number;
  totalPracticalMinutes: number;
  totalTheoryMinutes: number;
  practicalRatioPercent: number;
  completedCriteria: string[];
  criteriaCount: number;
}

export async function registerStudentAccount(data: {
  fullName: string;
  phoneNumber: string;
  password: string;
  email?: string;
  squadId?: string;
  avatar?: string;
}) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to register account');
  }
  return json.user;
}

export async function loginStudentAccount(identifier: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Invalid credentials');
  }
  return json.user;
}

export async function verifyRolePinWithServer(role: string, pin: string) {
  const res = await fetch('/api/auth/verify-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, pin }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Security Clearance Denied');
  }
  return json;
}

export async function fetchAllStudentsFromCloud(): Promise<CloudStudent[]> {
  try {
    const res = await fetch('/api/students');
    if (!res.ok) {
      throw new Error('Failed to fetch students directory');
    }
    const json = await res.json();
    return json.students || [];
  } catch (err) {
    console.warn('Could not fetch students from cloud, falling back to cached directory:', err);
    return [];
  }
}

export async function syncStudentProgressToCloud(data: {
  userId: string;
  xp: number;
  currentZone: number;
  streakDays: number;
  totalPracticalSeconds: number;
  totalTheorySeconds: number;
  practicalRatioPercent: number;
  completedCriteria?: string[];
  lastLessonId?: string;
}) {
  try {
    if (!navigator.onLine) return; // offline-first
    await fetch('/api/students/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Failed to sync progress to cloud, cached in IndexedDB:', err);
  }
}

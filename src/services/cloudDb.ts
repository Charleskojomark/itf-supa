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

async function safeParseJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      throw new Error(`Server returned HTML instead of JSON (${res.status}). Please verify API endpoint configuration.`);
    }
    throw new Error(`Invalid server response: ${text.substring(0, 120)}`);
  }
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
  const json = await safeParseJson(res);
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
  const json = await safeParseJson(res);
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
  const json = await safeParseJson(res);
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
}): Promise<boolean> {
  try {
    if (!navigator.onLine) return false; // offline-first
    const res = await fetch('/api/students/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await safeParseJson(res);
    return Boolean(json?.success);
  } catch (err) {
    console.warn('Failed to sync progress to cloud, cached in IndexedDB:', err);
    return false;
  }
}

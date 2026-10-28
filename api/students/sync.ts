import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    userId, 
    xp, 
    currentZone, 
    streakDays, 
    totalPracticalSeconds, 
    totalTheorySeconds, 
    practicalRatioPercent, 
    completedCriteria,
    lastLessonId 
  } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const criteriaArray = Array.isArray(completedCriteria) ? completedCriteria : [];

    await pool.query(
      `INSERT INTO public.student_progress (
        user_id, xp, current_zone, streak_days, total_practical_seconds, total_theory_seconds, practical_ratio_percent, completed_criteria, last_lesson_id, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET xp = GREATEST(COALESCE(EXCLUDED.xp, 0), COALESCE(student_progress.xp, 0)),
          current_zone = GREATEST(COALESCE(EXCLUDED.current_zone, 1), COALESCE(student_progress.current_zone, 1)),
          streak_days = GREATEST(COALESCE(EXCLUDED.streak_days, 1), COALESCE(student_progress.streak_days, 1)),
          total_practical_seconds = GREATEST(COALESCE(EXCLUDED.total_practical_seconds, 0), COALESCE(student_progress.total_practical_seconds, 0)),
          total_theory_seconds = GREATEST(COALESCE(EXCLUDED.total_theory_seconds, 0), COALESCE(student_progress.total_theory_seconds, 0)),
          practical_ratio_percent = COALESCE(EXCLUDED.practical_ratio_percent, student_progress.practical_ratio_percent),
          completed_criteria = CASE 
            WHEN EXCLUDED.completed_criteria IS NOT NULL AND array_length(EXCLUDED.completed_criteria, 1) > 0 
            THEN array(SELECT DISTINCT unnest(array_cat(COALESCE(student_progress.completed_criteria, '{}'::text[]), EXCLUDED.completed_criteria)))
            ELSE COALESCE(student_progress.completed_criteria, '{}'::text[])
          END,
          last_lesson_id = COALESCE(EXCLUDED.last_lesson_id, student_progress.last_lesson_id),
          updated_at = NOW();`,
      [
        userId,
        xp || 0,
        currentZone || 1,
        streakDays || 1,
        totalPracticalSeconds || 0,
        totalTheorySeconds || 0,
        practicalRatioPercent || 80,
        criteriaArray,
        lastLessonId || null
      ]
    );

    // Update user's last_active
    await pool.query(`UPDATE public.users SET last_active = NOW() WHERE id = $1`, [userId]);

    return res.status(200).json({ success: true, message: 'Progress synced to cloud database' });
  } catch (err: any) {
    console.error('Sync progress error:', err);
    return res.status(500).json({ error: err.message || 'Sync failed' });
  }
}

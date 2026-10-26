import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const studentsRes = await pool.query(`
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.phone_number, 
        u.role, 
        u.squad_id, 
        u.avatar, 
        u.batch_id, 
        u.created_at, 
        u.last_active,
        COALESCE(p.current_zone, 1) as current_zone,
        COALESCE(p.xp, 0) as xp,
        COALESCE(p.level, 1) as level,
        COALESCE(p.streak_days, 0) as streak_days,
        COALESCE(p.total_practical_seconds, 0) as total_practical_seconds,
        COALESCE(p.total_theory_seconds, 0) as total_theory_seconds,
        COALESCE(p.practical_ratio_percent, 80) as practical_ratio_percent,
        COALESCE(p.completed_criteria, '{}') as completed_criteria
      FROM public.users u
      LEFT JOIN public.student_progress p ON u.id = p.user_id
      WHERE u.role = 'learner'
      ORDER BY u.created_at DESC;
    `);

    const students = studentsRes.rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phoneNumber: r.phone_number,
      role: r.role,
      squadId: r.squad_id,
      avatar: r.avatar,
      batchId: r.batch_id,
      createdAt: r.created_at,
      lastActive: r.last_active,
      currentZone: r.current_zone,
      xp: r.xp,
      level: r.level,
      streakDays: r.streak_days,
      totalPracticalMinutes: Math.round(r.total_practical_seconds / 60),
      totalTheoryMinutes: Math.round(r.total_theory_seconds / 60),
      practicalRatioPercent: r.practical_ratio_percent,
      completedCriteria: r.completed_criteria || [],
      criteriaCount: (r.completed_criteria || []).length,
    }));

    return res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });
  } catch (err: any) {
    console.error('Fetch students error:', err);
    return res.status(500).json({ error: err.message || 'Failed to retrieve students from database' });
  }
}

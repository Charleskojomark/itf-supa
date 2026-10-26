import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool, hashPin } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { identifier, password } = req.body || {};

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Phone number or email and password are required' });
  }

  const rawIdent = String(identifier).trim();
  const cleanIdent = rawIdent.replace(/\s+/g, '');
  
  let identWithPlus234 = cleanIdent;
  let identWithZero = cleanIdent;

  if (cleanIdent.startsWith('+234')) {
    identWithZero = '0' + cleanIdent.substring(4);
  } else if (cleanIdent.startsWith('234')) {
    identWithPlus234 = '+' + cleanIdent;
    identWithZero = '0' + cleanIdent.substring(3);
  } else if (cleanIdent.startsWith('0')) {
    identWithPlus234 = '+234' + cleanIdent.substring(1);
  }

  const passwordHash = hashPin(password);

  try {
    const userRes = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone_number, u.role, u.squad_id, u.avatar, u.organization,
              p.current_zone, p.xp, p.level, p.streak_days, p.grace_tokens, p.total_theory_seconds,
              p.total_practical_seconds, p.practical_ratio_percent, p.completed_criteria
       FROM public.users u
       LEFT JOIN public.student_progress p ON u.id = p.user_id
       WHERE (
         u.phone_number = $1 
         OR u.phone_number = $2 
         OR u.phone_number = $3
         OR LOWER(u.email) = LOWER($1)
         OR LOWER(u.email) = LOWER($2)
       )
       AND u.password_hash = $4`,
      [cleanIdent, identWithZero, identWithPlus234, passwordHash]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid phone/email or password.' });
    }

    const row = userRes.rows[0];

    // Update last active
    await pool.query(`UPDATE public.users SET last_active = NOW() WHERE id = $1`, [row.id]);

    return res.status(200).json({
      success: true,
      user: {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phoneNumber: row.phone_number,
        role: row.role,
        squadId: row.squad_id,
        avatar: row.avatar,
        organization: row.organization,
        currentZone: row.current_zone || 1,
        xp: row.xp || 0,
        level: row.level || 1,
        streakDays: row.streak_days || 0,
        graceTokens: row.grace_tokens || 3,
        totalTheorySeconds: row.total_theory_seconds || 0,
        totalPracticalSeconds: row.total_practical_seconds || 0,
        practicalRatioPercent: row.practical_ratio_percent || 80,
        completedCriteria: row.completed_criteria || [],
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}

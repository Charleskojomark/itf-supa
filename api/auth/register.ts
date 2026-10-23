import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool, hashPin } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, email, phoneNumber, password, squadId, avatar } = req.body || {};

  if (!fullName || !phoneNumber || !password) {
    return res.status(400).json({ error: 'Full name, phone number, and password are required' });
  }

  const cleanPhone = String(phoneNumber).trim().replace(/\s+/g, '');
  const cleanEmail = email ? String(email).trim().toLowerCase() : null;
  const userId = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const passwordHash = hashPin(password);

  try {
    // Check if phone or email already registered
    const existing = await pool.query(
      `SELECT id FROM public.users WHERE phone_number = $1 OR (email = $2 AND email IS NOT NULL)`,
      [cleanPhone, cleanEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this phone number or email already exists. Please log in.' });
    }

    // Insert user
    await pool.query(
      `INSERT INTO public.users (id, full_name, email, phone_number, password_hash, role, squad_id, avatar)
       VALUES ($1, $2, $3, $4, $5, 'learner', $6, $7)`,
      [userId, fullName.trim(), cleanEmail, cleanPhone, passwordHash, squadId || 'squad_eko', avatar || '👨🏾‍💻']
    );

    // Initialize progress
    await pool.query(
      `INSERT INTO public.student_progress (user_id, current_zone, xp, level, streak_days, grace_tokens, total_theory_seconds, total_practical_seconds, practical_ratio_percent)
       VALUES ($1, 1, 50, 1, 1, 3, 0, 0, 80)`,
      [userId]
    );

    return res.status(201).json({
      success: true,
      user: {
        id: userId,
        fullName: fullName.trim(),
        email: cleanEmail,
        phoneNumber: cleanPhone,
        role: 'learner',
        squadId: squadId || 'squad_eko',
        avatar: avatar || '👨🏾‍💻',
        xp: 50,
        level: 1,
        streakDays: 1,
        currentZone: 1,
        practicalRatioPercent: 80,
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create student account' });
  }
}

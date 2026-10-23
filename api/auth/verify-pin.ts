import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool, hashPin } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, pin } = req.body || {};

  if (!role || !pin) {
    return res.status(400).json({ error: 'Role and PIN are required' });
  }

  const cleanRole = String(role).trim().toLowerCase();
  const pinHash = hashPin(pin);

  try {
    const pinRes = await pool.query(
      `SELECT role, description FROM public.system_pins WHERE role = $1 AND pin_hash = $2`,
      [cleanRole, pinHash]
    );

    if (pinRes.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: `Invalid security PIN for ${cleanRole}. Clearance denied.` 
      });
    }

    return res.status(200).json({
      success: true,
      role: cleanRole,
      message: 'Official Security Clearance Verified.'
    });
  } catch (err: any) {
    console.error('Verify PIN error:', err);
    return res.status(500).json({ error: err.message || 'Verification service error' });
  }
}

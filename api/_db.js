import pg from 'pg';
import crypto from 'crypto';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'aws-0-eu-west-1.pooler.supabase.com',
  port: Number(process.env.PGPORT) || 6543,
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'postgres.wncbdaqufbsdxzjoalbf',
  password: process.env.PGPASSWORD || '+mB3L#xFL5Pb@i?',
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

export function hashPin(pin) {
  return crypto.createHash('sha256').update(String(pin).trim()).digest('hex');
}

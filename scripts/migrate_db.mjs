import pg from 'pg';
import crypto from 'crypto';
const { Client } = pg;

export function hashPin(pin) {
  return crypto.createHash('sha256').update(pin.trim()).digest('hex');
}

const client = new Client({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.wncbdaqufbsdxzjoalbf',
  password: '+mB3L#xFL5Pb@i?',
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to Postgres, applying schema migrations...');

    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone_number TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'learner',
        avatar TEXT DEFAULT '👨🏾‍💻',
        squad_id TEXT DEFAULT 'squad_eko',
        batch_id TEXT DEFAULT 'ITF-SUPA-B26-03',
        organization TEXT DEFAULT 'ITF SUPA AI Academy',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_active TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ Created users table');

    // 2. Student Progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.student_progress (
        user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
        current_zone INT DEFAULT 1,
        xp INT DEFAULT 0,
        level INT DEFAULT 1,
        streak_days INT DEFAULT 0,
        grace_tokens INT DEFAULT 3,
        total_theory_seconds INT DEFAULT 0,
        total_practical_seconds INT DEFAULT 0,
        practical_ratio_percent INT DEFAULT 80,
        completed_criteria TEXT[] DEFAULT '{}',
        last_lesson_id TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ Created student_progress table');

    // 3. System Role PINs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.system_pins (
        role TEXT PRIMARY KEY,
        pin_hash TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ Created system_pins table');

    // 4. Lesson Submissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.lesson_submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
        lesson_id TEXT NOT NULL,
        step_number INT NOT NULL,
        step_type TEXT NOT NULL,
        is_practical BOOLEAN NOT NULL DEFAULT true,
        time_spent_seconds INT NOT NULL DEFAULT 120,
        score INT NOT NULL DEFAULT 10,
        code_snapshot TEXT,
        explanation_text TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ Created lesson_submissions table');

    // Insert Real Real PINs for Facilitator (Tutor) and Assessor:
    // Real Tutor PIN: 748291
    // Real Assessor PIN: 938104
    const tutorPin = '748291';
    const assessorPin = '938104';
    const adminPin = '202688';

    await client.query(`
      INSERT INTO public.system_pins (role, pin_hash, description)
      VALUES 
        ('tutor', $1, 'Official ITF Training Facilitator Access PIN'),
        ('assessor', $2, 'Official ITF SUPA Vocational Assessor Clearance PIN'),
        ('admin', $3, 'ITF SUPA System Administrator Master PIN')
      ON CONFLICT (role) DO UPDATE 
      SET pin_hash = EXCLUDED.pin_hash,
          updated_at = NOW();
    `, [hashPin(tutorPin), hashPin(assessorPin), hashPin(adminPin)]);
    console.log('✓ Configured real hashed security PINs for tutor and assessor');

    // Seed default verified test students so teacher/assessor can immediately inspect registered cohorts
    const seedStudents = [
      {
        id: 'usr_chidi_okonkwo',
        full_name: 'Chidi Okonkwo',
        email: 'chidi.okonkwo@cadet.itf.gov.ng',
        phone_number: '+2348031234567',
        password_hash: hashPin('cadet123'),
        squad_id: 'squad_eko',
        avatar: '👨🏾‍💻',
        xp: 140,
        streak_days: 5,
        zone: 2,
        practical: 7800,
        theory: 1200,
        criteria: ['A.1.1', 'A.1.2', 'D.1.1']
      },
      {
        id: 'usr_tunde_bakare',
        full_name: 'Tunde Bakare',
        email: 'tunde.bakare@cadet.itf.gov.ng',
        phone_number: '+2348023456789',
        password_hash: hashPin('cadet123'),
        squad_id: 'squad_eko',
        avatar: '👨🏾‍🎓',
        xp: 210,
        streak_days: 7,
        zone: 2,
        practical: 9600,
        theory: 1800,
        criteria: ['A.1.1', 'A.1.2', 'D.1.1', 'D.1.3']
      },
      {
        id: 'usr_somto_obi',
        full_name: 'Somtochukwu Obi',
        email: 'somto.obi@cadet.itf.gov.ng',
        phone_number: '+2348098765432',
        password_hash: hashPin('cadet123'),
        squad_id: 'squad_confluence',
        avatar: '👩🏾‍💻',
        xp: 95,
        streak_days: 3,
        zone: 1,
        practical: 5400,
        theory: 1200,
        criteria: ['A.1.1', 'A.1.2']
      },
      {
        id: 'usr_fatima_garba',
        full_name: 'Fatima Garba',
        email: 'fatima.garba@cadet.itf.gov.ng',
        phone_number: '+2348076543210',
        password_hash: hashPin('cadet123'),
        squad_id: 'squad_arewa',
        avatar: '🧕🏾',
        xp: 180,
        streak_days: 6,
        zone: 2,
        practical: 8800,
        theory: 1500,
        criteria: ['A.1.1', 'A.1.2', 'D.1.1']
      }
    ];

    for (const s of seedStudents) {
      await client.query(`
        INSERT INTO public.users (id, full_name, email, phone_number, password_hash, role, avatar, squad_id)
        VALUES ($1, $2, $3, $4, $5, 'learner', $6, $7)
        ON CONFLICT (id) DO NOTHING;
      `, [s.id, s.full_name, s.email, s.phone_number, s.password_hash, s.avatar, s.squad_id]);

      const ratio = Math.round((s.practical / (s.practical + s.theory)) * 100);
      await client.query(`
        INSERT INTO public.student_progress (
          user_id, current_zone, xp, streak_days, total_practical_seconds, total_theory_seconds, practical_ratio_percent, completed_criteria
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (user_id) DO UPDATE
        SET xp = EXCLUDED.xp,
            current_zone = EXCLUDED.current_zone,
            streak_days = EXCLUDED.streak_days,
            total_practical_seconds = EXCLUDED.total_practical_seconds,
            total_theory_seconds = EXCLUDED.total_theory_seconds,
            practical_ratio_percent = EXCLUDED.practical_ratio_percent,
            completed_criteria = EXCLUDED.completed_criteria;
      `, [s.id, s.zone, s.xp, s.streak_days, s.practical, s.theory, ratio, s.criteria]);
    }
    console.log('✓ Seeded candidate learner profiles for testing student tracking');

    await client.end();
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();

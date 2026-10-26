import pg from 'pg';
import crypto from 'crypto';
const { Client } = pg;

function hashPin(pin) {
  return crypto.createHash('sha256').update(pin.trim()).digest('hex');
}

const client = new Client({
  host: process.env.POSTGRES_HOST || 'aws-0-eu-west-1.pooler.supabase.com',
  port: parseInt(process.env.POSTGRES_PORT || '6543', 10),
  database: process.env.POSTGRES_DATABASE || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres.wncbdaqufbsdxzjoalbf',
  password: process.env.POSTGRES_PASSWORD || '+mB3L#xFL5Pb@i?',
  ssl: { rejectUnauthorized: false }
});

async function seedStaff() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL...');

    const staffAccounts = [
      {
        id: 'usr_tutor_bello',
        full_name: 'Engr. Mohammed Bello',
        email: 'tutor.bello@itf.gov.ng',
        phone_number: '08031112233',
        password_hash: hashPin('TeacherPass2026!'),
        role: 'tutor',
        avatar: '👨🏾‍🏫',
        squad_id: 'squad-eko-01',
        organization: 'ITF Vocational Training Directorate'
      },
      {
        id: 'usr_tutor_funke',
        full_name: 'Mrs. Funke Adeleke',
        email: 'tutor.funke@itf.gov.ng',
        phone_number: '08032223344',
        password_hash: hashPin('TeacherPass2026!'),
        role: 'tutor',
        avatar: '👩🏾‍🏫',
        squad_id: 'squad-cocoa-02',
        organization: 'ITF Vocational Training Directorate'
      },
      {
        id: 'usr_assessor_okafor',
        full_name: 'Dr. Emeka Okafor',
        email: 'assessor.okafor@itf.gov.ng',
        phone_number: '08035556677',
        password_hash: hashPin('AssessorPass2026!'),
        role: 'assessor',
        avatar: '👨🏾‍💼',
        squad_id: 'squad-confluence-03',
        organization: 'SUPA National Assessment Board'
      },
      {
        id: 'usr_assessor_usman',
        full_name: 'Hajiya Zainab Usman',
        email: 'assessor.usman@itf.gov.ng',
        phone_number: '08036667788',
        password_hash: hashPin('AssessorPass2026!'),
        role: 'assessor',
        avatar: '🧕🏾',
        squad_id: 'squad-eko-01',
        organization: 'SUPA National Assessment Board'
      }
    ];

    for (const s of staffAccounts) {
      await client.query(`
        INSERT INTO public.users (id, full_name, email, phone_number, password_hash, role, avatar, squad_id, organization)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            email = EXCLUDED.email,
            phone_number = EXCLUDED.phone_number,
            password_hash = EXCLUDED.password_hash,
            role = EXCLUDED.role,
            avatar = EXCLUDED.avatar,
            organization = EXCLUDED.organization;
      `, [s.id, s.full_name, s.email, s.phone_number, s.password_hash, s.role, s.avatar, s.squad_id, s.organization]);
      console.log(`✓ Inserted/Updated ${s.role}: ${s.full_name} (${s.phone_number} / ${s.email})`);
    }

    // Also update existing cadet learner passwords so they can log in with CadetPass2026!
    const cadetPasswordHash = hashPin('CadetPass2026!');
    await client.query(`
      UPDATE public.users 
      SET password_hash = $1 
      WHERE role = 'learner';
    `, [cadetPasswordHash]);
    console.log('✓ Updated cadet passwords to CadetPass2026!');

    const res = await client.query('SELECT full_name, role, phone_number, email FROM public.users ORDER BY role, full_name');
    console.log('\nAll users in database:');
    console.table(res.rows);

    await client.end();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedStaff();

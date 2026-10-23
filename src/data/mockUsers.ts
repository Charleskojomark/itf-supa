import type { AppUser } from '../types/rbac';

export const SYSTEM_USERS: Record<string, AppUser> = {
  learner: {
    id: 'usr_cadet_chidi',
    name: 'Chidi Okonkwo',
    email: 'chidi.okonkwo@cadet.itf-supa.gov.ng',
    phoneNumber: '+234 803 123 4567',
    role: 'learner',
    avatar: '👨🏾‍💻',
    organization: 'ITF SUPA AI Academy (Lagos Island Hub)',
    batchId: 'ITF-SUPA-B26-03',
  },
  tutor: {
    id: 'usr_tutor_amina',
    name: 'Engr. Amina Bello',
    email: 'amina.bello@ncair.gov.ng',
    phoneNumber: '+234 802 987 6543',
    role: 'tutor',
    avatar: '👩🏾‍🏫',
    organization: 'National Centre for AI & Robotics (NCAIR)',
    licenseNumber: 'ITF-TRAINER-2026-042',
    batchId: 'Batch 30 Cohort Lead',
  },
  assessor: {
    id: 'usr_assessor_olumide',
    name: 'Dr. Olumide Adeleke',
    email: 'olumide.adeleke@itf.gov.ng',
    phoneNumber: '+234 809 456 7890',
    role: 'assessor',
    avatar: '👨🏾‍💼',
    organization: 'Industrial Training Fund (ITF SUPA Standards Board)',
    licenseNumber: 'SUPA-ASSESSOR-L3-4029',
  },
};

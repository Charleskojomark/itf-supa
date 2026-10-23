// Role-Based Access Control (RBAC) System for ITF SUPA LMS
import type { UserRole } from './index';

export type Permission = 
  | 'view_mission'
  | 'play_lessons'
  | 'view_zones'
  | 'use_visual_lab'
  | 'participate_squad'
  | 'view_my_portfolio'
  | 'view_tutor_dashboard'
  | 'manage_squad_interventions'
  | 'send_batch_announcements'
  | 'review_criteria_gap'
  | 'verify_criteria_evidence'
  | 'sign_off_assessor_matrix'
  | 'export_official_pack'
  | 'audit_milestones';

export interface RoleConfig {
  role: UserRole;
  title: string;
  badgeLabel: string;
  description: string;
  allowedTabs: string[];
  permissions: Permission[];
  defaultTab: string;
  clearanceLevel: number;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  learner: {
    role: 'learner',
    title: 'Cadet Learner',
    badgeLabel: 'Cadet L3',
    description: 'Enrolled ITF SUPA AI Specialist trainee studying the 15-week curriculum.',
    allowedTabs: ['today', 'zones', 'lab', 'squad', 'portfolio'],
    permissions: [
      'view_mission',
      'play_lessons',
      'view_zones',
      'use_visual_lab',
      'participate_squad',
      'view_my_portfolio'
    ],
    defaultTab: 'today',
    clearanceLevel: 1,
  },
  tutor: {
    role: 'tutor',
    title: 'Training Facilitator',
    badgeLabel: 'Tutor / Instructor',
    description: 'Accredited ITF AI Instructor monitoring Batch 30 cohort progress and stuck alerts.',
    allowedTabs: ['tutor_dash', 'squad', 'assessor_matrix', 'portfolio'],
    permissions: [
      'view_tutor_dashboard',
      'manage_squad_interventions',
      'send_batch_announcements',
      'review_criteria_gap',
      'participate_squad'
    ],
    defaultTab: 'tutor_dash',
    clearanceLevel: 2,
  },
  assessor: {
    role: 'assessor',
    title: 'Vocational Assessor',
    badgeLabel: 'Official SUPA Assessor',
    description: 'Accredited external auditor verifying candidate evidence against Standard 27ITFVS26-3.',
    allowedTabs: ['assessor_matrix', 'portfolio', 'zones'],
    permissions: [
      'verify_criteria_evidence',
      'sign_off_assessor_matrix',
      'export_official_pack',
      'audit_milestones'
    ],
    defaultTab: 'assessor_matrix',
    clearanceLevel: 3,
  },
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatar: string;
  organization: string;
  licenseNumber?: string;
  batchId?: string;
}

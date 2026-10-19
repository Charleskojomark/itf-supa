import type { Squad } from '../types';

export const BATCH_SQUADS: Squad[] = [
  {
    id: 'squad-eko-01',
    name: 'Eko AI Transformers',
    motto: 'No Shaking, We Code & We Debug',
    zone: 'Lagos Island',
    batchNumber: 'ITF-SUPA-B26-03',
    members: [
      { id: 'learner-chidi-001', name: 'Chidi Okonkwo (You)', avatar: '🚀', xp: 120, helpfulPoints: 18, streak: 4, isCurrentUser: true },
      { id: 'learner-amina-002', name: 'Amina Bello', avatar: '⚡', xp: 190, helpfulPoints: 24, streak: 5 },
      { id: 'learner-olu-003', name: 'Olumide Adeyemi', avatar: '🧠', xp: 140, helpfulPoints: 12, streak: 3 },
      { id: 'learner-ngozi-004', name: 'Ngozi Eze', avatar: '🌟', xp: 210, helpfulPoints: 30, streak: 6 },
      { id: 'learner-tunde-005', name: 'Tunde Bakare', avatar: '🔥', xp: 110, helpfulPoints: 8, streak: 2 },
    ],
    weeklyQuest: {
      title: 'Week 2 Danfo Router Sprint',
      description: 'Help all 5 squad members pass Day 4 loops with 0 unhandled exceptions.',
      goal: 5,
      current: 3,
      rewardXp: 150,
    },
  },
  {
    id: 'squad-cocoa-02',
    name: 'Cocoa City Coders',
    motto: 'First to Understand, First to Build',
    zone: 'Ibadan',
    batchNumber: 'ITF-SUPA-B26-03',
    members: [
      { id: 'learner-femi-006', name: 'Femi Oladipo', avatar: '🦉', xp: 180, helpfulPoints: 15, streak: 4 },
      { id: 'learner-zainab-007', name: 'Zainab Danjuma', avatar: '✨', xp: 230, helpfulPoints: 32, streak: 7 },
      { id: 'learner-chidera-008', name: 'Chidera Nwosu', avatar: '💻', xp: 160, helpfulPoints: 10, streak: 3 },
      { id: 'learner-kemi-009', name: 'Kemi Adeleke', avatar: '🎯', xp: 145, helpfulPoints: 14, streak: 4 },
    ],
    weeklyQuest: {
      title: 'Balogun Bargain Error-Free Quest',
      description: 'Review and leave helpful comments on 10 peer explanation steps.',
      goal: 10,
      current: 7,
      rewardXp: 120,
    },
  },
  {
    id: 'squad-confluence-03',
    name: 'Confluence Data Miners',
    motto: 'Data Clean, Insight Sharp',
    zone: 'Enugu',
    batchNumber: 'ITF-SUPA-B26-03',
    members: [
      { id: 'learner-ibrahim-010', name: 'Ibrahim Musa', avatar: '🛡️', xp: 200, helpfulPoints: 20, streak: 5 },
      { id: 'learner-blessing-011', name: 'Blessing Udoh', avatar: '💎', xp: 175, helpfulPoints: 18, streak: 4 },
      { id: 'learner-somto-012', name: 'Somtochukwu Obi', avatar: '🚀', xp: 130, helpfulPoints: 9, streak: 2 },
      { id: 'learner-fatima-013', name: 'Fatima Aliyu', avatar: '🌺', xp: 215, helpfulPoints: 28, streak: 6 },
    ],
    weeklyQuest: {
      title: 'Zero-Drop Off Attendance Shield',
      description: 'Ensure no squad member loses a streak this week by sharing grace reminders.',
      goal: 4,
      current: 4,
      rewardXp: 200,
    },
  },
];

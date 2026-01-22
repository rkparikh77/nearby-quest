import type { MoodConfig, MoodType } from '../types';

export const MOOD_CONFIG: Record<MoodType, MoodConfig> = {
  work: {
    id: 'work',
    label: 'Work Mode',
    description: 'Quiet spots with wifi for productivity',
    icon: '💻',
    types: ['cafe', 'library'],
    keywords: ['wifi', 'quiet', 'workspace'],
    color: '#00d4ff',
  },
  date: {
    id: 'date',
    label: 'Date Night',
    description: 'Romantic spots with great ambiance',
    icon: '💕',
    types: ['restaurant', 'bar'],
    keywords: ['romantic', 'ambiance', 'dinner'],
    color: '#ff1493',
  },
  'quick-bite': {
    id: 'quick-bite',
    label: 'Quick Bite',
    description: 'Fast, tasty options when time is short',
    icon: '🍔',
    types: ['restaurant', 'meal_takeaway'],
    keywords: ['fast', 'takeout', 'quick'],
    color: '#ffd700',
  },
  budget: {
    id: 'budget',
    label: 'Budget Friendly',
    description: 'Great food that won\'t break the bank',
    icon: '💰',
    types: ['restaurant', 'cafe'],
    keywords: ['cheap', 'affordable', 'budget'],
    color: '#00ff88',
    priceLevel: [1, 2],
  },
};

export const getMoodConfig = (mood: MoodType): MoodConfig => {
  return MOOD_CONFIG[mood];
};

export const getMoodColor = (mood: MoodType): string => {
  return MOOD_CONFIG[mood]?.color || '#8b5cf6';
};

export const getAllMoods = (): MoodConfig[] => {
  return Object.values(MOOD_CONFIG);
};

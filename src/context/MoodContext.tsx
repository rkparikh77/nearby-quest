import { createContext, useContext, useState, ReactNode } from 'react';
import type { MoodType } from '../types';

interface MoodContextValue {
  selectedMood: MoodType | null;
  setMood: (mood: MoodType | null) => void;
}

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const setMood = (mood: MoodType | null) => {
    setSelectedMood(mood);
  };

  return (
    <MoodContext.Provider value={{ selectedMood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}

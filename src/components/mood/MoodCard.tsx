import { motion } from 'motion/react';
import type { MoodConfig } from '../../types';

interface MoodCardProps {
  mood: MoodConfig;
  onClick: () => void;
  delay?: number;
}

export default function MoodCard({ mood, onClick, delay = 0 }: MoodCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative p-6 rounded-2xl text-left transition-all duration-300 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${mood.color}15, ${mood.color}05)`,
        border: `1px solid ${mood.color}30`,
      }}
    >
      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${mood.color}20 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${mood.color}20`,
            boxShadow: `0 0 20px ${mood.color}30`,
          }}
        >
          {mood.icon}
        </div>

        {/* Label */}
        <h3
          className="text-xl font-bold font-heading mb-2 transition-colors"
          style={{ color: mood.color }}
        >
          {mood.label}
        </h3>

        {/* Description */}
        <p className="text-text-secondary text-sm">{mood.description}</p>

        {/* Arrow indicator */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
          style={{ color: mood.color }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${mood.color}60, 0 0 30px ${mood.color}20`,
        }}
      />
    </motion.button>
  );
}

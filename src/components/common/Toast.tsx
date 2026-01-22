import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const TOAST_CONFIG: Record<ToastType, { color: string; icon: string }> = {
  success: { color: '#00ff88', icon: '✓' },
  error: { color: '#ff1493', icon: '✕' },
  info: { color: '#00d4ff', icon: 'ℹ' },
  warning: { color: '#ffd700', icon: '⚠' },
};

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = TOAST_CONFIG[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className="glass-elevated rounded-xl px-4 py-3 flex items-center gap-3 max-w-sm"
            style={{
              borderColor: config.color,
              border: `1px solid ${config.color}50`,
              boxShadow: `0 0 20px ${config.color}20`,
            }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${config.color}30`, color: config.color }}
            >
              {config.icon}
            </span>
            <p className="text-white text-sm flex-1">{message}</p>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-text-muted hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

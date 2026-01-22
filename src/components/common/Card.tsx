import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  glowColor?: string;
  children: ReactNode;
}

export default function Card({
  variant = 'default',
  glowColor,
  children,
  className = '',
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'glass',
    elevated: 'glass-elevated',
    bordered: 'bg-surface border border-white/10',
  };

  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${className}`}
      style={
        glowColor
          ? {
              boxShadow: `0 0 20px ${glowColor}20, inset 0 0 0 1px ${glowColor}30`,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}

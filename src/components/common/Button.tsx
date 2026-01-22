import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  color = '#8b5cf6',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClasses =
    'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      boxShadow: `0 0 20px ${color}40`,
      color: 'white',
    },
    secondary: {
      background: `${color}20`,
      border: `1px solid ${color}50`,
      color: color,
    },
    ghost: {
      background: 'transparent',
      color: color,
    },
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={variantStyles[variant]}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

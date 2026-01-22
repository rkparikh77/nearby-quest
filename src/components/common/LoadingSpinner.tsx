interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = '#8b5cf6',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`${sizeClasses[size]} rounded-full animate-spin`}
        style={{
          borderColor: `${color}30`,
          borderTopColor: color,
        }}
      />
      <p className="text-text-secondary text-sm">Finding places...</p>
    </div>
  );
}

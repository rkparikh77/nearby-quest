interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '0.5rem',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`bg-surface-elevated animate-shimmer ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
      }}
    />
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="p-4 flex gap-4">
      <Skeleton width={80} height={80} borderRadius="0.75rem" />
      <div className="flex-1">
        <Skeleton width="70%" height={20} className="mb-2" />
        <Skeleton width="50%" height={16} className="mb-2" />
        <Skeleton width="30%" height={14} />
      </div>
    </div>
  );
}

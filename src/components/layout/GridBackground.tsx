export default function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-flow 20s linear infinite',
        }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full opacity-10 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 20, 147, 0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

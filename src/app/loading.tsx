export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          {/* Outer ring with sakura glow */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-glow" />
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-secondary animate-spin" />
          {/* Inner dot */}
          <div className="absolute inset-[18px] rounded-full bg-primary/30 animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground gradient-text-soft font-medium">Loading...</p>
      </div>
    </div>
  );
}

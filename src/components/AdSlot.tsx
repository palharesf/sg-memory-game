interface AdSlotProps {
  slot: string;
  className?: string;
}

/**
 * Placeholder for AdSense units.
 * In production, replace the inner div with the AdSense <ins> tag.
 * The outer wrapper preserves layout space regardless of whether ads load.
 */
export default function AdSlot({ slot, className = "" }: AdSlotProps) {
  return (
    <div
      className={`flex items-center justify-center bg-[var(--color-bg-elevated)] rounded border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] ${className}`}
      data-ad-slot={slot}
      aria-label="Advertisement"
    >
      {/* AdSense unit — replace this comment with <ins> tag when ready */}
      <span className="select-none opacity-40">ad</span>
    </div>
  );
}

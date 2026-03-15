import { BACKGROUNDS } from "@/hooks/useBackground";
import type { Background } from "@/hooks/useBackground";

interface BackgroundPickerProps {
  value: Background;
  onChange: (bg: Background) => void;
  label?: string;
}

export default function BackgroundPicker({ value, onChange, label = "Background:" }: BackgroundPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--color-text-muted)] shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.id}
            type="button"
            title={bg.label}
            aria-label={bg.label}
            aria-pressed={bg.id === value.id}
            onClick={() => onChange(bg)}
            className="w-5 h-5 rounded-sm border border-white/10 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-1"
            style={{
              backgroundColor: bg.color,
              boxShadow: bg.id === value.id
                ? "0 0 0 2px var(--color-primary)"
                : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

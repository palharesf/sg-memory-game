import { BACKGROUNDS } from "@/hooks/useBackground";

/**
 * The approximate output hue of the icon recolor filter pipeline before
 * hue-rotate is applied:
 *
 *   brightness(0) → saturate(100%) → invert(1) → sepia(1) → saturate(10000%)
 *
 * sepia(white) ≈ rgb(255, 255, 239) → HSL hue ≈ 60°.
 * This constant lets us map a background's hue back to the hue-rotate value
 * that would make an icon match it.
 */
const SEPIA_BASE_HUE = 60;

/** Backgrounds with saturation below this are near-neutral and won't conflict. */
const MIN_SATURATION = 0.2;

/** How far (degrees) an icon hue must stay from any background hue. */
const GUARD = 30;

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  const r = parseInt(m[1]!, 16) / 255;
  const g = parseInt(m[2]!, 16) / 255;
  const b = parseInt(m[3]!, 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const c = max - min;
  const s = c / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / c + 6) % 6;
  else if (max === g) h = (b - r) / c + 2;
  else h = (r - g) / c + 4;
  return { h: (h / 6) * 360, s, l };
}

/**
 * Pre-compute forbidden hue-rotate centers from the background palette.
 *
 * icon output hue ≈ (SEPIA_BASE_HUE + hueRotate) % 360
 * → forbidden hueRotate = (bgHue - SEPIA_BASE_HUE + 360) % 360
 *
 * Near-neutral backgrounds (low saturation) are excluded — an icon of any
 * hue is distinguishable against them.
 */
const FORBIDDEN_CENTERS: number[] = BACKGROUNDS
  .map((bg) => hexToHsl(bg.color))
  .filter((hsl): hsl is NonNullable<typeof hsl> => hsl !== null && hsl.s >= MIN_SATURATION)
  .map((hsl) => (hsl.h - SEPIA_BASE_HUE + 360) % 360);

/**
 * Adjusts a raw hue-rotate value so the resulting icon color stays clear of
 * every selectable background color.
 *
 * When a value falls inside a forbidden zone it is pushed toward the nearer
 * edge of that zone (preserving spread when consecutive pairIds land on the
 * same zone). Up to four correction passes are applied to handle cases where
 * zones are close together.
 */
export function safeIconHue(raw: number): number {
  let result = raw;
  for (let pass = 0; pass < 4; pass++) {
    let shifted = false;
    for (const center of FORBIDDEN_CENTERS) {
      // Signed angular distance in [-180, 180]
      const delta = ((result - center + 540) % 360) - 180;
      if (Math.abs(delta) < GUARD) {
        // Push toward whichever side of the zone we're already on
        const sign = delta >= 0 ? 1 : -1;
        result = (center + sign * (GUARD + 15) + 360) % 360;
        shifted = true;
        break;
      }
    }
    if (!shifted) break;
  }
  return result;
}

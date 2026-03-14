interface AdSlotProps {
  slot: string;
  className?: string;
}

/**
 * AdSense unit placeholder.
 *
 * Currently returns null (no blank space) while awaiting AdSense approval.
 *
 * When approved:
 * 1. Get real ad-slot IDs from AdSense dashboard
 * 2. Replace the null return with an <ins> tag:
 *
 *   useEffect(() => { (window.adsbygoogle = window.adsbygoogle || []).push({}); }, []);
 *   return (
 *     <ins
 *       className={`adsbygoogle ${className}`}
 *       style={{ display: "block" }}
 *       data-ad-client="ca-pub-6255805898920780"
 *       data-ad-slot={slot}
 *       data-ad-format="auto"
 *       data-full-width-responsive="true"
 *     />
 *   );
 *
 * The <ins> element collapses to 0 height automatically when no ad fills it,
 * so no extra show/hide logic is needed.
 */
export default function AdSlot(_props: AdSlotProps) {
  return null;
}

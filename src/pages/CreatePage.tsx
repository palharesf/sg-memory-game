import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/services/api";
import { MIN_PAIRS, MAX_PAIRS, defaultMistakes, minMistakes } from "@/game/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdSlot from "@/components/AdSlot";

const DEFAULT_PAIRS = 8;

export default function CreatePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authFailed = searchParams.get("auth") === "failed";

  const [isRandom, setIsRandom] = useState(true);
  const [pairs, setPairs] = useState(DEFAULT_PAIRS);
  // null = unlimited
  const [mistakes, setMistakes] = useState<number | "">(defaultMistakes(DEFAULT_PAIRS));
  const [timeLimit, setTimeLimit] = useState<number | "">("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePairsChange(value: number) {
    const clamped = Math.max(MIN_PAIRS, Math.min(MAX_PAIRS, value));
    setPairs(clamped);
    // Keep mistakes in sync only if it was still at the previous default
    setMistakes((prev) => {
      if (prev === "") return ""; // user already cleared it (unlimited)
      const wasDefault = prev === defaultMistakes(pairs);
      return wasDefault ? defaultMistakes(clamped) : Math.max(minMistakes(clamped), prev);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!secret.trim()) {
      setError("Please enter a secret to hide.");
      return;
    }

    const mistakesValue = mistakes === "" ? null : mistakes;
    if (mistakesValue !== null && mistakesValue < minMistakes(pairs)) {
      setError(`Minimum mistakes for ${pairs} pairs is ${minMistakes(pairs)}.`);
      return;
    }

    setLoading(true);
    try {
      const { id } = await api.createGame({
        pairs,
        isRandom,
        mistakes: isRandom ? mistakesValue : null,
        timeLimit: isRandom ? (timeLimit === "" ? null : timeLimit) : null,
        secret: secret.trim(),
      });
      navigate(`/play/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game.");
    } finally {
      setLoading(false);
    }
  }

  const mistakesMin = minMistakes(pairs);
  const totalCards = pairs * 2;

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Auth failure notice */}
      {authFailed && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 text-sm">
          <p className="text-[var(--color-danger)]">
            Steam sign-in failed. Please try again.
          </p>
          <button
            onClick={() => setSearchParams({})}
            aria-label="Dismiss"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="flex flex-col items-center text-center py-10 pb-8">
        <img src="/logo.png" alt="SG Memory Game" className="w-24 h-24 rounded-2xl mb-4 shadow-lg" />
        <h1 className="text-3xl font-bold text-[var(--color-text-bright)] mb-2">SG Memory Game</h1>
        <p className="text-[var(--color-text-muted)] max-w-sm">
          Create a memory game, hide a secret, and challenge the SteamGifts community.
        </p>
      </div>

      <div className="border-t border-[var(--color-border)] pt-8 pb-10">

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
          <div>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {isRandom ? "Random board" : "Fixed board"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {isRandom
                ? "Card positions are reshuffled on every attempt."
                : "Card positions never change. No time limit, no mistake limit, no leaderboard."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!isRandom}
            onClick={() => setIsRandom((r) => !r)}
            className={[
              "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
              !isRandom ? "bg-[var(--color-warning)]" : "bg-[var(--color-bg-hover)]",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                !isRandom ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>

        {/* Pairs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pairs" className="text-[var(--color-text)]">
              Pairs
            </Label>
            <span className="text-xs text-[var(--color-text-muted)]">
              {totalCards} cards · {MIN_PAIRS}–{MAX_PAIRS}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="pairs"
              type="range"
              min={MIN_PAIRS}
              max={MAX_PAIRS}
              value={pairs}
              onChange={(e) => handlePairsChange(Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
            />
            <span className="w-8 text-center text-[var(--color-text-bright)] font-mono font-semibold">
              {pairs}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            More pairs = harder game, longer to solve.
          </p>
        </div>

        {/* Mistakes + Time limit — random mode only */}
        {isRandom && (<>{/* Mistakes */}
        <div className="space-y-2">
          <Label htmlFor="mistakes" className="text-[var(--color-text)]">
            Mistakes allowed{" "}
            <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="mistakes"
              type="number"
              min={mistakesMin}
              placeholder="No limit"
              value={mistakes}
              onChange={(e) =>
                setMistakes(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-36 bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text)]"
            />
            <span className="text-sm text-[var(--color-text-muted)]">
              {mistakes === "" ? "unlimited" : `min ${mistakesMin}`}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Leave empty for unlimited mistakes (relaxed mode).
          </p>
        </div>

        {/* Time limit */}
        <div className="space-y-2">
          <Label htmlFor="timeLimit" className="text-[var(--color-text)]">
            Time limit{" "}
            <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="timeLimit"
              type="number"
              min={10}
              placeholder="No limit"
              value={timeLimit}
              onChange={(e) =>
                setTimeLimit(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-36 bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text)]"
            />
            <span className="text-sm text-[var(--color-text-muted)]">seconds</span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Leave empty for endless time (relaxed mode).
          </p>
        </div>
        </>)}

        {/* Secret */}
        <div className="space-y-2">
          <Label htmlFor="secret" className="text-[var(--color-text)]">
            Secret
          </Label>
          <Input
            id="secret"
            type="text"
            placeholder="SteamGifts link or 5-letter code"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            autoComplete="off"
          />
          <p className="text-xs text-[var(--color-text-muted)]">
            Shown to players only after they win. Stored securely server-side.
          </p>
        </div>

        {error && (
          <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-primary)] text-[var(--color-bg-base)] hover:bg-[var(--color-primary-hover)] font-semibold"
        >
          {loading ? "Creating…" : "Create Game"}
        </Button>
      </form>

      <div className="mt-10">
        <AdSlot slot="create-bottom" className="w-full h-[90px]" />
      </div>
      </div>
    </div>
  );
}

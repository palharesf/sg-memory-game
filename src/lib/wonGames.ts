/**
 * localStorage persistence for won game secrets.
 *
 * Key format: sg:won:{gameId}
 * Value: the secret string
 *
 * This is a best-effort cache — failures are silently ignored.
 * D1 (for logged-in users) is the authoritative source; localStorage is the
 * fallback for anonymous users and the fast path for returning visitors.
 */

const key = (id: string) => `sg:won:${id}`;

export function getWonGame(id: string): string | null {
  try {
    return localStorage.getItem(key(id));
  } catch {
    return null;
  }
}

export function setWonGame(id: string, secret: string): void {
  try {
    localStorage.setItem(key(id), secret);
  } catch {}
}

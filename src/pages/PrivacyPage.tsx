import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-bright)] mb-1">Privacy Policy</h1>
        <p className="text-xs text-[var(--color-text-muted)]">Last updated: March 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-[var(--color-text-bright)]">What we collect</h2>
        <p className="text-sm text-[var(--color-text)]">
          When you sign in with Steam, we receive your public Steam profile: your Steam ID, display name, and avatar URL. We do not receive your password, email address, or any private Steam data.
        </p>
        <p className="text-sm text-[var(--color-text)]">
          We store your Steam ID to record your game wins and personal best times. No other personal information is collected.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-[var(--color-text-bright)]">How we use it</h2>
        <p className="text-sm text-[var(--color-text)]">
          Your Steam ID is used solely to:
        </p>
        <ul className="text-sm text-[var(--color-text)] list-disc list-inside space-y-1 pl-2">
          <li>Record which games you have won and your best completion times</li>
          <li>Display your name on leaderboards</li>
          <li>Auto-reveal secrets for games you have already solved</li>
        </ul>
        <p className="text-sm text-[var(--color-text)]">
          We do not sell, share, or use your data for advertising targeting.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-[var(--color-text-bright)]">Cookies</h2>
        <p className="text-sm text-[var(--color-text)]">
          We use a single session cookie to keep you signed in after authenticating with Steam. This cookie contains a signed token identifying your session and expires when you log out or after a period of inactivity.
        </p>
        <p className="text-sm text-[var(--color-text)]">
          This site uses Google AdSense to display ads. Google may use cookies to serve ads based on your visits to this and other websites. You can opt out via{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline"
          >
            Google's ad settings
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-[var(--color-text-bright)]">Data retention</h2>
        <p className="text-sm text-[var(--color-text)]">
          Win records and leaderboard entries are kept for as long as the associated game exists. Game secrets are stored server-side and returned only to verified winners.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-[var(--color-text-bright)]">Third-party services</h2>
        <ul className="text-sm text-[var(--color-text)] list-disc list-inside space-y-1 pl-2">
          <li><strong>Steam OpenID</strong> — authentication only; read-only access to your public profile</li>
          <li><strong>Cloudflare</strong> — hosting, serverless compute, and database</li>
          <li><strong>Google AdSense</strong> — advertising</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-[var(--color-text-bright)]">Contact</h2>
        <p className="text-sm text-[var(--color-text)]">
          Questions or requests can be directed to the project thread on{" "}
          <a
            href="https://www.steamgifts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline"
          >
            SteamGifts
          </a>
          .
        </p>
      </section>

      <div className="pt-4 border-t border-[var(--color-border)]">
        <Link to="/" className="text-sm text-[var(--color-primary)] hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

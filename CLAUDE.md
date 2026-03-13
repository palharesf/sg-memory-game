# SG Memory Game — Project Guide

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS v4 + ShadCN
- **Backend:** Cloudflare Pages Functions (Workers runtime)
- **Database:** Cloudflare D1 (SQLite)
- **Auth:** Steam OpenID 2.0 + JWT session cookie (HS256)
- **Deploy:** GitHub Actions → `wrangler pages deploy dist`

## Design Context

### Users
SteamGifts community members who use SteamGifts.com to run and enter game giveaways. They encounter this as a giveaway mechanic: a creator hides a secret (SteamGifts link or entry code) behind a memory game. Players are motivated by the reward and enjoy the light competitive element (leaderboard, personal best). Users access from mobile and desktop; dark-mode is expected. Familiar with Steam's UI conventions.

### Brand Personality
**Fun, Community, Rewarding.** The game should feel like a natural extension of SteamGifts — familiar, welcoming, built by and for the community. Winning should feel satisfying. Creating a game should feel like giving a gift.

### Aesthetic Direction
- **Reference:** SteamGifts.com itself — dark background, muted steel-blue accents, clean tables, no decoration for its own sake.
- **Dark-only.** This audience expects dark mode. No light mode planned.
- The existing palette (`#1a1d23` base, `#5cb3cc` primary, Geist Variable font) already captures the right tone — stay consistent with it.
- Avoid: bright/saturated colors, heavy gradients, rounded bubbly aesthetics, anything that feels like a mobile casual game skin.

### Design Principles
1. **Community-native first.** Every design decision should feel at home on SteamGifts. When in doubt, reference the SteamGifts dark UI.
2. **Reward clarity.** The secret — the whole point — must be impossible to miss on win. Hierarchy should always draw attention to the outcome.
3. **Functional over decorative.** Add visual polish only where it aids comprehension or delight (card flip, matched glow). Resist decoration for its own sake.
4. **Accessible enough.** Good contrast and keyboard nav where practical. No formal WCAG target, but nothing should be broken or invisible.
5. **Mobile-first.** Design base layouts and interactions for small screens first, then enhance for desktop with `sm:`/`md:`/`lg:` breakpoints.

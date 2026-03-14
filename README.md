# SG Memory Game

**[Play it here →](https://sg-memory-game.pages.dev)**

---

Hi! fernandopa here. Some of you might know me from the SG Minesweeper project.

## About this project
Now, that project (SG Minesweeper) was the product of many weeks of blood, sweat, and tears (figuratively speaking, of course). I spent an inordinate amount of time thinking about its mechanics and systems to ensure it was as fair as possible to everyone who wanted to use it as a way to hide secrets. While it's not perfect, I always took pride in the amount of time I poured into that, as well as the exchanges I had with community members about it. Not everyone agreed with my approach, but most agreed there was no simple way of addressing all of its shortcomings reasonably.

To give a concrete example, the fact that mines are randomly placed once you start a game is clearly a source of randomness, but most members understood this was a trade-off required. To quote an analysis by ChatGPT of my code: "In SG Minesweeper, mines are placed randomly after the first click, ensuring the initial move is always safe while generating a unique board for every playthrough. This randomness prevents players from memorizing mine locations across attempts. If the mine layout were static, players could eventually solve the puzzle through repetition rather than deduction. By randomizing the board each time, the game forces players to rely on logic and analysis instead of memory. The tradeoff is that while board difficulty may vary slightly between runs, the gameplay remains a genuine problem-solving challenge. In summary, it's fair, but random mine placement naturally creates variability in board difficulty. Because different layouts produce different deduction opportunities, the same player might take slightly longer to solve one board than the other, but the difference should not be too significant."

Over time, users have criticized parts of my code, which led to many improvements. But recently, an user learned about the random nature of mine placement, and I received comments to the tune of "wow, that's hella unfair - some ppl getting super easy ones done in 1min and others having the hard clustered ones taking over 10 mins to beat for the same reward..."

Now, I hope all this context helps to understand why this kind of comment makes me salty. It disregards all the thought I put into developing a reasonably fair system, it disregards extensive playtesting conducted by community members before and after the official launch, it seems to disregard basic logic by comparing solving times for the same board parameters from two different users without any acknowledgment that different users also possess wildly different Minesweeping skills. It bothered me. It bothered me a lot. I caught myself thinking about this comment while at work, while walking my dog, while trying to fall asleep. It just bothered me. I think I would be happier just ignoring it, but I just couldn't. It. Just. Bothered. Me.

So, I decided to channel my anger and provide something that SG users apparently were claiming for. Something more akin to memorization rather than puzzling. Something entirely fair (if creators want), even though that might mean unfun. That's the only cynical takeaway I get from the whole situation. So welcome, new puzzle.

Welcome, SG Memory Game.

## What is it and how does it work?

SG Memory Game is a community tool for hiding giveaway secrets — SteamGifts links, entry codes, whatever — behind a classic memory card game. Think of it as a lock: only players who solve the puzzle get the key.

**Creating a game**

Head to the homepage, configure your puzzle, paste in your secret, and hit Create. You get a shareable link to drop in your giveaway thread. That's it.

A few things you can tune when creating:

- **Pairs (4–18):** Controls the board size. 4 pairs is a 2×4 grid of 8 cards; 18 pairs is a 6×6 grid of 36 cards. The default is 8 pairs (4×4) — a solid starting point. I don't want games taking hours to complete with absurd difficulty as we see with 900 piece Jigidis or insane Minesweeper fields. You won't find that level of sadism here, although games can still be punishing if the creator desires using mistake and time limits. You have a problem with that, complain with the person who set those parameters, not me.
- **Board mode — Random or Fixed:**
  - *Random* reshuffles card positions on every attempt, so no one can share a solution or memorize the layout between runs. Supports a leaderboard, personal best times, mistake limits, and time limits.
  - *Fixed* keeps the same layout every time. No reshuffling, no competitive pressure, no leaderboard. Basically, unfun, but that's what I understand some player want so have a field day, please. Good for people who complain about fairness without understanding trade-offs. Yeah it's that boring and sour, sue me.
- **Card theme:** Choose between *Generic Icons* (a pool of gaming symbols, available now) and *SG Donated Art* (community-contributed art, coming once enough pieces are donated — see below).
- **Mistake limit:** How many wrong flips before game over. Leave it empty for no limit.
- **Time limit:** Seconds to beat the board. Leave it empty for no timer.

**Playing a game**

Visit a shared link and start flipping. Two cards face up at once — find the matching pair and they stay revealed. Flip a mismatch and they flip back after a moment. Match all pairs and the secret is yours.

No login required to play. But if you sign in with Steam, your best time is recorded per game and you'll show up on the leaderboard (random boards only). Steam login is read-only — the app only sees your public profile. And if you revisit a game you already won, the secret is shown to you immediately — no need to play through it again.

**Your history**

Signed-in players can visit *My Games* to see every game they've created and every game they've won, along with their best times.

## I want to add an image for the project! Can I?
Please do! Remember when you created art for the Advent Calendar? Or for a puzzle? Or for fun? I would love if you donated it to this project! I'll reserve a comment in the thread for art donation, feel free to comment there if you want to donate something you created. Ideally, 512x512 transparent PNG. If I use in the project I'll give you attribution for it, and that's it. Also if there's too much interest in art donation, I might curate which ones will actually show up in the game (or keep a massive list, who knows), so by donating donating your art you agree to that.

By the way - we work with an image pool. The current image pool can be seen [here](https://sg-memory-game.pages.dev/theme). Once we have 18 user submissions, the community donation theme will be unlocked and you can choose it for your games.

Comment for donations [here](https://www.steamgifts.com/discussion/xbMXq/sg-memory-game#aepUQi8)

## What else do you have on the roadmap? Can I suggest a feature or a bugfix?
This time I checked all my boxes before releasing the game. But for suggestions, it's the same deal as with SG Minesweeper. Suggest a feature here, we can have a discussion as a community, and I might implement it or not. But since I implemented most of the stuff before releasing it, expect fewer changes in the next few days and weeks.

## Is this safe for sending really important and sensitive secrets?
Safer than SG Minesweeper, still unsafe generally.

## This sucks and I hate this
No love from me this time.

## Credits
Many thanks to the playtesters that once again ensured what I made worked, was intuitive and easy to use, and that overall provided very welcome criticism of stuff that was clunky or misleading prior to the launch. I appreciate your kindness and support.
- [adam1224](https://www.steamgifts.com/user/adam1224)
- [VenomousNyx](https://www.steamgifts.com/user/VenomousNyx)
- [PapaSmok](https://www.steamgifts.com/user/PapaSmok)

---

## Technical

Built with React + TypeScript + Tailwind CSS, deployed on Cloudflare Pages. Game state runs entirely client-side; secrets are stored server-side and only returned by the API after a valid win is submitted.

**Stack:** React 18 · Vite · TypeScript · Tailwind CSS v4 · Cloudflare Pages + Workers + D1 · Steam OpenID auth

**Running locally:**

```bash
npm install
npm run dev
```

You'll need a `wrangler.toml` pointing at a D1 database and a `STEAM_API_KEY` secret set in Cloudflare for auth to work. See [Cloudflare Pages docs](https://developers.cloudflare.com/pages/) for deployment setup.

**Card images:** [game-icons.net](https://game-icons.net) — Creative Commons 3.0 BY. See the Card Theme page in-app for the full list, including donated art.

**Adding or removing Generic Icons:**

1. **Add an image:** Drop a 512×512 transparent PNG into `public/images/000000/transparent/1x1/{author}/{filename}.png`, then add a line to the `POOL` array in `src/data/imagePool.ts`:
   ```ts
   img("author-key", "filename.png"),
   ```
   If the author isn't already in the `AUTHORS` map at the top of that file, add them there first.

2. **Remove an image:** Delete the `img(...)` line from `POOL` and delete the file from `public/`.

3. **Author keys** must match exactly between the `img()` call and the `AUTHORS` map — the key is used for grouping attributions on the Card Theme page.

**Adding Donated Art:**

Donated images use a separate folder and a separate helper to keep them distinct from game-icons.net assets.

1. Drop the 512×512 transparent PNG into `public/images/donated/{filename}.png`
2. Add the donor to the `AUTHORS` map in `src/data/imagePool.ts` (use their SteamGifts URL):
   ```ts
   "adam1224": { key: "adam1224", displayName: "adam1224", url: "https://www.steamgifts.com/user/adam1224" },
   ```
3. Add an entry to `DONATED_POOL` using `donatedImg()` (not `img()`):
   ```ts
   export const DONATED_POOL: PoolImage[] = [
     donatedImg("adam1224", "my-artwork.png"),
   ];
   ```
4. Once `DONATED_POOL` has at least as many images as the maximum pairs setting (18), the "SG Donated Art" theme will unlock automatically.

The pool files live in `src/data/imagePool.ts`. Images are served as static assets from `public/`; no build step needed for adding files there.

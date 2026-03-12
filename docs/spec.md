1. Project Overview

The system is a mobile-first memory puzzle generator designed for Steamgifts users.

Players receive a challenge link and must solve the memory board under constraints.

Constraints:

limited mistakes

optional timer

Boards are randomized on every attempt.

Persistence features:

completion tracking

leaderboard times

Authentication:

Steam OpenID

Database:

Firestore

Hosting:

static frontend hosting

2. Technology Stack

Frontend

React

Vite

TypeScript

CSS Modules or Tailwind (choose one, not both)

Backend services

Firebase

Firestore

Firebase Functions (for Steam authentication)

Asset hosting

static CDN via hosting provider

3. Core Game Rules

Parameters passed via URL:

pairs
mistakes
time
theme

Example:

/play?pairs=12&mistakes=9&time=60&theme=steam

Parameter meanings:

pairs
Number of image pairs.

mistakes
Maximum incorrect guesses allowed.

time
Optional time limit in seconds.

theme
Image source set.

4. Board Generation Algorithm

Cards = pairs * 2

Board generation process:

Step 1
Load theme image pool.

Step 2
Randomly select pairs unique images.

Step 3
Duplicate each image to create pairs.

Example:

A B C D
→
A A B B C C D D

Step 4
Shuffle using Fisher-Yates.

Pseudo code:

function shuffle(array):
  for i from array.length-1 down to 1:
      j = random integer between 0 and i
      swap array[i] and array[j]

Step 5
Return shuffled card list.

Boards must regenerate on every reset or retry.

5. Grid Layout Algorithm

Grid should be near-square.

Rules:

pairs <= 6 → 3x4
pairs <= 8 → 4x4
pairs <= 12 → 4x6
pairs <= 18 → 6x6

Implementation:

function getGridDimensions(pairs)

Return:

{ rows, columns }
6. Mistake Recommendation Algorithm

Default mistake suggestion:

mistakes = pairs

Examples:

6 pairs → 6 mistakes
8 pairs → 8 mistakes
12 pairs → 12 mistakes

Game creators may override.

7. Game State Model

Game state must be explicit and serializable.

Type definition:

GameState
  cards: Card[]
  flippedCards: number[]
  matchedCards: number[]
  mistakes: number
  status: "playing" | "won" | "lost"
  timeElapsed: number

Card definition:

Card
  id: string
  image: string
  isMatched: boolean
8. Card Interaction Rules

Card click logic:

Ignore clicks if:

card already matched

two cards already flipped

game ended

Add card to flipped list.

If two cards flipped:

compare images.

If match:

mark both matched
clear flipped

If mismatch:

increment mistakes
after delay hide cards

If mistakes > limit → game lost.

If matchedCards length == totalCards → game won.

9. Input Locking

During comparison delay, prevent additional input.

Implementation:

boardLocked = true

Unlock after resolution.

10. Timer System

Timer starts when first card flipped.

Implementation:

startTimestamp
currentTimestamp
timeElapsed

Loss condition:

timeElapsed > timeLimit
11. Theme System

Themes stored in assets.

Directory structure:

assets/
  themes/
    steam/
      icons.json
      img/
    community/
      icons.json
      img/

icons.json example:

[
 "img/01.webp",
 "img/02.webp",
 "img/03.webp"
]

Loader function:

loadTheme(themeName)

Returns image list.

12. Image Requirements

All images must follow:

256x256 resolution
webp format
square aspect ratio

Icons stored locally with static hosting.

13. Card Rendering

Card structure:

Card
  front (image)
  back (card design)

Animation:

rotateY flip

CSS transform used for GPU acceleration.

14. Mobile Layout Requirements

Mobile-first.

Card size rules:

mobile: 52px
tablet: 72px
desktop: 96px

Grid must fit within viewport width.

Spacing:

gap: 8px
15. Firestore Data Model

Collections:

users
challenges
scores

User document:

steamId
completedChallenges: string[]

Challenge document:

challengeId
pairs
mistakes
timeLimit
theme
createdAt

Score document:

challengeId
steamId
bestTime
completedAt

Only best time stored.

16. Score Submission Rules

On game win:

Query existing score.

If no score → create record.

If new time < existing time → update.

Pseudo logic:

if score does not exist:
  create
else if newTime < bestTime:
  update
17. Leaderboard Query

Query:

scores
  where challengeId == X
  order by bestTime asc
  limit 20
18. Steam Authentication

Use Steam OpenID.

Authentication flow:

user clicks login
redirect to Steam
Steam returns steamId
server verifies response
client receives session

SteamID becomes the primary user key.

No passwords or accounts stored.

19. File Structure

Frontend structure:

src/
  components/
    Card/
    Board/
    Timer/
    Leaderboard/

  game/
    boardGenerator.ts
    shuffle.ts
    rules.ts

  hooks/
    useGameState.ts

  services/
    firestore.ts
    steamAuth.ts

  pages/
    CreateChallenge.tsx
    PlayChallenge.tsx

  assets/
    themes/
20. Coding Standards for LLM Maintainability

Rules:

Use small pure functions.

Avoid deeply nested logic.

Use explicit type definitions.

Avoid implicit side effects.

Prefer named exports.

Example:

Good:

export function generateBoard(...)

Avoid:

export default
21. Logging

Include debug logging:

console.debug("board generated", board)

Helps LLM debugging.

22. Error Handling

Validate URL parameters.

Example:

pairs must be between 4 and 18
mistakes must be >= pairs/2
time must be positive

Fallback to defaults if invalid.

23. Implementation Phases

Phase 1
Core game logic.

Phase 2
Board rendering.

Phase 3
Challenge generator.

Phase 4
Theme system.

Phase 5
Firestore integration.

Phase 6
Steam login.

Phase 7
Mobile optimization.

24. Success Criteria

The system is complete when:

Challenges can be generated via URL.

Boards randomize every attempt.

Mobile layout works.

Leaderboards store best times.

Steam login identifies users.

Themes load icons correctly.
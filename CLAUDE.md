# Symphony Bass Catalog — Project Instructions

## Autonomy & Approval
- File edits and web fetches run without prompting
- **Stop and check with the user before any action that could affect the integrity or direction of the project** — this includes: removing a significant number of players, restructuring data shape, changing how the UI renders core content, or any decision where reasonable people could disagree on the right outcome
- Git pushes are always described before execution; confirm before pushing if the change is large or hard to reverse

## Stack
- Vite + React (JSX), no CSS modules — inline styles only
- All player/orchestra data lives in `src/data/players.js`
- All component code lives in `src/App.jsx`
- Deployed to Vercel via GitHub (SeniorStoryteller/symphony-bass-catalog); push to `main` to deploy

## Roster Policy
- **Official orchestra home site is the single source of truth** for all roster membership
- Do not add or remove players based on secondary sources (Wikipedia, AllMusic, press releases, etc.)
- When auditing a roster, fetch the official musicians page directly and compare against the current data
- If a player appears on the official site but is missing from the data, add them
- If a player does not appear on the official site and is not a Distinguished Alumnus, remove them

## Trust & Sourcing Policy
- **Never publish information shared in confidence by players**, even if it is factually accurate — instrument transactions, ownership changes, personal details, or anything not already public
- Information shared privately by players is background context only — it informs how we handle existing data but does not become new data unless the player has made it public themselves
- Acceptable public sources: orchestra press releases, official musician websites, published interviews, program notes, verifiable competition results
- When instrument ownership is known to have changed but the new owner has not made it public, remove or note the previous owner's entry as unconfirmed — do not document the new owner
- **The catalog's value to players depends entirely on their trust.** When in doubt, leave it out.

## Bio Writing Standards
- **Facts only — no hyperbole, no inferences**
- Do not describe anything as "remarkable," "extraordinary," "celebrated," or similar superlatives unless quoting a named source
- Do not infer feelings, motivations, or significance beyond what is documented
- Instrument attributions under investigation should be described as disputed/under investigation — do not state attribution as fact
- Use `\n\n` in bio strings to create paragraph breaks (the UI renders each as a `<p>` element)

## Data Conventions
- `highlights` array: short bullet facts displayed beneath the bio, above instruments — keep each entry under ~60 characters
- `new2025: true` for players who joined in the 2024–25 season or later
- `status: "alumni"` for Distinguished Alumni entries (go in the `ALUMNI` array, not the orchestra array)
- `LEADERSHIP_ROLES` in App.jsx controls which roles get a LeadershipCard vs SectionMemberCard; currently: Principal Bass, Associate Principal Bass, Assistant Principal Bass, First Assistant Principal Bass
- Chair names go in the `chair` field, not the bio

## Orchestra Keys
| Key   | Orchestra                        | accentColor |
|-------|----------------------------------|-------------|
| bso   | Boston Symphony Orchestra        | #7A9BB5     |
| hso   | Houston Symphony                 | #C87A6E     |
| lap   | Los Angeles Philharmonic         | #7A6EC8     |
| cso   | Chicago Symphony Orchestra       | #4A90A4     |
| nyp   | New York Philharmonic            | #5B8C6E     |
| phi   | Philadelphia Orchestra           | #B5863C     |
| sfs   | San Francisco Symphony           | #8B6E9E     |
| cle   | Cleveland Orchestra              | #B05A5A     |
| pso   | Pittsburgh Symphony Orchestra    | #B87333     |

## Git Workflow
- Commit with a clear subject line describing what changed and why
- Push to `origin main` after every meaningful set of changes — Vercel auto-deploys
- Do not commit `.claude/`, `src/App.css`, `src/assets/`, or `symphony-bass-catalog.jsx` (untracked scratch files)

## UI Conventions
- Max content width: `MAX_W = 860px`, centered with `margin: "0 auto"` — applies to header, nav bars, search, and all scroll content
- Navigation pattern: breadcrumb bar sits **above** the scroll area, never inside it — always visible regardless of scroll position
- Sort options: two only — Orchestra Name, Section Size. Do not add more without good reason.
- No index numbers on the orchestra list
- Search placeholder: "Search for a bassist by name…" — do not imply compound or structured query support
- Header title on landing: large (44px desktop / 30px mobile), dominant — should feel bigger than the orchestra names below it

## Pending Verification
- None outstanding as of March 14, 2026. Full 8-orchestra audit completed; all rosters confirmed against official sites.

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
- `researchDepth: "initial"` — bio sourced from official orchestra bio page only; deep research not yet done. `researchDepth: "deep"` — full research pass completed (podcasts, interviews, press, personal/university pages). Always upgrade to "deep" after completing a research pass. Query with `ALL_PLAYERS_FLAT.filter(p => p.researchDepth === "initial")` to find players awaiting deeper research.
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
| dso   | Detroit Symphony Orchestra       | #4A7A5E     |
| nso   | National Symphony Orchestra      | #8C3A4A     |
| pso   | Pittsburgh Symphony Orchestra    | #B87333     |
| aso   | Atlanta Symphony Orchestra       | #4A6B99     |

## Git Workflow
- **Never use worktrees.** Work directly on `main`. Worktrees have repeatedly caused silent regressions by committing stale file copies over current work.
- Commit with a clear subject line describing what changed and why
- Push to `origin main` after every meaningful set of changes — Vercel auto-deploys
- Do not commit `.claude/`, `src/App.css`, `src/assets/`, or `symphony-bass-catalog.jsx` (untracked scratch files)
- **When the user reports the live site is broken or showing old content:** Before any code analysis, run `git log --oneline -10` and `git diff HEAD~5..HEAD --stat` to check for regressions. Do not debug component logic until deployment state is confirmed.

## UI Conventions
- Max content width: `MAX_W = 860px`, centered with `margin: "0 auto"` — applies to header, nav bars, search, and all scroll content
- Navigation pattern: breadcrumb bar sits **above** the scroll area, never inside it — always visible regardless of scroll position
- Sort options: two only — Orchestra Name, Section Size. Do not add more without good reason.
- No index numbers on the orchestra list
- Search placeholder: "Search for a bassist by name…" — do not imply compound or structured query support
- Header title on landing: large (44px desktop / 30px mobile), dominant — should feel bigger than the orchestra names below it

## Pending Verification
- None outstanding as of March 15, 2026.

## Sourcing & Audit Notes
- **DSO initial audit (March 2026):** The DSO musicians page loads dynamically and could not be scraped programmatically. Five current members (Brown, Molina, Hamlen, Hatch, Luciano) were confirmed against the official roster image and individual bio pages uploaded directly by the user. Robert Stiles (Principal Librarian, DMA in double bass) appeared in a bass-section search but is not listed on the official roster image; excluded per "when in doubt, leave it out." Brandon Mason (DSO 2020–2025) departed to The Cleveland Orchestra in July 2025; his DSO page remained live at time of audit. Documented in CLE bio as "formerly with the Detroit Symphony Orchestra (2020–2025)."
- **ASO initial audit (March 2026):** Seven bass section members confirmed against the official ASO musicians page (aso.org/about-the-aso/conductors-musicians) and individual artist detail pages. All seven bio pages were accessible and scraped. No exclusions. Juan de Gomar (Contrabassoon/Bassoon) appeared in a bass-section context but is a woodwind player; correctly excluded.

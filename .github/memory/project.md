# Spotify test — project facts

Durable facts. Read before doing anything; append new facts when you learn something that
would save the next session time. Keep it short. Started 2026-10-26 from the main quiz's
planner chat.

## What this folder is
- A SEPARATE test: can a music-quiz clip play from the host's Spotify at the right second,
  with the countdown in step with the actual sound? Option "C" of the main quiz's
  "BIG PROJECT" (Hitster-like idea). If it works, it may later grow into a Spotify version
  of the quiz. If not, it gets dropped.
- Home: `C:\Users\daevi\Documents\Code\Music quiz Spotify test\`. Opened in its OWN VS Code
  window.

## The main quiz (read-only from here)
- Lives in `C:\Users\daevi\Documents\Code\Music quiz random\` (its own memory in
  `.github\memory\`). Full backup: `C:\Users\daevi\Documents\backup\Music quiz random 2026-10-26\`.
- NEVER write, copy over, move or link into the main quiz folder from here. Reading a file
  with a tool for a fact is OK; never open its files in editor tabs in this window.
  Why: on 2026-10-26 stale editor tabs saved September versions over 3 game files (rescued).
- Party music quiz, Norwegian content, English UI. Works by double-clicking HTML (file://),
  no build step, no framework, no server for play. 5×5 board, rows = 1–5 points. Clips:
  10 s for 1–2 point tiles, 20 s for 3–5. Teams take turns; answers revealed on a TV board.
- `music\quiz list.txt` line: `Artist - Song = Answer, Answer #tier @clipStart +tags`.
  ~450 song lines (songs repeat across categories), 13 categories + a BONUS section. Big
  ones: Food, Country, Colour, Bodypart, Animal, City, Number, Drink, Car, Name. Instrument
  is exactly one full column (tiers 1–5, Mambo No. 5 = #5).
- `music\song details.txt`: block per "Artist - Song" with `times: Word(sec)` = where the
  answer word is sung, in seconds from the start of OUR mp3 file (not Spotify's version).
- Example answer time to test with: Lou Bega - Mambo No. 5 (A Little Bit of...) = Trumpet,
  at 151.3 s in our mp3 (song details.txt; an earlier note said 150.7 — wrong, but both fit).
- Our mp3s can differ from Spotify's versions (remixes, remasters, radio edits), so answer
  times may need re-checking against Spotify. Known example: Old Town Road file is the 2:37
  Billy Ray Cyrus remix.

## Spotify facts
- User has Spotify Premium. Default browser: Firefox.
- RULE (user, 2026-10-26): do NOT use Spotify's developer Web API / developer app. User checked
  the rules: fine for private parties, not for official bar quiz nights.
  → Use Spotify's ordinary embedded player (open.spotify.com/embed, with its iFrame API).
- Believed, NOT verified (check in the test): the embed plays full songs only when logged in
  to Spotify in the same browser, else 30-second previews; it may not work from a
  double-clicked page (fallback: a small launcher .bat like the main quiz's builder);
  its position updates may be coarse (timer could lag ~0.5 s).
- Verified 2026-10-26 (user, Firefox): full songs play; jumping to a second works, with a
  ~0.1 s blip of the song's opening first. Mambo "Trumpet" at 150.7 s fits Spotify's version.
- Verified 2026-10-26 (user, Firefox, double-clicked page): logging in at open.spotify.com in
  another tab works — the test page just has to be reopened afterwards. One-time login.
- Verified 2026-10-26 (VS Code browser, not logged in): embed + iFrame API load fine from
  file://. Not logged in = "Preview" tag, duration 29.7 s; seeking past it just ends the
  preview (page now says so). Sound ~1.1 s after click. Positions arrive as ~whole seconds
  (wanted 0:05, first report 0:06), so the countdown follows Spotify's position, not a clock.
- Track IDs (checked via open.spotify.com/oembed, public, no developer app): Karma Chameleon
  6FN3UFrBFYQSTxhXa4tId3, Lose Yourself (Eminem) 7MJQ9Nfxzh8LPZ9e9u68Fq, Mambo No. 5
  5lA6mFOvaiienokVbTZEQx. Clip starts in the page (50/60/30 s) are picked by us, not the
  main quiz's @clipStart — editable on the page.
- Finding song links (2026-10-26): web search per song, then verify by fetching
  open.spotify.com/track/<id> — its <title> gives song + artist, `music:duration` the length.
  Search answers are often wrong IDs (other songs) → always verify. Dead ends: song.link API
  (401, public access closed), scripted Bing/DuckDuckGo results (junk).
- Links done 2026-10-27: all 272 in `spotify-links.js` (Kygo jo + Dai Dai pasted by user). Wikidata
  SPARQL (P2207 = Spotify track ID, by English label) gave many IDs in one go. Our mp3 lengths
  are in main quiz `tools\.cache\dur-<mp3 name>.json`. Spotify pages: fetch max ~2 at a time
  or some fail. Agent scratch scripts: session folder `files\` (collect/wikidata/pick/gen_links).
- Gotcha: piping text with — · → into python from PowerShell turns them into "?" — write a
  .py file or use the edit tool for memory files.
- `spotify quiz.html` = the Spotify quiz board (starter, 25 songs) — WORKS (user, Firefox,
  2026-10-26; spot-checked, not all 25 heard). Songs, links and answer
  times are in the BOARD list at the top of its script. Clips play from 0:00 (like the main
  quiz); answers play 3 s before → 4 s after. Spotify player is covered (it shows the song
  name); click the cover to show it.
## GitHub (2026-10-31)
- Git for Windows installed at `C:\Program Files\Git`. VS Code signed in to GitHub.
- GitHub user: Eviletheth. Git name/email set in `C:\Users\daevi\.gitconfig` (2026-10-31):
  Eviletheth / 208350097+Eviletheth@users.noreply.github.com (hidden address, public project).
- An empty public project was made on github.com by hand (name not yet recorded here).
  GitHub Pages can't be switched on until the first upload creates a branch. The branch may be
  called `master` instead of `main` (Git's default) — pick whichever appears in Pages.
- The old test pages stay on the PC but are kept out of GitHub with a `.gitignore` list.

## The Spotify game (copy of the complete main game, 2026-10-27)
- Files: `Musikk quiz host console.html`, `Musikk quiz board.html`, `quiz-core.js` = copies of
  the main quiz (2026-10-27) with small, marked changes ("Spotify copy" comments), plus
  `quiz-spotify.js` and `spotify-links.js` (new). Same features: teams, turns, keys, bonus,
  trivia, example round, presets/sessions, builder.
- `quiz-spotify.js`: quizSpotifyPlayer(box) = stand-in for the <audio> element (src, play,
  pause, currentTime, events) that plays through Spotify's embed. The game still asks for mp3
  paths; `spotify-links.js` (rows ["Artist - Song", mp3 path, track id]) maps them to Spotify.
  Extra event 'playing' = sound really started at the wanted spot.
- Host console changes: player = quizSpotifyPlayer('spotifyBox') (small fixed player, bottom
  right, host screen only); builderAudio = same player; countdown is held until 'playing'
  (holdCountdownForSound in playClip); "Quiz folder" panel → "Spotify" panel (folder picker,
  sound-on-board and volume leveling hidden); audioState() forces sound on the console.
- quiz-core.js changes: own storage key / channel names (`musikkQuizSpotify…`) so it never
  mixes with the main quiz; quizCreateVolumeLeveler is a do-nothing stub. Board window
  names `spotifyQuizBoard` / `spotifyQuizConsole`.
- Builder "save" can't write anything when double-clicked (shows copy boxes) — and there is
  no server here, so nothing can reach the main quiz's files.
- Verified 2026-10-27 in VS Code's browser (not logged in, 30-s previews): game loads with no
  errors; tile → "Starting on Spotify…" → countdown starts with the sound (~0.8 s) and stays in
  step, music stops at "Time"; song without link → "Could not play … play the song yourself",
  countdown runs; answer-word preview (play) and builder chip preview jump and stop right;
  TV board mirrors the console.
- Host sees "Spotify: Artist - Song" under the countdown (quizSpotifyLabel, used by clipForKey)
  and "(Spotify)" in the page title — user was confused by the old mp3-path label (2026-10-27).
- Volume (checked 2026-10-27): NOT possible from the page. Spotify's embed commands are only
  play_from_start/play/pause/resume/toggle/seek/load_complete_ack/fullscreen (iframe API +
  embed scripts searched); no volume slider in the embed; cross-origin iframe audio can't be
  turned down by our page. Use Windows volume / volume mixer (Firefox slider) instead.
- To refresh songs/boards from the main quiz later: re-copy quiz-core.js's built-in pool
  (QUIZ_DEFAULT_POOL_TEXT / QUIZ_DEFAULT_DETAILS_TEXT) and redo the marked changes, or
  diff the files — never edit the main quiz.

- History (main quiz, Sept 2026): Spotify developer playlist API returned 403 even with
  Premium — irrelevant now (no API), but don't go back there. Spotify search links per song
  already exist in the main quiz host console ("Search Spotify").

## User decisions (do not re-litigate)
- Explain plans non-technically: how it looks and works, not the internals. Every step gets
  a check: what to click, hear or see.
- "First do X" means only X. Small tasks: do several in one go.
- No mp3s in this folder — Spotify only.
- Keep this test separate from the main quiz folder, always.
- 2026-10-26 C5 verdict: BUILD ON IT — make a Spotify version of the quiz.
- 2026-10-26: Start with a small starter board (25 songs), not the whole list — see if the
  quiz turns out good first. No time for the user to check every link.
- 2026-10-27: Goal now = ALL songs + set up like the complete main game (host console, TV
  board, teams, etc.), sound from Spotify.
- 2026-10-27: OK to use the main quiz's SAVED Sept 2026 Spotify search results
  (`tools\.cache\spot-*.json`, read-only) for links — reading an old file, no developer API calls.
- 2026-10-31: Option B chosen — this folder goes on GitHub and is published as a website
  (user also wants to learn GitHub in general). Plus phones for players, joining by QR code.
  (Supersedes the main quiz's 2026-10-13 note "no QR codes needed" for this project.)
- 2026-10-31: GitHub project is PUBLIC (user: unlikely the wrong people find it). Phones: "join
  a team + buzz" first. Copilot keeps helping with the code as before; GitHub only adds save
  points + upload. Workflow: commit before asking for a big change, test, commit, Sync.
- 2026-10-26: In the main quiz, clips start from the song's beginning anyway, so the ~0.1 s
  blip before a jump doesn't matter for clips (only the answer moment jumps).

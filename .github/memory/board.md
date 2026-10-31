# Spotify board — updated 2026-10-31

## Objective
DONE: a Spotify version of the complete quiz (open `Musikk quiz host console.html`).
NOW (user, 2026-10-31): put it on a website through GitHub (option B, user also wants to learn
GitHub), then add phones for players that join by scanning a QR code.

## In progress
- 2026-10-31 F1/F2: Git for Windows installed (C:\Program Files\Git). User created an EMPTY
  project on github.com first, so Pages shows "add content first" (no branch yet). This folder
  IS a Git project now. `.gitignore` holds the 2 test pages (done). Name/email set in
  ~/.gitconfig (done). Next: stage everything → first commit → Add Remote (the github.com
  address) → Publish Branch.
  Decided: PUBLIC project; phones do "join a team + buzz" first; old test pages stay on the
  PC but are NOT uploaded (user, 2026-10-31).

## Next up — F: GitHub + website (S–M, the user clicks, the planner guides)
- [ ] F1 Install Git for Windows (defaults; VS Code as editor) + restart VS Code + set name and
  GitHub "noreply" email for save points — S. Check: Source Control panel (Ctrl+Shift+G) shows
  "Initialize Repository" + "Publish to GitHub" instead of "Download Git".
- [ ] F2 Source Control → "Publish to GitHub" → public, short name (e.g. musikk-quiz-spotify) →
  pick files — S. Decide first: keep/delete the old test pages. Check: github.com shows the files.
- [ ] F3 github.com → the project → Settings → Pages → Deploy from a branch → main, / (root) →
  Save — S. Check: open the address + /Musikk%20quiz%20host%20console.html in Firefox, logged
  in to Spotify, open a tile → FULL song plays, countdown in step.
- [ ] F4 First real loop: ask Copilot for a start page (index.html, so the plain address opens
  the game) → test by double-click → commit (✨ writes the note) → Sync → site updates in
  ~1 min — S. Check: the plain address opens the game. Then practise undo once.

## Next up — G: phones via QR (L in total; prove the link first)
- [ ] G0 Decide: what phones do first (recommended: join a team + buzz button) and how phones
  talk to the host (recommended: direct link first, online relay service only if that fails).
- [ ] G1 Link test page, like the C test was for Spotify — S–M. Host page shows a QR; phone
  scans, taps a button, host sees "Phone 1 pressed" in under half a second. Check on home Wi-Fi
  AND on mobile data, two phones at once. Verdict: build on it, or switch link type.
- [ ] G2 Join by QR — M. TV board shows a QR; phone opens, picks a team, types a name; host
  console lists phones per team. Check: 2 phones join different teams, names show on host.
- [ ] G3 Buzzer — M. Free-for-all + bonus: phones show a big BUZZ; first buzz lights up on TV
  and host; host still gives the points as today. Check: two phones press, the right one wins.
- [ ] G4 Phones show score + whose turn — S. Check: host gives points → phones update.
- [ ] G5 Party test with 3+ phones — S. Check: a full board played, nobody drops out.

## Next up — older
- [ ] E6 Songs whose Spotify version differs in length from our mp3 (answer times may be off,
  answer words may show early/late) — S · only if the user hears problems:
  This Is America (245 vs 306 s), We Didn't Start the Fire (290/249), Showed Up (205/212),
  Your Song (242/228), Are You Gonna Be My Girl (215/230), Stuck in the Middle (204/209),
  Free Bird (543/547), Wish You Were Here (304/335), Freaks (265/274), Rasputin (266/221),
  Copacabana (268/245), Anything You Can Do (195/228), Start Me Up (214/250), Candle in the
  Wind (230/250), Come On Eileen (242/287), Footloose (227/221), Dai Dai (223/212).
- [ ] Old test pages `spotify test.html` / `spotify quiz.html` — keep on the PC, not uploaded
  (user, 2026-10-31): right-click → "Add to .gitignore" in Source Control.

## Done
- [x] 2026-10-27 E4 User tested the Spotify game in Firefox, logged in: "works great". No songs
  reported wrong yet.
- [x] 2026-10-27 Volume control asked for: not possible (Spotify embed has no volume command,
  see project.md). User chose a tip in the host console's Spotify panel instead (added).
- [x] 2026-10-27 E5 Kygo jo + Dai Dai: links from the user, checked on Spotify. Kygo jo = Kygo
  Remix 153 s (= our mp3). Dai Dai 223 s vs mp3 212 s → added to E6 list. All 272 linked.
- [x] 2026-10-27 E1 Spotify links: all 272 songs (270 found here, 2 pasted by user) + example round (Blue radio edit) in
  `spotify-links.js`. Each checked on its Spotify page (title + artist), version closest to our
  mp3 length. Sources: saved Sept results (user OK), Wikidata, starter board, web search
  (background helper). Scratch: session `files\` (pick.py, gen_links.py, picks.json).
- [x] 2026-10-27 Host sees "Spotify: Artist - Song" under the countdown + "(Spotify)" in the
  title (user asked for proof it plays from Spotify). Bonus round + example round tested: play,
  countdown held until sound, stops at 10.0 s.
- [x] 2026-10-27 E3 Sound from Spotify in the copied game — verified in VS Code's browser
  (previews): countdown waits for the sound and stays in step, stops at "Time"; missing link
  → "Could not play", countdown runs; answer preview + builder preview jump and stop right;
  TV board mirrors. (Bonus + example round tested later the same day, see above.)
- [x] 2026-10-27 E2 Complete game copied (host console, TV board, quiz-core.js); own saved-game
  key + board channel so it never mixes with the main quiz. Loads with no errors.
- [x] 2026-10-26 D2–D3 `spotify quiz.html` works — user, Firefox, logged in: the tiles and
  answers checked were all right (not all 25 checked yet). Also verified in VS Code's browser:
  clip → "Loading…" 1.1 s → countdown → "Time!"; Reveal + answer buttons; used tile greys out.
- [x] 2026-10-26 D1 25 Spotify links found and checked: each link's Spotify page shows the right
  title + artist; where several versions exist, the original album one was picked.
- [x] 2026-10-26 C5 Verdict: BUILD ON IT (user). Spotify embed works for the quiz.
- [x] 2026-10-26 C2–C4 passed — user, Firefox, logged in, double-clicked page: all three
  clips start at the set second (a ~0.1 s blip of the song's start before it jumps), countdown
  in step and stops at 0, Mambo "Trumpet" heard inside the answer window.
- [x] 2026-10-26 C1 `spotify test.html` opened as a file (file://) shows the Spotify player —
  verified in VS Code's browser and by user in Firefox (double-click).
- [x] 2026-10-26 Folder + planner agent + memory set up from the main quiz's planner chat.

## Parking lot
- Phones: typing answers, own board view on the phone, online saving of games — after G5.
- Hitster-style game mode — after G5.

## Watchlist
- Separation: nothing may be written into `Music quiz random`. Never open its files in tabs here.
- Known: ~0.1 s blip of the song's opening before the jump (only matters when not starting at 0).
- Answer times are from our mp3s; Spotify's version may differ per song (Mambo matched).
- Website = every file is downloadable by anyone with the address, answers included (true for a
  private GitHub project too). A public GitHub project also shows the memory notes + history.
- Phones can't open double-clicked pages: phone features can only be tested on the website.
  Host + board must keep working by double-click (phones then just don't join).
- Spotify stays on the host computer only; phones never play sound or log in.

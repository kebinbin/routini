# Working notes — Sona

Scratch list for this demo. Separate from the routini library.

## Fonts — Acumin Pro

- Design font is **Acumin Pro** (Adobe Fonts). Not committed (Adobe license).
- CSS stack: `"acumin-pro", "Inter Variable", system-ui` → falls back to Inter.
- To activate: add the Adobe Fonts web-project link to `index.html`:
  `<link rel="stylesheet" href="https://use.typekit.net/XXXX.css" />`
  (create a Web Project in Adobe Fonts with Acumin Pro, paste its kit URL).
- This is the clean way — no font files in the repo, web use is covered by the
  Adobe subscription. Remove the `<link>` to drop back to Inter anytime.

## Music attribution — verify before public deploy

Audio + album art are real CC albums; display names follow the Figma. Most CC-BY
releases REQUIRE crediting the artist. The README "Credits" table lists them; the
per-artist source is in `src/lib/data.ts` (`credit` field).

- [ ] Verify each album's exact license + canonical link (Free Music Archive, etc.)
- [ ] CC-BY ones need visible attribution (README + ideally an in-app About page)
- Holizna (Control Machete) is CC0 — no attribution required.

## Status

- [x] Feed screen matched to Figma: square rows (image full row-height, no radius),
      h-32 rows, always-visible play/pause, "{date} @ {venue}" subtitle, genre +
      "N more songs" centered middle columns, heart right.
- [x] AppLayout: exact colors (#000 base / #09090b panels / #0e0e11 rows), logo
      (equalizer bars) + favicon, sidebar with search+Filters and vertical event
      flyers, full-width flush player (no border).
- [x] Player: prev/play-pause/next + speaker, queue + auto-advance, h-24,
      short volume slider, "{artist} @ {date}, {venue}" subtitle.

## TODO (next)

- [ ] Artist page layout → Figma (full-bleed hero + "Hear more from…" tracklist)
- [ ] Event page layout → Figma (poster + details + lineup)
- [ ] "About this project" page (houses the credits in-app)
- [ ] Landing page (from the Figma landing frame)
- [ ] Activate Acumin Pro (paste Adobe Fonts Typekit `<link>` in index.html)
- [ ] Deploy (Vercel/Netlify subdirectory) + link from the routini site
- [ ] Confirm artist↔photo and artist↔album pairings match the Figma intent

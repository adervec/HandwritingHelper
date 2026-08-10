# Handwriting Helper

A handwriting and calligraphy trainer that runs entirely in your browser. Photograph a page of
your writing, get it scored on the things that actually make handwriting readable, and get a daily
routine of drills aimed at whichever of those you're worst at — for either hand.

**Live: https://adervec.github.io/HandwritingHelper/** · installable as a PWA · works offline

---

## What it does

**Analyze a page.** Photograph or scan a page and the app finds each line of ink, fits a baseline
to it, and measures how much the writing varies:

| Score | What it measures |
|---|---|
| Slant steadiness | Spread of stroke angles. Not *what* your angle is — that you keep picking the same one. Not scored for scripts with no canonical angle. |
| Baseline | Scatter around the line the script is organised around — the bottom for Latin, the headline for Devanagari, the centre for CJK. |
| Size consistency | Variation in line height. |
| Spacing | Variation in gaps — letter gaps in print, word gaps in cursive, since cursive joins letters. |
| Pen control | Variation in stroke width, from horizontal ink run-lengths. Catches a grip that's too tight. |
| Legibility | Optional. OCR confidence — a machine reading your writing is a harsh but honest proxy. |
| Mirror match | In mirror-prime mode: how closely the off-hand copy matched the line above it. |

**Overall** averages only the first four, deliberately. Legibility needs OCR and is often absent,
and pen control was added later — folding either in would silently re-scale every score already in
your history and make the trend line a lie.

Each page also gets a **line-by-line breakdown**, with the weakest line shaded on the image.

**Practise.** 38 drills, each tagged with the metrics it trains, the hand and the style —
warm-ups, slant rails, baseline work, x-height and ascender discipline, spacing, cursive joins,
pen control, four left-hand-specific drills, mirror priming, and speed/endurance. Every drill opens
a runner with a countdown timer and, where it helps, a **printable guide sheet generated in true
millimetres** (ruled, slant rails at your angle, grid, letter boxes, mirror-prime pairs, trace
lines). Sheets fit one page on both A4 and Letter.

**Follow a plan.** Today's routine is generated from your weakest metrics over the last eight pages:
warm-up, two drills at the weak spot, one at the runner-up, then something to photograph. Or start
one of three **multi-week programs** — *Left hand from scratch* (8 weeks), *Neater printing* (6),
*Cursive revival* (6) — which replace the generator with an ordered syllabus that advances by date.

**Nine alphabets, not just Latin.** Latin, Cyrillic, Greek, Hebrew, Arabic, Devanagari, Thai,
Chinese/Japanese and Korean. The analyzer's geometry is a set of Latin assumptions, so each script
declares what actually applies to it: Devanagari hangs from a headline rather than sitting on a
baseline, CJK and Korean are boxed and only need to march level, Arabic and CJK have no canonical
stroke angle so slant isn't scored, joined and cell-set scripts are judged on word gaps and
character pitch instead of letter gaps. Drills print their own alphabet on the right guide sheet
(headline, character cells, right-to-left) and OCR loads the matching language model.

**It works out what it's looking at.** After analyzing, the app compares the page against your
settings and offers a one-tap switch if they disagree: joined writing while you're set to Printing,
alternating dominant/copy lines while you're set to Single hand, or a headline script. It only
claims what measurement supports — separated vs joined writing is 1.5 against 0.16 (nine times
apart, stable across typefaces and sizes), mirror pages score ~37 against under 1 for a page that's
merely messy. It deliberately does *not* guess which alphabet within the baseline family, or CJK
versus Latin, because the geometry genuinely doesn't separate them. It never switches silently.

**Review a whole scan batch at once.** The Drive scanner batches a stack of pages into one PDF,
so opening a PDF — from Drive or straight off your phone, no account needed — gives you a gallery
of every page. Pages already saved are dimmed (tracked per *page*, so a 40-page batch with one page
logged isn't marked finished), duplicates are flagged, and "Import all new" does the rest.

Opening is lazy and cached: a 40-page gallery opens in **3ms rendering zero pages**, previews arrive
as you scroll and are kept afterwards, so re-opening is free. The document itself is parsed once
rather than per page (160ms, then ~17ms a page when a preview is actually needed).

**Duplicate detection.** Every page carries a 256-bit layout fingerprint (a 16x16 difference hash).
Re-scanning a page you've already logged is flagged before you save it twice, whether it repeats an
earlier page of the same batch or one from months ago. The fingerprint is computed once at a fixed
width and stored with the preview — the same page fingerprinted from a thumbnail and from a
full-size render came out 26 bits apart, most of the 32-bit budget, which would have masked real
duplicates. The resolution and threshold were measured,
not guessed — at 64 bits a re-scan and a different page are 5 and 10 bits apart, which is no
separation at all; at 256 bits they're 13 and 70.

**Group pages into projects.** A page of practice and a page of a book you're copying out aren't the
same thing. File pages under a project — a book (with author and a page goal), a journal, a course
workbook, or anything else — and each one gets its own page count, time, per-hand averages, best
page and progress bar. The trend chart filters by project, and pages you don't file stay under
Unfiled. Deleting a project never deletes its pages; they just become unfiled.

**Watch it move.** Weekly goal, streaks, an 18-week activity calendar, per-hand metric profile,
trend chart, this-week-vs-last table, twelve achievements, and a **then-and-now view** that puts
your first and latest page side by side — because a picture of your own handwriting from two months
ago is more convincing than any number.

There's a [reference guide](https://adervec.github.io/HandwritingHelper/guide.html) covering how to
photograph a page so the scores are trustworthy, posture and grip, the left-hand paper tilt, and a
symptom-to-drill troubleshooting table.

## Privacy

Analysis runs entirely in your browser. **No photo ever leaves your device** — it is never uploaded
or stored anywhere but locally. Page thumbnails stay on the device that made them.

Connecting Google Drive is optional and syncs **scores and project names only**, through a private app-data folder
that only this app can see. It uses a two-tier scope split: sync needs `drive.appdata`; importing
scans from a folder needs the wider `drive.readonly`, requested separately and on demand, so a
refused scan permission can never break sync.

OCR downloads its engine from a CDN on first use, then caches. Everything else works offline.

## Running it

There is no build step. It's one `index.html` you can open directly:

```
git clone https://github.com/adervec/HandwritingHelper
cd HandwritingHelper
# just open index.html — or serve it if you want the service worker:
python -m http.server 8000
```

The service worker and Google sign-in need `https://` or `localhost`; everything else works from
`file://`.

## Tests

Open `index.html?selftest` — the page title becomes `SELFTEST PASS` or `SELFTEST FAIL` and the
Setup tab lists every check. It covers the image analysis on synthetic pages, OCR date/duration
parsing, Drive sync merge semantics, the drill catalog, guide-sheet geometry, plan and program
generation, derived stats, the weekly and compare views, and every chart.

`?selftest=ocr` and `?selftest=pdf` add checks that hit the network — the latter builds a 40-page
PDF in memory with a duplicate planted in it and runs it through the real import path. See
`test/README.md`.

Headless:

```bash
msedge --headless=new --virtual-time-budget=20000 --dump-dom "…/index.html?selftest"
```

## Notes for anyone forking this

- `sw.js` has a hand-bumped `VERSION` const. There's no build step to stamp it, so **bump it on
  every deploy** or the service worker keeps serving the old shell.
- The Google OAuth client ID is public (it's an identifier, not a secret) and only works from
  origins registered with Google. There's also an app-side origin gate, so a fork deployed
  elsewhere must supply its own client ID — there's a field for it in Setup.
- Score constants are hand-tuned heuristics. They're marked in the source and can be recalibrated
  if the numbers don't match your sense of the page.
- Chart colours come from a validated palette: right hand blue, left hand green, checked for
  colour-vision deficiency in both light and dark themes. If you change them, re-validate.

## Licence

Personal project, no licence granted. Fork it for your own use.

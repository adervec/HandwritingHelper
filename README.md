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
| Slant steadiness | Spread of stroke angles. Not *what* your angle is — that you keep picking the same one. |
| Baseline | How far letter bottoms scatter around the fitted line. Descenders are trimmed out first. |
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

Connecting Google Drive is optional and syncs **scores only**, through a private app-data folder
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

`?selftest=ocr` adds checks that hit the network. `test/pdf-render.html` separately verifies the
pdf.js path used for Drive PDF scans.

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

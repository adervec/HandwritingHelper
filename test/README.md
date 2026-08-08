# Tests

Everything lives in the app itself so the tests exercise the real code rather than a copy of it.

| URL | What it covers | Network |
|---|---|---|
| `index.html?selftest` | The whole app: image analysis across nine scripts, OCR parsing, Drive sync merge semantics, projects, drills, guide-sheet geometry, plans and programs, derived stats, charts, duplicate hashing. ~213 checks. | no |
| `index.html?selftest=ocr` | Adds the Tesseract round-trip: renders a dated page, reads it back, checks the parsed date and duration. | yes (CDN) |
| `index.html?selftest=pdf` | Adds the batch-PDF path: builds a 40-page PDF in memory with a duplicate planted in it, renders every page through the app's own `pdfDocFor`/`pdfRender`, and checks page count, the document cache, thumbnail and full-res sizing, and that the planted duplicate is the only one found. | yes (CDN) |

The page title becomes `SELFTEST PASS` or `SELFTEST FAIL`, and the Setup tab lists every check.

Headless:

```bash
msedge --headless=new --virtual-time-budget=60000 --dump-dom "…/index.html?selftest=pdf"
```

`?selftest=ocr` and `?selftest=pdf` both imply the base suite, so running either gives you everything
plus its own extra checks.

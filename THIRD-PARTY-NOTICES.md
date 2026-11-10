# Third-party notices

HandwritingHelper bundles the following third-party software under `vendor/`. Each licence text sits
beside the files it covers.

| Name | Version | Licence | Source | Files |
|---|---|---|---|---|
| Tesseract.js | 5.1.1 | Apache-2.0 | https://github.com/naptha/tesseract.js | `vendor/tesseract/tesseract.min.js`, `worker.min.js` |
| Tesseract.js-core (Tesseract OCR compiled to WebAssembly) | 5.1.1 | Apache-2.0 | https://github.com/naptha/tesseract.js-core | `vendor/tesseract/tesseract-core-*.wasm.js` |
| Tesseract trained data, best_int (eng, rus, ell, heb, ara, hin, tha, chi_sim, kor) | 4.0.0 | Apache-2.0 | https://github.com/tesseract-ocr/tessdata_best, packaged by https://github.com/naptha/tessdata | `vendor/tessdata/*.traineddata.gz` |
| PDF.js (pdfjs-dist) | 3.11.174 | Apache-2.0 | https://github.com/mozilla/pdf.js | `vendor/pdfjs/pdf.min.js`, `pdf.worker.min.js` |

Fonts are not bundled here. They are loaded from the maker's own site (https://adervec.github.io/fonts/),
which carries their licences: Atkinson Hyperlegible, Andika and Cedarville Cursive, all under the
SIL Open Font License 1.1.

# HandwritingHelper

Notes for the coding agent that works on this repo.

## House standards (shared across every app by this maker)

@../CoworkSyncHub/HOUSE-STANDARDS.md

For this app:
- Check the standards: `node ../CoworkSyncHub/standards.mjs handwriting -v`. Keep it all `ok` before pushing.
- Test: `npm i --no-save playwright-core && node selftest.mjs` (the in-page ?selftest)
- Deploy: push to main: ci.yml self-tests, publishes, live-checks and tags
- Work on `main`, push your own work when it passes, and add user-visible changes to `whatsnew.json`.

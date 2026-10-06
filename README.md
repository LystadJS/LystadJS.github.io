<div align="center">

# John S. Lystad — Academic & Technical Portfolio

**Computational Statistics · Social Science · International Policy**

[Live site](https://lystadjs.github.io/) · [Research](https://lystadjs.github.io/research.html) · [Code & Development](https://lystadjs.github.io/code.html) · [CV](https://lystadjs.github.io/cv.html)

</div>

---

**Repository status:** `ACTIVE` · deployed through GitHub Pages

## Overview

This repository is the source for **LystadJS.github.io**, my academic and technical portfolio. The site presents academic research and applied analytical work together on a unified Research page while preserving a clear distinction between the two, with code/development maintained as a separate technical body of work.

The site is intentionally static and dependency-light: HTML, CSS, and JavaScript are served directly by GitHub Pages without a framework or build pipeline.

## Information architecture

| Page | Purpose |
|---|---|
| `index.html` | Research identity, current signal, and primary navigation |
| `about.html` | Background and research orientation |
| `research.html` | Academic research, applied research, and the Empirical Settings Explorer |
| `projects.html` | Legacy redirect to `research.html#applied-research` |
| `code.html` | Repositories, development work, and technical methods |
| `un/` | UN project directory linked from Code & Development |
| `un/transcript-agent/` | Public Transcript Agent review interface and reports; synced from its project repository |
| `cv.html` | Curriculum vitae |
| `notes.html` / `notes/` | Technical and research notes |

Supporting assets live under `assets/`, including the shared stylesheet, JavaScript, images, favicon, and CV resources.

## Design system

The visual language combines an academic editorial layout with a technical instrument/terminal aesthetic. Core design tokens are defined in `assets/css/style.css`, including:

- near-black backgrounds and raised dark panels
- paper-toned primary text
- oxblood/crimson and violet accents
- serif display typography with sans-serif body text
- monospace instrumentation, terminal, and metadata treatments

The site is designed to remain professional enough for academic and policy contexts while retaining a distinctive technical identity.

## Local preview

Clone the repository and serve the root directory with any local HTTP server. For example:

```bash
git clone https://github.com/LystadJS/LystadJS.github.io.git
cd LystadJS.github.io
python -m http.server 8000
```

Then open `http://localhost:8000`.

Because the site uses relative asset paths, previewing through an HTTP server is preferable to opening individual HTML files directly.

## Maintenance conventions

- Shared visual rules belong in `assets/css/style.css`.
- Section spacing and index-rail geometry for About, Research, and Code belong in `assets/css/portfolio-layout.css`, loaded after each page stylesheet. Page-specific styles own component appearance, not section spacing.
- Shared navigation and progressive enhancement belong in `assets/js/main.js`. Homepage enhancements, CV controls, and Code examples have their own cached scripts.
- `research-program-data.js` is the single canonical homepage graph payload; do not add runtime text-override layers.
- Both Research tag linkers use `research-registry.js` for one bounded registry request. The geographic renderer emits `empirical:panel-rendered` rather than requiring DOM repair observers.
- Legacy page addresses remain redirects; unassigned resources are labels rather than broken template links.
- Public-facing academic and applied research descriptions should remain consistent with the underlying repository documentation.
- The website should link outward to reproducible technical artifacts rather than duplicate full project documentation.

## Related repositories

- [Public GitHub profile](https://github.com/LystadJS)
- [Profile README source](https://github.com/LystadJS/LystadJS)
- [Counterterrorism / ethnosectarian / Islamic State analysis](https://github.com/LystadJS/counterterrorism_ethnosectarian_islamic_state)
- [UN Transcript Intelligence & Dynamic Voting Alignment](https://github.com/LystadJS/UN-Transcript-Intelligence-Dynamic-Voting-Alignment)
- [Unsupervised Machine Learning notes](https://github.com/LystadJS/Unsupervised-Machine-Learning)

---

**John S. Lystad**  
[Website](https://lystadjs.github.io/) · [GitHub](https://github.com/LystadJS) · [LinkedIn](https://linkedin.com/LystadJS)

## Validation and asset maintenance

```bash

# Node 22 and Python 3.11 or later
npm ci
npx playwright install chromium
npm run check
npm test
```

The website regression workflow checks all three portfolio layouts, mobile navigation, Code examples, Research resources and map-adapter interactions, no-JavaScript content, explicit image paths, and the existing military-timeline accessibility contract. Deterministic layout tests block external font/map services; the geographic adapter is tested separately with an explicitly labeled fixture. Existing historical validation records describe their original runs.

Responsive WebP portraits retain the JPEG fallback. Rebuild the two derivatives with `python scripts/optimize_portraits.py` in an authoring environment with Pillow 12.3.0. No build framework or image dependency is shipped to visitors.

The public UN mirror is updated only by `scripts/sync_un_project.py`; it rejects path traversal and symlinks, skips unchanged bytes, and removes only files recorded in the previous manifest. Website maintenance does not rewrite that application's statistical code or data.

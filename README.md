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
- Shared interactions belong in `assets/js/main.js` unless a page-specific script is materially clearer inline.
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

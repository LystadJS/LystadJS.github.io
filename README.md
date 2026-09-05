# John S. Lystad — Academic Portfolio v2

A multi-page GitHub Pages portfolio designed around three distinct bodies of work:

1. **Research** — academic scholarship, works in progress, methods, and research agenda.
2. **Projects** — applied professional work, policy analysis, operational statistics, and decision support.
3. **Code & Development** — computational statistics, GitHub repositories, Gists, software, and technical notes.

The visual system is "dark academia / Frankenstein laboratory" without sacrificing professional readability.

## Files

```text
/
├── index.html
├── about.html
├── research.html
├── projects.html
├── code.html
├── cv.html
├── 404.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── favicon.svg
    └── cv/
        └── PUT-CV-HERE.txt
```

## Publish on GitHub Pages

If your GitHub username is `LystadJS`, create or use the repository:

`LystadJS.github.io`

Upload the **contents** of this folder so `index.html` is at the repository root.

Then open:

**Repository → Settings → Pages → Build and deployment → Deploy from a branch**

Choose:

- Branch: `main`
- Folder: `/(root)`

Your site should then publish at:

`https://lystadjs.github.io`

## First edits to make

### 1. Add your CV

Save the current PDF as:

`assets/cv/John-S-Lystad-CV.pdf`

Keep that filename when updating the CV. This lets you replace the PDF later without editing links.

### 2. Replace placeholder portfolio entries

Search the HTML files for:

- `forthcoming`
- `Add repository URL`
- `Repository slot`
- `Add later`

Replace placeholders only when you have real public material.

### 3. Add verifiable project details

For applied professional projects, use this sequence:

- **Problem** — the real decision or operational question.
- **Method** — data, models, software, or analytical approach.
- **Role** — what you personally did.
- **Impact** — what changed, quantified only when accurate and releasable.

### 4. Keep Research and Projects separate

Do not put a government/UN briefing under Research just because it used statistics.
Do not put an academic working paper under Projects just because it has policy relevance.

This separation is one of the strongest features of the site.

## Disclosure / security note

Before publishing current or former government, diplomatic, humanitarian, or multilateral work, verify what you are authorized to disclose.

Do **not** upload:

- restricted or controlled information
- internal deliberative material
- non-public operational data
- personal data
- credentials, tokens, or API keys
- restricted datasets
- documents you do not have permission to publish

A public-facing case study can still be strong with only:
**problem + method + your role + public impact**.

## Design customization

Main colors live at the top of:

`assets/css/style.css`

Key variables:

- `--bg`
- `--paper`
- `--crimson`
- `--violet`
- `--electric`

The current design uses near-black, oxblood, purple, parchment, and a restrained blue-grey "electrical" accent.

## Good next additions

After the core content is real, consider:

- ORCID
- Google Scholar
- downloadable writing samples
- publication citations
- conference presentations
- teaching
- project case-study detail pages
- a custom domain

## Version 3: Current Signal console

The homepage now includes a prominent terminal-style **Current Signal** section.

It is intentionally designed as an old analytical/laboratory console rather than a neon cyberpunk terminal. The current default command is:

`./current_signal --mode=humanitarian --verbose`

The output exposes:
- field
- current inquiry
- methods
- context
- mission

Edit these lines directly in `index.html` as your current research changes.

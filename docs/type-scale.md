# Shared screen typography

The desktop/mobile audit covered all 24 HTML pages. It found 93 rendered text sizes on desktop and 86 on mobile: H1 ranged from 27–160px on desktop, H2 from 12–80px, and metadata was sometimes smaller than 8px. Similar controls, captions and headings used different sizes on different pages.

`assets/css/type-scale.css` provides five roles, shared by every page, including generated UN pages:

| Role | Repeated elements | Desktop at 1440px | Mobile at 390px |
| --- | --- | ---: | ---: |
| Metadata | kickers, captions, dates, technical labels, footer copy | 12px | 12px |
| Body | paragraphs, navigation, controls, code, lead paragraphs | 16px | 16px |
| Subheading | H3–H6, card titles, brand names, emphasized metrics | 20px | 20px |
| Section | H2 and adjacent section numbers | 40px | 32px |
| Display | H1 and display monograms | 64px | 48px |

The two larger sizes interpolate between those endpoints. There are at most five text sizes at a given viewport. Nested spans and links inherit their role's size; they do not introduce independent variants. Font families, colors, weights and spacing remain in the existing typography and component styles. The UN directory's visible title is HTML, with its existing emblems retained separately, so it follows the same H1 size rather than shrinking with an SVG image.

The important declarations in the `type-scale` cascade layer take precedence over legacy component sizes while keeping the source app's styling and data separate. Add new shared roles to this file using one of the five tokens instead of introducing a sixth size. Generated pages receive the stylesheet through `scripts/site_typography.py`, so source updates preserve the scale.

The screen scale does not override print styles. SVG/MathML labels retain coordinate-based sizes because changing them to page pixels would break chart geometry; these are diagram annotations, not independent interface text roles. The report's reading-size preference still works through `--reading`, which adjusts the scale's base size.

`tests/type-scale.spec.mjs` checks every page on desktop/mobile for the five allowed sizes and for matching H1/H2/H3–H6, form control and section-number roles. Existing responsive, CV, keyboard, data-table and diagram checks protect layout and functionality.

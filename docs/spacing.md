# Shared screen spacing

The audit covers all 25 HTML pages at 1440px and 390px. Before this change, H1 used 10 desktop spacing combinations, H2 used 15, H3 used eight, and paragraphs used 52. These counts combine margins and padding; specialized components legitimately retain distinct geometry.

`assets/css/spacing.css` defines shared roles rather than changing the existing grids, column ratios, font families, sizes or colors:

| Role | Desktop | Mobile |
| --- | ---: | ---: |
| Compact detail | 4–8px | 4–8px |
| Kicker gap; control vertical padding | 12px | 12px |
| Paragraph gap; field horizontal padding | 16px | 16px |
| Title gap; card padding; action separation | 24px | 16px |
| Section heading to content | 48px | 32px |
| Content gutter below maximum width | 32px | 16px |
| Portfolio section padding | 64–96px | 64px |

Heading groups own the space after the group, so their H2 has no additional bottom margin. Masthead titles have no margin because their container owns the padding. Compact metadata and section numbers have no paragraph margins. These exceptions prevent double spacing and preserve index alignment. The existing 780px heading breakpoint and 700px control/gutter breakpoint remain explicit.

Content maximum widths, grid columns, chart coordinates, sticky controls, icon buttons, and CV navigation scrolling retain component-specific geometry. Print styles are unchanged. The generator adds the shared stylesheet to UN pages before computing manifest hashes, so regeneration preserves spacing.

`tests/spacing.spec.mjs` checks the role spacing and overflow on every page at desktop/mobile widths. Existing tests cover intermediate widths, font roles, section/index alignment, figures, keyboard interaction and CV wrapping.

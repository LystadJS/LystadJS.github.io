# Vanguards of Terror — figure sources and scope

The Research page renders the author's **reported thesis table values**, replacing
its former six-unit synthetic distance matrix. There is no statistical refit,
clustering, normalization, or newly estimated linkage–cohesion relationship.

## Source

John Lystad. *Vanguards of Terror: Analyzing the Tactical Orientation and Cohesion
of the Islamic State Insurgency 1999–2019*. Florida State University, Spring 2022.
Author-supplied `HITM Thesis.pdf`, 109 PDF pages.

SHA-256: `ef06e537c341112da4677b1701cd334fdde21beb60a9f0af3cf692b04d0996fc`.
The PDF is not republished by this update. Table values were extracted from the
text layer, checked against rendered pages, and retain their printed precision.
The repeated ISIL columns agree with Table 4.1.

| Unit | Tactic table | Printed page (PDF page) | Linkage table | Printed page (PDF page) |
|---|---|---|---|---|
| ISIL baseline | 4.1 | 39 (49) | Not scored | — |
| Libya | 5.2 | 49 (59) | 5.1 | 46 (56) |
| Yemen | 5.5 | 53 (63) | 5.4 | 50 (60) |
| Sinai | 5.8 | 57 (67) | 5.7 | 54 (64) |
| East Asia | 5.11 | 61 (71) | 5.10 | 58 (68) |
| Khorasan | 5.14 | 65 (75) | 5.13 | 62 (72) |
| West Africa | 5.17 | 69 (79) | 5.16 | 66 (76) |
| Greater Sahara | 5.20 | 73 (83) | 5.19 | 70 (80) |
| Caucasus | 5.23 | 77 (87) | 5.22 | 74 (84) |
| Central Africa — Congo wing | 5.26 | 81 (91) | 5.25 | 78 (88) |
| Central Africa — Mozambique wing | 5.29 | 85 (95) | 5.28 | 82 (92) |

## Display

The default **Tactic profiles** view compares five selected tactical frequencies
and the separate suicide indicator. Cells report percentages, not distances.
Color intensity uses a shared 0–65% scale. These selected columns are not a full
composition: thirteen mutually exclusive tactics are tabulated in the thesis,
while suicide is a cross-cutting attribute.

**Bombings & raids** uses aligned dot plots with common 0–70% scales. Dashed lines
are the reported ISIL baselines (60.2% and 10.6%), not fitted trend lines or
uncertainty intervals. **Linkage scores** displays the reported sum of nine 0–1
criteria on its full 0–9 scale. Every view preserves Chapter 5's province order.
Congo and Mozambique are separate wings in the thesis, not pooled observations.

## Interpretation and source issues

- Baseline observations cover 8 April 2013–31 December 2019; the affiliate study
  window covers 29 June 2014–31 December 2019. Affiliate inception dates also
  vary. These windows are not silently treated as matched exposure periods.
- The thesis's 6,606 ISIL and 2,639 affiliate operations are overall totals, not
  province-specific denominators. No per-province counts or error bars are
  inferred. Tactics follow the thesis's objective-based coding hierarchy.
- The chapter conclusions (printed pp. 86–87) leave a linkage–behavior
  association for further quantitative analysis. Differences in shares alone
  do not establish correlation, causation, or a degree of central control.
- Reported tactic sums range from 99.8% to 100.2%. Source values are retained,
  not renormalized. Suicide plus non-suicide sums to 100% in all eleven rows;
  all ten linkage totals equal the sum of their nine displayed criteria.
- Libya's target-choice values in Table 5.3 sum to 97.0%; the Caucasus discussion
  (p. 76) conflicts with the target-choice table (p. 77). No target-choice
  values are plotted, and no speculative corrections are made.
- Provenance follows the printed table captions, not inconsistent cross-references
  in the prose. The display uses “Caucasus,” matching its tactical table.

## Reproduction

From the website repository root, run:

```sh
python3 scripts/build_research_figures.py
python3 -m unittest discover -s tests -p 'test_*.py'
npx playwright test tests/vanguards.spec.mjs
```

`assets/data/vanguards-thesis.json` is the source transcription and audit record.
`assets/data/vanguards-thesis.csv` contains 265 values with measure type, original
numeric string, units, table number, and printed/PDF page. The generator embeds
SVG and an accessible data table directly into `research.html`. JavaScript only
switches views; the default chart, table, and downloads do not require it.

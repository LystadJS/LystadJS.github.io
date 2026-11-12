# Operational mirror regression repair — 12 November 2026

PR #151's source application mirror passed its hash/provenance audit, but the portfolio regression suite failed against inherited expectations. The initial failing tests and portfolio assets were identical to main (`3da8e82505953cd8f37b9cfb9ba85c92992152b6`). This repair preserves the current portfolio design and the source-owned mirror assets.

A real defect was found in the shared presentation layer: `type-scale.css` overrode the Cuba report's reading-size control. The body and metadata tokens now honor `--reading`, preserving the normal portfolio defaults. The browser regression uses the actual control and verifies selection, reload persistence and reset. No generated report or source data is edited.

The remaining repairs bind assertions to existing, intentional contracts:

- The November palette in `style.css` specifies canvas `#090B0D`, text `#EEE9E0`, muted text `#B0AAA4`, and accent `#9C3846`. Document lists use primary text; university metadata uses the secondary color. Research/code index labels retain their existing text color, while editorial `.section-index` labels use the accent.
- The opaque academic header and the three titled destination cards are retained. Cards are checked for their actual accessible names and local destinations. Keyboard navigation uses the existing About navigation link, opening the mobile menu when needed.
- The CV uses four qualifications, grouped school art and a shared military scale. Image loading checks cover all 18 current organization/school/identity/insignia images instead of expecting 19 obsolete repeated role logos.
- Typography checks retain an exhaustive default-size audit, with exact checks for the deliberately enlarged CV masthead, 10:9:6 education hierarchy, minor position headings, and military year/date/role labels. The UN directory is excluded from the *personal-portfolio* spacing category while still receiving the full spacing and overflow audit.
- The military-detail test now waits for the specified opacity of `0.38` after the 150 ms transition instead of sampling its intermediate state. Its pixel threshold is unchanged. Linux timeline baselines were visually inspected and refreshed for the existing November palette; unit/rank positions, geometry, chronology, keyboard tests and accessibility assertions remain intact. Windows snapshots are not claimed as newly validated.

Synthetic browser tests and engineering visual inspection are not diplomat usability acceptance or model evaluation. No owner annotation is inferred from these checks.

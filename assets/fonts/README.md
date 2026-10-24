# Website fonts

Self-hosted WOFF2 files loaded by `assets/css/typography.css` with `font-display: swap`.

- **Atkinson Hyperlegible**: regular, bold, italic, and bold italic, from the [Braille Institute's Atkinson Hyperlegible distribution](https://github.com/googlefonts/atkinson-hyperlegible/tree/main/fonts/webfonts). Used for body text, smaller headings, and interface controls.
- **EB Garamond**: variable roman and italic, from the [EB Garamond 12 upstream distribution](https://github.com/octaviopardo/EBGaramond12/tree/master/fonts/webfonts). Used for H1/H2, main titles, and serif accents.
- **JetBrains Mono**: variable roman and italic, from the [official JetBrains Mono distribution](https://github.com/JetBrains/JetBrainsMono/tree/master/fonts/webfonts). Used for code, section indexes, technical labels, and numerical metadata.

All three families use the SIL Open Font License 1.1; the original license text for each is included in this directory. H1/H2 use EB Garamond at weight 700. The UN landing-page SVG banner embeds the same EB Garamond and JetBrains Mono webfonts because SVG images cannot inherit the page's fonts or load external font files; regenerate those embedded copies if the corresponding font files change.

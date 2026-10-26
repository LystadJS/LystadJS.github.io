# Compact academic layout

The navigation precedes the banner and stays at the top of the viewport during scrolling. Its 78% opaque background and backdrop blur keep underlying content visible while preserving readable links.

Reference: [Owlstown Argyle preview](https://www.owlstown.com/themes) and [sidebar contact layout](https://www.owlstown.com/pages/3154-contact-info-block). The implementation uses the structural ideas of a photographic banner and a profile beside the homepage content, without copying theme source or demo content.

The personal pages share `assets/css/academic-layout.css`, with ordinary navigation, 32px section padding and 24px heading separation. The current night-sky banner uses responsive enhanced WebP images with `assets/images/site-banner.jpg` as the fallback. Interior pages use a hand-aligned shorter crop; the homepage uses a full-screen introduction. See [banner and introduction behavior](banner-introduction.md) for dimensions, crop placement and motion accessibility.

The homepage profile and contact links are static HTML. Above 700px the profile sits to the left of the introduction and research content. On smaller screens it precedes that content. The profile name uses the existing 40px heading size to fit the sidebar, while the font families, weights and colors retain the existing framework. Research diagrams and their keyboard controls remain available.

The dark academic background, palette, surfaces, controls and diamond brand mark remain in place. Sidebar destination cards and the current-work command link are static HTML. `home-hero.js` handles a failed portrait load; `main.js` provides progressive reveal and navigation behavior. Institutional UN workspaces keep their own presentation. Print hides the photographic banner and contact navigation.

Regression coverage checks the banner, profile placement, image loading, static contact links, narrow-screen overflow and no-JavaScript behavior, alongside the existing typography, spacing, CV and interactive-figure checks.

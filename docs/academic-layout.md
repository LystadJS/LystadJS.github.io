# Compact academic layout

Reference: [Owlstown Argyle preview](https://www.owlstown.com/themes) and [sidebar contact layout](https://www.owlstown.com/pages/3154-contact-info-block). The implementation uses the structural ideas of a photographic banner and a profile beside the homepage content, without copying theme source or demo content.

The personal pages share `assets/css/academic-layout.css`: a 200px banner on desktop, 120px on mobile, ordinary navigation, 32px section padding and 24px heading separation. The current banner reuses the landscape portion of the existing Yosemite portrait; its image source is the `.site-banner img` in each personal page, with the crop controlled by `object-position` in the shared stylesheet. A replacement photograph can use the same banner markup and dimensions.

The homepage profile and contact links are static HTML. Above 700px the profile sits to the left of the introduction and research content. On smaller screens it precedes that content. The profile name uses the existing 40px heading size to fit the sidebar, while the font families, weights and colors retain the existing framework. Research diagrams and their keyboard controls remain available.

The redesign removes the animated cursor, injected destination cards, decorative portrait frame, diamond brand mark and noise overlay. `home-hero.js` now only handles a failed portrait load. Institutional UN workspaces keep their own presentation. Print hides the photographic banner and contact navigation.

Regression coverage checks the banner, profile placement, image loading, static contact links, narrow-screen overflow and no-JavaScript behavior, alongside the existing typography, spacing, CV and interactive-figure checks.

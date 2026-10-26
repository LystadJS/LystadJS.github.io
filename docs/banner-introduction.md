# Banner crop and homepage introduction

Interior personal pages use a shorter banner: `clamp(210px, 32vw, 460px)`, reduced from `clamp(240px, 40vw, 560px)`. The image is anchored at 82% of its height, the bottom of the hand in the current silhouette photograph. This removes the foreground below the hand and reveals more of the sky. The responsive enhanced images and original JPEG fallback are retained, without modifying the photograph.

Only `body[data-page="index"]` uses a full-screen banner (`100svh`, with `100vh` fallback). Its responsive image sizes account for viewport height as well as width, keeping the tall mobile crop sharp. Its navigation overlays the image and remains fixed during scrolling. The page H1 appears over the night sky; the sidebar's repeated name is an H2. The title retains the shared EB Garamond display scale.

The homepage profile, introduction, research sections and footer use the existing IntersectionObserver reveal enhancement. Sections fade into view as they enter the viewport. Content remains visible without JavaScript, unsupported observation APIs, or when reduced motion is requested. The down-arrow is an ordinary anchor to the page content and works without JavaScript.

`tests/academic-layout.spec.mjs` checks interior crop alignment, homepage viewport coverage, title placement, sticky navigation, responsive structure, no-JavaScript content and scroll reveal with both motion preferences. Existing font and layout regressions remain in place.

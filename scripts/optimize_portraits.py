"""Rebuild the responsive portrait derivatives from the retained original.

Authoring-only dependency: Pillow 12.3.0 (libwebp 1.6.0 in the release wheel).
The deployed website remains static and does not require Pillow.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]


def build() -> dict[str, dict[str, int]]:
    source = ROOT / "assets/images/headshot.jpeg"
    result = {}
    with Image.open(source) as original:
        portrait = ImageOps.exif_transpose(original).convert("RGB")
        for width in (480, 960):
            if width > portrait.width:
                raise ValueError("Do not enlarge the original portrait")
            height = round(width * portrait.height / portrait.width)
            resized = portrait.resize((width, height), Image.Resampling.LANCZOS)
            path = source.with_name(f"headshot-{width}.webp")
            resized.save(path, format="WEBP", quality=82, method=6)
            result[str(path.relative_to(ROOT))] = {
                "width": width, "height": height, "bytes": path.stat().st_size
            }
    return result


if __name__ == "__main__":
    import json
    print(json.dumps(build(), indent=2))

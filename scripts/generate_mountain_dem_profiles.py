#!/usr/bin/env python3
"""Generate reproducible DEM-derived mountain cross-sections for the About page.

Data source:
  Mapzen Terrain Tiles on the AWS Open Data Registry
  https://registry.opendata.aws/terrain-tiles/

Terrarium decoding:
  elevation_m = R * 256 + G + B / 256 - 32768

Method:
  1. Refine the published summit coordinate to the local DEM maximum.
  2. Use a curated characteristic-view azimuth for each mountain. These views
     are intentionally frozen so the recognizable silhouette is stable across
     regenerations rather than changing with an optimization heuristic.
  3. Sample 121 equally spaced DEM elevations across that line.
  4. Store the raw metric profile, characteristic azimuth, display emphasis,
     and provenance.

Summit elevation and the shared horizon remain quantitative guides. Horizontal
presentation may be emphasized per mountain so distinctive shoulders, saddles,
summit blocks, and volcanic or ridge geometry remain legible.
"""

from __future__ import annotations

import io
import json
import math
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import requests
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
JSON_OUT = ROOT / "assets" / "data" / "mountain_dem_profiles.json"
JS_OUT = ROOT / "assets" / "js" / "mountain-dem-profiles.js"

TERRARIUM_URL = (
    "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
)
ZOOM = 12
TILE_SIZE = 256
PROFILE_SAMPLES = 121
EARTH_RADIUS_KM = 6371.0088
REQUEST_TIMEOUT = 30

# Coordinates are WGS84 summit references from Peakbagger / USGS-GNIS-style
# sources. summit_search_m lets the DEM refine the exact raster-cell apex.
PEAKS = {
    "rainbow": {
        "name": "Rainbow Peak",
        "lat": 61.018901,
        "lon": -149.666134,
        "radius_km": 2.6,
        "characteristic_azimuth_deg": 105,
        "display_width_factor": 1.55,
        "characteristic_view": "Turnagain Arm-facing pyramidal profile",
        "summit_search_m": 300,
        "published_elevation_ft": 3543,
        "coordinate_source": "Peakbagger / USGS",
    },
    "alyeska": {
        "name": "Mount Alyeska",
        "lat": 60.959090,
        "lon": -149.055862,
        "radius_km": 1.5,
        "characteristic_azimuth_deg": 80,
        "display_width_factor": 2.40,
        "characteristic_view": "Broad Alyeska ridge and off-center high point",
        "summit_search_m": 300,
        "published_elevation_ft": 3940,
        "coordinate_source": "Peakbagger / USGS",
    },
    "gold-star": {
        "name": "Gold Star Peak",
        "lat": 61.444699,
        "lon": -149.208230,
        "radius_km": 0.65,
        "characteristic_azimuth_deg": 170,
        "display_width_factor": 2.60,
        "characteristic_view": "Sharp Gold Star summit crown",
        "summit_search_m": 220,
        "published_elevation_ft": 4148,
        "coordinate_source": "Peakbagger / USGS",
    },
    "healy": {
        "name": "Mount Healy",
        "lat": 63.780743,
        "lon": -149.013409,
        "radius_km": 4.5,
        "characteristic_azimuth_deg": 130,
        "display_width_factor": 1.55,
        "characteristic_view": "Long Mount Healy ridge profile",
        "summit_search_m": 450,
        "published_elevation_ft": 5661,
        "coordinate_source": "Peakbagger / USGS",
    },
    "east-twin": {
        "name": "East Twin Peak",
        "lat": 61.444800,
        "lon": -149.144300,
        "radius_km": 3.0,
        "characteristic_azimuth_deg": 175,
        "display_width_factor": 1.60,
        "characteristic_view": "Craggy East Twin summit block",
        "summit_search_m": 800,
        "published_elevation_ft": 5873,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "rendezvous": {
        "name": "Rendezvous Peak",
        "lat": 61.250556,
        "lon": -149.504444,
        "radius_km": 1.8,
        "characteristic_azimuth_deg": 80,
        "display_width_factor": 1.70,
        "characteristic_view": "Pyramidal Rendezvous profile",
        "summit_search_m": 450,
        "published_elevation_ft": 4078,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "gordon-lyon": {
        "name": "Mount Gordon Lyon",
        "lat": 61.261815,
        "lon": -149.506588,
        "radius_km": 3.0,
        "characteristic_azimuth_deg": 120,
        "display_width_factor": 1.60,
        "characteristic_view": "Broad rounded Gordon Lyon ridge",
        "summit_search_m": 450,
        "published_elevation_ft": 4129,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "lion-head": {
        "name": "Lion Head",
        "lat": 61.783611,
        "lon": -147.665278,
        "radius_km": 2.2,
        "characteristic_azimuth_deg": 90,
        "display_width_factor": 1.70,
        "characteristic_view": "Steep Lion Head cliff-and-cap profile",
        "summit_search_m": 400,
        "published_elevation_ft": 2881,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "fuji": {
        "name": "Mount Fuji",
        "lat": 35.360638,
        "lon": 138.727347,
        "radius_km": 15.0,
        "characteristic_azimuth_deg": 95,
        "display_width_factor": 1.18,
        "characteristic_view": "Iconic near-conical Fuji profile",
        "summit_search_m": 600,
        "published_elevation_ft": 12388,
        "coordinate_source": "Peakbagger / GSI",
    },
    "toubkal": {
        "name": "Mount Toubkal",
        "lat": 31.060297,
        "lon": -7.915258,
        "radius_km": 8.0,
        "characteristic_azimuth_deg": 170,
        "display_width_factor": 1.15,
        "characteristic_view": "Asymmetric High Atlas Toubkal profile",
        "summit_search_m": 600,
        "published_elevation_ft": 13671,
        "coordinate_source": "Peakbagger / Morocco Div Cart",
    },
    "denali": {
        "name": "Denali",
        "lat": 63.069042,
        "lon": -151.006347,
        "radius_km": 25.0,
        "characteristic_azimuth_deg": 160,
        "display_width_factor": 1.00,
        "characteristic_view": "Broad Denali massif profile",
        "summit_search_m": 900,
        "published_elevation_ft": 20310,
        "coordinate_source": "Peakbagger / USGS",
    },
}


def destination(lat: float, lon: float, bearing_deg: float, distance_km: float) -> Tuple[float, float]:
    bearing = math.radians(bearing_deg)
    phi1 = math.radians(lat)
    lam1 = math.radians(lon)
    angular = distance_km / EARTH_RADIUS_KM

    phi2 = math.asin(
        math.sin(phi1) * math.cos(angular)
        + math.cos(phi1) * math.sin(angular) * math.cos(bearing)
    )
    lam2 = lam1 + math.atan2(
        math.sin(bearing) * math.sin(angular) * math.cos(phi1),
        math.cos(angular) - math.sin(phi1) * math.sin(phi2),
    )
    return math.degrees(phi2), ((math.degrees(lam2) + 540.0) % 360.0) - 180.0


class TerrariumSampler:
    def __init__(self, zoom: int = ZOOM) -> None:
        self.zoom = zoom
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "LystadJS-mountain-profile-generator/1.0"})
        self.cache: Dict[Tuple[int, int], Image.Image] = {}

    def _fetch_tile(self, tile_x: int, tile_y: int) -> Image.Image:
        key = (tile_x, tile_y)
        if key in self.cache:
            return self.cache[key]

        url = TERRARIUM_URL.format(z=self.zoom, x=tile_x, y=tile_y)
        response = self.session.get(url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        if image.size != (TILE_SIZE, TILE_SIZE):
            raise RuntimeError(f"Unexpected terrain tile size {image.size} for {url}")
        self.cache[key] = image
        return image

    def _absolute_pixel(self, lat: float, lon: float) -> Tuple[float, float]:
        n = 2 ** self.zoom
        lat = max(min(lat, 85.05112878), -85.05112878)
        x_tile = (lon + 180.0) / 360.0 * n
        y_tile = (
            1.0
            - math.asinh(math.tan(math.radians(lat))) / math.pi
        ) / 2.0 * n
        return x_tile * TILE_SIZE, y_tile * TILE_SIZE

    def _pixel_elevation(self, abs_x: int, abs_y: int) -> float:
        tile_x, px = divmod(abs_x, TILE_SIZE)
        tile_y, py = divmod(abs_y, TILE_SIZE)
        image = self._fetch_tile(tile_x, tile_y)
        r, g, b = image.getpixel((px, py))
        return (r * 256.0 + g + b / 256.0) - 32768.0

    def elevation(self, lat: float, lon: float) -> float:
        """Bilinearly interpolate Terrarium elevations in Web Mercator pixel space."""
        gx, gy = self._absolute_pixel(lat, lon)
        x0 = math.floor(gx)
        y0 = math.floor(gy)
        fx = gx - x0
        fy = gy - y0

        z00 = self._pixel_elevation(x0, y0)
        z10 = self._pixel_elevation(x0 + 1, y0)
        z01 = self._pixel_elevation(x0, y0 + 1)
        z11 = self._pixel_elevation(x0 + 1, y0 + 1)

        top = z00 * (1.0 - fx) + z10 * fx
        bottom = z01 * (1.0 - fx) + z11 * fx
        return top * (1.0 - fy) + bottom * fy


def local_summit(
    sampler: TerrariumSampler,
    lat: float,
    lon: float,
    radius_m: float,
) -> Tuple[float, float, float]:
    """Refine the summit to the highest DEM sample in a 17x17 local grid."""
    best = (lat, lon, sampler.elevation(lat, lon))
    steps = 8
    for iy in range(-steps, steps + 1):
        for ix in range(-steps, steps + 1):
            north_m = (iy / steps) * radius_m
            east_m = (ix / steps) * radius_m
            test_lat = lat + north_m / 111_320.0
            test_lon = lon + east_m / (111_320.0 * math.cos(math.radians(lat)))
            elevation = sampler.elevation(test_lat, test_lon)
            if elevation > best[2]:
                best = (test_lat, test_lon, elevation)
    return best


def sample_profile(
    sampler: TerrariumSampler,
    lat: float,
    lon: float,
    radius_km: float,
    azimuth_deg: float,
) -> List[dict]:
    samples: List[dict] = []
    for index in range(PROFILE_SAMPLES):
        position = -1.0 + 2.0 * index / (PROFILE_SAMPLES - 1)
        distance_km = position * radius_km
        bearing = azimuth_deg if distance_km >= 0 else azimuth_deg + 180.0
        p_lat, p_lon = destination(lat, lon, bearing, abs(distance_km))
        samples.append(
            {
                "distance_km": round(distance_km, 5),
                "elevation_m": round(sampler.elevation(p_lat, p_lon), 2),
            }
        )
    return samples


def generate_profile(key: str, config: dict, sampler: TerrariumSampler) -> dict:
    summit_lat, summit_lon, summit_elevation = local_summit(
        sampler,
        config["lat"],
        config["lon"],
        config["summit_search_m"],
    )

    # Keep the characteristic viewing direction fixed. If the selected
    # cross-section reaches a higher neighboring ridge, only shrink the window;
    # never rotate to a less recognizable view or clip/invent terrain.
    azimuth = float(config["characteristic_azimuth_deg"])
    radius_km = config["radius_km"]
    minimum_radius = config["radius_km"] * 0.45
    for _ in range(6):
        samples = sample_profile(
            sampler,
            summit_lat,
            summit_lon,
            radius_km,
            azimuth,
        )
        center_index = PROFILE_SAMPLES // 2
        samples[center_index]["elevation_m"] = round(summit_elevation, 2)
        max_profile_elevation = max(item["elevation_m"] for item in samples)
        if max_profile_elevation <= summit_elevation + 1.0:
            break
        radius_km = max(minimum_radius, radius_km * 0.82)

    max_profile_elevation = max(item["elevation_m"] for item in samples)
    min_profile_elevation = min(item["elevation_m"] for item in samples)

    return {
        "key": key,
        "name": config["name"],
        "source_coordinate": {
            "lat": config["lat"],
            "lon": config["lon"],
            "source": config["coordinate_source"],
        },
        "dem_summit": {
            "lat": round(summit_lat, 7),
            "lon": round(summit_lon, 7),
            "elevation_m": round(summit_elevation, 2),
        },
        "published_elevation_ft": config["published_elevation_ft"],
        "radius_km": round(radius_km, 5),
        "requested_radius_km": config["radius_km"],
        "azimuth_deg": azimuth,
        "profile_mode": "curated_characteristic_view",
        "characteristic_view": config["characteristic_view"],
        "display_width_factor": config["display_width_factor"],
        "sample_count": PROFILE_SAMPLES,
        "min_elevation_m": round(min_profile_elevation, 2),
        "max_elevation_m": round(max_profile_elevation, 2),
        "center_is_profile_max": summit_elevation >= max_profile_elevation - 1.0,
        "samples": samples,
    }


def main() -> None:
    sampler = TerrariumSampler()
    profiles = {}
    for key, config in PEAKS.items():
        print(f"Generating {config['name']}...")
        profiles[key] = generate_profile(key, config, sampler)
        p = profiles[key]
        print(
            f"  azimuth={p['azimuth_deg']:.0f}° "
            f"DEM summit={p['dem_summit']['elevation_m']:.1f} m "
            f"range={p['min_elevation_m']:.1f}-{p['max_elevation_m']:.1f} m "
            f"width_factor={p['display_width_factor']:.2f} "
            f"center_max={p['center_is_profile_max']}"
        )

    payload = {
        "schema_version": 1,
        "dataset": {
            "name": "Mapzen Terrain Tiles",
            "registry": "AWS Open Data Registry",
            "format": "Terrarium PNG",
            "zoom": ZOOM,
            "nominal_resolution": "approximately 30 m source DEM; rendered from z12 tiles",
            "url_template": TERRARIUM_URL,
            "encoding": "R*256 + G + B/256 - 32768 metres",
        },
        "method": {
            "summit_refinement": "17x17 DEM grid around published WGS84 summit reference",
            "orientation_selection": (
                "Curated characteristic-view azimuth frozen per mountain; "
                "profile window may shrink to keep the named summit as apex"
            ),
            "profile_samples": PROFILE_SAMPLES,
            "presentation_note": (
                "Raw DEM elevations determine ridge geometry. Summit anchors and the "
                "shared horizon remain quantitative; per-mountain horizontal emphasis "
                "is presentation-only and preserves recognizable silhouette features."
            ),
        },
        "profiles": profiles,
    }

    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JS_OUT.parent.mkdir(parents=True, exist_ok=True)

    json_text = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    JSON_OUT.write_text(json_text, encoding="utf-8")
    JS_OUT.write_text(
        "/* Auto-generated by scripts/generate_mountain_dem_profiles.py. */\n"
        "window.MOUNTAIN_DEM_PROFILES = "
        + json.dumps(payload, separators=(",", ":"), sort_keys=True)
        + ";\n",
        encoding="utf-8",
    )

    print(f"Wrote {JSON_OUT.relative_to(ROOT)}")
    print(f"Wrote {JS_OUT.relative_to(ROOT)}")
    print(f"Terrain tiles fetched: {len(sampler.cache)}")


if __name__ == "__main__":
    main()

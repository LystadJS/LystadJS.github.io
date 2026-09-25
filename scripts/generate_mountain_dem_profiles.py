#!/usr/bin/env python3
"""Generate reproducible DEM-derived mountain cross-sections for the About page.

Data source:
  Mapzen Terrain Tiles on the AWS Open Data Registry
  https://registry.opendata.aws/terrain-tiles/

Terrarium decoding:
  elevation_m = R * 256 + G + B / 256 - 32768

Method:
  1. Refine the published summit coordinate to the local DEM maximum.
  2. Search 0-175 degrees in 5-degree increments for the cross-section that
     maximizes two-sided relief while penalizing lines that intersect terrain
     higher than the named summit.
  3. Sample 121 equally spaced DEM elevations across that line.
  4. Store the raw metric profile plus provenance and selected azimuth.

The website controls only presentation scaling. Ridge geometry comes directly
from these sampled DEM elevations rather than hand-authored SVG points.
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
AZIMUTH_STEP_DEG = 5
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
        "summit_search_m": 300,
        "published_elevation_ft": 3543,
        "coordinate_source": "Peakbagger / USGS",
    },
    "alyeska": {
        "name": "Mount Alyeska",
        "lat": 60.959090,
        "lon": -149.055862,
        "radius_km": 1.5,
        "summit_search_m": 300,
        "published_elevation_ft": 3940,
        "coordinate_source": "Peakbagger / USGS",
    },
    "gold-star": {
        "name": "Gold Star Peak",
        "lat": 61.444699,
        "lon": -149.208230,
        "radius_km": 0.65,
        "summit_search_m": 220,
        "published_elevation_ft": 4148,
        "coordinate_source": "Peakbagger / USGS",
    },
    "healy": {
        "name": "Mount Healy",
        "lat": 63.780743,
        "lon": -149.013409,
        "radius_km": 4.5,
        "summit_search_m": 450,
        "published_elevation_ft": 5661,
        "coordinate_source": "Peakbagger / USGS",
    },
    "east-twin": {
        "name": "East Twin Peak",
        "lat": 61.444800,
        "lon": -149.144300,
        "radius_km": 3.0,
        "summit_search_m": 800,
        "published_elevation_ft": 5873,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "rendezvous": {
        "name": "Rendezvous Peak",
        "lat": 61.250556,
        "lon": -149.504444,
        "radius_km": 1.8,
        "summit_search_m": 450,
        "published_elevation_ft": 4078,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "gordon-lyon": {
        "name": "Mount Gordon Lyon",
        "lat": 61.261815,
        "lon": -149.506588,
        "radius_km": 3.0,
        "summit_search_m": 450,
        "published_elevation_ft": 4129,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "lion-head": {
        "name": "Lion Head",
        "lat": 61.783611,
        "lon": -147.665278,
        "radius_km": 2.2,
        "summit_search_m": 400,
        "published_elevation_ft": 2881,
        "coordinate_source": "USGS-GNIS-style summit reference",
    },
    "fuji": {
        "name": "Mount Fuji",
        "lat": 35.360638,
        "lon": 138.727347,
        "radius_km": 15.0,
        "summit_search_m": 600,
        "published_elevation_ft": 12388,
        "coordinate_source": "Peakbagger / GSI",
    },
    "toubkal": {
        "name": "Mount Toubkal",
        "lat": 31.060297,
        "lon": -7.915258,
        "radius_km": 8.0,
        "summit_search_m": 600,
        "published_elevation_ft": 13671,
        "coordinate_source": "Peakbagger / Morocco Div Cart",
    },
    "denali": {
        "name": "Denali",
        "lat": 63.069042,
        "lon": -151.006347,
        "radius_km": 25.0,
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
    """Refine the summit to the highest DEM sample in a 9x9 local grid."""
    best = (lat, lon, sampler.elevation(lat, lon))
    steps = 4
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


def orientation_score(
    sampler: TerrariumSampler,
    lat: float,
    lon: float,
    summit_elevation: float,
    radius_km: float,
    azimuth_deg: float,
) -> float:
    """Favor two-sided relief while strongly rejecting higher adjacent terrain."""
    fractions = tuple(i / 20.0 for i in range(1, 21))
    side_scores = []
    higher_penalty = 0.0

    for bearing in (azimuth_deg, azimuth_deg + 180.0):
        drops = []
        for fraction in fractions:
            p_lat, p_lon = destination(lat, lon, bearing, radius_km * fraction)
            elevation = sampler.elevation(p_lat, p_lon)
            drop = summit_elevation - elevation
            drops.append(drop)
            if drop < -5.0:
                # A line crossing a higher neighbor is not a valid silhouette
                # for the named summit, so penalize it aggressively.
                higher_penalty += 10000.0 + abs(drop) * 250.0

        # Weight outer relief more strongly while still checking the near summit.
        side_scores.append(
            0.25 * sum(drops[:7]) / 7.0
            + 0.30 * sum(drops[7:14]) / 7.0
            + 0.45 * sum(drops[14:]) / 6.0
        )

    return min(side_scores) + 0.55 * sum(side_scores) - higher_penalty


def choose_azimuth(
    sampler: TerrariumSampler,
    lat: float,
    lon: float,
    summit_elevation: float,
    radius_km: float,
) -> float:
    candidates = range(0, 180, AZIMUTH_STEP_DEG)
    return float(
        max(
            candidates,
            key=lambda az: orientation_score(
                sampler, lat, lon, summit_elevation, radius_km, float(az)
            ),
        )
    )


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

    # Keep the named summit as the apex of its own profile. If a proposed
    # cross-section reaches a higher neighboring ridge, shrink the local window
    # and recompute rather than clipping or inventing elevations.
    radius_km = config["radius_km"]
    minimum_radius = config["radius_km"] * 0.45
    for _ in range(6):
        azimuth = choose_azimuth(
            sampler,
            summit_lat,
            summit_lon,
            summit_elevation,
            radius_km,
        )
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
        if max_profile_elevation <= summit_elevation + 5.0:
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
        "sample_count": PROFILE_SAMPLES,
        "min_elevation_m": round(min_profile_elevation, 2),
        "max_elevation_m": round(max_profile_elevation, 2),
        "center_is_profile_max": summit_elevation >= max_profile_elevation - 5.0,
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
            "summit_refinement": "9x9 DEM grid around published WGS84 summit reference",
            "orientation_selection": (
                "5-degree search maximizing two-sided relief with a penalty for "
                "crossing terrain higher than the named summit"
            ),
            "profile_samples": PROFILE_SAMPLES,
            "presentation_note": (
                "Raw DEM elevations determine ridge geometry. The website rescales "
                "profiles to a shared visual horizon while preserving summit anchors."
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

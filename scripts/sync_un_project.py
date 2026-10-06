"""Sync an explicitly selected public Transcript Agent build, preserving other files."""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import tempfile

SOURCE_REPOSITORY = "https://github.com/LystadJS/UNGA81-Transcript-Agent"


def checked_path(root: Path, relative: str) -> Path:
    """Reject traversal and symlinks before making any changes to the mirror."""
    rel = PurePosixPath(relative)
    if not relative or rel.is_absolute() or ".." in rel.parts or "\\" in relative:
        raise ValueError(f"Unsafe public-build path: {relative!r}")
    candidate = root.joinpath(*rel.parts)
    for part in (candidate, *candidate.parents):
        if part == root.parent:
            break
        if part.is_symlink():
            raise ValueError(f"Symlink in public-build path: {relative!r}")
    candidate.resolve().relative_to(root.resolve())
    return candidate


def digest(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def sync(source: str | Path, *, site: Path | None = None) -> dict[str, object]:
    source = Path(source).resolve()
    site = (site or Path(__file__).resolve().parents[1]).resolve()
    builder = source / "tools" / "build_pages.py"
    if not builder.is_file():
        raise FileNotFoundError(f"Public Pages builder not found: {builder}")
    spec = importlib.util.spec_from_file_location("un_pages", builder)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load public Pages builder: {builder}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    target = site / "un" / "transcript-agent"
    if (site / "un").is_symlink() or target.is_symlink():
        raise ValueError("The public mirror must not be a symlink")
    target.resolve().relative_to(site)
    manifest_path = checked_path(target, "mirror-manifest.json")
    previous = json.loads(manifest_path.read_text(encoding="utf-8"))["files"] if manifest_path.exists() else {}
    if not isinstance(previous, dict):
        raise ValueError("Mirror manifest must contain a files object")
    # Validate the complete existing inventory before removing or copying a file.
    for relative in previous:
        checked_path(target, relative)

    copied = unchanged = removed = 0
    with tempfile.TemporaryDirectory() as directory:
        built = Path(directory) / "site"
        module.build(built)
        files = {}
        for path in sorted(built.rglob("*")):
            relative = path.relative_to(built).as_posix()
            checked_path(built, relative)
            checked_path(target, relative)
            if path.is_file():
                files[relative] = digest(path)
        if "index.html" not in files:
            raise ValueError("The public build must contain index.html")
        if "mirror-manifest.json" in files:
            raise ValueError("The public build cannot overwrite its mirror manifest")
        target.mkdir(parents=True, exist_ok=True)
        for relative, checksum in files.items():
            destination = checked_path(target, relative)
            if destination.is_file() and digest(destination) == checksum:
                unchanged += 1
                continue
            destination.parent.mkdir(parents=True, exist_ok=True)
            # Replace complete files atomically; never publish a half-written file.
            with tempfile.NamedTemporaryFile(dir=destination.parent, delete=False) as tmp:
                staging = Path(tmp.name)
            try:
                shutil.copy2(built / relative, staging)
                os.replace(staging, destination)
            finally:
                staging.unlink(missing_ok=True)
            copied += 1
        for relative in previous.keys() - files.keys():
            destination = checked_path(target, relative)
            if destination.is_file():
                destination.unlink()
                removed += 1

    manifest = json.dumps({"source_repository": SOURCE_REPOSITORY, "files": files}, indent=2) + "\n"
    if not manifest_path.exists() or manifest_path.read_text(encoding="utf-8") != manifest:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=target, delete=False) as tmp:
            staging = Path(tmp.name)
            tmp.write(manifest)
        try:
            os.replace(staging, manifest_path)
        finally:
            staging.unlink(missing_ok=True)
    return {"destination": "un/transcript-agent", "public_files": len(files),
            "copied": copied, "unchanged": unchanged, "removed": removed}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_checkout", type=Path)
    arguments = parser.parse_args()
    try:
        print(json.dumps(sync(arguments.source_checkout)))
    except (OSError, ValueError, ImportError, KeyError) as error:
        parser.exit(1, f"Public mirror sync failed: {error}\n")

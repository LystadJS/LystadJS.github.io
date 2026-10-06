"""Dependency-free checks of first-party page destinations and static resources."""
from __future__ import annotations
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]

class Document(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = []
        self.links = []
        self.feed(text)
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        identifier = attrs.get("id")
        if identifier:
            if identifier in self.ids:
                self.duplicates.append(identifier)
            self.ids.add(identifier)
        for key in ("src", "href"):
            if attrs.get(key):
                self.links.append((tag, key, attrs[key]))
        for candidate in attrs.get("srcset", "").split(","):
            if candidate.strip():
                self.links.append((tag, "srcset", candidate.strip().split()[0]))


def run() -> dict:
    pages = sorted(ROOT.glob("*.html")) + sorted((ROOT / "notes").glob("*.html"))
    parsed = {path: Document(path.read_text(encoding="utf-8")) for path in pages}
    errors = []
    checked = 0
    for path, document in parsed.items():
        errors.extend(f"{path.name}: duplicate id {identifier}" for identifier in document.duplicates)
        for tag, attribute, raw in document.links:
            url = urlsplit(raw)
            if url.scheme or url.netloc:
                continue
            destination = (ROOT / unquote(url.path).lstrip("/") if url.path.startswith("/") else path.parent / unquote(url.path)).resolve() if url.path else path
            if destination.is_dir():
                destination /= "index.html"
            if not destination.exists():
                errors.append(f"{path.relative_to(ROOT)}: missing {attribute}={raw}")
                continue
            checked += 1
            if attribute == "href" and url.fragment and destination in parsed and unquote(url.fragment) not in parsed[destination].ids:
                errors.append(f"{path.relative_to(ROOT)}: missing anchor {raw}")
    script_count = 0
    for path in sorted((ROOT / "assets/js").glob("*.js")):
        completed = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
        script_count += 1
        if completed.returncode:
            errors.append(completed.stderr.strip())
    for path in (ROOT / "assets/css").glob("*.css"):
        for match in re.finditer(r'@import\s+(?:url\()?[^;]*;', path.read_text()):
            errors.append(f"{path.name}: avoid render-blocking stylesheet import {match[0]}")
    result = {"pages": len(pages), "local_references_checked": checked, "javascript_files_parsed": script_count, "errors": errors}
    if errors:
        print(json.dumps(result, indent=2))
        raise SystemExit(1)
    return result

if __name__ == "__main__":
    print(json.dumps(run(), indent=2))

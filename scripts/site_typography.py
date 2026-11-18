"""Apply the website's presentation layer to generated public mirror assets."""
from pathlib import Path
import hashlib
import posixpath
import re

SERIF = '"EB Garamond", Georgia, serif'
SANS = '"Atkinson Hyperlegible Next", system-ui, sans-serif'
MONO = '"JetBrains Mono", ui-monospace, monospace'


def family(value: str) -> str:
    """Keep each declaration's serif/sans/technical role, including fallbacks."""
    if 'var(' in value or value.strip() in ('inherit', 'initial', 'unset'):
        return value
    if re.search(r'mono|Consolas|Menlo', value, re.I):
        return MONO
    if re.search(r'Georgia|Times|Garamond|Fraunces', value, re.I):
        return SERIF
    return SANS


def style_text(text: str) -> str:
    # Replace font declarations only; never change copy, code, or data strings.
    text = re.sub(r'(font-family\s*:\s*)([^;}<>\n]+)',
                  lambda m: m[1] + family(m[2]), text)
    text = re.sub(r'(font\s*:[^;{}<>\n]*?\s)(Georgia(?:,[^;{}<>\n]*)?|Arial(?:,[^;{}<>\n]*)?|system-ui(?:,[^;{}<>\n]*)?|ui-monospace(?:,[^;{}<>\n]*)?)(?=[;}])',
                  lambda m: m[1] + family(m[2]), text)
    return text


def apply_typography(root: Path, *, prefix: str = 'un/transcript-agent') -> None:
    """Transform only HTML/CSS presentation, before manifest hashes are computed."""
    for path in root.rglob('*'):
        if path.suffix not in ('.html', '.css'):
            continue
        original = path.read_bytes().decode('utf-8')
        text = (re.sub(r'(<style\b[^>]*>)(.*?)(</style>)',
                       lambda m: m[1] + style_text(m[2]) + m[3], original, flags=re.S)
                if path.suffix == '.html' else style_text(original))
        if path.suffix == '.html':
            # A cached pre-migration CSS file may still contain literal old faces.
            text = re.sub(r'(href=["\'])(?!https?:|//)([^"\']+\.css)(?:\?[^"\']*)?(["\'])',
                          r'\1\2?v=20261108-atkinson-next\3', text)
            parent = posixpath.dirname(prefix + '/' + path.relative_to(root).as_posix())
            href = posixpath.relpath('assets/css/typography.css', parent)
            scale_href = posixpath.relpath('assets/css/type-scale.css', parent)
            spacing_href = posixpath.relpath('assets/css/spacing.css', parent)
            link = (f'<link rel="stylesheet" href="{href}?v=20261108-atkinson-next">'
                    f'<link rel="stylesheet" href="{scale_href}?v=20261024-1">'
                    f'<link rel="stylesheet" href="{spacing_href}?v=20261024-1">')
            if '</head>' in text:
                text = text.replace('</head>', link + '</head>', 1)
            else:
                # Some upstream reports use HTML's permitted implicit head.
                text = re.sub(r'(?=<(?:body|header|main)\b)', lambda _: link,
                              text, count=1)
        if text != original:
            path.write_bytes(text.encode('utf-8'))

    # Fingerprint transformed local styles, not only the shared typography release.
    # A source style change must invalidate CSS even when the font theme is stable.
    for path in root.rglob('*.html'):
        def stylesheet(match):
            target = (path.parent / match[2]).resolve()
            if not target.is_relative_to(root.resolve()) or not target.is_file():
                return match[0]
            version = hashlib.sha256(target.read_bytes()).hexdigest()[:16]
            return f'{match[1]}{match[2]}?v=20261108-atkinson-next&amp;asset={version}{match[3]}'
        original = path.read_text(encoding='utf-8')
        updated = re.sub(r'(href=["\'])(?!https?:|//)([^"\']+\.css)(?:\?[^"\']*)?(["\'])', stylesheet, original)
        if updated != original:
            path.write_text(updated, encoding='utf-8')

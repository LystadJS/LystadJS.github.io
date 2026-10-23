"""Apply the website's presentation layer to generated public mirror assets."""
from pathlib import Path
import posixpath
import re

SERIF = '"EB Garamond", Georgia, serif'
SANS = '"Atkinson Hyperlegible", system-ui, sans-serif'
MONO = '"JetBrains Mono", ui-monospace, monospace'


def family(value: str) -> str:
    """Keep each declaration's serif/sans/technical role, including fallbacks."""
    if 'var(' in value or value.strip() in ('inherit', 'initial', 'unset'):
        return value
    if re.search(r'mono|Consolas|Menlo', value, re.I):
        return MONO
    if re.search(r'Georgia|Times|Garamond|EB Garamond', value, re.I):
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
                          r'\1\2?v=20261020-1\3', text)
            parent = posixpath.dirname(prefix + '/' + path.relative_to(root).as_posix())
            href = posixpath.relpath('assets/css/typography.css', parent)
            link = f'<link rel="stylesheet" href="{href}?v=1">'
            if '</head>' in text:
                text = text.replace('</head>', link + '</head>', 1)
            else:
                # Some upstream reports use HTML's permitted implicit head.
                text = re.sub(r'(?=<(?:body|header|main)\b)', lambda _: link,
                              text, count=1)
        if text != original:
            path.write_bytes(text.encode('utf-8'))

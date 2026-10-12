"""Render the public Markdown policy as the extension's standalone HTML page."""
from pathlib import Path
from html import escape
import re

repo = Path(__file__).resolve().parents[1]

def inline(text):
    return re.sub(r'\[([^\]]+)\]\((https://[^\s)]+)\)', lambda m: f'<a href="{m[2]}" target="_blank" rel="noopener">{m[1]}</a>', escape(text))

blocks = []
for paragraph in (repo / 'PRIVACY.md').read_text(encoding='utf-8').strip().split('\n\n'):
    if paragraph.startswith('# '):
        blocks.append('<h1>' + inline(paragraph[2:]) + '</h1>')
    elif paragraph.startswith('## '):
        blocks.append('<h2>' + inline(paragraph[3:]) + '</h2>')
    elif paragraph.startswith('- '):
        blocks.append('<ul>' + ''.join('<li>' + inline(line[2:]) + '</li>' for line in paragraph.splitlines()) + '</ul>')
    else:
        blocks.append('<p>' + inline(paragraph) + '</p>')
html = '''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>3D Parallax — Privacy policy</title><style>
html { color-scheme:dark; } body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; background:#17191e; color:#d6dae2; max-width:780px; margin:auto; padding:48px 24px 80px; line-height:1.7; }
h1 { color:#ecf2ed; font-size:30px; letter-spacing:-.6px; line-height:1.2; } h2 { color:#c6dfcf; font-size:19px; margin-top:32px; }
p,li { font-size:15px; } li { margin-bottom:12px; } a { color:#c6dfcf; } a:focus-visible { outline:2px solid #c6dfcf; outline-offset:4px; }
</style></head><body><main>''' + '\n'.join(blocks) + '</main></body></html>\n'
(repo / 'custom extension' / 'privacy.html').write_text(html, encoding='utf-8')
print('Rendered privacy.html from PRIVACY.md.')

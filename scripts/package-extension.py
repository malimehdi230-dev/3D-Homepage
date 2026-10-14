"""Build a Chrome upload ZIP containing only bundled runtime files and licenses."""
from pathlib import Path
import argparse
import json
import re
import zipfile

repo = Path(__file__).resolve().parents[1]
root = repo / 'custom extension'
manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=repo / 'dist' / f"3D-Parallax-{manifest['version']}.zip")
archive = parser.parse_args().output.resolve()
files = [root / name for name in [
    'manifest.json','index.html','popup.html','popup.css','privacy.html','styles.css','ui.css','extension-links.js',
    'preferences.js','ui.js','script.js','templates.js','widgets.js','weather.js',
    'wallpaper.js','backgrounds.js','ai-providers.js','ambient.js','setup.js','makeover.js','sharing.js',
    'interactions.js','feedback.js','popup.js','models.json',
]]
files += list((root / 'icons').rglob('*.png'))
files += [p for p in (root / 'vendor').rglob('*') if p.is_file()]
assert len(manifest['description']) <= 132
assert manifest['manifest_version'] == 3
assert manifest['permissions'] == ['storage','unlimitedStorage']
assert not manifest.get('optional_permissions')
assert not manifest['host_permissions']
for name in ['index.html','popup.html']:
    html = (root / name).read_text(encoding='utf-8')
    assert not re.search(r'<script(?:\s*)>',html), f'Inline script in {name}'
    assert not re.search(r'\son\w+\s*=',html), f'Inline event handler in {name}'
    for src in re.findall(r'<(?:script|link)[^>]+(?:src|href)="([^"]+)"',html):
        assert not src.startswith(('http:','https:')), f'Remote runtime asset in {name}'
        assert (root / src).is_file(), f'Missing asset: {src}'
for file in files:
    assert file.is_file(), file
for icon in manifest['icons'].values():
    assert (root / icon).is_file()
archive.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for file in files:
        z.write(file,file.relative_to(root).as_posix())
    z.write(repo / 'LICENSE','LICENSE')
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert json.loads(z.read('manifest.json'))['version'] == manifest['version']
print(f"Verified {len(files)+1} bundled files; {archive}; {archive.stat().st_size:,} bytes.")

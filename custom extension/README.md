# 3D Parallax — Chrome extension

A personal new tab with resizable widgets, quick links, 18 themes, uploaded image or video wallpapers, notes, tasks, countdowns, ambient sound, optional local weather and AI tools. Version 2.3.0 uses native system fonts and clear settings.

## Install locally

Open chrome://extensions, turn on Developer mode, choose Load unpacked and select this folder. If already loaded, choose Reload and open a new tab.

Settings has General, Background, Layout, AI features and Backup & help sections. Customize has Elements, Effects and Sizes. The grid button arranges widgets: drag titles to move, drag corners to resize the content, or use widget settings to fine-tune scale and dimensions. Tidy up removes empty rows; Undo restores your last layout change.

Your theme and saved preferences stay on this device. Weather uses a city you choose and needs no device location permission. AI features require your own compatible provider key and may incur provider charges. Neither is needed for ordinary homepage features. Backups exclude API keys unless explicitly selected.

## Develop and package

Run these commands from the repository root:

```
npm install
npx playwright install chromium
npm test
python scripts/package-extension.py
npm run store-assets
```

Set BROWSER_PATH to use an existing Chromium. Tests use isolated profiles and mocked weather/feedback responses; they do not send feedback emails. Runtime JavaScript, styles and icon fonts are bundled locally for Manifest V3.

Read [release notes](RELEASE.md), [store submission kit](../store-kit/README.md), and [privacy policy](privacy.html). Support: [GitHub issues](https://github.com/malimehdi230-dev/3D-Homepage/issues). Licensed under the repository's MIT license; bundled Font Awesome assets include their license in vendor.

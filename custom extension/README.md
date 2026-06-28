<div align="center">

# 🌐 3D Parallax — Chrome Extension

**A stunning, fully customisable new-tab page with 3D animations, AI-powered features, and a deep personalisation system.**

[![Manifest Version](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.1-purple?style=flat-square)](manifest.json)
[![Made With Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red?style=flat-square)]()

*Developed by **Muhammad Ali Mehdi***

</div>

---

## 📸 Preview

> Replace the placeholder cells below with your own screenshots once captured.

| Default (Programmer) | Gamer Theme | Custom Wallpaper |
|:---:|:---:|:---:|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## ✨ What Is This?

**3D Parallax** replaces your browser's new-tab page with a dynamic, neon-cyberpunk-styled homepage. Everything runs locally — no accounts, no subscriptions, no tracking.

### Feature highlights at a glance

| Feature | Description |
|---------|-------------|
| 🎨 **17 themes** | Each has a unique colour palette, 3D animated scene, and floating elements |
| 🖼️ **Custom wallpaper** | Image or video background with blur, dim, blend mode, and parallax depth |
| 🤖 **Ask AI** | Streaming Groq chat assistant with web-search mode |
| 🔑 **AI key manager** | Store multiple keys with automatic failover when one is rate-limited |
| 🌀 **Element packs** | 3D depth-layered floating icons — Gaming, Anime, Space, Cars, and more |
| ✏️ **AI elements** | Describe any icon and Groq generates an inline SVG for it |
| 💬 **Headline editor** | Edit and AI-generate the typewriter phrases above the search bar |
| 🌤️ **Live weather** | Temperature + icon from Open-Meteo (free, no key required) |
| 📦 **Import / Export** | Back up all settings (and optionally the wallpaper) to a single JSON file |

Works as a **Chrome / Edge / Brave extension** *and* as a plain **hosted web page** — no build step, no dependencies to install.

---

## 🚀 Installation

### Option A — Chrome Extension (recommended)

1. **Download or clone** this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/3d-homepage.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the project folder
5. Open a **new tab** — the homepage appears immediately

> **Tip:** Pin the extension icon to your toolbar. Clicking it opens a quick-stats popup showing your current theme, link count, and shortcuts to open or reset the homepage.

### Option B — Hosted Web Page

No extension needed. Open `index.html` directly:

```bash
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Or serve it locally for full feature support (geolocation requires a real origin):

```bash
npx serve .
# then visit http://localhost:3000
```

> **Note:** The weather feature requires a served `http://` or `https://` origin. It will not work when opened as a `file://` URL.

---

## 🎨 Themes

Click the **Templates** button (top-right) to open the theme picker.

| # | Theme | Primary vibe |
|---|-------|-------------|
| 1 | **Programmer** | Green matrix rain, spinning code cubes, bracket floaters |
| 2 | **Gamer** | Red/cyan, 3D game controller, HP/XP bars |
| 3 | **Anime** | Pink/purple, sakura petals, energy orb |
| 4 | **Creator** | Orange/pink, 3D paint palette and brush |
| 5 | **AI Developer** | Teal, animated neural-network nodes |
| 6 | **Cyberpunk** | Magenta/yellow, holographic display |
| 7 | **Minimal** | Muted greys, sparse geometric shapes |
| 8 | **Retro** | Red/green, pixel-art arcade cabinet |
| 9 | **Space** | Blue/orange, rocket, ringed planet |
| 10 | **Music** | Red/blue, vinyl record, equaliser bars |
| 11 | **Crypto** | Bitcoin orange, spinning coin stacks |
| 12 | **Cyber Expert** | Green terminal, hacker aesthetic |
| 13 | **Nature** | Jade/lotus, bamboo sway animation |
| 14 | **Synthwave** | Purple/pink, retro sun, scrolling grid floor |
| 15 | **Sci-Fi** | Cyan, holographic rotating rings |
| 16 | **Liquid Glass** | Translucent morphing panels |
| 17 | **Diamond Cut** | Prismatic crystal facets |
| 18 | **Holographic** | Iridescent iridescent rings |

Switching a theme changes colours, 3D scene, floating code elements, and the typewriter phrases — instantly and without reloading.

---

## ⚙️ Settings Panel

Click the **⚙** icon (top-left corner of the page) to open the Settings panel. It scrolls through these sections:

---

### 👤 Your Name

Your display name appears as the large glowing title on the homepage and inside the weather greeting line.

---

### 🔑 AI Providers

All AI features (Ask AI, AI element generation, AI headline generation) are powered by **Groq** — which has a generous free tier.

#### Getting a free Groq API key

1. Go to [console.groq.com](https://console.groq.com) and sign up (free)
2. Navigate to **API Keys → Create API Key**
3. Copy the key — it starts with `gsk_…`

#### Adding your first key

1. Open **Settings → AI Providers**
2. Click **Add Key**
3. Fill in the form:

   | Field | What to enter |
   |-------|--------------|
   | **Name** | Anything you like, e.g. `Groq #1` |
   | **API Key** | Your `gsk_…` key |
   | **Model** | Leave blank for the default, or type a model ID (auto-suggests once a working key exists) |
   | **Priority** | `0` = highest priority; increase to make a key a fallback |
   | **Base URL** | Leave as-is for Groq; change only for other OpenAI-compatible endpoints |

4. Click **Save Provider**

#### Using multiple keys (failover)

Add as many keys as you like. When the active key is rate-limited or fails, the next enabled key in priority order is tried automatically — no user action needed.

| Button | Action |
|--------|--------|
| **Vial icon** | Test the key — badge turns green (working) or red (failing) |
| **Enable toggle** | Temporarily pause a key without deleting it |
| **Eye icon** | Reveal or hide the full key value |
| **Trash icon** | Permanently delete the provider |

#### Import Script shortcut

Instead of typing the model name manually:

1. Generate a code snippet in the Groq playground
2. Click **Import Script** and paste the snippet
3. Click **Parse & Fill Form** — the model (and key, if present) are extracted automatically

If the snippet only contains a placeholder (`process.env.GROQ_API_KEY`), the form shows a note asking you to paste the real key.

---

### 🖼️ Wallpaper

Set a custom background image or video that sits behind all animations.

#### How to set a wallpaper

- **Drag & drop** any file onto the page (a dashed border appears to confirm the drop zone)
- Or click **Choose File** inside the Wallpaper section of Settings

Supported formats: JPEG · PNG · WebP · GIF · animated GIF · **MP4** · **WebM**

Videos loop silently and autoplay. A thumbnail preview appears in the settings panel once a wallpaper is active.

#### Wallpaper controls

| Control | Effect |
|---------|--------|
| **Blur** (0 – 20 px) | Softens the image; useful for busy photos |
| **Dim** (0 – 90 %) | Darkens the wallpaper so text stays readable |
| **Blend Mode** | CSS mix-blend-mode applied to the image layer (`Normal`, `Multiply`, `Screen`, `Overlay`, `Soft Light`, etc.) |
| **Parallax depth** | The wallpaper shifts slightly opposite to your mouse movement, sitting at a different visual depth than the floating elements |
| **Subtle accents over photo** | When ON, a faint particle layer and aurora glow are drawn over a static image |

#### Automatic element visibility rules

The extension manages which decorative layers show based on what background is active:

| Active background | Decorative layers |
|-------------------|------------------|
| Prebuilt template (no wallpaper) | All template elements visible — nothing changes |
| **Video** wallpaper | All decorative layers hidden; clean video + functional UI |
| **Static image** wallpaper | Heavy animations hidden; clean photo |
| Static + Subtle accents ON | Faint aurora and particles over the photo |
| Wallpaper removed | Everything restores instantly |

#### Extract Colors → Apply to Theme

After setting an image, click this button to sample dominant colours from the photo and apply them to `--primary`, `--secondary`, and `--accent` — re-theming the entire UI to match your wallpaper.

---

### 🌀 Background Elements

Depth-layered floating 3D icons that tumble slowly through the background. They are rendered with real CSS 3D perspective — near elements are large and bright, far elements are small and slightly blurred. Mouse movement creates parallax separation between layers.

#### Switching packs

Click any card in the pack grid. The swap is live and your choice is saved.

| Pack | What floats |
|------|------------|
| **< Coding />** | `{ }` `[ ]` `</>` `=>` JS/Python icons, terminal symbols |
| **🎮 Gaming** | Gamepad, trophy, sword ⚔, crosshairs, skull, XP/HP text |
| **🚀 Space** | Rocket, satellite, moon, meteor, stars ✦ ✧ ⊕ |
| **✨ Anime** | Hearts ♥, sakura 🌸, kanji 力心気, wind gusts |
| **🌿 Nature** | Leaf, snowflake ❄, sun ☀, cloud, wave 🌊 |
| **🎬 Cinema** | Film reel, camera, video camera, star, ticket |
| **🏎 Cars** | Car, tachometer, road, fuel pump, ⚡, 🏁 |
| **· Minimal** | Tiny faint dots — barely there |

#### AI Create — generate your own SVG elements

1. Click **AI Create** in the section header
2. Enter a **Pack Name** (e.g. `Neon Weapons`)
3. Describe one element (e.g. `"neon katana"`, `"glowing rune"`, `"low-poly skull"`)
4. Click **Generate**

Groq generates a clean inline SVG icon. It is sanitised (no scripts, no external URLs) and added to your named custom pack, which automatically activates. Click Generate again to add more elements to the same pack.

Custom packs appear in the grid alongside built-in ones and can be deleted with the × button on the card.

---

### 💬 Headline Lines

The animated typewriter text that cycles above the search bar (e.g. *"Full Stack Developer"*, *"Pro Gamer"*). By default it uses the active template's built-in phrases. You can replace them entirely.

#### Editing lines

1. Type a new line in the input field and press **＋** or Enter
2. Use **▲ ▼** arrows to reorder
3. Click **✕** to remove a line

Changes appear on the homepage immediately.

#### Typewriter settings

| Control | Effect |
|---------|--------|
| **Typewriter** toggle | ON = animated character-by-character effect; OFF = first line shown statically |
| **Speed** slider | Milliseconds per character. 20 ms is very fast; 200 ms is slow and dramatic |

#### AI Generate

1. Click **AI Generate**
2. Optionally enter a genre hint (e.g. `space explorer`, `anime hero`, `cyber hacker`)
3. Click **Generate** — Groq returns 7 short, punchy phrases
4. Click any chip to add that phrase to your list

---

### 📦 Import / Export

Back up everything to a single JSON file, or restore it on another machine.

#### Export

Click **Export** to download `3d-homepage-settings.json`. It contains your name, theme, links, wallpaper settings, headline lines, element pack choice, and all AI provider configurations.

Tick **Include wallpaper blob in export** first if you also want the actual image/video bundled into the file (base64-encoded — makes the file larger).

#### Import

Click **Import**, select a previously exported `.json` file, and the page reloads with all settings restored. If the file includes a wallpaper blob, it is written to IndexedDB and the wallpaper reappears.

> ⚠️ Importing overwrites your current settings. Export first if you want a backup of what you have now.

---

## ⚡ Quick Access Links

The card grid below the search bar. Click **+ Add Link** to add a shortcut.

| Field | Notes |
|-------|-------|
| **Link Name** | Label shown on the card |
| **URL** | Full address including `https://` |
| **Icon** | Choose from a FontAwesome icon set |
| **Color** | Accent colour for the icon and card glow |

To **remove** a link, hover the card and click the × that appears in the corner.

---

## 🔍 Search

Type in the search bar and press **Enter** (or click →) to search Google.

**Shortcut:** Press `/` anywhere on the page to immediately focus the search bar.

---

## 🤖 Ask AI

Click the **Ask AI** button (below the search bar) to open the chat panel.

### Features

- **Streaming responses** — text appears word-by-word as it is generated
- **Conversation memory** — the assistant remembers the last 8 messages in the session
- **Markdown rendering** — bold, italic, code blocks, tables, and headers all display correctly
- **Web Search toggle** — when enabled, the assistant searches DuckDuckGo and Wikipedia before answering, grounding its response in current facts
- **Clear history** — the trash icon starts a fresh conversation

### Changing the AI model

The model shown in the chat header reflects your highest-priority active provider. To use a different model, edit the provider entry in **Settings → AI Providers** and change the Model field.

---

## 🌤️ Weather & Greeting

A one-line greeting appears between the clock and your name:

```
Good morning, Alex  ☀️ 22°C
```

- **Time of day** is determined by your local clock (morning before 12:00, afternoon until 17:00, evening after)
- **Weather** comes from [Open-Meteo](https://open-meteo.com/) — free, no account, no API key
- **Location** is obtained once via `navigator.geolocation`; if you deny permission the greeting shows without the weather badge
- The name updates instantly whenever you change it in Settings

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus the search bar |
| `Escape` | Close any open modal or panel |

---

## 🗂️ Project Structure

```
3d-homepage/
│
├── index.html           Main page (new-tab page override)
├── popup.html           Extension toolbar popup UI
├── popup.js             Popup logic
├── manifest.json        Chrome Extension MV3 manifest
│
├── script.js            Core app — HomepageApp class
│                        (themes, links, search, typing, weather,
│                         settings UI, import/export, headline editor)
│
├── templates.js         17 theme definitions
│                        (colours, icons, roles, quotes)
│
├── interactions.js      Drag-and-click interactions for 3D objects
│
├── wallpaper.js         Wallpaper module
│                        (IndexedDB storage, render, parallax, palette)
│
├── ai-providers.js      Multi-key manager + failover engine
│                        (CRUD, aiComplete(), testProvider(),
│                         fetchModels(), parseSnippet())
│
├── element-packs.js     3D element pack renderer + AI SVG generation
│                        (built-in packs, custom packs, depth layers,
│                         per-element keyframes, SVG sanitiser)
│
├── styles.css           All styles — main page + design system
│                        (CSS custom properties, button variants,
│                         toggle control, wallpaper thumbnail, 3D layers)
│
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 — custom properties, `perspective`, `transform-style: preserve-3d`, `color-mix()`, `backdrop-filter`, injected per-element `@keyframes` |
| Logic | Vanilla JavaScript (ES2022+) — no frameworks, no build step |
| 3D Rendering | Pure CSS 3D transforms with depth-layered composition |
| Storage | `localStorage` (settings) · `IndexedDB` (wallpaper blobs) · `chrome.storage.local` (provider configs in extension context) |
| AI | [Groq API](https://console.groq.com) — OpenAI-compatible, free tier available |
| Weather | [Open-Meteo](https://open-meteo.com/) — free, no key required |
| Fonts | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) · [Orbitron](https://fonts.google.com/specimen/Orbitron) · [Fira Code](https://fonts.google.com/specimen/Fira+Code) via Google Fonts |
| Icons | [Font Awesome 6](https://fontawesome.com/) via CDN |

---

## 🔒 Privacy & Security

- **No external server.** All data is stored locally on your device. The only external calls are to Groq (AI features, when you use them) and Open-Meteo (weather, one call per new tab).
- **API keys are stored locally in plain text.** This is standard practice for a personal browser tool. Do not share exported settings files publicly.
- **AI-generated SVGs are sanitised** before being rendered — `<script>` elements, `on*` event attributes, and external `href`/`src` URLs are stripped automatically. Malformed SVG is discarded entirely.
- Chrome permissions requested: `storage` and `unlimitedStorage` only. No `tabs`, no `history`, no `cookies`.

---

## 🐛 Troubleshooting

### AI features not working

1. Open **Settings → AI Providers**
2. Make sure at least one provider shows a **green "working"** badge
3. Click the **vial / Test** button on your provider card
4. Common error messages:

   | Message | Fix |
   |---------|-----|
   | *Invalid or expired key* | Generate a new key at [console.groq.com](https://console.groq.com) |
   | *Rate limited — 60 s cooldown* | Wait 60 seconds, or add a second key as a fallback |
   | *No AI providers available* | Add at least one provider in Settings |

### Weather not appearing

- Make sure you clicked **Allow** when the browser asked for your location
- If you denied it: Chrome address bar → 🔒 → Site settings → Location → **Allow**
- `file://` URLs cannot use geolocation — load the page via a local server (`npx serve .`) or as an extension

### Wallpaper not restoring after reload

- The manifest includes `"unlimitedStorage"` — if you edited it manually, confirm the permission is still there and reload the extension at `chrome://extensions`

### Element pack shows nothing

- When a **video** wallpaper is active, all decorative layers are intentionally hidden. Switch to a static image or clear the wallpaper.
- For a static image wallpaper, enable **Subtle accents over photo** in the Wallpaper section.

### AI element generation always fails

1. Open DevTools (`F12`) → Console — look for `[ElementPacks]` log lines
2. They will show the exact HTTP status and the first 500 characters of the model's raw output
3. Common causes:
   - API key not working → fix key in AI Providers
   - SVG returned inside markdown fences (`` ```svg `` ) → already handled; re-try once
   - Description too complex → try `"sword"` instead of `"ornate longsword with engravings"`

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-improvement
   ```
3. Make your changes — keep the vanilla-JS style, no build step, no new dependencies
4. Commit with a clear message:
   ```bash
   git commit -m "Add: short description of what changed"
   ```
5. Push and open a Pull Request

### Development guidelines

- Match the existing ES2022+ vanilla-JS class-based style
- All user-facing settings must persist to `localStorage` with a `homepage_` prefix
- Large binary data (images, video) must use `IndexedDB` — never `localStorage`
- All AI calls must route through `AIProviders.aiComplete()` — never call Groq directly
- Never add paid external services or new required API keys
- New CSS must use the design-system tokens (`--sp-*`, `--r-*`, `--font-mono`, etc.)
- Test in both the Chrome extension context and as a plain web page before opening a PR

---

## 📄 License

```
MIT License

Copyright (c) 2025 Muhammad Ali Mehdi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Made with ❤️ by [Muhammad Ali Mehdi](https://github.com/YOUR_USERNAME)**

*If this project helped you, please consider giving it a ⭐ on GitHub!*

</div>

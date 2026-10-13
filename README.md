## Chrome extension 2.4.0

The extension in [custom extension](custom%20extension) has a balanced centered layout, a compact background picker, five saved wallpapers with non-destructive theme switching, and a dynamic Supabase wallpaper library. Widget resizing, element controls and store packaging are retained. See [release notes](custom%20extension/RELEASE.md), the [backend setup](https://github.com/malimehdi230-dev/3D-Parallax-backend), and the [Chrome Web Store kit](store-kit/README.md).

# 🎮 3D Homepage - Chrome Extension

![Version](https://img.shields.io/badge/version-2.4.0-blue)
![License](https://img.shields.io/badge/license-Apache_2.0-green)

A beautiful Chrome extension featuring **15+ stunning 3D animated homepage templates** for your new tab page. Perfect for programmers, gamers, anime lovers, digital creators, AI developers, and more!

## ✨ Developed by Muhammad Ali Mehdi

---

## 🚀 Features

### 🎨 15 Unique Templates
1. **Programmer** - For developers & coders (Matrix rain, code cubes)
2. **Gamer** - For gaming enthusiasts (Neon grids, pixel effects)
3. **Anime** - For anime & manga lovers (Sakura particles, energy auras)
4. **Digital Creator** - For artists & creators (Color splashes, creative waves)
5. **AI Developer** - For AI & ML engineers (Neural networks, data streams)
6. **Cyberpunk** - Futuristic neon vibes (Glitch effects, holo rings)
7. **Minimal Dark** - Clean & focused (Subtle animations)
8. **Retro Gaming** - 80s arcade vibes (Scanlines, pixel art)
9. **Space Explorer** - Cosmic adventures (Starfields, planets)
10. **Music Producer** - For beat makers (Equalizers, sound waves)
11. **Crypto / Web3** - Blockchain & DeFi (Trading charts, coin animations)
12. **Cyber Expert** - Matrix style (Terminal rain, system analysis effects)
13. **Zen Coder** - Peaceful & calm (Nature particles, water ripples)
14. **Synthwave** - 80s neon aesthetic (Sunset grids, retro sun)
15. **Sci-Fi Tech** - Advanced technology (Holograms, tech circles)

### 🎮 3D Elements
- Rotating code cubes with template-specific symbols
- Floating 3D pyramids
- Torus ring animations
- Orbiting elements
- Mouse parallax effects

### ⚡ Key Features
- 🔍 **Google Search** - Integrated search bar
- 🔗 **Custom Quick Links** - Add/remove your favorite sites
- 🤖 **AI Assistant** - Integrated Chat (Powered by Groq)
- 🌌 **AI Backgrounds** - Generate custom themes with AI
- 🎨 **40+ Icons** - Choose from various icon options
- 🌈 **25 Colors** - Customize link colors
- ⌨️ **Keyboard Shortcuts** - Press `/` to focus search
- 💾 **Persistent Storage** - Settings saved locally
- 📱 **Responsive Design** - Optimized for all screen sizes

---

## 📦 Installation Method

### Load as Unpacked Extension (Developer Mode)

1. **Download** or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **"Load unpacked"**
5. Select the folder containing these files
6. Open a new tab to see your 3D homepage!
---

## 🛠️ File Structure

```
3d-homepage-extension/
├── manifest.json      # Extension configuration
├── index.html         # Main new tab page
├── styles.css         # All styles
├── script.js          # Main JavaScript
├── templates.js       # Template definitions
├── popup.html         # Extension popup
├── README.md          # This file
└── icons/             # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🎯 How to Use

### Change Template
1. Click the **"Templates"** button (top right)
2. Browse through 15 unique themes
3. Click any template to apply it instantly

### Customize Your Name
1. Click the **⚙️ Settings** button (top left)
2. Enter your name
3. Enter your **Groq API Key** (for AI features)
   - Get a free key at [console.groq.com](https://console.groq.com/)
4. Click **"Save Settings"**

### Add Quick Links
1. Click **"+ Add Link"**
2. Enter link name and URL
3. Choose an icon from 40+ options
4. Select a color
5. Click **"Add Link"**

### Remove Quick Links
1. Hover over any link card
2. Click the **✕** button

### Search
- Type in the search bar and press **Enter**
- Or press `/` anywhere to focus the search bar

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Escape` | Close any modal |
| `Enter` | Perform search |

---

## 🎨 Customization

Each template includes:
- **Unique color scheme** (Primary, Secondary, Accent)
- **Custom 3D elements** with template-specific symbols
- **Matching particles** and background effects
- **Role titles** that cycle in the typing animation
- **Themed code snippets** floating in the background

---

## 💡 Tips

- Your settings are saved in browser's local storage
- API keys are stored locally and nunca sent to GitHub or 3rd parties
- Links persist across browser sessions
- Each template changes the cube symbols automatically
- Mouse movement creates parallax effects
- The matrix rain adapts to your chosen template color

---

## 👨‍💻 Developer

**Muhammad Ali Mehdi**

This extension was crafted with ❤️ for the developer community.

---

## 🐛 Troubleshooting

**Extension not loading?**
- Make sure Developer mode is enabled
- Check that all files are in the same folder
- Reload the extension after making changes

**Settings not saving?**
- Check if cookies/local storage is enabled
- Try in a non-incognito window

**Animations slow?**
- Close other resource-heavy tabs
- Ensure hardware acceleration is enabled in Chrome

---

Enjoy your new 3D animated homepage! 🚀

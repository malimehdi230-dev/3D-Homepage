function _esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
    const TEMPLATES = {
        programmer:  { name: 'Programmer',      desc: 'For developers & coders',     icon: 'fa-code',        primary: '#00ff88', secondary: '#00d4ff' },
        gamer:       { name: 'Gamer',            desc: 'For gaming enthusiasts',       icon: 'fa-gamepad',     primary: '#ff0055', secondary: '#00ffff' },
        anime:       { name: 'Anime',            desc: 'For anime & manga lovers',     icon: 'fa-star',        primary: '#ff6b9d', secondary: '#c77dff' },
        creator:     { name: 'Digital Creator',  desc: 'For artists & creators',       icon: 'fa-palette',     primary: '#ff7b00', secondary: '#ff00d4' },
        aiDev:       { name: 'AI Developer',     desc: 'For AI & ML engineers',        icon: 'fa-robot',       primary: '#00d4ff', secondary: '#7b2fff' },
        cyberpunk:   { name: 'Cyberpunk',        desc: 'Futuristic neon vibes',        icon: 'fa-microchip',   primary: '#ff00ff', secondary: '#00ffff' },
        minimal:     { name: 'Minimal Dark',     desc: 'Clean & focused',              icon: 'fa-moon',        primary: '#ffffff', secondary: '#888888' },
        retro:       { name: 'Retro Gaming',     desc: '80s arcade vibes',             icon: 'fa-ghost',       primary: '#ff6b35', secondary: '#f7c948' },
        space:       { name: 'Space Explorer',   desc: 'Cosmic adventures',            icon: 'fa-rocket',      primary: '#7b2fff', secondary: '#00d4ff' },
        music:       { name: 'Music Producer',   desc: 'For beat makers',              icon: 'fa-headphones',  primary: '#ff4d4d', secondary: '#ff8800' },
        crypto:      { name: 'Crypto / Web3',    desc: 'Blockchain & DeFi',            icon: 'fa-bitcoin',     primary: '#f7c948', secondary: '#ff6b35' },
        cyberexpert: { name: 'Cyber Expert',     desc: 'Matrix style',                 icon: 'fa-terminal',    primary: '#00ff88', secondary: '#00cc66' },
        nature:      { name: 'Zen Coder',        desc: 'Peaceful & calm',              icon: 'fa-leaf',        primary: '#88ff44', secondary: '#44ffcc' },
        synthwave:   { name: 'Synthwave',        desc: '80s neon aesthetic',           icon: 'fa-sun',         primary: '#ff6ec7', secondary: '#a855f7' },
        scifi:       { name: 'Sci-Fi Tech',      desc: 'Advanced technology',          icon: 'fa-satellite',   primary: '#00f0ff', secondary: '#0070ff' },
        liquidGlass: { name: 'Liquid Glass',     desc: 'Apple-inspired glassmorphism', icon: 'fa-droplet',     primary: '#88ccff', secondary: '#ffffff' },
        diamondCut:  { name: 'Diamond Cut',      desc: 'Premium crystal aesthetic',    icon: 'fa-gem',         primary: '#b3ffff', secondary: '#e6ffff' },
        holographic: { name: 'Holographic',      desc: 'Iridescent hologram vibes',    icon: 'fa-eye',         primary: '#ff7eb3', secondary: '#ff758c' },
    };

    function applyData(template, userName, links, installDate) {
        const current = TEMPLATES[template] || TEMPLATES.programmer;

        // Template card
        const tmplIcon = document.getElementById('tmplIcon');
        if (tmplIcon) tmplIcon.innerHTML = `<i class="fas ${_esc(current.icon)}" style="color:${_esc(current.primary)};"></i>`;
        const tmplName = document.getElementById('tmplName');
        if (tmplName) tmplName.textContent = current.name;
        const tmplDesc = document.getElementById('tmplDesc');
        if (tmplDesc) tmplDesc.textContent = current.desc;

        // Stats
        const statLinks = document.getElementById('statLinks');
        if (statLinks) statLinks.textContent = links.length;

        // Days since install
        const statDays = document.getElementById('statDays');
        if (statDays && installDate) {
            const days = Math.max(0, Math.floor((Date.now() - Number(installDate)) / 86400000));
            statDays.textContent = days;
        }

        // Greeting
        const greetEl = document.getElementById('popupGreeting');
        const nameEl  = document.getElementById('popupName');
        if (greetEl) {
            const h = new Date().getHours();
            const period = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
            greetEl.innerHTML = `Good ${period}, <strong id="popupName">${_esc((userName && userName !== 'YOUR NAME') ? userName : 'there')}</strong>`;
        }

        // Quick links chips
        const linksContainer = document.getElementById('quickLinks');
        if (linksContainer) {
            if (!links.length) {
                linksContainer.innerHTML = '<div style="font-size:0.78rem;color:rgba(255,255,255,0.3);padding:4px 0;">No links saved yet.</div>';
            } else {
                linksContainer.innerHTML = links.slice(0, 8).map(link => `
                    <a href="${_esc(link.url)}" class="ql-chip" target="_blank" title="${_esc(link.name)}">
                        <i class="${_esc(link.icon)}" style="color:${_esc(link.color || '#00ff88')};"></i>
                        ${_esc(link.name)}
                    </a>
                `).join('') + (links.length > 8 ? `<span class="ql-chip" style="opacity:0.5;">+${links.length - 8} more</span>` : '');
            }
        }
    }

    function loadData() {
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
            chrome.storage.local.get(
                ['homepage_template', 'homepage_userName', 'homepage_links', 'homepage_install_date'],
                (result) => {
                    const template = result.homepage_template || localStorage.getItem('homepage_template') || 'programmer';
                    const userName = result.homepage_userName || localStorage.getItem('homepage_userName') || '';
                    let links = [];
                    try { links = JSON.parse(result.homepage_links || localStorage.getItem('homepage_links') || '[]'); } catch {}
                    const installDate = result.homepage_install_date || localStorage.getItem('homepage_install_date');
                    applyData(template, userName, links, installDate);
                }
            );
        } else {
            const template = localStorage.getItem('homepage_template') || 'programmer';
            const userName = localStorage.getItem('homepage_userName') || '';
            let links = [];
            try { links = JSON.parse(localStorage.getItem('homepage_links') || '[]'); } catch {}
            const installDate = localStorage.getItem('homepage_install_date');
            applyData(template, userName, links, installDate);
        }
    }

    loadData();

    // Toggle: Matrix rain
    const toggleMatrix = document.getElementById('toggleMatrix');
    if (toggleMatrix) {
        const stored = localStorage.getItem('homepage_matrixEnabled');
        toggleMatrix.checked = stored !== '0';
        toggleMatrix.addEventListener('change', () => {
            localStorage.setItem('homepage_matrixEnabled', toggleMatrix.checked ? '1' : '0');
            if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
                chrome.storage.local.set({ homepage_matrixEnabled: toggleMatrix.checked ? '1' : '0' });
            }
        });
    }

    // Toggle: Ambient sound
    const toggleAmbient = document.getElementById('toggleAmbient');
    if (toggleAmbient) {
        const stored = localStorage.getItem('homepage_ambientEnabled');
        toggleAmbient.checked = stored === '1';
        toggleAmbient.addEventListener('change', () => {
            localStorage.setItem('homepage_ambientEnabled', toggleAmbient.checked ? '1' : '0');
            if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
                chrome.storage.local.set({ homepage_ambientEnabled: toggleAmbient.checked ? '1' : '0' });
            }
        });
    }

    // Button: Open New Tab
    const openBtn = document.getElementById('openNewTab');
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof chrome !== 'undefined' && chrome?.tabs) {
                chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
            } else {
                window.open('index.html', '_blank');
            }
        });
    }

    // Button: Export settings
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('homepage_') && k !== 'homepage_ai_providers') data[k] = localStorage.getItem(k);
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = '3d-parallax-settings.json';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }

    // Button: Reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
                chrome.storage.local.clear(() => location.reload());
            } else {
                localStorage.clear();
                location.reload();
            }
        });
    }

    // Feedback link — opens new tab to index.html and triggers the feedback modal
    const popupFeedbackLink = document.getElementById('popupFeedbackLink');
    if (popupFeedbackLink) {
        popupFeedbackLink.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: chrome.runtime.getURL('index.html') + '#feedback' });
        });
    }
});

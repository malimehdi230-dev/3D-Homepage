// 3D Homepage Templates - Developed by Muhammad Ali Mehdi

const TEMPLATES = {
    programmer: {
        id: 'programmer',
        name: 'Programmer',
        icon: 'fas fa-code',
        description: 'For developers & coders',
        colors: {
            primary: '#00ff88',
            secondary: '#00d4ff',
            accent: '#bf00ff',
            bg: '#0a0a0f',
            bgSecondary: '#0d1117'
        },
        particles: 'code',
        effects: ['matrix', 'cubes', 'brackets'],
        quotes: [
            'console.log("Hello, World!");',
            'while(alive) { code(); }',
            'git commit -m "Success"',
            '// Dreams → Reality'
        ],
        roles: ['Full Stack Developer', 'Code Architect', 'Software Engineer', 'Problem Solver', 'Tech Innovator']
    },

    gamer: {
        id: 'gamer',
        name: 'Gamer',
        icon: 'fas fa-gamepad',
        description: 'For gaming enthusiasts',
        colors: {
            primary: '#ff0055',
            secondary: '#00ffff',
            accent: '#ffff00',
            bg: '#0a0012',
            bgSecondary: '#150020'
        },
        particles: 'pixels',
        effects: ['neonGrid', 'controller', 'healthBar'],
        quotes: [
            'GAME ON!',
            'Press START to begin',
            'Level Up!',
            'GG WP'
        ],
        roles: ['Pro Gamer', 'Stream Legend', 'Esports Champion', 'Game Master', 'Achievement Hunter']
    },

    anime: {
        id: 'anime',
        name: 'Anime',
        icon: 'fas fa-star',
        description: 'For anime & manga lovers',
        colors: {
            primary: '#ff6b9d',
            secondary: '#c44dff',
            accent: '#00d4ff',
            bg: '#0d0015',
            bgSecondary: '#1a0028'
        },
        particles: 'sakura',
        effects: ['sakuraFall', 'energyAura', 'speedLines'],
        quotes: [
            '私のやり方だ！',
            'Plus Ultra!',
            'Believe It!',
            'Omae wa mou shindeiru'
        ],
        roles: ['Anime Enthusiast', 'Manga Reader', 'Otaku Legend', 'Cosplayer', 'Weeb Master']
    },

    creator: {
        id: 'creator',
        name: 'Digital Creator',
        icon: 'fas fa-palette',
        description: 'For artists & creators',
        colors: {
            primary: '#ff7b00',
            secondary: '#ff00d4',
            accent: '#00ff88',
            bg: '#0f0a15',
            bgSecondary: '#1a1020'
        },
        particles: 'brushStrokes',
        effects: ['colorSplash', 'creativeCube', 'waves'],
        quotes: [
            'Create. Inspire. Repeat.',
            'Art is freedom',
            'Design your dreams',
            'Imagination unleashed'
        ],
        roles: ['Digital Artist', 'Content Creator', 'Visual Designer', 'Creative Director', 'Imagination Engineer']
    },

    aiDev: {
        id: 'aiDev',
        name: 'AI Developer',
        icon: 'fas fa-robot',
        description: 'For AI & ML engineers',
        colors: {
            primary: '#00ffcc',
            secondary: '#7b00ff',
            accent: '#ff0080',
            bg: '#050510',
            bgSecondary: '#0a0a20'
        },
        particles: 'neurons',
        effects: ['neuralNetwork', 'dataCube', 'brainWaves'],
        quotes: [
            'model.fit(dreams)',
            'Training complete',
            'Neural pathways active',
            'AI > Human? Loading...'
        ],
        roles: ['AI Engineer', 'ML Architect', 'Deep Learning Expert', 'Neural Network Designer', 'Data Scientist']
    },

    cyberpunk: {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        icon: 'fas fa-microchip',
        description: 'Futuristic neon vibes',
        colors: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ffff00',
            bg: '#0a000f',
            bgSecondary: '#15001a'
        },
        particles: 'glitch',
        effects: ['glitchText', 'holoRings', 'cityscape'],
        quotes: [
            'Welcome to 2077',
            'System override',
            'Jacking in...',
            'The future is now'
        ],
        roles: ['Netrunner', 'Cyber Enhanced', 'Tech Ninja', 'Digital Ghost', 'System Expert']
    },

    minimal: {
        id: 'minimal',
        name: 'Minimal Dark',
        icon: 'fas fa-moon',
        description: 'Clean & focused',
        colors: {
            primary: '#ffffff',
            secondary: '#888888',
            accent: '#444444',
            bg: '#000000',
            bgSecondary: '#111111'
        },
        particles: 'dots',
        effects: ['subtleFloat', 'cleanLines'],
        quotes: [
            'Less is more',
            'Focus mode',
            'Simplicity',
            'Clean code'
        ],
        roles: ['Minimalist', 'Focused Mind', 'Clean Coder', 'Zen Developer', 'Simple Living']
    },

    retro: {
        id: 'retro',
        name: 'Retro Gaming',
        icon: 'fas fa-ghost',
        description: '80s arcade vibes',
        colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            accent: '#ffff00',
            bg: '#000000',
            bgSecondary: '#0a0a0a'
        },
        particles: 'pixels8bit',
        effects: ['scanlines', 'pixelGrid', 'arcadeText'],
        quotes: [
            'INSERT COIN',
            'HIGH SCORE!',
            'GAME OVER? NEVER!',
            '1UP'
        ],
        roles: ['Retro Gamer', 'Arcade Master', '8-Bit Legend', 'Pixel Warrior', 'Classic Champion']
    },

    space: {
        id: 'space',
        name: 'Space Explorer',
        icon: 'fas fa-rocket',
        description: 'Cosmic adventures',
        colors: {
            primary: '#00d4ff',
            secondary: '#bf00ff',
            accent: '#ff6b00',
            bg: '#000008',
            bgSecondary: '#000515'
        },
        particles: 'stars',
        effects: ['starfield', 'planet', 'warpSpeed'],
        quotes: [
            'To infinity...',
            'Houston, we have liftoff',
            'Exploring galaxies',
            'Space: Final frontier'
        ],
        roles: ['Space Explorer', 'Cosmic Traveler', 'Star Navigator', 'Galaxy Pioneer', 'Astro Engineer']
    },

    music: {
        id: 'music',
        name: 'Music Producer',
        icon: 'fas fa-headphones',
        description: 'For beat makers',
        colors: {
            primary: '#ff4d4d',
            secondary: '#4d4dff',
            accent: '#4dff4d',
            bg: '#0a0808',
            bgSecondary: '#151010'
        },
        particles: 'soundWaves',
        effects: ['equalizer', 'vinylSpin', 'musicNotes'],
        quotes: [
            '♪ Drop the beat ♪',
            'Feel the rhythm',
            'Music is life',
            'Bass boosted'
        ],
        roles: ['Music Producer', 'Beat Maker', 'Sound Designer', 'Audio Engineer', 'Rhythm Master']
    },

    crypto: {
        id: 'crypto',
        name: 'Crypto / Web3',
        icon: 'fab fa-bitcoin',
        description: 'Blockchain & DeFi',
        colors: {
            primary: '#f7931a',
            secondary: '#627eea',
            accent: '#00ff88',
            bg: '#0a0a12',
            bgSecondary: '#12121a'
        },
        particles: 'blocks',
        effects: ['blockchain', 'coinSpin', 'tradingChart'],
        quotes: [
            'HODL!',
            'To the moon 🚀',
            'Decentralized future',
            'Blockchain verified'
        ],
        roles: ['Crypto Trader', 'Web3 Developer', 'DeFi Expert', 'Blockchain Engineer', 'Diamond Hands']
    },

    cyberexpert: {
        id: 'cyberexpert',
        name: 'Cyber Expert',
        icon: 'fas fa-terminal',
        description: 'Matrix style',
        colors: {
            primary: '#00ff00',
            secondary: '#00aa00',
            accent: '#005500',
            bg: '#000000',
            bgSecondary: '#001100'
        },
        particles: 'matrixHeavy',
        effects: ['terminalRain', 'hackingText', 'systemBreach'],
        quotes: [
            'Access granted',
            'Firewall bypassed',
            'root@system:~#',
            'Decrypting...'
        ],
        roles: ['Security Expert', 'Penetration Tester', 'Cyber Warrior', 'Code Breaker', 'System Guardian']
    },

    nature: {
        id: 'nature',
        name: 'Zen Coder',
        icon: 'fas fa-leaf',
        description: 'Peaceful & calm',
        colors: {
            primary: '#4ade80',
            secondary: '#22d3ee',
            accent: '#a78bfa',
            bg: '#0a1210',
            bgSecondary: '#0f1a15'
        },
        particles: 'leaves',
        effects: ['gentleWind', 'waterRipple', 'bamboo'],
        quotes: [
            'Code in peace',
            'Breathe. Code. Repeat.',
            'Harmony in logic',
            'Mindful coding'
        ],
        roles: ['Zen Developer', 'Mindful Coder', 'Digital Monk', 'Peace Engineer', 'Calm Creator']
    },

    synthwave: {
        id: 'synthwave',
        name: 'Synthwave',
        icon: 'fas fa-sun',
        description: '80s neon aesthetic',
        colors: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ff7700',
            bg: '#1a0a2e',
            bgSecondary: '#2d1b4e'
        },
        particles: 'retroGrid',
        effects: ['sunsetGrid', 'neonSun', 'palmTrees'],
        quotes: [
            'Riding the neon wave',
            'Retro future',
            'Synthwave nights',
            'Electric dreams'
        ],
        roles: ['Synthwave Rider', 'Neon Warrior', 'Retro Futurist', 'Digital Dreamer', 'Vaporwave Artist']
    },

    scifi: {
        id: 'scifi',
        name: 'Sci-Fi Tech',
        icon: 'fas fa-satellite',
        description: 'Advanced technology',
        colors: {
            primary: '#00b4d8',
            secondary: '#90e0ef',
            accent: '#ff006e',
            bg: '#03071e',
            bgSecondary: '#0a1128'
        },
        particles: 'holo',
        effects: ['hologram', 'techCircles', 'dataStream'],
        quotes: [
            'Systems online',
            'Quantum processing',
            'Initializing...',
            'Tech level: Maximum'
        ],
        roles: ['Tech Pioneer', 'System Architect', 'Quantum Engineer', 'Future Builder', 'Innovation Lead']
    },

    liquidGlass: {
        id: 'liquidGlass',
        name: 'Liquid Glass',
        icon: 'fas fa-tint',
        description: 'Smooth translucent iOS style',
        colors: {
            primary: '#ffffff',
            secondary: '#e6e6fa',
            accent: '#ffb6c1',
            bg: '#7f00ff',
            bgSecondary: '#e100ff'
        },
        particles: 'bubbles',
        effects: ['glassmorphism', 'fluidGradient', 'softShadows'],
        quotes: [
            'Crystal clear',
            'Flowing logic',
            'Transparent design',
            'Smooth interactions'
        ],
        roles: ['UI/UX Designer', 'Frontend Innovator', 'Design Systems', 'Creative Coder', 'Fluid Artist']
    },

    diamondCut: {
        id: 'diamondCut',
        name: 'Diamond Cut',
        icon: 'fas fa-gem',
        description: 'Sharp, premium geometric cuts',
        colors: {
            primary: '#e6ffff',
            secondary: '#b3ffff',
            accent: '#4dffff',
            bg: '#050a0a',
            bgSecondary: '#0a1414'
        },
        particles: 'facets',
        effects: ['crystalline', 'sharpEdges', 'prismRefraction'],
        quotes: [
            'Precision engineered',
            'Flawless execution',
            'Sharp focus',
            'Premium quality'
        ],
        roles: ['Elite Developer', 'Software Craftsman', 'Quality Engineer', 'Architecture Pro', 'Diamond Coder']
    },

    holographic: {
        id: 'holographic',
        name: 'Holographic',
        icon: 'fas fa-magic',
        description: 'Iridescent futuristic glows',
        colors: {
            primary: '#ff7eb3',
            secondary: '#ff758c',
            accent: '#ff7eb3',
            bg: '#140c1c',
            bgSecondary: '#241a34'
        },
        particles: 'holoDust',
        effects: ['iridescent', 'holoGlow', 'prismatic'],
        quotes: [
            'Seeing the unseen',
            'Future visions',
            'Prismatic logic',
            'Holo-deck active'
        ],
        roles: ['Holo Designer', 'Visionary Dev', 'Future UI Creator', 'Spatial Coder', 'Light Weaver']
    }
};

const DEFAULT_LINKS = [
    { name: 'YouTube', url: 'https://youtube.com', icon: 'fab fa-youtube', color: '#ff0000' },
    { name: 'Gmail', url: 'https://mail.google.com', icon: 'fas fa-envelope', color: '#ea4335' },
    { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github', color: '#ffffff' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'fas fa-robot', color: '#10a37f' },
    { name: 'Claude', url: 'https://claude.ai', icon: 'fas fa-brain', color: '#cc785c' }
];

const AVAILABLE_ICONS = [
    'fab fa-youtube', 'fas fa-envelope', 'fab fa-github', 'fas fa-robot', 'fas fa-brain',
    'fab fa-twitter', 'fab fa-linkedin', 'fab fa-discord', 'fab fa-spotify', 'fab fa-twitch',
    'fab fa-reddit', 'fab fa-instagram', 'fab fa-facebook', 'fab fa-tiktok', 'fab fa-whatsapp',
    'fas fa-code', 'fas fa-terminal', 'fas fa-database', 'fas fa-cloud', 'fas fa-gamepad',
    'fas fa-music', 'fas fa-film', 'fas fa-book', 'fas fa-shopping-cart', 'fas fa-wallet',
    'fas fa-graduation-cap', 'fas fa-briefcase', 'fas fa-heart', 'fas fa-star', 'fas fa-globe',
    'fab fa-steam', 'fab fa-playstation', 'fab fa-xbox', 'fab fa-netflix', 'fas fa-vr-cardboard',
    'fab fa-bitcoin', 'fab fa-ethereum', 'fas fa-chart-line', 'fas fa-rocket', 'fas fa-fire'
];

const AVAILABLE_COLORS = [
    '#ff0000', '#ea4335', '#ffffff', '#10a37f', '#cc785c',
    '#1da1f2', '#0077b5', '#5865f2', '#1db954', '#9146ff',
    '#ff4500', '#e1306c', '#000000', '#00d4ff', '#bf00ff',
    '#ffbd2e', '#00ff88', '#ff79c6', '#f1fa8c', '#8be9fd',
    '#ff00ff', '#00ffff', '#ffff00', '#ff7700', '#7b00ff'
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEMPLATES, DEFAULT_LINKS, AVAILABLE_ICONS, AVAILABLE_COLORS };
}

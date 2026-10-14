// 3D Homepage Templates - Developed by Muhammad Ali Mehdi

class Enhanced3DObjects {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create container for dynamic 3D objects
        this.container = document.createElement('div');
        this.container.id = 'dynamic-3d-objects';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        `;
        document.body.appendChild(this.container);
    }

    clearObjects() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    renderForTemplate(templateId) {
        this.clearObjects();

        const renderer = this[`render_${templateId}`];
        if (renderer) {
            renderer.call(this);
        }
    }

    // PROGRAMMER - Floating Code Symbols & Monitor
    render_programmer() {
        // Floating Monitor
        this.container.innerHTML += `
            <div class="floating-monitor" style="position: absolute; right: 15%; top: 30%; transform-style: preserve-3d; animation: float3d 6s ease-in-out infinite;">
                <div style="width: 140px; height: 100px; background: rgba(0,0,0,0.8); border: 2px solid var(--primary); border-radius: 8px; position: relative; transform: rotateY(-20deg) rotateX(10deg);">
                    <div style="position: absolute; top: 10px; left: 10px; font-family: 'Fira Code'; font-size: 8px; color: var(--primary); line-height: 1.4;">
                        <div>&gt; npm start</div>
                        <div style="opacity: 0.7;">Building...</div>
                        <div style="color: var(--secondary);">✓ Success</div>
                    </div>
                    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 8px; background: rgba(0,0,0,0.9); border-radius: 0 0 4px 4px;"></div>
                </div>
            </div>
        `;

        // Floating Brackets
        const brackets = ['{ }', '[ ]', '< >', '( )'];
        brackets.forEach((bracket, i) => {
            this.container.innerHTML += `
                <div style="position: absolute; left: ${10 + i * 20}%; top: ${20 + i * 15}%; 
                    font-family: 'Fira Code'; font-size: 3rem; color: rgba(0,255,136,0.15);
                    animation: codeFloat ${8 + i}s ease-in-out infinite;
                    animation-delay: ${-i * 2}s;">
                    ${bracket}
                </div>
            `;
        });
    }

    // GAMER - Game Controller & Health Bar
    render_gamer() {
        // 3D Game Controller
        this.container.innerHTML += `
            <div style="position: absolute; left: 10%; bottom: 25%; transform-style: preserve-3d; animation: controllerSpin 15s linear infinite;">
                <div style="width: 120px; height: 80px; background: linear-gradient(135deg, rgba(255,0,85,0.2), rgba(0,255,255,0.2)); 
                    border: 2px solid var(--primary); border-radius: 20px; position: relative; transform: rotateY(30deg) rotateX(-20deg);
                    box-shadow: 0 0 30px rgba(255,0,85,0.3);">
                    <div style="position: absolute; top: 20px; left: 20px; width: 30px; height: 30px; border: 2px solid var(--primary); border-radius: 50%; opacity: 0.6;"></div>
                    <div style="position: absolute; top: 30px; right: 25px; width: 12px; height: 12px; background: var(--accent); border-radius: 50%;"></div>
                    <div style="position: absolute; top: 20px; right: 35px; width: 12px; height: 12px; background: var(--secondary); border-radius: 50%;"></div>
                </div>
            </div>
        `;

        // HP/XP Bars
        this.container.innerHTML += `
            <div style="position: absolute; right: 12%; top: 40%; width: 150px;">
                <div style="margin-bottom: 10px;">
                    <div style="font-family: 'Orbitron'; font-size: 10px; color: #ff0055; margin-bottom: 4px;">HP: 100/100</div>
                    <div style="height: 12px; background: rgba(0,0,0,0.5); border: 1px solid #ff0055; border-radius: 6px; overflow: hidden;">
                        <div style="height: 100%; width: 100%; background: linear-gradient(90deg, #ff0055, #ff4488); animation: pulse 2s ease-in-out infinite;"></div>
                    </div>
                </div>
                <div>
                    <div style="font-family: 'Orbitron'; font-size: 10px; color: #00ffff; margin-bottom: 4px;">XP: 85/100</div>
                    <div style="height: 12px; background: rgba(0,0,0,0.5); border: 1px solid #00ffff; border-radius: 6px; overflow: hidden;">
                        <div style="height: 100%; width: 85%; background: linear-gradient(90deg, #00ffff, #44ffff);"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // ANIME - Sakura Petals & Energy Sphere
    render_anime() {
        // Energy Sphere
        this.container.innerHTML += `
            <div style="position: absolute; right: 18%; top: 35%; transform-style: preserve-3d;">
                <div style="width: 100px; height: 100px; border-radius: 50%; 
                    background: radial-gradient(circle, rgba(255,107,157,0.3), transparent);
                    border: 2px solid var(--primary); position: relative;
                    animation: energyPulse 3s ease-in-out infinite;
                    box-shadow: 0 0 50px rgba(255,107,157,0.5), inset 0 0 30px rgba(255,107,157,0.3);">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        font-size: 2rem; color: var(--primary);">力</div>
                </div>
            </div>
        `;

        // Sakura Petals
        for (let i = 0; i < 15; i++) {
            this.container.innerHTML += `
                <div style="position: absolute; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
                    width: 12px; height: 12px; background: #ff6b9d;
                    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
                    animation: sakuraFall ${10 + Math.random() * 5}s linear infinite;
                    animation-delay: ${-Math.random() * 10}s;
                    opacity: ${0.3 + Math.random() * 0.4};">
                </div>
            `;
        }
    }

    // CREATOR - Paint Palette & Brush
    render_creator() {
        // 3D Paint Palette
        this.container.innerHTML += `
            <div style="position: absolute; left: 12%; top: 35%; transform-style: preserve-3d; animation: float3d 7s ease-in-out infinite;">
                <div style="width: 120px; height: 90px; background: rgba(0,0,0,0.8); border: 2px solid var(--primary); 
                    border-radius: 50% 50% 50% 0; position: relative; transform: rotateY(-25deg) rotateX(15deg);">
                    ${[0, 1, 2, 3, 4].map((i) => {
            const colors = ['#ff7b00', '#ff00d4', '#00ff88', '#00d4ff', '#bf00ff'];
            return `<div style="position: absolute; top: ${20 + (i % 2) * 30}px; left: ${20 + Math.floor(i / 2) * 35}px;
                            width: 22px; height: 22px; background: ${colors[i]}; border-radius: 50%;
                            box-shadow: 0 0 15px ${colors[i]}80;"></div>`;
        }).join('')}
                </div>
            </div>
        `;

        // Paint Brush
        this.container.innerHTML += `
            <div style="position: absolute; right: 20%; bottom: 30%; transform-style: preserve-3d; animation: brushStroke 4s ease-in-out infinite;">
                <div style="width: 80px; height: 8px; background: linear-gradient(90deg, #8b4513, #a0522d); border-radius: 4px; position: relative; transform: rotate(-30deg);">
                    <div style="position: absolute; right: -15px; top: -8px; width: 0; height: 0; 
                        border-left: 15px solid var(--primary); border-top: 12px solid transparent; border-bottom: 12px solid transparent;">
                    </div>
                </div>
            </div>
        `;
    }

    // AI DEVELOPER - Neural Network & Brain
    render_aiDev() {
        // Neural Network Nodes
        this.container.innerHTML += `
            <div style="position: absolute; right: 15%; top: 25%; width: 180px; height: 180px; transform-style: preserve-3d;">
                ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const angle = (i / 9) * Math.PI * 2;
            const x = Math.cos(angle) * 70 + 90;
            const y = Math.sin(angle) * 70 + 90;
            return `<div style="position: absolute; left: ${x}px; top: ${y}px; width: 12px; height: 12px;
                        background: var(--primary); border-radius: 50%; box-shadow: 0 0 20px var(--primary);
                        animation: neuronPulse ${2 + Math.random()}s ease-in-out infinite;
                        animation-delay: ${i * 0.2}s;"></div>`;
        }).join('')}
                <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
                    width: 30px; height: 30px; background: var(--secondary); border-radius: 50%;
                    box-shadow: 0 0 40px var(--secondary); animation: pulse 2s ease-in-out infinite;"></div>
            </div>
        `;
    }

    // CYBERPUNK - Holographic Display
    render_cyberpunk() {
        this.container.innerHTML += `
            <div style="position: absolute; left: 15%; top: 30%; transform-style: preserve-3d; animation: holoFloat 5s ease-in-out infinite;">
                <div style="width: 140px; height: 180px; position: relative; transform: rotateY(20deg);">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 60px; background: linear-gradient(180deg, rgba(255,0,255,0.3), transparent);
                        border: 1px solid var(--primary); border-bottom: none;"></div>
                    <div style="position: absolute; top: 60px; left: 0; width: 100%; height: 60px; background: linear-gradient(180deg, rgba(0,255,255,0.3), transparent);
                        border: 1px solid var(--secondary); border-top: none; border-bottom: none;"></div>
                    <div style="position: absolute; top: 120px; left: 0; width: 100%; height: 60px; background: linear-gradient(180deg, rgba(255,255,0,0.3), transparent);
                        border: 1px solid var(--accent); border-top: none;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        font-family: 'Orbitron'; font-size: 14px; color: var(--primary); text-align: center;">
                        SYSTEM<br/>2077
                    </div>
                </div>
            </div>
        `;
    }

    // SPACE - Planet & Rocket
    render_space() {
        // Planet
        this.container.innerHTML += `
            <div style="position: absolute; right: 10%; top: 25%; transform-style: preserve-3d;">
                <div style="width: 120px; height: 120px; border-radius: 50%; 
                    background: radial-gradient(circle at 30% 30%, #4a90e2, #1e3a8a);
                    border: 2px solid var(--primary); position: relative;
                    animation: planetSpin 20s linear infinite;
                    box-shadow: 0 0 60px rgba(0,212,255,0.4), inset -20px -20px 40px rgba(0,0,0,0.5);">
                    <div style="position: absolute; top: 20%; left: 15%; width: 15px; height: 15px; background: rgba(255,255,255,0.3); border-radius: 50%;"></div>
                    <div style="position: absolute; top: 60%; left: 65%; width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                </div>
                <div style="position: absolute; top: 50%; left: 50%; width: 160px; height: 4px; 
                    background: linear-gradient(90deg, transparent, var(--primary), transparent);
                    transform: translate(-50%, -50%) rotateX(75deg); opacity: 0.4;"></div>
            </div>
        `;

        // Rocket
        this.container.innerHTML += `
            <div style="position: absolute; left: 15%; bottom: 30%; animation: rocketFly 8s ease-in-out infinite;">
                <div style="width: 30px; height: 70px; background: linear-gradient(180deg, var(--accent), var(--primary)); 
                    border-radius: 15px 15px 0 0; position: relative; box-shadow: 0 0 20px var(--primary);">
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 10px; height: 15px; background: rgba(255,255,255,0.3); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: -15px; left: 0; width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 15px solid var(--accent);"></div>
                    <div style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px;">
                        <div style="width: 8px; height: 15px; background: linear-gradient(180deg, #ff6b00, #ff0000); border-radius: 50%; opacity: 0.8; animation: flame 0.3s ease-in-out infinite;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // MUSIC - Vinyl Record & Equalizer
    render_music() {
        // Vinyl Record
        this.container.innerHTML += `
            <div style="position: absolute; left: 12%; top: 35%; transform-style: preserve-3d;">
                <div style="width: 110px; height: 110px; border-radius: 50%; 
                    background: radial-gradient(circle, #1a1a1a 0%, #1a1a1a 35%, var(--primary) 36%, var(--primary) 38%, #1a1a1a 39%, #1a1a1a 100%);
                    border: 2px solid var(--primary); position: relative;
                    animation: vinylSpin 4s linear infinite;
                    box-shadow: 0 0 30px rgba(255,77,77,0.3);">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        width: 20px; height: 20px; background: #ff4d4d; border-radius: 50%;"></div>
                </div>
            </div>
        `;

        // Equalizer
        this.container.innerHTML += `
            <div style="position: absolute; right: 15%; bottom: 30%; display: flex; gap: 6px; align-items: flex-end; height: 80px;">
                ${[40, 70, 55, 80, 45, 65, 50, 75].map((height, i) => `
                    <div style="width: 10px; height: ${height}px; background: linear-gradient(180deg, var(--primary), var(--secondary));
                        border-radius: 3px 3px 0 0; animation: equalizerBounce ${0.4 + (i % 3) * 0.2}s ease-in-out infinite;
                        animation-delay: ${i * 0.1}s;"></div>
                `).join('')}
            </div>
        `;
    }

    // CRYPTO - Coin Stack & Chart
    render_crypto() {
        // Spinning Coins
        ['#f7931a', '#627eea', '#00ff88'].forEach((color, i) => {
            this.container.innerHTML += `
                <div style="position: absolute; right: ${15 + i * 8}%; top: ${30 + i * 10}%; transform-style: preserve-3d; animation: coinFlip${i} 3s ease-in-out infinite;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: ${color};
                        border: 3px solid ${color}dd; position: relative;
                        box-shadow: 0 0 30px ${color}80;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                            font-family: 'Orbitron'; font-size: 20px; font-weight: bold; color: #000;">
                            ${i === 0 ? '₿' : i === 1 ? 'Ξ' : '$'}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // CYBEREXPERT - Terminal Window
    render_cyberexpert() {
        this.container.innerHTML += `
            <div style="position: absolute; right: 12%; top: 25%; transform-style: preserve-3d; animation: float3d 6s ease-in-out infinite;">
                <div style="width: 200px; height: 140px; background: rgba(0,0,0,0.95); border: 2px solid var(--primary); border-radius: 8px; position: relative; transform: rotateY(-15deg);">
                    <div style="padding: 8px; font-family: 'Fira Code'; font-size: 9px; color: var(--primary); line-height: 1.6;">
                        <div>root@matrix:~# access mainframe</div>
                        <div style="opacity: 0.7;">Connecting...</div>
                        <div style="color: var(--secondary);">█ Firewall bypassed</div>
                        <div style="color: var(--secondary);">█ Encryption cracked</div>
                        <div style="animation: blink 1s infinite;">█ Access granted_</div>
                    </div>
                </div>
            </div>
        `;
    }

    // RETRO - Arcade Cabinet
    render_retro() {
        this.container.innerHTML += `
            <div style="position: absolute; left: 10%; bottom: 20%; transform-style: preserve-3d;">
                <div style="width: 100px; height: 140px; background: linear-gradient(180deg, #1a1a1a, #000); 
                    border: 3px solid var(--primary); border-radius: 8px 8px 0 0; position: relative;
                    box-shadow: 0 0 30px rgba(255,0,0,0.3);">
                    <div style="margin: 15px auto 0; width: 70px; height: 50px; background: #000; border: 2px solid var(--secondary); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron'; font-size: 10px; color: var(--accent);">
                        INSERT<br/>COIN
                    </div>
                    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; border: 2px solid var(--primary); border-radius: 50%; opacity: 0.6;"></div>
                    <div style="position: absolute; bottom: 30px; left: 20px; width: 15px; height: 15px; background: var(--accent); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: 30px; right: 20px; width: 15px; height: 15px; background: var(--accent); border-radius: 50%;"></div>
                </div>
            </div>
        `;
    }

    // NATURE - Bamboo & Lotus
    render_nature() {
        // Bamboo
        this.container.innerHTML += `
            <div style="position: absolute; right: 15%; bottom: 15%; animation: bambooSway 4s ease-in-out infinite;">
                <div style="width: 12px; height: 150px; background: linear-gradient(180deg, #4ade80, #22c55e); border-radius: 6px; position: relative;">
                    ${[30, 60, 90, 120].map(top => `
                        <div style="position: absolute; top: ${top}px; left: 0; width: 100%; height: 2px; background: rgba(0,0,0,0.3);"></div>
                    `).join('')}
                    <div style="position: absolute; top: -20px; left: -15px; width: 40px; height: 25px; background: #4ade80; border-radius: 50% 50% 0 0; transform: rotate(-20deg);"></div>
                    <div style="position: absolute; top: -15px; right: -15px; width: 35px; height: 20px; background: #4ade80; border-radius: 50% 50% 0 0; transform: rotate(20deg);"></div>
                </div>
            </div>
        `;

        // Floating Lotus
        this.container.innerHTML += `
            <div style="position: absolute; left: 15%; top: 40%; animation: lotusFloat 6s ease-in-out infinite;">
                <div style="width: 60px; height: 60px; position: relative;">
                    ${[0, 72, 144, 216, 288].map(angle => `
                        <div style="position: absolute; top: 50%; left: 50%; width: 25px; height: 35px; background: linear-gradient(180deg, #a78bfa, #c4b5fd); border-radius: 50% 50% 0 0; transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-15px); opacity: 0.8;"></div>
                    `).join('')}
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 15px; height: 15px; background: #fbbf24; border-radius: 50%;"></div>
                </div>
            </div>
        `;
    }

    // SYNTHWAVE - Neon Sun & Grid
    render_synthwave() {
        // Retro Sun
        this.container.innerHTML += `
            <div style="position: absolute; right: 10%; top: 20%; transform-style: preserve-3d;">
                <div style="width: 120px; height: 120px; border-radius: 50%; 
                    background: linear-gradient(180deg, #ff00ff, #ff7700);
                    position: relative; animation: pulse 3s ease-in-out infinite;
                    box-shadow: 0 0 60px #ff00ff80;">
                    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `
                        <div style="position: absolute; top: 50%; left: 50%; width: 140px; height: 2px; 
                            background: linear-gradient(90deg, transparent, #ff00ff, transparent);
                            transform: translate(-50%, -50%) rotate(${i * 22.5}deg);"></div>
                    `).join('')}
                </div>
            </div>
        `;

        // Grid Floor
        this.container.innerHTML += `
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 300px; 
                perspective: 500px; overflow: hidden; pointer-events: none;">
                <div style="width: 200%; height: 200%; background-image: 
                    linear-gradient(0deg, transparent 24%, rgba(255,0,255,.3) 25%, rgba(255,0,255,.3) 26%, transparent 27%, transparent 74%, rgba(255,0,255,.3) 75%, rgba(255,0,255,.3) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(0,255,255,.3) 25%, rgba(0,255,255,.3) 26%, transparent 27%, transparent 74%, rgba(0,255,255,.3) 75%, rgba(0,255,255,.3) 76%, transparent 77%, transparent);
                    background-size: 50px 50px;
                    transform: rotateX(60deg) translateY(50%);
                    animation: gridScroll 20s linear infinite;">
                </div>
            </div>
        `;
    }

    // SCIFI - Holographic Rings
    render_scifi() {
        [0, 1, 2].forEach((i) => {
            this.container.innerHTML += `
                <div style="position: absolute; left: ${20 + i * 15}%; top: ${25 + i * 12}%; 
                    width: ${100 - i * 15}px; height: ${100 - i * 15}px;
                    border: 2px solid var(--${i === 0 ? 'primary' : i === 1 ? 'secondary' : 'accent'});
                    border-radius: 50%; transform-style: preserve-3d;
                    animation: holoRingRotate${i} ${6 + i * 2}s linear infinite;
                    box-shadow: 0 0 20px var(--${i === 0 ? 'primary' : i === 1 ? 'secondary' : 'accent'})80;">
                </div>
            `;
        });
    }

    // MINIMAL - Simple Geometric Shapes
    render_minimal() {
        const shapes = [
            { type: 'circle', size: 60, left: '15%', top: '30%' },
            { type: 'square', size: 50, right: '20%', top: '40%' },
            { type: 'triangle', size: 55, left: '18%', bottom: '35%' }
        ];

        shapes.forEach((shape, i) => {
            if (shape.type === 'circle') {
                this.container.innerHTML += `
                    <div style="position: absolute; left: ${shape.left}; top: ${shape.top}; 
                        width: ${shape.size}px; height: ${shape.size}px; 
                        border: 2px solid rgba(255,255,255,0.3); border-radius: 50%;
                        animation: minimalFloat ${5 + i}s ease-in-out infinite;">
                    </div>
                `;
            } else if (shape.type === 'square') {
                this.container.innerHTML += `
                    <div style="position: absolute; right: ${shape.right}; top: ${shape.top}; 
                        width: ${shape.size}px; height: ${shape.size}px; 
                        border: 2px solid rgba(255,255,255,0.3);
                        animation: minimalFloat ${5 + i}s ease-in-out infinite; animation-delay: -2s;
                        transform: rotate(45deg);">
                    </div>
                `;
            } else {
                this.container.innerHTML += `
                    <div style="position: absolute; left: ${shape.left}; bottom: ${shape.bottom}; 
                        width: 0; height: 0; 
                        border-left: ${shape.size / 2}px solid transparent;
                        border-right: ${shape.size / 2}px solid transparent;
                        border-bottom: ${shape.size}px solid rgba(255,255,255,0.3);
                        animation: minimalFloat ${5 + i}s ease-in-out infinite; animation-delay: -4s;">
                    </div>
                `;
            }
        });
    }

    // LIQUID GLASS - Fluid Orbs
    render_liquidGlass() {
        // Floating Glass Panels
        this.container.innerHTML += `
            <div style="position: absolute; left: 15%; top: 30%;
                width: 140px; height: 180px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(25px) saturate(180%);
                -webkit-backdrop-filter: blur(25px) saturate(180%);
                border: 1px solid rgba(255, 255, 255, 0.6);
                border-radius: 25px;
                animation: float3d 8s ease-in-out infinite alternate;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 20px 20px rgba(255, 255, 255, 0.4);
                display: flex; align-items: center; justify-content: center; transform: rotate(-10deg);">
                <i class="fab fa-apple" style="font-size: 50px; color: rgba(255, 255, 255, 0.9); text-shadow: 0 4px 15px rgba(0,0,0,0.2);"></i>
            </div>
            
            <div style="position: absolute; right: 18%; bottom: 25%;
                width: 120px; height: 120px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(30px) saturate(200%);
                -webkit-backdrop-filter: blur(30px) saturate(200%);
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: float3d 6s ease-in-out infinite alternate;
                box-shadow: 0 12px 30px rgba(0,0,0,0.2), inset 0 10px 20px rgba(255,255,255,0.6);
                display: flex; align-items: center; justify-content: center;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.9); box-shadow: 0 0 20px rgba(255,255,255,1);"></div>
            </div>
        `;
    }

    // DIAMOND CUT - Sharp Crystals
    render_diamondCut() {
        // Main floating diamond
        this.container.innerHTML += `
            <div style="position: absolute; right: 20%; top: 30%; transform-style: preserve-3d; animation: holoFloat 6s ease-in-out infinite;">
                <div style="width: 100px; height: 100px; position: relative; animation: spin360 8s linear infinite;">
                    <div style="position: absolute; top: -50px; left: 0; width: 0; height: 0; 
                        border-left: 50px solid transparent; border-right: 50px solid transparent; border-bottom: 50px solid rgba(179,255,255,0.4);
                        filter: drop-shadow(0 0 10px rgba(77,255,255,0.5));"></div>
                    <div style="position: absolute; top: 0; left: 0; width: 0; height: 0; 
                        border-left: 50px solid transparent; border-right: 50px solid transparent; border-top: 100px solid rgba(230,255,255,0.3);
                        filter: drop-shadow(0 0 15px rgba(179,255,255,0.5));"></div>
                    <div style="position: absolute; top: -20px; left: 20px; width: 60px; height: 50px; background: linear-gradient(135deg, rgba(255,255,255,0.8), transparent); clip-path: polygon(50% 0%, 100% 100%, 0% 100%); opacity: 0.5;"></div>
                </div>
            </div>
        `;
    }

    // HOLOGRAPHIC - Iridescent Rings
    render_holographic() {
        this.container.innerHTML += `
            <div style="position: absolute; left: 15%; top: 35%; transform-style: preserve-3d; animation: holoFloat 5s ease-in-out infinite;">
                <div style="width: 150px; height: 150px; border-radius: 50%; border: 3px solid transparent;
                    background: linear-gradient(135deg, rgba(255, 126, 179, 0.5), rgba(255, 117, 140, 0.5)) border-box;
                    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: destination-out;
                    mask-composite: exclude;
                    animation: holoRingRotate0 4s linear infinite;
                    box-shadow: 0 0 30px rgba(255, 126, 179, 0.6), inset 0 0 20px rgba(255, 126, 179, 0.4);">
                </div>
                <div style="position: absolute; top: 25px; left: 25px; width: 100px; height: 100px; border-radius: 50%;
                    background: conic-gradient(from 0deg, transparent, rgba(255,126,179,0.8), transparent);
                    animation: spin360 3s linear infinite;">
                </div>
            </div>
        `;
    }
}

// WMO weather-code → emoji mapping (open-meteo codes)
const WMO_ICONS = {
    0: '☀️',  1: '🌤️', 2: '⛅',  3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌦️',
    56: '🌨️', 57: '🌨️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    66: '🌨️', 67: '🌨️',
    71: '🌨️', 73: '🌨️', 75: '🌨️', 77: '🌨️',
    80: '🌦️', 81: '🌧️', 82: '⛈️',
    85: '🌨️', 86: '🌨️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
};

class HomepageApp {
    constructor() {
        this.currentTemplate = this.loadSetting('template') || 'minimal';
        this.userName = this.loadSetting('userName') || 'YOUR NAME';
        this.apiKey = this.loadSetting('apiKey') || '';
        this.aiModel = this.loadSetting('aiModel') || 'openai/gpt-oss-120b';
        this.links = this.loadLinks();
        this.selectedIcon = AVAILABLE_ICONS[0];
        this.selectedColor = AVAILABLE_COLORS[0];

        // Track install date for stats
        if (!localStorage.getItem('homepage_install_date')) {
            localStorage.setItem('homepage_install_date', String(Date.now()));
        }

        this.init();
    }

    init() {
        // Initialize 3D objects first
        this.objects3D = new Enhanced3DObjects();

        // Apply template with 3D objects
        this.applyTemplate(this.currentTemplate);

        this.renderLinks();
        this.saveLinks();
        this.initTime();
        this.initTyping();
        this.initSearch();
        this.initMatrix();
        this.initParticles();
        this.initParallax();
        this.initKeyboardShortcuts();
        this.initEventListeners();
        this.initAIChat();

        // New features
        Wallpaper.init();          // async restore — non-blocking
        // ElementPacks.init() removed
        // Restore subtle-accents class if it was previously enabled
        if (localStorage.getItem('homepage_wp_subtle') === '1') {
            // Delay until Wallpaper.restore() has had a chance to set wp-static
            setTimeout(() => {
                if (document.body.classList.contains('wp-static')) {
                    document.body.classList.add('wp-subtle');
                }
            }, 300);
        }
        this.initWeather();
        this.initWallpaperControls();
        this.initElementPacksUI();
        this.initHeadlineUI();
        this.initImportExport();
        this.initAIProvidersUI();
        this.updateAiModelLabel();
    }

    // Initialize all event listeners
    initEventListeners() {
        // Template button
        const templateBtn = document.getElementById('templateBtn');
        if (templateBtn) {
            templateBtn.addEventListener('click', () => this.openTemplateModal());
        }

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettingsModal());
        }

        // Add link button
        const addLinkBtn = document.getElementById('addLinkBtn');
        if (addLinkBtn) {
            addLinkBtn.addEventListener('click', () => this.openLinkModal());
        }

        // Ask AI button
        const askAiBtn = document.getElementById('askAiBtn');
        if (askAiBtn) {
            askAiBtn.addEventListener('click', () => this.openAIChatModal());
        }

        // Customize button — slide-up panel
        const customizeBtn = document.getElementById('customizeBtn');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => {
                let panel = document.getElementById('customizationPanel');
                if (!panel) {
                    panel = this._buildCustomizationPanel();
                    document.body.appendChild(panel);
                }
                panel.classList.toggle('open');
                customizeBtn.setAttribute('aria-expanded', String(panel.classList.contains('open')));
                if (panel.classList.contains('open')) panel.querySelector('[data-cp-tab="0"]')?.click();
            });
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Click outside modal to close
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });

        ['linkName', 'linkUrl'].forEach(id => document.getElementById(id)?.addEventListener('input', e => e.target.setCustomValidity('')));

        // Form submissions
        const linkForm = document.getElementById('linkForm');
        if (linkForm) {
            linkForm.addEventListener('submit', (e) => this.handleAddLink(e));
        }

        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSaveSettings(e));
        }

        // Drag-and-drop wallpaper — anywhere on the page
        document.addEventListener('dragover', e => {
            e.preventDefault();
            document.body.classList.add('drag-over');
        });
        document.addEventListener('dragleave', e => {
            if (!e.relatedTarget) document.body.classList.remove('drag-over');
        });
        document.addEventListener('drop', async e => {
            e.preventDefault();
            document.body.classList.remove('drag-over');
            const file = e.dataTransfer?.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
            try { await Wallpaper.setFromFile(file); } catch (error) { window.toast?.(error.message, 'error', 5000); return; }
            this._updateWpThumbnail();
            window.toast?.('Wallpaper set by drag & drop!', 'success', 2000);
        });
    }

    // Storage Methods
    loadSetting(key) {
        try {
            return localStorage.getItem(`homepage_${key}`);
        } catch {
            return null;
        }
    }

    saveSetting(key, value) {
        try {
            localStorage.setItem(`homepage_${key}`, value);
        } catch { }
        // Mirror to chrome.storage.local so popup.js can read it
        try {
            if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
                chrome.storage.local.set({ [`homepage_${key}`]: value });
            }
        } catch {}
    }

    loadLinks() {
        try {
            const stored = localStorage.getItem('homepage_links');
            return stored ? JSON.parse(stored) : [...DEFAULT_LINKS];
        } catch {
            return [...DEFAULT_LINKS];
        }
    }

    saveLinks() {
        try {
            const v = JSON.stringify(this.links);
            localStorage.setItem('homepage_links', v);
            if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
                chrome.storage.local.set({ homepage_links: v });
            }
        } catch { }
    }

    // ── Search Engine & History ──────────────────────────────────────────
    initSearch() {
        const input   = document.getElementById('searchInput');
        const btn     = document.getElementById('searchBtn');
        const engines = document.getElementById('searchEngines');
        const histDD  = document.getElementById('searchHistoryDropdown');

        const ENGINES = {
            google:     q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
            bing:       q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
            duckduckgo: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
            youtube:    q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
        };

        let currentEngine = localStorage.getItem('homepage_search_engine') || 'google';

        // Set active engine button
        const setEngine = (e) => {
            currentEngine = e;
            localStorage.setItem('homepage_search_engine', e);
            document.querySelectorAll('.engine-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.engine === e);
            });
        };
        setEngine(currentEngine);

        document.querySelectorAll('.engine-btn').forEach(b => {
            b.addEventListener('click', () => setEngine(b.dataset.engine));
        });

        const doSearch = () => {
            const q = input?.value.trim();
            if (!q) return;
            // Save history
            let hist = [];
            try { hist = JSON.parse(localStorage.getItem('homepage_search_history') || '[]'); } catch {}
            hist = [q, ...hist.filter(h => h !== q)].slice(0, 6);
            try { localStorage.setItem('homepage_search_history', JSON.stringify(hist)); } catch {}
            window.location.href = ENGINES[currentEngine]?.(q) || ENGINES.google(q);
        };

        btn?.addEventListener('click', doSearch);
        input?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

        // Show engines + history on focus
        input?.addEventListener('focus', () => {
            if (engines) engines.style.display = 'flex';
            this._renderSearchHistory();
        });

        input?.addEventListener('input', () => {
            if (input.value.trim()) {
                if (histDD) histDD.style.display = 'none';
            } else {
                this._renderSearchHistory();
            }
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('.search-wrapper') && !e.target.closest('.search-engines')) {
                if (engines) engines.style.display = 'none';
                if (histDD) histDD.style.display = 'none';
            }
        });
    }

    _renderSearchHistory() {
        const histDD = document.getElementById('searchHistoryDropdown');
        if (!histDD) return;
        let hist = [];
        try { hist = JSON.parse(localStorage.getItem('homepage_search_history') || '[]'); } catch {}
        if (!hist.length) { histDD.style.display = 'none'; return; }

        histDD.innerHTML = hist.map((h, i) => `
            <div class="history-item">
                <i class="fas fa-history"></i>
                <span class="history-text" data-query="${this._esc(h)}">${this._esc(h)}</span>
                <button class="history-del" data-idx="${i}" title="Remove">✕</button>
            </div>
        `).join('') + `<div class="history-clear-row"><button id="historyClearAll">Clear all</button></div>`;

        histDD.style.display = 'block';

        histDD.querySelectorAll('.history-text').forEach(el => {
            el.addEventListener('click', () => {
                document.getElementById('searchInput').value = el.dataset.query;
                histDD.style.display = 'none';
            });
        });
        histDD.querySelectorAll('.history-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                let hist = [];
                try { hist = JSON.parse(localStorage.getItem('homepage_search_history') || '[]'); } catch {}
                hist.splice(parseInt(btn.dataset.idx), 1);
                localStorage.setItem('homepage_search_history', JSON.stringify(hist));
                this._renderSearchHistory();
            });
        });
        document.getElementById('historyClearAll')?.addEventListener('click', () => {
            localStorage.removeItem('homepage_search_history');
            histDD.style.display = 'none';
        });
    }

    // Template Methods
    applyTemplate(templateId) {
        const template = TEMPLATES[templateId];
        if (!template) return;

        this.currentTemplate = templateId;
        document.body.dataset.template = templateId;
        this.saveSetting('template', templateId);

        const root = document.documentElement;
        root.style.setProperty('--primary', template.colors.primary);
        root.style.setProperty('--secondary', template.colors.secondary);
        root.style.setProperty('--accent', template.colors.accent);
        root.style.setProperty('--bg', template.colors.bg);
        root.style.setProperty('--bg-secondary', template.colors.bgSecondary);

        document.body.style.background = `linear-gradient(135deg, ${template.colors.bg} 0%, ${template.colors.bgSecondary} 50%, ${template.colors.bg} 100%)`;

        // Update name
        const nameEl = document.getElementById('userName');
        if (nameEl) {
            const displayName = this.userName === 'YOUR NAME' ? 'Welcome' : this.userName;
            nameEl.textContent = displayName;
            nameEl.setAttribute('data-text', displayName);
        }

        // Update roles for typing effect — prefer saved custom lines over template defaults
        const savedLines = this.loadHeadlineLines?.();
        this.roles = (savedLines && savedLines.length) ? savedLines : template.roles;
        this.phraseIndex = 0;
        this.charIndex = 0;

        // Update cube content based on template
        this.updateCubeContent(template);

        // Update floating elements
        this.updateFloatingElements(template);

        // *** CRITICAL FIX: Render 3D objects for this template ***
        if (this.objects3D) {
            this.objects3D.renderForTemplate(templateId);
        }
    }

    updateCubeContent(template) {
        const cubeSymbols = {
            programmer: ['</>', '{...}', '[ ]', '( )', '01', '#!'],
            gamer: ['▶', '◀', '▲', '▼', 'GG', 'HP'],
            anime: ['★', '♥', '心', '力', 'ア', 'ニ'],
            creator: ['✦', '◈', '◉', '✿', '♦', '▣'],
            aiDev: ['AI', 'ML', 'NN', 'DL', '∞', 'θ'],
            cyberpunk: ['⚡', '☢', '⌘', '⎓', '◎', '▦'],
            minimal: ['·', '○', '□', '△', '—', '+'],
            retro: ['♠', '♦', '♥', '♣', '★', '◘'],
            space: ['☆', '◉', '✧', '⊕', '◍', '✦'],
            music: ['♪', '♫', '♬', '◉', '▶', '⸮'],
            crypto: ['₿', 'Ξ', '◈', '⟡', '◇', '⬡'],
            cyberexpert: ['>', '_', '#', '/', '&'],
            nature: ['♡', '☘', '✿', '♠', '◎', '○'],
            synthwave: ['◢', '◣', '▲', '◮', '◭', '◬'],
            scifi: ['⎊', '⌬', '⣿', '⎓', '◎', '⊛'],
            liquidGlass: ['✧', '❍', '⚗', '♒', '○', '◎'],
            diamondCut: ['◈', '⟡', '◇', '⬡', '✦', '▽'],
            holographic: ['❇', '✵', '✱', '✺', '✷', '✧']
        };

        const symbols = cubeSymbols[template.id] || cubeSymbols.programmer;
        const faces = document.querySelectorAll('.cube-face');
        faces.forEach((face, i) => {
            if (symbols[i]) face.textContent = symbols[i];
        });

        const secondarySymbols = {
            programmer: ['JS', 'PY', '++', '=>', '::', '$'],
            gamer: ['XP', 'LV', 'HP', 'MP', 'FPS', 'RPG'],
            anime: ['カ', 'ワ', 'イ', 'イ', '!!', '??'],
            creator: ['PS', 'AI', 'XD', 'FG', 'AE', 'PR'],
            aiDev: ['TF', 'PT', 'CV', 'NLP', 'GAN', 'CNN'],
            cyberpunk: ['2077', 'NET', 'ICE', 'ROM', 'RAM', 'SYS'],
            minimal: ['01', '02', '03', '04', '05', '06'],
            retro: ['1UP', '2P', 'HI', 'SC', 'GO', 'END'],
            space: ['SOL', 'LUN', 'MAR', 'JUP', 'SAT', 'NEP'],
            music: ['BPM', 'HZ', 'DB', 'EQ', 'MIX', 'FX'],
            crypto: ['NFT', 'DEX', 'DAO', 'WEB3', 'GAS', 'APY'],
            cyberexpert: ['SYS', 'ROOT', 'SUDO', 'SSH', 'VPN', 'TOR'],
            nature: ['ZEN', 'OM', '和', '気', '心', '道'],
            synthwave: ['1985', 'VHS', 'FM', 'NEON', 'WAVE', 'RETRO'],
            scifi: ['INIT', 'LOAD', 'SCAN', 'PROC', 'EXEC', 'DONE'],
            liquidGlass: ['H2O', 'AQUA', 'FLOW', 'CRYSTAL', 'CLEAR', 'FLUID'],
            diamondCut: ['GEM', 'EDGE', 'FACET', 'PURE', 'CUT', 'PRISM'],
            holographic: ['HOLO', 'LUM', 'GLOW', 'AURA', 'RAY', 'BEAM']
        };

        const secSymbols = secondarySymbols[template.id] || secondarySymbols.programmer;
        const secFaces = document.querySelectorAll('.cube-face-2');
        secFaces.forEach((face, i) => {
            if (secSymbols[i]) face.textContent = secSymbols[i];
        });
    }

    updateFloatingElements(template) {
        const codeFloats = document.querySelectorAll('.code-float');
        const codeSnippets = {
            programmer: [
                '<span style="color: #ff79c6;">async</span> <span style="color: #8be9fd;">function</span> <span style="color: #50fa7b;">build</span>() { }',
                '<span style="color: #6272a4;">// Dreams → Reality</span>',
                '<span style="color: #ff79c6;">const</span> future = <span style="color: #f1fa8c;">"now"</span>;'
            ],
            gamer: [
                '<span style="color: #ff0055;">player</span>.levelUp();',
                '<span style="color: #00ffff;">// GAME ON!</span>',
                '<span style="color: #ffff00;">score</span> += 1000;'
            ],
            anime: [
                '<span style="color: #ff6b9d;">power</span>.over(9000);',
                '<span style="color: #c44dff;">// 行くぞ！</span>',
                '<span style="color: #00d4ff;">nakama</span>.believe();'
            ],
            creator: [
                '<span style="color: #ff7b00;">design</span>.inspire();',
                '<span style="color: #ff00d4;">// Create magic</span>',
                '<span style="color: #00ff88;">art</span>.express();'
            ],
            aiDev: [
                '<span style="color: #00ffcc;">model</span>.train(data);',
                '<span style="color: #7b00ff;">// AI awakens</span>',
                '<span style="color: #ff0080;">neural</span>.connect();'
            ],
            cyberpunk: [
                '<span style="color: #ff00ff;">system</span>.override();',
                '<span style="color: #00ffff;">// Jack in</span>',
                '<span style="color: #ffff00;">cyber</span>.enhance();'
            ],
            minimal: [
                '<span style="color: #888;">focus</span>();',
                '<span style="color: #666;">// simplify</span>',
                '<span style="color: #aaa;">clean</span>.code();'
            ],
            retro: [
                '<span style="color: #ff0000;">INSERT</span> COIN',
                '<span style="color: #00ff00;">// PRESS START</span>',
                '<span style="color: #ffff00;">HIGH</span>.SCORE++;'
            ],
            space: [
                '<span style="color: #00d4ff;">rocket</span>.launch();',
                '<span style="color: #bf00ff;">// To infinity</span>',
                '<span style="color: #ff6b00;">galaxy</span>.explore();'
            ],
            music: [
                '<span style="color: #ff4d4d;">beat</span>.drop();',
                '<span style="color: #4d4dff;">// Feel rhythm</span>',
                '<span style="color: #4dff4d;">bass</span>.boost();'
            ],
            crypto: [
                '<span style="color: #f7931a;">wallet</span>.connect();',
                '<span style="color: #627eea;">// HODL!</span>',
                '<span style="color: #00ff88;">moon</span>.soon();'
            ],
            cyberexpert: [
                '<span style="color: #00ff00;">root</span>@system:~#',
                '<span style="color: #00aa00;">// Access granted</span>',
                '<span style="color: #005500;">firewall</span>.bypass();'
            ],
            nature: [
                '<span style="color: #4ade80;">mind</span>.calm();',
                '<span style="color: #22d3ee;">// Breathe</span>',
                '<span style="color: #a78bfa;">zen</span>.achieve();'
            ],
            synthwave: [
                '<span style="color: #ff00ff;">neon</span>.glow();',
                '<span style="color: #00ffff;">// Retro vibes</span>',
                '<span style="color: #ff7700;">synth</span>.wave();'
            ],
            scifi: [
                '<span style="color: #00b4d8;">quantum</span>.process();',
                '<span style="color: #90e0ef;">// Initializing</span>',
                '<span style="color: #ff006e;">system</span>.online();'
            ],
            liquidGlass: [
                '<span style="color: #f0f0f5;">ui</span>.blur(20);',
                '<span style="color: #d4d4eb;">// Transparent depth</span>',
                '<span style="color: #a2a2d0;">glass</span>.reflect();'
            ],
            diamondCut: [
                '<span style="color: #e6ffff;">geometry</span>.sharpen();',
                '<span style="color: #b3ffff;">// Premium cuts</span>',
                '<span style="color: #4dffff;">facets</span>.refract();'
            ],
            holographic: [
                '<span style="color: #ff7eb3;">light</span>.bend();',
                '<span style="color: #ff758c;">// Iridescent</span>',
                '<span style="color: #ff7eb3;">hologram</span>.project();'
            ]
        };

        const snippets = codeSnippets[template.id] || codeSnippets.programmer;
        codeFloats.forEach((el, i) => {
            if (snippets[i]) el.innerHTML = snippets[i];
        });
    }

    // Link Methods
    renderLinks() {
        const grid = document.getElementById('linksGrid');
        if (!grid) return;

        grid.innerHTML = this.links.map((link, index) => `
            <a href="${/^https?:\/\//i.test(link.url) ? this._esc(link.url) : '#'}" class="link-card"
               style="--card-color: ${this._esc(link.color)}; --card-glow: ${this._esc(link.color)}40;"
               draggable="true" data-index="${index}">
                <button class="remove-btn" data-index="${index}" aria-label="Remove ${this._esc(link.name)}">
                    <i class="fas fa-times"></i>
                </button>
                <div class="link-icon-wrapper">
                    <i class="${this._esc(link.icon)} link-icon" style="color: ${this._esc(link.color)};"></i>
                </div>
                <span class="link-name">${this._esc(link.name)}</span>
            </a>
        `).join('');

        // Add event listeners to remove buttons
        grid.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removeLink(index);
            });
        });

        const add = document.createElement('button');
        add.type = 'button'; add.className = 'shortcut-add'; add.setAttribute('aria-label', 'Add a shortcut');
        add.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i><span>Add link</span>';
        add.addEventListener('click', () => this.openLinkModal()); grid.appendChild(add);
        this._initLinkDrag(grid);
        document.dispatchEvent(new Event('links-changed'));
    }

    _initLinkDrag(grid) {
        let dragSrc = null;

        grid.querySelectorAll('.link-card[draggable]').forEach(card => {
            card.addEventListener('dragstart', e => {
                dragSrc = card;
                card.classList.add('link-drag-active');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.dataset.index);
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('link-drag-active');
                grid.querySelectorAll('.link-card').forEach(c => c.classList.remove('link-drag-over'));
            });
            card.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (card !== dragSrc) {
                    grid.querySelectorAll('.link-card').forEach(c => c.classList.remove('link-drag-over'));
                    card.classList.add('link-drag-over');
                }
            });
            card.addEventListener('drop', e => {
                e.preventDefault();
                if (!dragSrc || dragSrc === card) return;
                const fromIdx = parseInt(dragSrc.dataset.index);
                const toIdx   = parseInt(card.dataset.index);
                if (isNaN(fromIdx) || isNaN(toIdx)) return;
                const moved = this.links.splice(fromIdx, 1)[0];
                this.links.splice(toIdx, 0, moved);
                this.saveLinks();
                this.renderLinks();
            });
        });
    }

    removeLink(index) {
        if (!Number.isInteger(index) || index < 0 || index >= this.links.length) return;
        this.links.splice(index, 1);
        this.saveLinks();
        this.renderLinks();
    }

    addLink(name, url, icon, color) {
        this.links.push({ name, url, icon, color });
        this.saveLinks();
        this.renderLinks();
    }

    // Modal Methods
    openTemplateModal() {
        const modal = document.getElementById('templateModal');
        if (modal) {
            modal.classList.add('active');
            this.renderTemplateGrid();
        }
    }

    openLinkModal() {
        const modal = document.getElementById('linkModal');
        if (modal) {
            modal.classList.add('active');
            this.initializePickers();
        }
    }

    openSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('settingsName').value = this.userName === 'YOUR NAME' ? '' : this.userName;

            // Render dynamic sections every time the modal opens
            this.renderAIProviders();
            this.renderHeadlineLines();
            this._updateWpThumbnail();

            // Populate wallpaper controls
            const s = Wallpaper.getSettings();
            const blur = s.blur ?? 0;
            const dim  = Math.round((s.dim ?? 0.3) * 100);
            const blend = s.blend || 'normal';
            const blurEl = document.getElementById('wpBlur');
            const dimEl  = document.getElementById('wpDim');
            const blendEl = document.getElementById('wpBlend');
            const parEl   = document.getElementById('wpParallax');
            if (blurEl)  { blurEl.value  = blur;  document.getElementById('blurVal').textContent = `${blur}px`; }
            if (dimEl)   { dimEl.value   = dim;   document.getElementById('dimVal').textContent  = `${dim}%`;  }
            if (blendEl) blendEl.value   = blend;
            if (parEl)   parEl.checked   = localStorage.getItem('homepage_wallpaper_parallax') === '1';
            const subtleEl = document.getElementById('wpSubtle');
            if (subtleEl) subtleEl.checked = localStorage.getItem('homepage_wp_subtle') === '1';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        // Also close customization panel
        document.getElementById('customizationPanel')?.classList.remove('open');
    }

    renderTemplateGrid() {
        const grid = document.getElementById('templateGrid');
        if (!grid) return;

        grid.innerHTML = Object.values(TEMPLATES).map(template => {
            const isActive = this.currentTemplate === template.id && Wallpaper.mode() === 'theme';
            return `
            <div class="template-card ${isActive ? 'active' : ''}"
                 style="--template-color: ${template.colors.primary};"
                 data-template="${template.id}"
                 role="button" tabindex="0"
                 aria-label="${template.name}${isActive ? ' (active)' : ''}">
                ${isActive ? '<div class="template-card-active-badge"><i class="fas fa-check"></i></div>' : ''}
                <div class="template-color-bar" style="background:linear-gradient(135deg,${template.colors.primary},${template.colors.secondary});"></div>
                <div class="template-icon" style="color: ${template.colors.primary};">
                    <i class="${template.icon}"></i>
                </div>
                <div class="template-name">${template.name}</div>
                <div class="template-desc">${template.description}</div>
            </div>`;
        }).join('');

        // Add click + keyboard listeners
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const templateId = card.dataset.template;
                this.selectTemplate(templateId);
            });
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectTemplate(card.dataset.template);
                }
            });
        });
    }

    selectTemplate(templateId) {
        this.applyTemplate(templateId);
        window.toast?.(`Template "${TEMPLATES[templateId]?.name || templateId}" applied.`, 'success', 2000);
        
        // Switch backgrounds without deleting the saved collection
        if (window.Wallpaper) {
            Wallpaper.useTheme();
        }
        
        this.renderTemplateGrid();

        // Refresh particles with new color
        const container = document.getElementById('particles');
        if (container) {
            container.innerHTML = '';
            this.initParticles();
        }

        setTimeout(() => this.closeAllModals(), 300);
    }

    initializePickers() {
        const iconPicker = document.getElementById('iconPicker');
        if (iconPicker) {
            iconPicker.innerHTML = AVAILABLE_ICONS.map(icon => `
                <div class="icon-option ${icon === this.selectedIcon ? 'selected' : ''}" 
                     style="color: ${this.selectedColor};" data-icon="${icon}">
                    <i class="${icon}"></i>
                </div>
            `).join('');

            iconPicker.querySelectorAll('.icon-option').forEach(el => {
                el.addEventListener('click', () => {
                    this.selectedIcon = el.dataset.icon;
                    document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
                    el.classList.add('selected');
                });
            });
        }

        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.innerHTML = AVAILABLE_COLORS.map(color => `
                <div class="color-option ${color === this.selectedColor ? 'selected' : ''}" 
                     style="background: ${color};" data-color="${color}"></div>
            `).join('');

            colorPicker.querySelectorAll('.color-option').forEach(el => {
                el.addEventListener('click', () => {
                    this.selectedColor = el.dataset.color;
                    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                    el.classList.add('selected');
                    document.querySelectorAll('.icon-option').forEach(icon => icon.style.color = this.selectedColor);
                });
            });
        }
    }

    handleAddLink(event) {
        event.preventDefault();
        const nameInput = document.getElementById('linkName');
        const urlInput = document.getElementById('linkUrl');
        const name = nameInput.value.trim();
        const raw = urlInput.value.trim();
        let url;
        try {
            const parsed = new URL(/^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : 'https://' + raw);
            if (!['https:', 'http:'].includes(parsed.protocol) || !parsed.hostname || /\s/.test(raw)) throw new Error('Invalid URL');
            url = parsed.href;
        } catch {
            urlInput.setCustomValidity('Enter a valid website address, such as example.com.');
            urlInput.reportValidity(); return;
        }
        if (!name) { nameInput.setCustomValidity('Give your shortcut a name.'); nameInput.reportValidity(); return; }
        nameInput.setCustomValidity(''); urlInput.setCustomValidity('');
        this.addLink(name, url, this.selectedIcon, this.selectedColor);
        document.getElementById('linkModal').classList.remove('active');
        document.getElementById('linkForm').reset();
        window.toast?.(`Link "${this._esc(name)}" added.`, 'success', 2000);
    }

    handleSaveSettings(event) {
        event.preventDefault();
        const name = document.getElementById('settingsName').value.trim();
        if (!name) return;
        this.updateUserName(name);
        window.toast?.('Name saved.', 'success', 2000);
    }

    // Time
    initTime() {
        const update = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const timeEl = document.getElementById('time');
            const dateEl = document.getElementById('date');

            if (timeEl) timeEl.textContent = `${hours}:${minutes}`;
            if (dateEl) {
                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                dateEl.textContent = now.toLocaleDateString('en-US', options);
            }
        };
        update();
        setInterval(update, 1000);
    }

    // ── Headline lines persistence ─────────────────────────────────────────
    loadHeadlineLines() {
        try { return JSON.parse(localStorage.getItem('homepage_headline_lines') || 'null'); }
        catch { return null; }
    }
    saveHeadlineLines(lines) {
        try { localStorage.setItem('homepage_headline_lines', JSON.stringify(lines)); } catch {}
        document.dispatchEvent(new Event('sizes-changed'));
    }

    // Typing Effect
    initTyping() {
        const custom = this.loadHeadlineLines();
        this.roles = (custom && custom.length) ? custom : (TEMPLATES[this.currentTemplate]?.roles || ['Developer']);
        this.typingEnabled = localStorage.getItem('homepage_headline_typewriter') !== '0';
        this.typingSpeed   = parseInt(localStorage.getItem('homepage_headline_speed') || '80', 10);
        this.phraseIndex   = 0;
        this.charIndex     = 0;
        this.isDeleting    = false;

        const typingEls = document.querySelectorAll('.typing-text');
        if (typingEls.length === 0) return;

        if (!this.typingEnabled) {
            typingEls.forEach(el => el.textContent = this.roles[0] || '');
            return;
        }
        this.typeEffect();
    }

    typeEffect() {
        if (!this.typingEnabled) return;
        const current  = this.roles[this.phraseIndex];
        const typingEls = document.querySelectorAll('.typing-text');
        if (typingEls.length === 0) return;

        if (this.isDeleting) {
            typingEls.forEach(el => el.textContent = current.substring(0, this.charIndex - 1));
            this.charIndex--;
        } else {
            typingEls.forEach(el => el.textContent = current.substring(0, this.charIndex + 1));
            this.charIndex++;
        }

        const spd = this.typingSpeed || 80;
        let typeSpeed = this.isDeleting ? Math.max(15, Math.round(spd * 0.35)) : spd;

        if (!this.isDeleting && this.charIndex === current.length) {
            typeSpeed = 2500;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.roles.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.typeEffect(), typeSpeed);
    }

    // ── Headline UI ────────────────────────────────────────────────────────
    initHeadlineUI() {
        // AI Generate panel toggle
        document.getElementById('aiHeadlineBtn')?.addEventListener('click', () => {
            const p = document.getElementById('aiHeadlinePanel');
            if (!p) return;
            const vis = p.style.display !== 'none';
            p.style.display = vis ? 'none' : 'block';
            if (!vis) document.getElementById('aiHeadlineSeed')?.focus();
        });

        // Speed slider
        const speedSlider = document.getElementById('headlineSpeed');
        const speedVal    = document.getElementById('headlineSpeedVal');
        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                const v = parseInt(speedSlider.value, 10);
                if (speedVal) speedVal.textContent = `${v}ms`;
                this.typingSpeed = v;
                localStorage.setItem('homepage_headline_speed', String(v));
            });
        }

        // Typewriter toggle
        const twChk = document.getElementById('headlineTypewriterOn');
        if (twChk) {
            twChk.addEventListener('change', () => {
                this.typingEnabled = twChk.checked;
                localStorage.setItem('homepage_headline_typewriter', twChk.checked ? '1' : '0');
                document.body.classList.toggle('fx-typewriter-off', !twChk.checked);
                if (twChk.checked) {
                    this.charIndex = 0; this.isDeleting = false;
                    this.typeEffect();
                } else {
                    const els = document.querySelectorAll('.typing-text');
                    els.forEach(el => el.textContent = this.roles[0] || '');
                }
            });
        }

        // Add line
        const addBtn  = document.getElementById('addHeadlineLineBtn');
        const addInp  = document.getElementById('newHeadlineLine');
        const doAdd = () => {
            const val = addInp?.value.trim();
            if (!val) return;
            const lines = [...this.roles, val];
            this.roles = lines;
            this.saveHeadlineLines(lines);
            if (addInp) addInp.value = '';
            this.renderHeadlineLines();
        };
        addBtn?.addEventListener('click', doAdd);
        addInp?.addEventListener('keypress', e => { if (e.key === 'Enter') doAdd(); });

        // AI generate headlines
        document.getElementById('generateHeadlineBtn')?.addEventListener('click', () => this._generateAIHeadlines());
        document.getElementById('aiHeadlineSeed')?.addEventListener('keypress', e => {
            if (e.key === 'Enter') this._generateAIHeadlines();
        });
    }

    renderHeadlineLines() {
        const list = document.getElementById('headlineLinesList');
        if (!list) return;

        // Restore controls to current state
        const twChk = document.getElementById('headlineTypewriterOn');
        if (twChk) twChk.checked = this.typingEnabled !== false;
        const spd = document.getElementById('headlineSpeed');
        if (spd) { spd.value = this.typingSpeed || 80; }
        const spdV = document.getElementById('headlineSpeedVal');
        if (spdV) spdV.textContent = `${this.typingSpeed || 80}ms`;

        if (!this.roles.length) {
            list.innerHTML = '<p style="color:rgba(255,255,255,0.25);font-size:0.78rem;font-family:Fira Code,monospace;padding:6px 0;">No lines — add one below.</p>';
            return;
        }

        list.innerHTML = this.roles.map((line, i) => `
            <div class="headline-line-item">
                <span class="headline-line-text">${this._esc(line)}</span>
                <div class="headline-line-btns">
                    <button class="btn btn-icon btn-secondary"
                            data-hl-up="${i}" title="Move up"
                            ${i === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-up"></i></button>
                    <button class="btn btn-icon btn-secondary"
                            data-hl-down="${i}" title="Move down"
                            ${i === this.roles.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-down"></i></button>
                    <button class="btn btn-icon btn-secondary btn-icon-danger"
                            data-hl-del="${i}" title="Remove">
                        <i class="fas fa-times"></i></button>
                </div>
            </div>`).join('');

        // Events
        list.querySelectorAll('[data-hl-up]').forEach(b => b.addEventListener('click', () => {
            const i = parseInt(b.dataset.hlUp, 10);
            if (i === 0) return;
            [this.roles[i - 1], this.roles[i]] = [this.roles[i], this.roles[i - 1]];
            this.saveHeadlineLines(this.roles);
            this.renderHeadlineLines();
        }));
        list.querySelectorAll('[data-hl-down]').forEach(b => b.addEventListener('click', () => {
            const i = parseInt(b.dataset.hlDown, 10);
            if (i >= this.roles.length - 1) return;
            [this.roles[i], this.roles[i + 1]] = [this.roles[i + 1], this.roles[i]];
            this.saveHeadlineLines(this.roles);
            this.renderHeadlineLines();
        }));
        list.querySelectorAll('[data-hl-del]').forEach(b => b.addEventListener('click', () => {
            const i = parseInt(b.dataset.hlDel, 10);
            this.roles.splice(i, 1);
            if (!this.roles.length) {
                this.roles = TEMPLATES[this.currentTemplate]?.roles || ['Developer'];
                this.saveHeadlineLines(null); // null = use template default
                localStorage.removeItem('homepage_headline_lines');
            } else {
                this.saveHeadlineLines(this.roles);
            }
            this.phraseIndex = Math.min(this.phraseIndex, this.roles.length - 1);
            this.renderHeadlineLines();
        }));
    }

    async _generateAIHeadlines() {
        const seed     = document.getElementById('aiHeadlineSeed')?.value.trim() || '';
        const statusEl = document.getElementById('aiHeadlineStatus');
        const resultsEl = document.getElementById('aiHeadlineResults');
        const btn      = document.getElementById('generateHeadlineBtn');

        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…'; btn.disabled = true; }
        if (statusEl) { statusEl.textContent = ''; statusEl.className = 'snippet-note'; }
        if (resultsEl) resultsEl.style.display = 'none';

        try {
            const ctx = [seed, this.currentTemplate].filter(Boolean).join(', ');
            const messages = [
                { role: 'system', content: 'Generate short punchy browser-homepage headline phrases. Return ONLY the phrases, one per line, no numbering, no quotes, no markdown, no punctuation at end of lines.' },
                { role: 'user',   content: `Generate 7 short (2–5 word) punchy headline phrases for a ${ctx || 'general'} theme. Plain text only.` }
            ];
            const { response } = await AIProviders.aiComplete(messages, { stream: false, maxTokens: 180 });
            const data = await response.json();
            const raw  = data.choices?.[0]?.message?.content?.trim() || '';
            const lines = raw.split('\n')
                .map(l => l.replace(/^[-•*\d.)]+\s*/, '').replace(/["'`]/g, '').trim())
                .filter(l => l.length > 0 && l.length < 55)
                .slice(0, 8);

            if (!lines.length) throw new Error('No lines returned');

            // Render chips
            if (resultsEl) {
                resultsEl.style.display = 'block';
                resultsEl.innerHTML = lines.map((l, i) => `
                    <span class="ai-headline-chip" data-line="${this._esc(l)}" data-idx="${i}">
                        <i class="fas fa-plus" style="font-size:0.65rem;"></i> ${this._esc(l)}
                    </span>`).join('');

                resultsEl.querySelectorAll('.ai-headline-chip').forEach(chip => {
                    chip.addEventListener('click', () => {
                        if (chip.classList.contains('added')) return;
                        const line = chip.dataset.line;
                        this.roles.push(line);
                        this.saveHeadlineLines(this.roles);
                        this.renderHeadlineLines();
                        chip.classList.add('added');
                        chip.innerHTML = `<i class="fas fa-check" style="font-size:0.65rem;"></i> ${this._esc(line)}`;
                    });
                });
            }

            if (statusEl) { statusEl.textContent = 'Click a phrase to add it to your headline lines.'; statusEl.className = 'snippet-note ok'; }
        } catch (err) {
            if (statusEl) { statusEl.textContent = err.message || 'Generation failed.'; statusEl.className = 'snippet-note err'; }
        } finally {
            if (btn) { btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate'; btn.disabled = false; }
        }
    }

    // ========== AI CHAT ==========
    openAIChatModal() {
        if (window.ExtensionService && !ExtensionService.enabled('aiEnabled')) { window.toast?.('AI tools are temporarily unavailable.', 'info'); return; }
        const modal = document.getElementById('aiChatModal');
        if (modal) {
            modal.classList.add('active');
            setTimeout(() => document.getElementById('aiChatInput')?.focus(), 100);
        }
    }

    parseMarkdown(text) {
        // Escape HTML first
        text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Code blocks (``` ... ```) — protect from other transforms
        const codeBlocks = [];
        text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
            const placeholder = `\x00CODE${codeBlocks.length}\x00`;
            codeBlocks.push(`<pre class="ai-code-block"><code>${code.trim()}</code></pre>`);
            return placeholder;
        });

        // Inline code (`code`)
        const inlineCodes = [];
        text = text.replace(/`([^`]+)`/g, (_, code) => {
            const placeholder = `\x00INLINE${inlineCodes.length}\x00`;
            inlineCodes.push(`<code class="ai-inline-code">${code}</code>`);
            return placeholder;
        });

        // === TABLES === detect blocks of lines all containing |
        text = text.replace(/((?:^[ \t]*\|.+\|[ \t]*\n?)+)/gm, (tableBlock) => {
            const lines = tableBlock.trim().split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length < 2) return tableBlock;

            // Check if line 1 is a separator (|---|---|)
            const isSeparator = (line) => /^\|[\s\|\-:]+\|$/.test(line);
            if (!isSeparator(lines[1])) return tableBlock;

            const parseRow = (line) =>
                line.replace(/^\||\|$/g, '').split('|').map(c => c.trim());

            const headers = parseRow(lines[0]);
            const bodyRows = lines.slice(2); // skip separator

            const thead = `<thead><tr>${headers.map(h =>
                `<th class="ai-th">${h}</th>`).join('')}</tr></thead>`;

            const tbody = bodyRows.map(row => {
                const cells = parseRow(row);
                return `<tr>${cells.map(c => `<td class="ai-td">${c}</td>`).join('')}</tr>`;
            }).join('');

            return `<div class="ai-table-wrap"><table class="ai-table">${thead}<tbody>${tbody}</tbody></table></div>`;
        });

        // Bold+Italic (***text***)
        text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

        // Bold (**text** or __text__)
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic (*text* or _text_)
        text = text.replace(/\*([^\s*][^*]*)\*/g, '<em>$1</em>');
        text = text.replace(/_([^\s_][^_]*)_/g, '<em>$1</em>');

        // Horizontal rule ---
        text = text.replace(/^-{3,}$/gm, '<hr class="ai-hr">');

        // Bullet list items (- or *)
        text = text.replace(/^[\-\*]\s+(.+)/gm, '<li class="ai-li">$1</li>');
        text = text.replace(/((<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="ai-ul">$1</ul>');

        // Numbered list items
        text = text.replace(/^\d+\.\s+(.+)/gm, '<li class="ai-li ai-oli">$1</li>');

        // Headings
        text = text.replace(/^###\s+(.+)/gm, '<h4 class="ai-h">$1</h4>');
        text = text.replace(/^##\s+(.+)/gm, '<h3 class="ai-h">$1</h3>');
        text = text.replace(/^#\s+(.+)/gm, '<h2 class="ai-h">$1</h2>');

        // Restore code placeholders before line-break conversion
        codeBlocks.forEach((block, i) => {
            text = text.replace(`\x00CODE${i}\x00`, block);
        });
        inlineCodes.forEach((block, i) => {
            text = text.replace(`\x00INLINE${i}\x00`, block);
        });

        // Line breaks (double newline = paragraph, single = <br>)
        text = text.replace(/\n\n/g, '</p><p class="ai-p">');
        text = text.replace(/\n/g, '<br>');
        text = `<p class="ai-p">${text}</p>`;

        return text;
    }

    initAIChat() {
        this.chatHistory = [];

        this.updateAiModelLabel();

        const sendBtn = document.getElementById('aiChatSend');
        const inputEl = document.getElementById('aiChatInput');
        const clearBtn = document.getElementById('aiChatClear');

        const send = () => {
            const msg = inputEl?.value.trim();
            if (msg) {
                inputEl.value = '';
                inputEl.style.height = 'auto';
                this.sendAIChat(msg);
            }
        };

        if (sendBtn) sendBtn.addEventListener('click', send);
        if (inputEl) {
            // Auto-grow textarea
            inputEl.addEventListener('input', () => {
                inputEl.style.height = 'auto';
                inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
            });
            // Enter = send, Shift+Enter = newline
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                }
            });
        }

        // Clear Chat History
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.chatHistory = [];
                const container = document.getElementById('aiChatMessages');
                if (container) {
                    container.innerHTML = `
                        <div class="ai-chat-msg assistant">
                            <div class="ai-msg-avatar"><i class="fas fa-robot"></i></div>
                            <div class="ai-chat-bubble">Chat cleared. Ask me anything!</div>
                        </div>
                    `;
                }
                window.toast?.('Chat history cleared.', 'info');
            });
        }
    }

    appendChatMsg(role, rawText, isStreaming = false) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return null;

        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-chat-msg ${role}`;

        if (role === 'assistant') {
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'ai-msg-avatar';
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';

            const bubble = document.createElement('div');
            bubble.className = 'ai-chat-bubble';
            // For streaming placeholders (spinner), don't parse markdown
            if (rawText.includes('fa-spin')) {
                bubble.innerHTML = rawText;
            } else {
                bubble.innerHTML = this.parseMarkdown(rawText);
            }

            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(bubble);
        } else {
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'ai-msg-avatar user-avatar';
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';

            const bubble = document.createElement('div');
            bubble.className = 'ai-chat-bubble user-bubble';
            bubble.textContent = rawText;

            msgDiv.appendChild(bubble);
            msgDiv.appendChild(avatarDiv);
        }

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;

        // Return the bubble element itself for streaming updates
        return msgDiv.querySelector('.ai-chat-bubble');
    }

    updateAiModelLabel() {
        const label = document.getElementById('aiModelLabel');
        if (!label) return;
        AIProviders.getAll().then(providers => {
            const active = providers.filter(p => p.enabled && p.status !== 'failing');
            if (!active.length) {
                label.textContent = 'No providers — add a key in Settings';
            } else if (active.length === 1) {
                label.textContent = active[0].model;
            } else {
                label.textContent = `${active[0].model} +${active.length - 1} more`;
            }
        }).catch(() => {});
    }

    async searchWeb(query) {
        try {
            // Fast Instant Answer API
            const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
            const ddgData = await ddgRes.json();

            if (ddgData.AbstractText) {
                return `DuckDuckGo Knowledge Info:\n${ddgData.AbstractText}`;
            }

            // Fallback robust Wikipedia full-text Search across origin
            const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`);
            const wikiData = await wikiRes.json();

            if (wikiData.query && wikiData.query.search && wikiData.query.search.length > 0) {
                const topResults = wikiData.query.search.slice(0, 3).map(s => {
                    const cleanSnippet = s.snippet.replace(/<[^>]+>/g, '');
                    return `Title: ${s.title}\nInfo: ${cleanSnippet}`;
                }).join('\n\n');
                return `Wikipedia Search Results:\n${topResults}`;
            }

            return "No specific web search results found. Answer from your own knowledge.";
        } catch (e) {
            console.error("Web Search Error:", e);
            return "Web search failed. Answer from your own knowledge.";
        }
    }

    async sendAIChat(userMessage) {
        this.chatHistory.push({ role: 'user', content: userMessage });
        this.appendChatMsg('user', userMessage);

        const searchToggle = document.getElementById('aiWebSearchToggle');
        const useWebSearch = searchToggle && searchToggle.checked;

        let searchContext = "";
        let typingBubble;

        if (useWebSearch) {
            typingBubble = this.appendChatMsg('assistant', '<i class="fas fa-globe fa-spin" style="color:var(--secondary);margin-right:6px;"></i> Searching the web...');
            searchContext = await this.searchWeb(userMessage);
            typingBubble.innerHTML = '<i class="fas fa-spinner fa-spin" style="color:var(--primary);margin-right:6px;"></i> Reading results and thinking...';
        } else {
            typingBubble = this.appendChatMsg('assistant', '<i class="fas fa-spinner fa-spin" style="color:var(--primary);margin-right:6px;"></i> Thinking...');
        }

        try {
            // Construct payload with a capped history to prevent oversized requests
            const historyLimit = 8;
            const maxContentChars = 2000;
            const trimmedHistory = this.chatHistory.slice(-historyLimit).map(msg => ({
                role: msg.role,
                content: msg.content.length > maxContentChars
                    ? msg.content.slice(0, maxContentChars) + '...'
                    : msg.content
            }));

            const messagesPayload = [
                { role: 'system', content: 'You are a helpful, concise AI assistant embedded in a 3D browser homepage extension.' },
                ...trimmedHistory
            ];

            if (useWebSearch && searchContext) {
                const maxSearchChars = 2000;
                const safeSearchContext = searchContext.length > maxSearchChars
                    ? searchContext.slice(0, maxSearchChars) + '...'
                    : searchContext;
                messagesPayload.splice(messagesPayload.length - 1, 0, {
                    role: 'system',
                    content: `Web Search Context for the user's latest query:\n${safeSearchContext}\nUse this information to answer the latest question if relevant.`
                });
            }

            // Route through the failover engine — picks the best available provider
            const { response } = await AIProviders.aiComplete(messagesPayload, {
                stream: true, temperature: 1, maxTokens: 1024
            });
            this.updateAiModelLabel();

            // Stream the response - show raw text during streaming, then format after done
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (typingBubble) typingBubble.innerHTML = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(data);
                            const delta = parsed.choices?.[0]?.delta?.content || '';
                            fullText += delta;
                            // During streaming, show as plain text for performance
                            if (typingBubble) typingBubble.textContent = fullText;
                            const container = document.getElementById('aiChatMessages');
                            if (container) container.scrollTop = container.scrollHeight;
                        } catch (e) { /* skip unparseable lines */ }
                    }
                }
            }

            // After streaming complete, render markdown properly
            if (typingBubble) typingBubble.innerHTML = this.parseMarkdown(fullText);
            this.chatHistory.push({ role: 'assistant', content: fullText });

            const container = document.getElementById('aiChatMessages');
            if (container) container.scrollTop = container.scrollHeight;

        } catch (error) {
            if (typingBubble) typingBubble.innerHTML = `<span style="color:#ff6b6b;"><i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>Error: ${error.message}</span>`;
        }
    }

    // ========== UI WIRING ==========

    // Wire the subtle-accents toggle.
    initElementPacksUI() {
        // Subtle accents toggle
        const subtleChk = document.getElementById('wpSubtle');
        if (subtleChk) {
            subtleChk.checked = localStorage.getItem('homepage_wp_subtle') === '1';
            subtleChk.addEventListener('change', () => {
                const on = subtleChk.checked;
                localStorage.setItem('homepage_wp_subtle', on ? '1' : '0');
                document.body.classList.toggle('wp-subtle', on);
            });
            // Restore on startup if static wallpaper is already set
            if (subtleChk.checked && document.body.classList.contains('wp-static')) {
                document.body.classList.add('wp-subtle');
            }
        }
    }



    enableDeleteMode() {
        this.deleteMode = true;
        document.body.classList.add('delete-mode-active');

        let existingNotice = document.getElementById('deleteModeNotice');
        if (!existingNotice) {
            existingNotice = document.createElement('div');
            existingNotice.id = 'deleteModeNotice';
            existingNotice.className = 'delete-mode-notice';
            existingNotice.innerHTML = `<i class="fas fa-trash-alt"></i> Delete Mode Active: Double-click or hover-click any floating object to remove it. <button id="exitDeleteMode" style="margin-left:10px; padding: 4px 8px; background:var(--primary); color:#000; border:none; border-radius:4px; font-family:inherit; cursor:pointer;">Exit</button>`;
            document.body.appendChild(existingNotice);

            document.getElementById('exitDeleteMode').addEventListener('click', () => {
                this.deleteMode = false;
                document.body.classList.remove('delete-mode-active');
                existingNotice.style.display = 'none';
            });
        }
        existingNotice.style.display = 'flex';

        // Find all interactable objects and attach delete handlers if they don't have them
        const interactables = document.querySelectorAll('.floating-element, .code-float, .orbit-container, .interactive-shape');
        interactables.forEach(el => {
            if (!el.dataset.deleteBound) {
                el.dataset.deleteBound = "true";

                // Add visual delete button
                const delBtn = document.createElement('div');
                delBtn.className = 'obj-delete-btn';
                delBtn.innerHTML = '<i class="fas fa-times"></i>';

                // Position relative if not already absolute to attach btn properly
                if (window.getComputedStyle(el).position === 'static') {
                    el.style.position = 'relative';
                }
                el.appendChild(delBtn);

                // Event Listeners for removal
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.deleteMode) el.remove();
                });

                el.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    if (this.deleteMode) el.remove();
                });
            }
        });
    }

    // Matrix Rain
    initMatrix() {
        const canvas = document.getElementById('matrixCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const chars = 'アイウエオカキクケコサシスセソ0123456789<>/{}[]();=+-*&^%$#@!';
        const charArray = chars.split('');
        const fontSize = 14;
        let columns = Math.floor(canvas.width / fontSize);
        let drops = Array(columns).fill(1);

        window.addEventListener('resize', () => {
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(1);
        });

        const template = TEMPLATES[this.currentTemplate];
        const color = template?.colors.primary || '#00ff88';

        let _lastMatrix = 0;
        const draw = (ts) => {
            requestAnimationFrame(draw);
            if (document.hidden || document.body.classList.contains('fx-matrix-off') || document.body.classList.contains('wp-static') || document.body.classList.contains('wp-video')) return;
            if (ts - _lastMatrix < 50) return;
            _lastMatrix = ts;
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;
            ctx.font = `${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        requestAnimationFrame(draw);
    }

    // Particles
    initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const template = TEMPLATES[this.currentTemplate];
        const color = template?.colors.primary || '#00ff88';

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particle.style.background = color;
            particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${color}`;
            particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(particle);
        }

        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                25% { transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(1.5); opacity: 0.8; }
                50% { transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(0.8); opacity: 0.5; }
                75% { transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(1.2); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }

    // Parallax
    initParallax() {
        let _lastMouse = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - _lastMouse < 16) return;
            _lastMouse = now;

            const x = (e.clientX / window.innerWidth - 0.5) * 25;
            const y = (e.clientY / window.innerHeight - 0.5) * 25;

            document.querySelectorAll('.code-float').forEach((el, i) => {
                el.style.transform = `translate(${x * (i + 1) * 0.25}px, ${y * (i + 1) * 0.25}px)`;
            });

            const cube = document.querySelector('.code-cube-container');
            if (cube) {
                cube.style.transform = `translateY(-50%) translate(${x * 0.4}px, ${y * 0.4}px)`;
            }
        });
    }

    // Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable);

            const dialogOpen = document.querySelector('.modal-overlay.active, #widgetSettingsPop, #feedbackOverlay.open');
            if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && !isTyping && !dialogOpen) {
                e.preventDefault();
                const search = document.querySelector('#widgetCanvas .wb-search-input') || document.getElementById('searchInput');
                search?.focus();
                return;
            }
            if (e.key === 'Escape') {
                this.closeAllModals();
                return;
            }
            if (isTyping || dialogOpen || e.ctrlKey || e.metaKey || e.altKey) return;

            if (e.key === 'T' || e.key === 't') { this.openTemplateModal(); return; }
            if (e.key === 'S' || e.key === 's') { this.openSettingsModal(); return; }
            if (e.key === 'A' || e.key === 'a') { this.openAIChatModal(); return; }
            if (e.key === 'C' || e.key === 'c') {
                document.getElementById('customizeBtn')?.click();
                return;
            }
            if (e.key === '?') {
                const m = document.getElementById('shortcutsModal');
                if (m) m.classList.toggle('active');
                return;
            }
            if (e.key === 'F' || e.key === 'f') {
                window.openExtensionReviews?.();
                return;
            }
        });
    }

    // Update User Name
    updateUserName(name) {
        this.userName = name;
        this.saveSetting('userName', name);
        const nameEl = document.getElementById('userName');
        if (nameEl) {
            nameEl.textContent = name;
            nameEl.setAttribute('data-text', name);
        }
        this.initWeather();
        document.dispatchEvent(new Event('name-changed'));
    }

    // ── Weather + greeting ───────────────────────────────────────────────
    initWeather() {
        // Restore saved unit preference (default °C)
        this._tempUnit = localStorage.getItem('homepage_temp_unit') || 'C';

        this.refreshGreeting();
        // Try cache first (30-min TTL)
        if (!window.WeatherAccess.enabled()) { this._showGeoRetry(); return; }
        try {
            const cached = JSON.parse(localStorage.getItem('homepage_weather_cache') || 'null');
            if (cached && (Date.now() - cached.ts) < 30 * 60 * 1000) {
                this.refreshGreeting(cached.tempC, cached.icon);
                return;
            }
        } catch {}

        window.WeatherAccess.position(
            async pos => {
                try {
                    const { latitude: lat, longitude: lon } = pos.coords;
                    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto`;
                    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
                    if (!res.ok) throw new Error('Weather unavailable');
                    const d   = await res.json();
                    if (!window.WeatherAccess.enabled()) return;
                    const tempC = Math.round(d.current.temperature_2m);
                    const icon = WMO_ICONS[d.current.weather_code] || '🌡️';
                    try { localStorage.setItem('homepage_weather_cache', JSON.stringify({ tempC, icon, ts: Date.now() })); } catch {}
                    this.refreshGreeting(tempC, icon);
                } catch { this._showGeoRetry(); }
            },
            () => this._showGeoRetry()
        );
    }

    _toDisplayTemp(tempC) {
        if (this._tempUnit === 'F') return `${Math.round(tempC * 9 / 5 + 32)}°F`;
        return `${tempC}°C`;
    }

    _showGeoRetry() {
        const el = document.getElementById('weatherGreeting');
        if (!el) return;
        this.refreshGreeting();
        el.insertAdjacentHTML('beforeend', '<button type="button" class="geo-retry-btn" id="geoRetryBtn" title="Choose a city for an Open-Meteo forecast">Weather</button>');
        el.style.opacity = '1';
        document.getElementById('geoRetryBtn')?.addEventListener('click', () => {
            localStorage.removeItem('homepage_weather_cache');
            window.WeatherAccess.enable();
        });
    }

    refreshGreeting(tempC, icon) {
        const el = document.getElementById('weatherGreeting');
        if (!el) return;
        const h      = new Date().getHours();
        const period = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
        const name   = this.userName && this.userName !== 'YOUR NAME' ? `, ${this.userName}` : '';
        let html = this._esc(`Good ${period}${name}`);
        if (tempC !== undefined && icon !== undefined) {
            this._lastTempC = tempC;
            this._lastTempIcon = icon;
            const display = this._toDisplayTemp(tempC);
            html += `&ensp;<span class="weather-badge" id="weatherBadge" title="Click to toggle °C / °F" style="cursor:pointer;">${icon} ${display}</span>`;
            html += '<a class="weather-credit" href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>';
        }
        el.innerHTML    = html;
        el.style.opacity = '1';

        // Toggle °C/°F on click
        const badge = document.getElementById('weatherBadge');
        if (badge) {
            badge.addEventListener('click', () => {
                this._tempUnit = this._tempUnit === 'C' ? 'F' : 'C';
                localStorage.setItem('homepage_temp_unit', this._tempUnit);
                const newDisplay = this._toDisplayTemp(this._lastTempC);
                badge.textContent = `${this._lastTempIcon} ${newDisplay}`;
                window.toast?.(`Switched to °${this._tempUnit}`, 'info', 1500);
            });
        }
    }

    // ── Wallpaper controls ───────────────────────────────────────────────
    initWallpaperControls() {
        const picker     = document.getElementById('wallpaperFilePicker');
        const pickerBtn  = document.getElementById('wallpaperPickerBtn');
        const clearBtn   = document.getElementById('wallpaperClearBtn');
        const blurSlider = document.getElementById('wpBlur');
        const dimSlider  = document.getElementById('wpDim');
        const blendSel   = document.getElementById('wpBlend');
        const parChk     = document.getElementById('wpParallax');
        const applyBtn   = document.getElementById('wpApplyTheme');

        if (pickerBtn && picker) {
            pickerBtn.addEventListener('click', () => picker.click());
            picker.addEventListener('change', async e => {
                const file = e.target.files[0];
                if (!file) return;
                try { await Wallpaper.setFromFile(file); } catch (error) { picker.value = ''; window.toast?.(error.message, 'error', 5000); return; }
                this._updateWpThumbnail();
                picker.value = '';
                window.toast?.('Wallpaper set!', 'success', 2000);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                await Wallpaper.useTheme();
                this._updateWpThumbnail();
                window.toast?.('Built-in theme restored. Your wallpapers are still saved.', 'info', 2000);
            });
        }

        const readSliders = () => ({
            blur:  parseInt(blurSlider?.value ?? 0),
            dim:   parseInt(dimSlider?.value  ?? 30) / 100,
            blend: blendSel?.value || 'normal'
        });

        if (blurSlider) {
            blurSlider.addEventListener('input', () => {
                const el = document.getElementById('blurVal');
                if (el) el.textContent = `${blurSlider.value}px`;
                Wallpaper.applySettings(readSliders());
            });
        }

        if (dimSlider) {
            dimSlider.addEventListener('input', () => {
                const el = document.getElementById('dimVal');
                if (el) el.textContent = `${dimSlider.value}%`;
                Wallpaper.applySettings(readSliders());
            });
        }

        if (blendSel) {
            blendSel.addEventListener('change', () => Wallpaper.applySettings(readSliders()));
        }

        if (parChk) {
            parChk.addEventListener('change', () => Wallpaper.enableParallax(parChk.checked));
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', async () => {
                const original = applyBtn.innerHTML;
                applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting...';
                applyBtn.disabled  = true;
                const colors = await Wallpaper.extractPalette();
                applyBtn.disabled  = false;
                if (!colors) {
                    applyBtn.innerHTML = '⚠ No image set or video not supported';
                    setTimeout(() => { applyBtn.innerHTML = original; }, 2500);
                    return;
                }
                Wallpaper.applyPaletteToTheme(colors);
                applyBtn.innerHTML = '<i class="fas fa-check"></i> Colors applied!';
                setTimeout(() => { applyBtn.innerHTML = original; }, 2000);
            });
        }
    }

    // ── Import / Export ──────────────────────────────────────────────────
    initImportExport() {
        const exportBtn     = document.getElementById('exportSettingsBtn');
        const importBtn     = document.getElementById('importSettingsBtn');
        const importPicker  = document.getElementById('importFilePicker');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSettings());
        }
        if (importBtn && importPicker) {
            importBtn.addEventListener('click', () => importPicker.click());
            importPicker.addEventListener('change', async e => {
                const file = e.target.files[0];
                if (!file) return;
                await this.importSettings(file);
                importPicker.value = '';
            });
        }
    }

    async exportSettings() {
        const data = {};
        const includeKeys = document.getElementById('exportIncludeKeys')?.checked;
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k === 'homepage_ai_providers' && !includeKeys) continue;
            if (k && k.startsWith('homepage_')) data[k] = localStorage.getItem(k);
        }

        const includeWallpaper = document.getElementById('exportIncludeWallpaper')?.checked;
        if (includeWallpaper) {
            try {
                const blob = await Wallpaper.getBlob();
                if (blob) {
                    data['__wallpaper_blob__'] = await this._blobToBase64(blob);
                    data['__wallpaper_type__'] = blob.type;
                }
            } catch {}
        }

        const json = JSON.stringify(data, null, 2);
        const url  = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
        Object.assign(document.createElement('a'), { href: url, download: '3d-parallax-settings.json' }).click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        window.toast?.('Settings exported!', 'success', 2000);
    }

    async importSettings(file) {
        let data;
        try { data = JSON.parse(await file.text()); }
        catch { window.toast?.('Could not parse settings file — invalid JSON.', 'error'); return; }

        if (!data || typeof data !== 'object' || Array.isArray(data) || !Object.keys(data).some(k => k.startsWith('homepage_'))) {
            window.toast?.("This file doesn't look like a 3D Homepage settings export.", 'error');
            return;
        }

        if (data['__wallpaper_blob__'] && data['__wallpaper_type__']) {
            try {
                const blob = this._base64ToBlob(data['__wallpaper_blob__'], data['__wallpaper_type__']);
                await Wallpaper.setFromFile(blob);
            } catch (error) { window.toast?.('Backup could not be restored: ' + error.message, 'error', 6000); return; }
        }
        const localOnly = ['homepage_wallpaper_active_id', 'homepage_background_mode', 'homepage_wallpaper_remote_url', 'homepage_service_config'];
        for (const [k, v] of Object.entries(data)) {
            if (k.startsWith('homepage_') && typeof v === 'string' && !localOnly.includes(k)) {
                localStorage.setItem(k, v);
                if (typeof chrome !== 'undefined' && chrome?.storage?.local) chrome.storage.local.set({ [k]: v });
            }
        }

        if (typeof data.homepage_ai_providers === 'string') {
            try {
                const providers = JSON.parse(data.homepage_ai_providers);
                if (Array.isArray(providers)) {
                    for (const provider of await AIProviders.getAll()) await AIProviders.remove(provider.id);
                    for (const provider of providers) if (provider && typeof provider.apiKey === 'string') await AIProviders.add(provider);
                }
            } catch { window.toast?.('API keys could not be restored.', 'error'); }
        }

        window.toast?.('Settings imported — reloading…', 'success', 2000);
        setTimeout(() => location.reload(), 600);
    }

    _blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload  = () => resolve(r.result.split(',')[1]);
            r.onerror = reject;
            r.readAsDataURL(blob);
        });
    }

    _base64ToBlob(b64, type) {
        const bytes = atob(b64);
        const arr   = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
        return new Blob([arr], { type });
    }

    // ── AI Providers UI ──────────────────────────────────────────────────
    initAIProvidersUI() {
        // Re-render whenever the data changes (e.g. after test / delete)
        document.addEventListener('ai-providers-updated', () => {
            if (document.getElementById('settingsModal')?.classList.contains('active')) {
                this.renderAIProviders();
            }
            this.updateAiModelLabel();
        });

        // ── Snippet panel toggle ──────────────────────────────────────────
        document.getElementById('showSnippetBtn')?.addEventListener('click', () => {
            const p = document.getElementById('snippetPanel');
            if (!p) return;
            const vis = p.style.display !== 'none';
            p.style.display = vis ? 'none' : 'block';
            document.getElementById('addProvForm').style.display = 'none'; // close other panel
            if (!vis) document.getElementById('snippetInput')?.focus();
        });

        // ── Parse snippet ─────────────────────────────────────────────────
        document.getElementById('parseSnippetBtn')?.addEventListener('click', () => {
            const raw  = document.getElementById('snippetInput')?.value || '';
            const note = document.getElementById('snippetNote');
            const parsed = AIProviders.parseSnippet(raw);

            if (!parsed.model && !parsed.apiKey && !parsed.baseUrl) {
                if (note) { note.textContent = "Couldn't detect a model — fill the form manually."; note.className = 'snippet-note err'; }
                return;
            }

            // Open the add form and pre-fill
            const form = document.getElementById('addProvForm');
            if (form) form.style.display = 'block';
            if (parsed.model)   { const el = document.getElementById('provModel');   if (el) el.value = parsed.model;   }
            if (parsed.baseUrl) { const el = document.getElementById('provBaseUrl'); if (el) el.value = parsed.baseUrl; }

            if (parsed.apiKey) {
                const el = document.getElementById('provKey');
                if (el) el.value = parsed.apiKey;
                if (note) { note.textContent = 'Model & key detected — review and save.'; note.className = 'snippet-note ok'; }
            } else {
                if (note) { note.textContent = 'Model detected — paste your API key to finish.'; note.className = 'snippet-note warn'; }
            }

            // Try to fetch model suggestions with the detected key
            const key = parsed.apiKey || '';
            const base = parsed.baseUrl || 'https://api.groq.com/openai/v1';
            if (key) this._tryFetchModelSuggestions(base, key);
        });

        // ── Add form toggle ───────────────────────────────────────────────
        document.getElementById('showAddFormBtn')?.addEventListener('click', () => {
            const f = document.getElementById('addProvForm');
            if (!f) return;
            const vis = f.style.display !== 'none';
            f.style.display = vis ? 'none' : 'block';
            document.getElementById('snippetPanel').style.display = 'none';
            if (!vis) {
                // Clear form on open
                ['provName','provKey','provModel','provPriority','provBaseUrl'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = id === 'provPriority' ? '0' : id === 'provBaseUrl' ? 'https://api.groq.com/openai/v1' : '';
                });
                document.getElementById('provKeyWarn').style.display = 'none';
                document.getElementById('provName')?.focus();
                // Try to fetch model suggestions from first working provider
                AIProviders.getAll().then(providers => {
                    const wp = providers.find(p => p.status === 'working' && p.enabled);
                    if (wp) this._tryFetchModelSuggestions(wp.baseUrl, wp.apiKey);
                }).catch(() => {});
            }
        });

        // ── API key warning on blur ───────────────────────────────────────
        document.getElementById('provKey')?.addEventListener('blur', () => {
            const val  = document.getElementById('provKey')?.value.trim() || '';
            const warn = document.getElementById('provKeyWarn');
            const base = document.getElementById('provBaseUrl')?.value.trim() || '';
            if (!warn) return;
            if (val && !val.startsWith('gsk_') && !val.startsWith('sk-') && !base) {
                warn.textContent = "Key doesn't start with 'gsk_' — make sure the Base URL is set for non-Groq providers.";
                warn.style.display = 'block';
            } else {
                warn.style.display = 'none';
            }
        });

        // ── Save provider ─────────────────────────────────────────────────
        document.getElementById('saveProvBtn')?.addEventListener('click', async () => {
            const name     = (document.getElementById('provName')?.value.trim()) || 'New Provider';
            const apiKey   = (document.getElementById('provKey')?.value.trim()) || '';
            const model    = (document.getElementById('provModel')?.value.trim()) || 'meta-llama/llama-4-scout-17b-16e-instruct';
            const priority = parseInt(document.getElementById('provPriority')?.value ?? '0') || 0;
            const baseUrl  = (document.getElementById('provBaseUrl')?.value.trim()) || 'https://api.groq.com/openai/v1';

            if (!apiKey) { window.toast?.('Please enter an API key.', 'error'); return; }

            await AIProviders.add({ name, apiKey, model, priority, baseUrl, status: 'untested' });
            document.getElementById('addProvForm').style.display = 'none';
            this.renderAIProviders();
            this.updateAiModelLabel();
            window.toast?.(`Provider "${this._esc(name)}" saved.`, 'success', 2000);
        });

        // ── Cancel add form ───────────────────────────────────────────────
        document.getElementById('cancelProvBtn')?.addEventListener('click', () => {
            document.getElementById('addProvForm').style.display = 'none';
        });

        // ── Event delegation for card actions ─────────────────────────────
        document.getElementById('providersList')?.addEventListener('click', async e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const id     = btn.dataset.id;
            const action = btn.dataset.action;

            if (action === 'test') {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                btn.disabled  = true;
                await AIProviders.update(id, { status: 'testing' });
                this.renderAIProviders();
                const res = await AIProviders.testProvider(id);
                btn.disabled = false;
                this.renderAIProviders();
                if (res.ok) {
                    window.toast?.('Provider test passed!', 'success', 2000);
                } else {
                    window.toast?.(`Provider test failed: ${res.error || 'unknown error'}`, 'error', 4000);
                }
            }

            if (action === 'delete') {
                await AIProviders.remove(id);
                this.renderAIProviders();
                this.updateAiModelLabel();
                window.toast?.('Provider deleted.', 'info');
            }

            if (action === 'reveal') {
                const span = document.getElementById(`key-display-${id}`);
                if (!span) return;
                const isHidden = span.dataset.hidden !== 'false';
                const list = await AIProviders.getAll();
                const prov = list.find(p => p.id === id);
                if (!prov) return;
                span.textContent = isHidden ? prov.apiKey : AIProviders.maskKey(prov.apiKey);
                span.dataset.hidden = isHidden ? 'false' : 'true';
                btn.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            }
        });

        // Toggle enabled state via change event
        document.getElementById('providersList')?.addEventListener('change', async e => {
            const chk = e.target.closest('[data-action="toggle"]');
            if (!chk) return;
            await AIProviders.update(chk.dataset.id, { enabled: chk.checked });
            this.updateAiModelLabel();
        });
    }

    async renderAIProviders() {
        const container = document.getElementById('providersList');
        if (!container) return;

        let providers = [];
        try { providers = await AIProviders.getAll(); } catch { return; }

        if (!providers.length) {
            container.innerHTML = '<div class="no-providers-msg">No providers connected yet.<br>Add an API key above to enable AI features.</div>';
            return;
        }

        container.innerHTML = providers.map(p => {
            const masked = AIProviders.maskKey(p.apiKey);
            const reqCnt = AIProviders.reqTodayDisplay(p);
            const statusDot = { working:'●', failing:'●', untested:'○', cooldown:'⏱', testing:'…' }[p.status] || '○';

            return `
            <div class="provider-card" data-id="${p.id}">
                <div class="provider-card-top">
                    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
                        <span class="provider-name">${this._esc(p.name)}</span>
                        <span class="status-badge status-${p.status}">${statusDot} ${p.status}</span>
                    </div>
                    <div class="provider-card-actions">
                        <button class="btn btn-icon btn-secondary btn-icon-accent"
                                data-action="test" data-id="${p.id}" title="Test key">
                            <i class="fas fa-vial"></i>
                        </button>
                        <label class="ctrl-toggle" title="Enabled">
                            <input type="checkbox" data-action="toggle"
                                   data-id="${p.id}" ${p.enabled ? 'checked' : ''}>
                            <span class="ctrl-toggle-track"></span>
                        </label>
                        <button class="btn btn-icon btn-secondary btn-icon-danger"
                                data-action="delete" data-id="${p.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="provider-key-row">
                    <span class="masked-key" id="key-display-${p.id}"
                          data-hidden="true">${masked}</span>
                    <button class="btn btn-icon btn-secondary"
                            data-action="reveal" data-id="${p.id}" title="Reveal / hide key">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="provider-meta">
                    <span>${this._esc(p.model)}</span>
                    <span>Priority ${p.priority}</span>
                    <span>${reqCnt} req today</span>
                    ${p.lastError ? `<span class="err-text" style="flex-basis:100%;color:#ff7070;"><i class="fas fa-exclamation-circle"></i> ${this._esc(p.lastError)}</span>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    // Attempt to fetch model list and populate the datalist
    async _tryFetchModelSuggestions(baseUrl, apiKey) {
        try {
            const models = await AIProviders.fetchModels(baseUrl, apiKey);
            const dl = document.getElementById('modelSuggest');
            if (!dl || !models?.length) return;
            dl.innerHTML = models.map(m => `<option value="${this._esc(m)}">`).join('');
        } catch {}
    }

    // ── Wallpaper thumbnail (settings preview) ───────────────────────────
    async _updateWpThumbnail() {
        const empty     = document.getElementById('wpThumbEmpty');
        const thumbWrap = document.getElementById('wpThumb');
        const img       = document.getElementById('wpThumbImg');
        const videoIcon = document.getElementById('wpThumbVideo');
        if (!empty || !thumbWrap) return;

        let blob = null;
        try { blob = await Wallpaper.getBlob(); } catch {}

        if (!blob) {
            empty.style.display     = '';
            thumbWrap.style.display = 'none';
            if (img) img.src        = '';
            return;
        }

        empty.style.display     = 'none';
        thumbWrap.style.display = '';

        if (blob.type.startsWith('video/')) {
            if (img)       img.style.display       = 'none';
            if (videoIcon) videoIcon.style.display = '';
        } else {
            if (videoIcon) videoIcon.style.display = 'none';
            if (img) {
                img.style.display = '';
                const url = URL.createObjectURL(blob);
                img.src = url;
                img.onload = () => URL.revokeObjectURL(url);
            }
        }
    }

    // ── Customization Panel (slide-up) ───────────────────────────────────────
    _buildCustomizationPanel() {
        return HomepageUI.buildCustomizePanel(this);
    }

    // Safe HTML escaping
    _esc(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

// ── Global Toast Notification System ─────────────────────────────────────────
window.toast = (msg, type = 'info', duration = 3000) => {
    const ICONS = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const COLORS = { success: '#00ff88', error: '#ff4d4d', info: '#00d4ff', warning: '#f7c948' };
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
        document.body.appendChild(container);
    }
    const t = document.createElement('div');
    const color = COLORS[type] || COLORS.info;
    t.style.cssText = `pointer-events:all;display:flex;align-items:center;gap:10px;min-width:260px;max-width:380px;
        padding:12px 14px;border-radius:10px;backdrop-filter:blur(12px);
        background:rgba(13,17,23,0.92);border-left:3px solid ${color};
        box-shadow:0 4px 24px rgba(0,0,0,0.4);transform:translateX(120%);
        transition:transform 0.3s ease;font-family:Inter,sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.9);position:relative;overflow:hidden;`;
    t.innerHTML = `<i class="fas ${ICONS[type]||ICONS.info}" style="color:${color};flex-shrink:0;"></i>
        <span style="flex:1;">${String(msg).replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>
        <button style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:1rem;padding:0;line-height:1;" data-toast-close>✕</button>
        <div class="toast-bar" style="position:absolute;bottom:0;left:0;height:2px;background:${color};width:100%;transform-origin:left;animation:toastBar ${duration}ms linear forwards;"></div>`;
    if (!document.getElementById('toast-keyframes')) {
        const s = document.createElement('style');
        s.id = 'toast-keyframes';
        s.textContent = '@keyframes toastBar{from{transform:scaleX(1)}to{transform:scaleX(0)}}';
        document.head.appendChild(s);
    }
    container.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; }));
    const remove = () => { t.style.transform = 'translateX(120%)'; setTimeout(() => t.remove(), 320); };
    const timer = setTimeout(remove, duration);
    t.querySelector('button').addEventListener('click', () => { clearTimeout(timer); remove(); });
};

// ── Initialize app when DOM is ready ─────────────────────────────────────────
let app;
document.addEventListener('DOMContentLoaded', () => {
    // Fade out loading screen
    const ls = document.getElementById('loadingScreen');
    if (ls) {
        ls.style.transition = 'opacity 0.4s';
        ls.style.opacity = '0';
        ls.style.pointerEvents = 'none';
        setTimeout(() => { ls.style.display = 'none'; }, 420);
    }

    app = new HomepageApp();
    window.app = app;   // expose for Setup / Makeover / Sharing / Widget modules
    // Backbone modules — order matters (Setup first, then features that use it)
    try { window.Ambient && Ambient.init(); } catch (e) { console.warn('Ambient init', e); }
    try { window.Setup && Setup.init(); } catch (e) { console.warn('Setup init', e); }
    try { window.WidgetCanvas && WidgetCanvas.init(); } catch (e) { console.warn('WidgetCanvas init', e); }

    // Defer non-critical modules with requestIdleCallback
    const defer = (fn) => {
        if (typeof requestIdleCallback === 'function') requestIdleCallback(fn);
        else setTimeout(fn, 0);
    };
    defer(() => { try { window.Makeover && Makeover.init(); } catch (e) { console.warn('Makeover init', e); } });
    defer(() => { try { window.Sharing && Sharing.init(); } catch (e) { console.warn('Sharing init', e); } });
    defer(() => { try { window.Feedback && Feedback.init(); } catch (e) { console.warn('Feedback init', e); } });

    // Auto-open feedback modal if page was loaded via #feedback hash (from popup)
    if (location.hash === '#feedback') {
        setTimeout(() => window.Feedback?.open(), 800);
        history.replaceState(null, '', location.pathname);
    }

    // Wire models.json into the model datalist
    fetch('models.json').then(r => r.json()).then(models => {
        const dl = document.getElementById('modelSuggest');
        if (dl && Array.isArray(models)) {
            dl.innerHTML = models.map(m => `<option value="${m}">`).join('');
        }
    }).catch(() => {});
});

// Dispatch templateChanged event after applyTemplate so interactions.js can listen
const _origApplyTemplate = HomepageApp.prototype.applyTemplate;
HomepageApp.prototype.applyTemplate = function (templateId) {
    _origApplyTemplate.call(this, templateId);
    try {
        document.dispatchEvent(new CustomEvent('templateChanged', { detail: { templateId } }));
    } catch {}
};


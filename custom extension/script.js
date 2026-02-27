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

class HomepageApp {
    constructor() {
        this.currentTemplate = this.loadSetting('template') || 'programmer';
        this.userName = this.loadSetting('userName') || 'YOUR NAME';
        this.apiKey = this.loadSetting('apiKey') || '';
        this.aiBackground = this.loadSetting('aiBackground') || null;
        this.links = this.loadLinks();
        this.selectedIcon = AVAILABLE_ICONS[0];
        this.selectedColor = AVAILABLE_COLORS[0];

        this.init();
    }

    init() {
        // Initialize 3D objects first
        this.objects3D = new Enhanced3DObjects();

        // Apply template with 3D objects
        this.applyTemplate(this.currentTemplate);

        // If there was a saved AI background, re-apply it over the template background
        if (this.aiBackground) {
            document.body.style.background = this.aiBackground;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }

        this.renderLinks();
        this.initTime();
        this.initTyping();
        this.initSearch();
        this.initMatrix();
        this.initParticles();
        this.initParallax();
        this.initKeyboardShortcuts();
        this.initEventListeners();
        this.initAIChat();
        this.initBgGen();
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

        // AI Background button
        const bgGenBtn = document.getElementById('bgGenBtn');
        if (bgGenBtn) {
            bgGenBtn.addEventListener('click', () => this.openBgGenModal());
        }

        // Random BG button
        const bgRandomBtn = document.getElementById('bgRandomBtn');
        if (bgRandomBtn) {
            bgRandomBtn.addEventListener('click', () => this.generateRandomAIBackground());
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

        // Form submissions
        const linkForm = document.getElementById('linkForm');
        if (linkForm) {
            linkForm.addEventListener('submit', (e) => this.handleAddLink(e));
        }

        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSaveSettings(e));
        }
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
            localStorage.setItem('homepage_links', JSON.stringify(this.links));
        } catch { }
    }

    // Template Methods
    applyTemplate(templateId) {
        const template = TEMPLATES[templateId];
        if (!template) return;

        this.currentTemplate = templateId;
        this.saveSetting('template', templateId);

        // Reset AI background when switching templates
        this.aiBackground = null;
        this.saveSetting('aiBackground', '');

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
            nameEl.textContent = this.userName;
            nameEl.setAttribute('data-text', this.userName);
        }

        // Update roles for typing effect
        this.roles = template.roles;
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
            <a href="${link.url}" class="link-card" style="--card-color: ${link.color}; --card-glow: ${link.color}40;">
                <button class="remove-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
                <div class="link-icon-wrapper">
                    <i class="${link.icon} link-icon" style="color: ${link.color};"></i>
                </div>
                <span class="link-name">${link.name}</span>
            </a>
        `).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removeLink(index);
            });
        });
    }

    removeLink(index) {
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
            document.getElementById('settingsName').value = this.userName;
            document.getElementById('settingsApiKey').value = this.apiKey;
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    renderTemplateGrid() {
        const grid = document.getElementById('templateGrid');
        if (!grid) return;

        grid.innerHTML = Object.values(TEMPLATES).map(template => `
            <div class="template-card ${this.currentTemplate === template.id ? 'active' : ''}" 
                 style="--template-color: ${template.colors.primary};"
                 data-template="${template.id}">
                <div class="template-icon" style="color: ${template.colors.primary};">
                    <i class="${template.icon}"></i>
                </div>
                <div class="template-name">${template.name}</div>
                <div class="template-desc">${template.description}</div>
            </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const templateId = card.dataset.template;
                this.selectTemplate(templateId);
            });
        });
    }

    selectTemplate(templateId) {
        this.applyTemplate(templateId);
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
        const name = document.getElementById('linkName').value;
        const url = document.getElementById('linkUrl').value;
        this.addLink(name, url, this.selectedIcon, this.selectedColor);
        this.closeAllModals();
        document.getElementById('linkForm').reset();
    }

    handleSaveSettings(event) {
        event.preventDefault();
        const name = document.getElementById('settingsName').value;
        const key = document.getElementById('settingsApiKey').value;
        this.updateUserName(name);
        this.apiKey = key;
        this.saveSetting('apiKey', key);
        this.closeAllModals();
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

    // Typing Effect
    initTyping() {
        this.roles = TEMPLATES[this.currentTemplate]?.roles || ['Developer'];
        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeEffect();
    }

    typeEffect() {
        const current = this.roles[this.phraseIndex];
        const typingEl = document.getElementById('typingText');
        if (!typingEl) return;

        if (this.isDeleting) {
            typingEl.textContent = current.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            typingEl.textContent = current.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? 30 : 80;

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

    // Search
    initSearch() {
        const input = document.getElementById('searchInput');
        const btn = document.getElementById('searchBtn');

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }

        if (btn) {
            btn.addEventListener('click', () => this.performSearch());
        }
    }

    performSearch() {
        const query = document.getElementById('searchInput')?.value.trim();
        if (query) {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            document.getElementById('searchInput').value = '';
        }
    }

    // ========== AI CHAT ==========
    openAIChatModal() {
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
                if (confirm('Are you sure you want to clear the AI chat history?')) {
                    this.chatHistory = [];
                    const container = document.getElementById('aiChatMessages');
                    if (container) {
                        container.innerHTML = `
                            <div class="ai-chat-msg assistant">
                                <div class="ai-msg-avatar"><i class="fas fa-robot"></i></div>
                                <div class="ai-chat-bubble">Hello! I'm your AI assistant powered by Groq. Ask me anything!</div>
                            </div>
                        `;
                    }
                }
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
            if (!this.apiKey) {
                this.appendChatMsg('assistant', '<span style="color:#ff6b6b;"><i class="fas fa-key" style="margin-right:6px;"></i> Please enter your Groq API Key in Settings to use Ask AI.</span>');
                setTimeout(() => this.openSettingsModal(), 1500);
                return;
            }
            const GROQ_API_KEY = this.apiKey;

            // Construct payload: inject seaechContext without mutating chatHistory directly
            const messagesPayload = [
                { role: 'system', content: 'You are a helpful, concise AI assistant embedded in a 3D browser homepage extension.' },
                ...this.chatHistory
            ];

            if (useWebSearch && searchContext) {
                // Insert contextual system prompt right before the latest user message
                messagesPayload.splice(messagesPayload.length - 1, 0, {
                    role: 'system',
                    content: `Web Search Context for the user's latest query:\n${searchContext}\nUse this information to answer the latest question if relevant.`
                });
            }

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-120b',
                    messages: messagesPayload,

                    temperature: 1,
                    max_completion_tokens: 8192,
                    top_p: 1,
                    stream: true,
                    reasoning_effort: 'medium',
                    stop: null
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API Error ${response.status}`);
            }

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

    // ========== AI BACKGROUND GENERATOR ==========
    openBgGenModal() {
        const modal = document.getElementById('bgGenModal');
        if (modal) {
            modal.classList.add('active');
            setTimeout(() => document.getElementById('bgGenInput')?.focus(), 100);
        }
    }

    initBgGen() {
        const submitBtn = document.getElementById('bgGenSubmit');
        const randomBtn = document.getElementById('bgGenRandom');
        const input = document.getElementById('bgGenInput');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const prompt = input?.value.trim();
                if (prompt) {
                    this.closeAllModals();
                    this.generateAIBackground(prompt);
                }
            });
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const prompt = input.value.trim();
                    if (prompt) {
                        this.closeAllModals();
                        this.generateAIBackground(prompt);
                    }
                }
            });
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.closeAllModals();
                this.generateRandomAIBackground();
            });
        }
    }

    generateRandomAIBackground() {
        const prompts = [
            'deep space nebula with purple and blue swirls',
            'cyberpunk city neon lights rain reflection',
            'aurora borealis northern lights green and teal',
            'ocean at sunset orange and pink gradient',
            'dark forest moonlight mystery',
            'futuristic holographic interface blue neon',
            'volcanic eruption orange lava and dark sky',
            'candy universe pastel pink and lavender',
            'underwater bioluminescent deep blue',
            'neon synthwave retro grid purple magenta'
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        this.generateAIBackground(randomPrompt);
    }

    async generateAIBackground(prompt) {
        const overlay = document.getElementById('aiLoadingOverlay');
        const loadingText = document.getElementById('aiLoadingText');

        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('active'), 10);
        }

        try {
            if (loadingText) loadingText.textContent = `Crafting: "${prompt}"...`;

            if (!this.apiKey) {
                if (loadingText) loadingText.textContent = 'API Key Required. Opening Settings...';
                setTimeout(() => {
                    if (overlay) {
                        overlay.classList.remove('active');
                        setTimeout(() => overlay.style.display = 'none', 500);
                    }
                    this.openSettingsModal();
                }, 1500);
                return;
            }
            const GROQ_API_KEY = this.apiKey;

            const systemPrompt = `You are a CSS background generator. The user will describe a visual scene or theme. You must respond with ONLY a valid CSS background property value (e.g., a linear-gradient, radial-gradient, or combination). Use vivid colors suitable for a dark browser homepage. Output ONLY the CSS value, nothing else. Example output: linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 25%, #0d1b2a 50%, #0a2a1a 75%, #1a0a0a 100%)`;

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-120b',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Create a CSS background for: ${prompt}` }
                    ],
                    temperature: 1,
                    max_completion_tokens: 512,
                    top_p: 1,
                    stream: false,
                    reasoning_effort: 'medium',
                    stop: null
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API Error ${response.status}`);
            }

            const result = await response.json();
            let cssBackground = result.choices?.[0]?.message?.content?.trim() || '';

            // Sanitize: strip any surrounding quotes, backticks, or "background:" prefix
            cssBackground = cssBackground
                .replace(/^background\s*:\s*/i, '')
                .replace(/^[`"']+|[`"']+$/g, '')
                .replace(/;\s*$/, '')
                .trim();

            if (!cssBackground) throw new Error('No background generated by AI.');

            if (loadingText) loadingText.textContent = 'Applying Vision...';

            // Apply the AI-generated CSS background
            document.body.style.background = cssBackground;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';

            this.aiBackground = cssBackground;
            this.saveSetting('aiBackground', cssBackground);

            this.enableDeleteMode();

            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => overlay.style.display = 'none', 500);
            }

        } catch (error) {
            console.error('AI Generation Error:', error);
            if (loadingText) loadingText.textContent = `Error: ${error.message}`;
            setTimeout(() => {
                if (overlay) {
                    overlay.classList.remove('active');
                    setTimeout(() => overlay.style.display = 'none', 500);
                }
            }, 3000);
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
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const template = TEMPLATES[this.currentTemplate];
        const color = template?.colors.primary || '#00ff88';

        const draw = () => {
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

        setInterval(draw, 50);
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
        document.addEventListener('mousemove', (e) => {
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
            if (e.key === '/' && document.activeElement !== document.getElementById('searchInput')) {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
            if (e.key === 'Escape') {
                this.closeAllModals();
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
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new HomepageApp();
});

// Add this to the END of your existing script.js file
// This ensures interactions are re-initialized after template changes

// Store reference to original applyTemplate method
const originalApplyTemplate = HomepageApp.prototype.applyTemplate;

// Override applyTemplate to re-initialize interactions
HomepageApp.prototype.applyTemplate = function (templateId) {
    // Call original method
    originalApplyTemplate.call(this, templateId);

    // Re-initialize interactions after template objects are created
    setTimeout(() => {
        if (window.interactive3DSystem) {
            console.log('Re-initializing interactions after template change...');
            window.interactive3DSystem.makeObjectsInteractive();
        }
    }, 2000);
};


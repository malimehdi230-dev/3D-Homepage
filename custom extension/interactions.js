// 3D Homepage Templates - Interactive Objects Module
// Developed by Muhammad Ali Mehdi

class Interactive3DObjects {
    constructor() {
        this.isDragging = false;
        this.currentElement = null;
        this.startX = 0;
        this.startY = 0;
        this.dragStarted = false;
        this.init();
    }

    init() {
        console.log('Initializing 3D interactions...');
        this.addStyles();

        // Wait for DOM and other scripts to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.delayedInit();
            });
        } else {
            this.delayedInit();
        }
    }

    delayedInit() {
        // Wait for main app to finish
        setTimeout(() => {
            console.log('Making objects interactive...');
            this.makeObjectsInteractive();

            // Re-check after template changes
            this.observeTemplateChanges();
        }, 2000);
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'interaction-styles';
        style.textContent = `
            @keyframes rippleEffect {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(4);
                    opacity: 0;
                }
            }

            @keyframes bounce3D {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }

            @keyframes spin360 {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
            }

            .interactive-hint {
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: var(--primary);
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 11px;
                font-family: 'Fira Code', monospace;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid var(--primary);
                z-index: 10000;
            }

            .interactive-object {
                cursor: grab !important;
                transition: filter 0.3s ease, transform 0.3s ease !important;
            }

            .interactive-object:hover {
                filter: brightness(1.4) drop-shadow(0 0 25px var(--primary)) !important;
            }

            .interactive-object:hover .interactive-hint {
                opacity: 1;
            }

            .interactive-object:active {
                cursor: grabbing !important;
            }

            .dragging {
                z-index: 10000 !important;
                cursor: grabbing !important;
            }

            /* Make sure objects can receive events */
            .code-cube-container,
            .code-cube-container-2,
            .torus-container,
            .pyramid-container {
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    makeObjectsInteractive() {
        console.log('Setting up interactive objects...');

        // Make main cube interactive
        this.makeElementInteractive('.code-cube-container', 'Click to pause • Drag to move • Double-click to reset', (el) => {
            const cube = el.querySelector('.code-cube');
            if (cube) {
                let isPaused = false;
                el.addEventListener('click', (e) => {
                    if (!this.dragStarted) {
                        isPaused = !isPaused;
                        cube.style.animationPlayState = isPaused ? 'paused' : 'running';
                        this.createRipple(e, el);
                    }
                });
            }
        });

        // Make secondary cube interactive
        this.makeElementInteractive('.code-cube-container-2', 'Click to spin • Drag to move', (el) => {
            el.addEventListener('click', (e) => {
                if (!this.dragStarted) {
                    const cube = el.querySelector('.code-cube-2');
                    if (cube) {
                        cube.style.animation = 'spin360 1s ease, cubeRotate 15s linear infinite reverse';
                    }
                    this.createRipple(e, el);
                }
            });
        });

        // Make torus interactive
        this.makeElementInteractive('.torus-container', 'Click to speed • Drag to move • Scroll to scale', (el) => {
            let isSpedUp = false;
            el.addEventListener('click', (e) => {
                if (!this.dragStarted) {
                    isSpedUp = !isSpedUp;
                    el.style.animationDuration = isSpedUp ? '5s' : '20s';
                    this.createRipple(e, el);
                }
            });

            el.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                const currentScale = this.getScale(el);
                const newScale = Math.max(0.5, Math.min(2, currentScale * delta));
                el.style.transform = `scale(${newScale})`;
            }, { passive: false });
        });

        // Make pyramid interactive
        this.makeElementInteractive('.pyramid-container', 'Click to bounce • Drag to move', (el) => {
            el.addEventListener('click', (e) => {
                if (!this.dragStarted) {
                    el.style.animation = 'bounce3D 0.6s ease, pyramidFloat 6s ease-in-out infinite';
                    this.createRipple(e, el);
                }
            });
        });

        // Make floating elements interactive
        document.querySelectorAll('.floating-element').forEach(el => {
            this.makeElementInteractive(el, 'Drag to move', () => { });
        });

        // Make code floats interactive
        document.querySelectorAll('.code-float').forEach(el => {
            this.makeElementInteractive(el, 'Drag to move', () => { });
        });

        // Make orbit container interactive
        this.makeElementInteractive('.orbit-container', 'Drag to move', () => { });

        // Make dynamic objects interactive after a delay
        setTimeout(() => {
            this.makeDynamicObjectsInteractive();
        }, 3000);
    }

    makeElementInteractive(selectorOrElement, hintText, clickHandler) {
        let elements = [];
        if (typeof selectorOrElement === 'string') {
            const foundElement = document.querySelector(selectorOrElement);
            if (foundElement) elements.push(foundElement);
        } else if (selectorOrElement instanceof Element) {
            elements.push(selectorOrElement);
        }

        if (elements.length === 0) {
            console.log(`Element not found: ${selectorOrElement}`);
            return;
        }

        elements.forEach(element => {
            console.log(`Making interactive: ${selectorOrElement}`);

            element.classList.add('interactive-object');
            element.style.pointerEvents = 'auto';

            // Add hint
            if (!element.querySelector('.interactive-hint')) {
                const hint = document.createElement('div');
                hint.className = 'interactive-hint';
                hint.textContent = hintText;
                // Don't override position if it's already set to fixed or absolute
                const currentPosition = window.getComputedStyle(element).position;
                if (currentPosition !== 'absolute' && currentPosition !== 'fixed') {
                    element.style.position = 'absolute';
                }
                element.appendChild(hint);
            }

            // Setup drag functionality
            this.setupDrag(element);

            // Setup click handler if provided
            if (clickHandler) {
                clickHandler(element);
            }

            // Double-click to reset
            element.addEventListener('dblclick', () => {
                this.resetElement(element, selectorOrElement);
            });
        });
    }

    setupDrag(element) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;
        let hasMoved = false;

        const onMouseDown = (e) => {
            isDragging = true;
            hasMoved = false;
            this.dragStarted = false;

            const rect = element.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;

            element.style.animation = 'none';
            element.style.left = initialLeft + 'px';
            element.style.top = initialTop + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.transform = 'none';

            element.classList.add('dragging');
            element.style.cursor = 'grabbing';
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasMoved = true;
                this.dragStarted = true;
            }

            element.style.left = (initialLeft + deltaX) + 'px';
            element.style.top = (initialTop + deltaY) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.transform = 'none';

            e.preventDefault();
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
                element.style.cursor = 'grab';

                // Reset dragStarted after a short delay
                setTimeout(() => {
                    this.dragStarted = false;
                }, 100);
            }
        };

        element.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    makeDynamicObjectsInteractive() {
        const dynamicContainer = document.getElementById('dynamic-3d-objects');
        if (!dynamicContainer) {
            console.log('Dynamic objects container not found');
            return;
        }

        console.log('Making dynamic objects interactive...');

        const objects = Array.from(dynamicContainer.children).filter(child => {
            return child.style.position === 'absolute';
        });

        console.log(`Found ${objects.length} dynamic objects`);

        objects.forEach((obj, index) => {
            if (!obj.classList.contains('interactive-object')) {
                obj.classList.add('interactive-object');
                obj.style.pointerEvents = 'auto';
                obj.style.cursor = 'grab';

                // Add hint
                const hint = document.createElement('div');
                hint.className = 'interactive-hint';
                hint.textContent = 'Click to interact • Drag to move';
                obj.appendChild(hint);

                // Setup drag
                this.setupDrag(obj);

                // Click effect
                obj.addEventListener('click', (e) => {
                    if (!this.dragStarted) {
                        this.createRipple(e, obj);
                        obj.style.animation = 'bounce3D 0.5s ease';
                        setTimeout(() => {
                            obj.style.animation = '';
                        }, 500);
                    }
                });

                console.log(`Made object ${index} interactive`);
            }
        });
    }

    createRipple(e, container) {
        const ripple = document.createElement('div');
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            z-index: 999;
            opacity: 0.8;
        `;

        container.style.position = 'relative';
        container.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    getScale(element) {
        const transform = window.getComputedStyle(element).transform;
        if (transform === 'none') return 1;

        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
            const values = matrix[1].split(', ');
            return parseFloat(values[0]);
        }
        return 1;
    }

    resetElement(element, selector) {
        element.style.left = '';
        element.style.top = '';
        element.style.right = '';
        element.style.bottom = '';
        element.style.transform = '';
        element.style.animation = '';

        // Reset to original position based on selector
        const positions = {
            '.code-cube-container': { left: '5%', top: '50%', transform: 'translateY(-50%)' },
            '.code-cube-container-2': { right: '5%', bottom: '20%' },
            '.torus-container': { right: '8%', top: '20%' },
            '.pyramid-container': { bottom: '15%', left: '12%' }
        };

        const pos = positions[selector];
        if (pos) {
            Object.assign(element.style, pos);
        }

        console.log(`Reset element: ${selector}`);
    }

    observeTemplateChanges() {
        // Re-initialize when template changes
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                this.makeDynamicObjectsInteractive();
            }, 1000);
        });

        const dynamicContainer = document.getElementById('dynamic-3d-objects');
        if (dynamicContainer) {
            observer.observe(dynamicContainer, {
                childList: true,
                subtree: true
            });
        }
    }
}

// Initialize immediately
console.log('Loading interactions.js...');
window.interactive3DSystem = new Interactive3DObjects();

// Also initialize after window load as backup
window.addEventListener('load', () => {
    if (!window.interactive3DSystem) {
        console.log('Backup initialization...');
        window.interactive3DSystem = new Interactive3DObjects();
    }
});
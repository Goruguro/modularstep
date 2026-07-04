// Three.js global rendering context
let scene, camera, renderer, controls, stairGroup;

/**
 * Dynamically loads a script file and returns a Promise.
 * @param {string} src - The URL of the script.
 * @returns {Promise} Resolves when script is loaded.
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            if (existing.dataset.loaded === 'true') {
                resolve();
            } else {
                existing.addEventListener('load', resolve);
                existing.addEventListener('error', reject);
            }
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Initializes the WebGL 3D scene, lighting, camera, and user OrbitControls.
 */
export async function init3D() {
    const container = document.getElementById('visualizer-target');
    if (!container) return;

    // Load Three.js and OrbitControls dynamically if not already present
    if (typeof THREE === 'undefined') {
        try {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
            await loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js");
        } catch (e) {
            console.error("Failed to load 3D graphics libraries dynamically", e);
            const fallback = document.createElement('div');
            fallback.className = 'webgl-fallback';
            fallback.style.display = 'flex';
            fallback.style.alignItems = 'center';
            fallback.style.justifyContent = 'center';
            fallback.style.height = '100%';
            fallback.style.padding = '20px';
            fallback.style.textAlign = 'center';
            fallback.style.color = 'var(--text-secondary)';
            fallback.style.background = 'var(--bg-secondary)';
            fallback.innerHTML = '<strong>Interactive 3D Configurator</strong><br>Failed to load 3D assets. Check your network connection.';
            container.innerHTML = '';
            container.appendChild(fallback);
            return;
        }
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // 1. Create Scene
    scene = new THREE.Scene();

    // 2. Create Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(30, 20, 30);

    // 3. Create WebGL Renderer with console.error interceptor for headless environments
    const originalConsoleError = console.error;
    console.error = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.WebGLRenderer')) {
            return;
        }
        originalConsoleError.apply(console, args);
    };

    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
        console.warn("WebGL not supported. Displaying fallback message.", e);
        const fallback = document.createElement('div');
        fallback.className = 'webgl-fallback';
        fallback.style.display = 'flex';
        fallback.style.alignItems = 'center';
        fallback.style.justifyContent = 'center';
        fallback.style.height = '100%';
        fallback.style.padding = '20px';
        fallback.style.textAlign = 'center';
        fallback.style.color = 'var(--text-secondary)';
        fallback.style.background = 'var(--bg-secondary)';
        fallback.innerHTML = '<strong>Interactive 3D Configurator</strong><br>Enable WebGL in your browser to view the 3D model.';
        container.innerHTML = '';
        container.appendChild(fallback);
        return;
    } finally {
        console.error = originalConsoleError;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = ''; // Clear target container
    container.appendChild(renderer.domElement);

    // 4. Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(40, 100, 40);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.35);
    pointLight.position.set(-20, 20, -20);
    scene.add(pointLight);

    // 5. Add Grid Helper
    const gridHelper = new THREE.GridHelper(80, 80, 0x94a3b8, 0xe2e8f0);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // 6. Create Stair Group Wrapper
    stairGroup = new THREE.Group();
    scene.add(stairGroup);

    // 7. Add Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Don't go below ground
    controls.target.set(8, postHeight => 5, 0); // safe target y fallback
    controls.target.set(8, 5, 0);

    // 8. Start Animation Loop
    animate();

    // 9. Resize Listener
    window.addEventListener('resize', onWindowResize);
}

/**
 * Handle window resizing to update camera aspect ratio and renderer size.
 */
function onWindowResize() {
    const container = document.getElementById('visualizer-target');
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

/**
 * Continuous animation rendering loop.
 */
function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

/**
 * Main function to redraw the 3D modular stair and platform assembly based on active state.
 * Uses Three.js primitives to build steps, side handrails, and platform sizes.
 * @param {object} state - The current configurator state.
 */
export function updateVisualizer(state) {
    if (!stairGroup) return;

    // Clear existing children
    while (stairGroup.children.length > 0) {
        const obj = stairGroup.children[0];
        stairGroup.remove(obj);
    }

    // Geometry/Dimension specs
    const stepDepth = 1.1; // in grid units
    const stepHeight = 1.0; 
    const platformLen = state.platform === 'double' ? 10.0 : 5.0;
    const handrailHeight = 2.8;
    const supportHeight = state.steps * stepHeight;
    const platformX = state.steps * stepDepth;

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.15 });
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 });
    const safetyMat = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.2, roughness: 0.5 }); // Teknosis Accent Orange

    // 1. Draw Platform
    const platformGeo = new THREE.BoxGeometry(platformLen, 0.2, 5.0);
    const platform = new THREE.Mesh(platformGeo, metalMat);
    platform.position.set(platformX + platformLen / 2, supportHeight - 0.1, 0);
    stairGroup.add(platform);

    // 2. Draw Platform Support Legs (4 corners)
    const legGeo = new THREE.BoxGeometry(0.2, supportHeight - 0.2, 0.2);
    const legX = [platformX + 0.2, platformX + platformLen - 0.2];
    const legZ = [-2.3, 2.3];

    for (let x of legX) {
        for (let z of legZ) {
            const leg = new THREE.Mesh(legGeo, metalMat);
            leg.position.set(x, (supportHeight - 0.2) / 2, z);
            stairGroup.add(leg);
        }
    }

    // 3. Draw Stair Steps
    for (let i = 0; i < state.steps; i++) {
        const stepGeo = new THREE.BoxGeometry(stepDepth, 0.1, 4.6);
        const step = new THREE.Mesh(stepGeo, stepMat);
        step.position.set(i * stepDepth + 0.55, stepHeight * i + 1.0, 0);
        stairGroup.add(step);
    }

    // 4. Draw Stair Side Stringers
    const stringerLen = Math.sqrt(supportHeight * supportHeight + platformX * platformX);
    const stringerAngle = Math.atan2(supportHeight, platformX);
    const stringerGeo = new THREE.BoxGeometry(stringerLen, 0.4, 0.1);

    for (let z of [-2.4, 2.4]) {
        const stringer = new THREE.Mesh(stringerGeo, metalMat);
        stringer.position.set(platformX / 2, supportHeight / 2, z);
        stringer.rotation.z = stringerAngle;
        stairGroup.add(stringer);
    }

    // 5. Draw Safety Handrails
    if (state.handrails) {
        // Platform Handrails
        const railGeo = new THREE.BoxGeometry(platformLen, 0.08, 0.08);
        const crossRailGeo = new THREE.BoxGeometry(0.08, 0.08, 5.0);
        const postGeo = new THREE.BoxGeometry(0.08, handrailHeight, 0.08);

        for (let z of [-2.5, 2.5]) {
            // Top rail
            const topRail = new THREE.Mesh(railGeo, safetyMat);
            topRail.position.set(platformX + platformLen / 2, supportHeight + handrailHeight, z);
            stairGroup.add(topRail);

            // Mid rail
            const midRail = new THREE.Mesh(railGeo, safetyMat);
            midRail.position.set(platformX + platformLen / 2, supportHeight + handrailHeight / 2, z);
            stairGroup.add(midRail);

            // Vertical posts
            for (let px of [platformX, platformX + platformLen]) {
                const post = new THREE.Mesh(postGeo, safetyMat);
                post.position.set(px, supportHeight + handrailHeight / 2, z);
                stairGroup.add(post);
            }
        }

        // End cross handrail
        const endRail = new THREE.Mesh(crossRailGeo, safetyMat);
        endRail.position.set(platformX + platformLen, supportHeight + handrailHeight, 0);
        stairGroup.add(endRail);

        // Stair Handrails
        for (let z of [-2.4, 2.4]) {
            // Top rail
            const stairTopRail = new THREE.Mesh(stringerGeo, safetyMat);
            stairTopRail.position.set(platformX / 2, supportHeight / 2 + handrailHeight, z);
            stairTopRail.rotation.z = stringerAngle;
            stairGroup.add(stairTopRail);

            // Mid rail
            const stairMidRail = new THREE.Mesh(stringerGeo, safetyMat);
            stairMidRail.position.set(platformX / 2, supportHeight / 2 + handrailHeight / 2, z);
            stairMidRail.rotation.z = stringerAngle;
            stairGroup.add(stairMidRail);

            // Vertical balusters/posts
            for (let i = 0; i <= state.steps; i += Math.max(1, Math.round(state.steps / 2))) {
                const px = i * stepDepth;
                const py = stepHeight * i + handrailHeight / 2;
                const post = new THREE.Mesh(postGeo, safetyMat);
                post.position.set(px, py, z);
                stairGroup.add(post);
            }
        }
    }
}

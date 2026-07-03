/**
 * ModularStep Access Builder State, 3D WebGL Configurator, and UI Logic.
 * Utilizes Three.js and OrbitControls to build a dynamic, interactive 3D access model.
 */

// Step specifications data mapping stair sizes to engineering metrics
const STAIR_DATA = {
    1: { height: 59, footprint: 10, weight: 80, clearance: 12 },
    2: { height: 64, footprint: 20, weight: 105, clearance: 24 },
    3: { height: 74, footprint: 30, weight: 125, clearance: 36 },
    4: { height: 84, footprint: 40, weight: 145, clearance: 48 },
    5: { height: 94, footprint: 50, weight: 165, clearance: 59 },
    6: { height: 104, footprint: 60, weight: 185, clearance: 70 },
    7: { height: 108, footprint: 60, weight: 200, clearance: 82 },
    8: { height: 117, footprint: 70, weight: 220, clearance: 94 },
    9: { height: 129, footprint: 80, weight: 240, clearance: 106 },
    10: { height: 138, footprint: 90, weight: 260, clearance: 118 },
    11: { height: 147, footprint: 100, weight: 285, clearance: 130 },
    12: { height: 156, footprint: 110, weight: 310, clearance: 142 },
    13: { height: 165, footprint: 120, weight: 335, clearance: 154 },
    14: { height: 174, footprint: 130, weight: 360, clearance: 166 },
    15: { height: 184, footprint: 140, weight: 390, clearance: 178 }
};

// Builder configuration state
const state = {
    steps: 5,
    handrails: true,
    platform: 'single' // 'single' or 'double'
};

// Three.js global rendering context
let scene, camera, renderer, controls, stairGroup;

/**
 * Initializes the WebGL 3D scene, lighting, camera, and user OrbitControls.
 */
function init3D() {
    const container = document.getElementById('visualizer-target');
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // 1. Create Scene
    scene = new THREE.Scene();

    // 2. Create Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(30, 20, 30);

    // 3. Create WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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

    // 5. Add Grid Helper at base floor
    const gridHelper = new THREE.GridHelper(80, 80, 0x94a3b8, 0xe2e8f0);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // 6. Create Stair Mesh Group
    stairGroup = new THREE.Group();
    scene.add(stairGroup);

    // 7. Add Camera Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Banish going below ground
    controls.target.set(8, 5, 0);

    // 8. Start Rendering Loop
    animate();

    // Handle viewport resize
    window.addEventListener('resize', onWindowResize);
}

/**
 * Handles window resize to keep renderer aspect ratio consistent.
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
 * Main WebGL animation rendering frame.
 */
function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

/**
 * Dynamic 3D Stair Mesh Builder.
 * Reconstructs geometries in the 3D scene when state changes.
 */
function updateVisualizer() {
    if (!stairGroup) return;

    // Clear previous stair geometries
    while (stairGroup.children.length > 0) {
        const obj = stairGroup.children[0];
        stairGroup.remove(obj);
    }

    const stepRise = 1.0;
    const stepRun = 1.1;
    const stepWidth = 5.0;
    const stairTotalHeight = state.steps * stepRise;
    const stairTotalWidth = state.steps * stepRun;
    const platformWidth = state.platform === 'double' ? 10.0 : 5.0;
    const platformHeight = 0.2;
    const platformX = stairTotalWidth;

    // 3D Mesh materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.15 });
    const treadMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 });
    const orangeMaterial = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.2, roughness: 0.5 }); // Safety Orange

    // 1. Render Platform Box
    const platformGeo = new THREE.BoxGeometry(platformWidth, platformHeight, stepWidth);
    const platformMesh = new THREE.Mesh(platformGeo, steelMaterial);
    platformMesh.position.set(platformX + platformWidth / 2, stairTotalHeight - platformHeight / 2, 0);
    stairGroup.add(platformMesh);

    // 2. Render Columns/Support Legs (4 columns)
    const legGeo = new THREE.BoxGeometry(0.2, stairTotalHeight - platformHeight, 0.2);
    const xOffsets = [platformX + 0.2, platformX + platformWidth - 0.2];
    const zOffsets = [-stepWidth / 2 + 0.2, stepWidth / 2 - 0.2];

    for (let x of xOffsets) {
        for (let z of zOffsets) {
            const leg = new THREE.Mesh(legGeo, steelMaterial);
            leg.position.set(x, (stairTotalHeight - platformHeight) / 2, z);
            stairGroup.add(leg);
        }
    }

    // 3. Render Stair Treads and Side Beams (Stringers)
    for (let i = 0; i < state.steps; i++) {
        const treadGeo = new THREE.BoxGeometry(stepRun, 0.1, stepWidth - 0.4);
        const tread = new THREE.Mesh(treadGeo, treadMaterial);
        tread.position.set((i * stepRun) + stepRun / 2, (i * stepRise) + stepRise, 0);
        stairGroup.add(tread);
    }

    // Left & Right Side Stringer Beams
    const beamLength = Math.sqrt(stairTotalHeight * stairTotalHeight + stairTotalWidth * stairTotalWidth);
    const beamAngle = Math.atan2(stairTotalHeight, stairTotalWidth);
    const beamGeo = new THREE.BoxGeometry(beamLength, 0.4, 0.1);
    
    for (let zVal of [-stepWidth / 2 + 0.1, stepWidth / 2 - 0.1]) {
        const beam = new THREE.Mesh(beamGeo, steelMaterial);
        beam.position.set(stairTotalWidth / 2, stairTotalHeight / 2, zVal);
        beam.rotation.z = beamAngle;
        stairGroup.add(beam);
    }

    // 4. Render Safety Handrails (Orange Rails)
    if (state.handrails) {
        const railHeight = 2.8;
        
        // Platform rails (left & right sides + back end)
        const railSideGeo = new THREE.BoxGeometry(platformWidth, 0.08, 0.08);
        const railBackGeo = new THREE.BoxGeometry(0.08, 0.08, stepWidth);
        const postGeo = new THREE.BoxGeometry(0.08, railHeight, 0.08);

        // Platform top handrails
        for (let side of [-stepWidth / 2, stepWidth / 2]) {
            const topRail = new THREE.Mesh(railSideGeo, orangeMaterial);
            topRail.position.set(platformX + platformWidth / 2, stairTotalHeight + railHeight, side);
            stairGroup.add(topRail);

            // Platform mid rails
            const midRail = new THREE.Mesh(railSideGeo, orangeMaterial);
            midRail.position.set(platformX + platformWidth / 2, stairTotalHeight + railHeight / 2, side);
            stairGroup.add(midRail);

            // Posts
            for (let xPos of [platformX, platformX + platformWidth]) {
                const post = new THREE.Mesh(postGeo, orangeMaterial);
                post.position.set(xPos, stairTotalHeight + railHeight / 2, side);
                stairGroup.add(post);
            }
        }
        
        // Back guardrail
        const backRail = new THREE.Mesh(railBackGeo, orangeMaterial);
        backRail.position.set(platformX + platformWidth, stairTotalHeight + railHeight, 0);
        stairGroup.add(backRail);

        // Stair rails (left & right)
        for (let side of [-stepWidth / 2 + 0.1, stepWidth / 2 - 0.1]) {
            const stairRail = new THREE.Mesh(beamGeo, orangeMaterial);
            stairRail.position.set(stairTotalWidth / 2, (stairTotalHeight / 2) + railHeight, side);
            stairRail.rotation.z = beamAngle;
            stairGroup.add(stairRail);

            // Mid stair rail
            const midStairRail = new THREE.Mesh(beamGeo, orangeMaterial);
            midStairRail.position.set(stairTotalWidth / 2, (stairTotalHeight / 2) + railHeight / 2, side);
            midStairRail.rotation.z = beamAngle;
            stairGroup.add(midStairRail);

            // Vertical support posts along stairs
            for (let i = 0; i <= state.steps; i += Math.max(1, Math.round(state.steps / 2))) {
                const px = i * stepRun;
                const py = i * stepRise + railHeight / 2;
                const post = new THREE.Mesh(postGeo, orangeMaterial);
                post.position.set(px, py, side);
                stairGroup.add(post);
            }
        }
    }
}

/**
 * Calculates current specification values based on configuration and updates UI values.
 */
function updateSpecs() {
    const data = STAIR_DATA[state.steps];
    if (!data) return;

    // Adjust values if platform is doubled
    const actualWeight = Math.round(data.weight * (state.platform === 'double' ? 1.4 : 1.0) + (state.handrails ? 30 : 0));
    const actualFootprint = data.footprint + (state.platform === 'double' ? 36 : 18);
    const totalHeight = data.height;
    const clearance = totalHeight - 35; // calculation clearance

    // Update DOM texts
    document.getElementById('step-count-display').textContent = state.steps.toString();
    document.getElementById('height-display').textContent = `${totalHeight}" Height`;
    document.getElementById('spec-clearance').textContent = `${clearance} in`;
    document.getElementById('spec-footprint').textContent = `${actualFootprint} in`;
    document.getElementById('spec-weight').textContent = `${actualWeight} lbs`;

    // Pre-populate quote input
    const summaryInput = document.getElementById('config-summary');
    if (summaryInput) {
        summaryInput.value = `${state.steps} Steps (${totalHeight}" Height) - ${state.handrails ? 'With Handrails' : 'No Handrails'} - Platform: ${state.platform.toUpperCase()}`;
    }
}

/**
 * Handles the custom toggle actions for parameters.
 * @param {string} key - State item name (e.g. 'handrails', 'platform').
 * @param {*} value - Target state value.
 */
function setConfig(key, value) {
    state[key] = value;
    
    // Manage UI class toggles
    if (key === 'handrails') {
        document.getElementById('handrails-on').classList.toggle('active', value === true);
        document.getElementById('handrails-off').classList.toggle('active', value === false);
    } else if (key === 'platform') {
        document.getElementById('platform-single').classList.toggle('active', value === 'single');
        document.getElementById('platform-double').classList.toggle('active', value === 'double');
    }

    updateVisualizer();
    updateSpecs();
}

/**
 * Sets up all document event bindings.
 */
function initEvents() {
    // Slider event
    const slider = document.getElementById('step-slider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            state.steps = parseInt(e.target.value);
            updateVisualizer();
            updateSpecs();
        });
    }

    // Toggle button events
    document.getElementById('handrails-on')?.addEventListener('click', () => setConfig('handrails', true));
    document.getElementById('handrails-off')?.addEventListener('click', () => setConfig('handrails', false));
    document.getElementById('platform-single')?.addEventListener('click', () => setConfig('platform', 'single'));
    document.getElementById('platform-double')?.addEventListener('click', () => setConfig('platform', 'double'));

    // Config selector buttons in the table
    document.querySelectorAll('.select-config-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const steps = parseInt(e.target.getAttribute('data-steps'));
            state.steps = steps;
            if (slider) {
                slider.value = steps;
            }
            updateVisualizer();
            updateSpecs();
            // Scroll smoothly to visualizer
            document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Form submission simulation
    const form = document.getElementById('quote-form');
    const feedback = document.getElementById('form-feedback');
    if (form && feedback) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            feedback.className = 'form-feedback success';
            feedback.textContent = 'Quote request submitted successfully! We will contact you soon.';
            form.reset();
            updateSpecs(); // restore summary input
        });
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    init3D();
    updateVisualizer();
    updateSpecs();
    loadDatabasePresets();
});

async function loadDatabasePresets() {
    const group = document.getElementById('db-presets-group');
    const select = document.getElementById('db-presets-select');
    if (!group || !select) return;
    try {
        const res = await fetch(`${window.location.origin}/api/presets`);
        const presets = await res.json();
        if (presets && presets.length > 0) {
            group.style.display = 'block';
            select.innerHTML = '<option value="">-- Choose Preset --</option>';
            presets.forEach(p => {
                const opt = document.createElement('option');
                opt.value = JSON.stringify(p);
                opt.textContent = `${p.name} (${p.steps} Steps, ${p.step_width}mm)`;
                select.appendChild(opt);
            });
            select.addEventListener('change', (e) => {
                const val = e.target.value;
                if (!val) return;
                const p = JSON.parse(val);
                state.steps = p.steps;
                state.handrails = p.has_handrails === 1;
                state.platform = p.platform_length > 1000 ? 'double' : 'single';
                const slider = document.getElementById('step-slider');
                if (slider) slider.value = p.steps;
                document.getElementById('handrails-on').classList.toggle('active', state.handrails === true);
                document.getElementById('handrails-off').classList.toggle('active', state.handrails === false);
                document.getElementById('platform-single').classList.toggle('active', state.platform === 'single');
                document.getElementById('platform-double').classList.toggle('active', state.platform === 'double');
                updateVisualizer();
                updateSpecs();
            });
        }
    } catch (err) {
        console.log('[*] API Server offline, using default local presets.');
    }
}

// Bridge Pattern
if (typeof window !== 'undefined') {
    window.state = state;
    window.setConfig = setConfig;
    window.updateVisualizer = updateVisualizer;
    window.updateSpecs = updateSpecs;
}

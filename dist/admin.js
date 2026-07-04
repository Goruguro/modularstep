/**
 * Admin Dashboard controller
 * Manages admin authorization, CRUD presets API, and Three.js 3D configuration previews.
 */

// Global API Endpoint Base URL (Local development vs remote hosting proxy)
const API_BASE = window.location.origin;

let scene, camera, renderer, controls;
let stairGroup;

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

function initAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    } else {
        document.getElementById('loginWrapper').style.display = 'flex';
        document.getElementById('dashboardPanel').style.display = 'none';
    }

    // Login Form Listener
    document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const feedback = document.getElementById('login-feedback');

        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                showDashboard();
            } else {
                feedback.textContent = data.error || 'Authentication failed.';
            }
        } catch (err) {
            feedback.textContent = 'Unable to connect to server API.';
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.reload();
    });
}

function showDashboard() {
    document.getElementById('loginWrapper').style.display = 'none';
    document.getElementById('dashboardPanel').style.display = 'block';

    init3DPreview();
    fetchPresets();
    setupPresetForm();
}

/**
 * Fetch presets list from SQLite server API
 */
async function fetchPresets() {
    try {
        const res = await fetch(`${API_BASE}/api/presets`);
        const presets = await res.json();
        const tbody = document.getElementById('presetsListBody');
        tbody.innerHTML = '';

        presets.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.name}</strong></td>
                <td>${p.steps} Steps</td>
                <td>${p.step_width} mm</td>
                <td>${p.platform_length} mm</td>
                <td>${p.has_handrails ? 'Yes' : 'No'}</td>
                <td><button class="btn-delete" data-id="${p.id}">Delete</button></td>
            `;
            tbody.appendChild(tr);
        });

        // Add Delete Event Listeners
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this preset?')) {
                    await deletePreset(id);
                }
            });
        });
    } catch (err) {
        console.error('[-] Error fetching presets:', err);
    }
}

async function deletePreset(id) {
    try {
        const res = await fetch(`${API_BASE}/api/presets/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            fetchPresets();
        }
    } catch (err) {
        console.error('[-] Error deleting preset:', err);
    }
}

function setupPresetForm() {
    const form = document.getElementById('preset-form');

    // Trigger 3D render preview updates on inputs change
    const updatePreviewOnInput = () => {
        const steps = parseInt(document.getElementById('step-count').value) || 4;
        const width = parseInt(document.getElementById('step-width').value) || 800;
        const length = parseInt(document.getElementById('platform-length').value) || 1000;
        const handrails = document.getElementById('has-handrails').checked;

        update3DScene(steps, length, width, handrails);
    };

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updatePreviewOnInput);
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('preset-name').value;
        const steps = parseInt(document.getElementById('step-count').value);
        const step_width = parseInt(document.getElementById('step-width').value);
        const platform_length = parseInt(document.getElementById('platform-length').value);
        const load_capacity = parseInt(document.getElementById('load-capacity').value);
        const has_handrails = document.getElementById('has-handrails').checked;

        try {
            const res = await fetch(`${API_BASE}/api/presets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, steps, step_width, platform_length, load_capacity, has_handrails })
            });

            const data = await res.json();
            if (data.success) {
                form.reset();
                // Set defaults after reset
                document.getElementById('step-count').value = 4;
                document.getElementById('step-width').value = 800;
                document.getElementById('platform-length').value = 1000;
                document.getElementById('load-capacity').value = 150;
                document.getElementById('has-handrails').checked = true;

                fetchPresets();
                updatePreviewOnInput();
                alert('Preset successfully saved to database!');
            }
        } catch (err) {
            alert('Error saving preset to server database.');
        }
    });

    // Initial render
    updatePreviewOnInput();
}

/**
 * Initialize embedded 3D Three.js viewport
 */
function init3DPreview() {
    const container = document.getElementById('preview3D');
    if (!container || scene) return;

    // Create Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Matches container background

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(4, 3, 5);

    try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
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
        fallback.innerHTML = '<strong>Interactive 3D Preview</strong><br>Enable WebGL in your browser to view the 3D model.';
        container.appendChild(fallback);
        return;
    }
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Controls
    // @ts-ignore
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Base Grid Floor
    const grid = new THREE.GridHelper(10, 10, 0x0f2c59, 0xcbd5e1);
    scene.add(grid);

    stairGroup = new THREE.Group();
    scene.add(stairGroup);

    // Handle Window Resize
    window.addEventListener('resize', () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Start Loop
    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    animate();
}

/**
 * Rebuild the 3D model geometry when inputs change
 */
function update3DScene(steps, length, width, hasHandrails) {
    if (!stairGroup) return;

    // Clear previous geometries
    while(stairGroup.children.length > 0){
        stairGroup.remove(stairGroup.children[0]);
    }

    const stepRise = 0.2; // 20cm rise
    const stepRun = 0.25; // 25cm run
    const stairWidth = width / 1000; // mm to m
    const platformLen = length / 1000; // mm to m

    const aluminumMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const safetyOrangeMaterial = new THREE.MeshStandardMaterial({ color: 0xf97316 });

    // Draw steps
    for (let i = 0; i < steps; i++) {
        const treadGeo = new THREE.BoxGeometry(stairWidth, 0.03, stepRun);
        const tread = new THREE.Mesh(treadGeo, aluminumMaterial);
        tread.position.set(0, (i + 1) * stepRise, -i * stepRun);
        tread.castShadow = true;
        stairGroup.add(tread);
    }

    // Platform
    const platHeight = steps * stepRise;
    const platGeo = new THREE.BoxGeometry(stairWidth, 0.04, platformLen);
    const platform = new THREE.Mesh(platGeo, aluminumMaterial);
    platform.position.set(0, platHeight, -((steps - 1) * stepRun) - (platformLen / 2) - (stepRun / 2));
    platform.castShadow = true;
    stairGroup.add(platform);

    // Handrails
    if (hasHandrails) {
        const railGeo = new THREE.BoxGeometry(0.04, 0.04, platformLen);
        const railLeft = new THREE.Mesh(railGeo, safetyOrangeMaterial);
        railLeft.position.set(-stairWidth/2, platHeight + 0.9, -((steps - 1) * stepRun) - (platformLen / 2) - (stepRun / 2));
        stairGroup.add(railLeft);

        const railRight = new THREE.Mesh(railGeo, safetyOrangeMaterial);
        railRight.position.set(stairWidth/2, platHeight + 0.9, -((steps - 1) * stepRun) - (platformLen / 2) - (stepRun / 2));
        stairGroup.add(railRight);
    }
}

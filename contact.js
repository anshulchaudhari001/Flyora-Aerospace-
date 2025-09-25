import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
let scene, camera, renderer, planeModel;
let mixer, clock;

// Initialize the 3D scene
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1B1B1B);

    // Camera
    const container = document.getElementById('plane3DContainer');
    const initialWidth = container?.clientWidth || 560;
    const initialHeight = container?.clientHeight || 560;
    camera = new THREE.PerspectiveCamera(60, initialWidth / initialHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xd1ff48, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xd1ff48, 0.5, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Clock for animations
    clock = new THREE.Clock();

    // Load plane model
    loadPlaneModel();

    // Start animation loop
    animate();
}

// Load the plane 3D model
function loadPlaneModel() {
    const loader = new GLTFLoader();
    
    // Try to load one of the available plane models
    const planeModels = [
        'img/stylized_ww1_plane.glb',
        'img/sukhoi_su-75.glb',
        'img/wwii_cartoon_plane_free.glb',
        'img/c17__transport_aircraft.glb',
        'img/cargo_aircraft.glb'
    ];

    function tryLoadModel(index) {
        if (index >= planeModels.length) {
            // If no model loads, create a simple plane geometry
            createSimplePlane();
            return;
        }

        loader.load(
            planeModels[index],
            function (gltf) {
                planeModel = gltf.scene;
                
                // Scale and position the model
                planeModel.scale.set(0.8, 0.8, 0.8);
                planeModel.position.set(0, 0, 0);
                
                // Enable shadows
                planeModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                scene.add(planeModel);

                // Setup animations if available
                if (gltf.animations && gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(planeModel);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.play();
                }
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('Error loading model:', error);
                // Try next model
                tryLoadModel(index + 1);
            }
        );
    }

    tryLoadModel(0);
}

// Create a simple plane if no model loads
function createSimplePlane() {
    const geometry = new THREE.ConeGeometry(1, 3, 8);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xd1ff48,
        transparent: true,
        opacity: 0.8
    });
    planeModel = new THREE.Mesh(geometry, material);
    planeModel.rotation.x = Math.PI / 2;
    scene.add(planeModel);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (planeModel) {
        // Rotate the plane
        planeModel.rotation.y += 0.01;
        
        // Add some floating motion
        planeModel.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    }

    // Update animations
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('plane3DContainer');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Form handling
function initForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(data)) {
            // Show success message
            showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            showMessage('Please fill in all required fields correctly.', 'error');
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
    }
    
    return isValid;
}

// Validate entire form
function validateForm(data) {
    const requiredFields = ['name', 'phone', 'email', 'enquiry', 'message'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        return false;
    }
    
    return true;
}

// Show message to user
function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-popup ${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="message-text">${message}</span>
        </div>
    `;
    
    // Add styles
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 300);
    }, 5000);
}

// Add smooth scrolling for navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('header nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    initForm();
    initSmoothScrolling();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Add loading animation
    const planeContainer = document.getElementById('plane3D');
    if (planeContainer) {
        planeContainer.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #d1ff48; font-size: 1.2rem;">Loading 3D Model...</div>';
    }
});

// Styles moved to contact.css to avoid duplication

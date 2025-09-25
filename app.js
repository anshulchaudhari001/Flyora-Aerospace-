import { gsap } from 'https://cdn.skypack.dev/gsap';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

// Device detection and responsive utilities
function getBreakpoint(width = window.innerWidth) {
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}

let currentBreakpoint = getBreakpoint();
const isMobile = currentBreakpoint === 'mobile';
const isTablet = currentBreakpoint === 'tablet';
const isDesktop = currentBreakpoint === 'desktop';

// Responsive camera setup
function getCameraSettings() {
    if (isMobile) {
        return {
            fov: 13,
            position: { x: 0, y: 0, z: 20 },
            near: 0.1,
            far: 1000
        };
    } else if (isTablet) {
        return {
            fov: 12,
            position: { x: 0, y: 0, z: 16 },
            near: 0.1,
            far: 1000
        };
    } else {
        return {
            fov: 12,
            position: { x: 0, y: 0, z: 14 },
            near: 0.1,
            far: 1000
        };
    }
}

// Set up camera with responsive settings
const cameraSettings = getCameraSettings();
const camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    window.innerWidth / window.innerHeight,
    cameraSettings.near,
    cameraSettings.far
);
camera.position.set(cameraSettings.position.x, cameraSettings.position.y, cameraSettings.position.z);
camera.lookAt(0, 0, 0);

// Create scene
const scene = new THREE.Scene();
let planeModel;
let modelGroup;
let mixer;

// Renderer setup with responsive pixel ratio
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
renderer.setClearColor(0x000000, 0); // Transparent background
document.getElementById('container3D').appendChild(renderer.domElement);

// Responsive lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.8 : 1.1);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, isMobile ? 0.6 : 1);
dirLight.position.set(300, 400, 200);
dirLight.castShadow = false; // Disable shadows for better mobile performance
scene.add(dirLight);

// Load a plane model and animate
const loader = new GLTFLoader();
const planeCandidates = [
    'img/stylized_ww1_plane.glb',
    // Fallback models can be added here
];

// Responsive scale factors
function getModelScale() {
    if (isMobile) {
        return 4.2; // Smaller for mobile
    } else if (isTablet) {
        return 5.2; // Medium for tablet
    } else {
        return 6.6; // Larger size for desktop
    }
}

// Responsive animation parameters
function getAnimationParams() {
    if (isMobile) {
        return {
            initialX: -15,
            duration: 2.8,
            delay: 0.1,
            movementRange: 1.5 // Reduced movement range for mobile
        };
    } else if (isTablet) {
        return {
            initialX: -14,
            duration: 3.0,
            delay: 0.15,
            movementRange: 2
        };
    } else {
        return {
            initialX: -12,
            duration: 3.2,
            delay: 0.2,
            movementRange: 2.5
        };
    }
}

function loadPlaneModel(index = 0) {
    if (index >= planeCandidates.length) return;

    loader.load(
        planeCandidates[index],
        (gltf) => {
            planeModel = gltf.scene;

            // Center model inside a group so the pivot is at the model's center
            const box = new THREE.Box3().setFromObject(planeModel);
            const center = box.getCenter(new THREE.Vector3());
            planeModel.position.sub(center);

            modelGroup = new THREE.Group();
            modelGroup.add(planeModel);
            scene.add(modelGroup);

            // Responsive scaling (applied to group)
            const baseScale = getModelScale();
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scaleFactor = baseScale / maxDim;
            modelGroup.scale.setScalar(scaleFactor);

            // Get animation parameters
            const animParams = getAnimationParams();

            // Initial off-screen position
            modelGroup.position.set(animParams.initialX, 0, 0);
            modelGroup.rotation.set(0.05, Math.PI * 0.5, 0.05);

            // Play animation if available
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(planeModel);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
                // Reduce animation speed on mobile for better performance
                action.timeScale = isMobile ? 0.7 : 1;
            }

            // Glide-in animation from left
            gsap.to(modelGroup.position, {
                x: 0,
                duration: animParams.duration,
                ease: 'power2.out',
                delay: animParams.delay,
            });

            gsap.to(modelGroup.rotation, {
                y: 0,
                x: 0.02,
                z: -0.02,
                duration: animParams.duration,
                ease: 'power2.out',
                delay: animParams.delay,
            });
        },
        undefined,
        () => loadPlaneModel(index + 1)
    );
}

loadPlaneModel();

// Responsive scroll-driven movement
let isScrolling = false;
function onScroll() {
    if (!modelGroup || isScrolling) return;

    isScrolling = true;

    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || window.pageYOffset;
    const maxScroll = doc.scrollHeight - doc.clientHeight || 1;
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

    const animParams = getAnimationParams();
    const movementRange = animParams.movementRange;

    // Responsive movement pattern - simplified for mobile
    let targetX = 0;
    if (isMobile) {
        // Simplified movement for mobile - just gentle side to side
        targetX = Math.sin(progress * Math.PI * 2) * (movementRange * 0.5);
    } else {
        // Full movement pattern for desktop/tablet
        const section = 1 / 6;
        if (progress < section) {
            targetX = -movementRange * (progress / section);
        } else if (progress < 2 * section) {
            targetX = -movementRange + (2 * movementRange) * ((progress - section) / section);
        } else if (progress < 3 * section) {
            targetX = movementRange - (2 * movementRange) * ((progress - 2 * section) / section);
        } else if (progress < 4 * section) {
            targetX = -movementRange + (2 * movementRange) * ((progress - 3 * section) / section);
        } else if (progress < 5 * section) {
            targetX = movementRange - (2 * movementRange) * ((progress - 4 * section) / section);
        } else {
            targetX = -movementRange + movementRange * ((progress - 5 * section) / section);
        }
    }

    // Responsive vertical and depth movement
    const verticalMultiplier = isMobile ? 0.3 : 0.5;
    const depthMultiplier = isMobile ? 1 : 2;
    const rotationMultiplier = isMobile ? 0.08 : 0.15;

    const targetY = -progress * verticalMultiplier;
    const targetZ = -progress * depthMultiplier;
    const targetRotX = 0.02 + progress * rotationMultiplier;

    // Use requestAnimationFrame for smoother animation on mobile
    requestAnimationFrame(() => {
        gsap.to(modelGroup.position, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: isMobile ? 0.3 : 0.5,
            ease: 'power1.out',
            onComplete: () => {
                isScrolling = false;
            }
        });

        gsap.to(modelGroup.rotation, {
            x: targetRotX,
            duration: isMobile ? 0.3 : 0.5,
            ease: 'power1.out'
        });
    });
}

// Optimized animation loop
let lastTime = 0;
const targetFPS = isMobile ? 30 : 60; // Reduce FPS on mobile for better performance
const frameInterval = 1000 / targetFPS;

function tick(currentTime) {
    requestAnimationFrame(tick);

    if (currentTime - lastTime >= frameInterval) {
        if (mixer) {
            const delta = isMobile ? 0.016 : 0.02; // Slower animation on mobile
            mixer.update(delta);
        }
        renderer.render(scene, camera);
        lastTime = currentTime;
    }
}
tick();

// Optimized scroll event listener
let scrollTimeout;
function handleScroll() {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    onScroll();

    // Throttle scroll events on mobile
    if (isMobile) {
        scrollTimeout = setTimeout(() => {
            onScroll();
        }, 16); // ~60fps
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Track last stable size to avoid layout jumps on tab switch / mobile URL bar
let lastStableWidth = window.innerWidth;
let lastStableHeight = window.innerHeight;

// Responsive resize handler (robust against tab switches and minor viewport chrome changes)
function handleResize() {
    if (document.hidden) return; // ignore while tab is hidden

    const newWidth = Math.max(1, window.innerWidth);
    const newHeight = Math.max(1, window.innerHeight);

    // Ignore tiny changes (e.g., mobile browser chrome show/hide)
    const widthDelta = Math.abs(newWidth - lastStableWidth);
    const heightDelta = Math.abs(newHeight - lastStableHeight);
    const minorChange = widthDelta < 60 && heightDelta < 80;
    if (minorChange) return;

    // Update renderer
    renderer.setSize(newWidth, newHeight);

    // Update camera aspect/projection
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    // Only update camera position and model scale when breakpoint actually changes
    const newBreakpoint = getBreakpoint(newWidth);
    const breakpointChanged = newBreakpoint !== currentBreakpoint;
    if (breakpointChanged) {
        currentBreakpoint = newBreakpoint;

        const newCameraSettings = getCameraSettings();
        gsap.to(camera.position, {
            x: newCameraSettings.position.x,
            y: newCameraSettings.position.y,
            z: newCameraSettings.position.z,
            duration: 0.5
        });

        if (modelGroup && planeModel) {
            const newScale = getModelScale();
            const box = new THREE.Box3().setFromObject(planeModel);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scaleFactor = newScale / maxDim;

            gsap.to(modelGroup.scale, {
                x: scaleFactor,
                y: scaleFactor,
                z: scaleFactor,
                duration: 0.5
            });
        }
    }

    // Keep camera aimed at center
    camera.lookAt(0, 0, 0);

    // Commit new stable size
    lastStableWidth = newWidth;
    lastStableHeight = newHeight;
}

window.addEventListener('resize', handleResize);

// Avoid resize-induced jumps when switching tabs
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Re-evaluate once when tab becomes visible using robust handler
        handleResize();
    }
});

// Logo slider setup
const track = document.getElementById('logosTrack');
if (track) {
    const logos = [...track.children];
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        track.appendChild(clone);
    });
}

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        nav.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('show');
        }
    });

    // Close menu when clicking on nav links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('show');
        });
    });
}

// Generic vertical slider initializer to avoid duplicate code
function initVerticalSlider({
    containerSelector,
    sliderSelector,
    slideSelector,
    dotsContainerSelector,
    dotClass,
    autoplayMsMobile = 3000,
    autoplayMsDesktop = 2000
}) {
    const sliderContainer = document.querySelector(containerSelector);
    const slider = document.querySelector(sliderSelector);
    const slides = document.querySelectorAll(slideSelector);
    const dotsContainer = document.querySelector(dotsContainerSelector);

    if (!sliderContainer || !slider || !slides.length || !dotsContainer) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    let isSliderScrolling = false;
    let startY = 0;
    let startX = 0;

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add(dotClass);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll(`.${dotClass}`);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (isSliderScrolling) return;
        isSliderScrolling = true;

        currentIndex = (index + totalSlides) % totalSlides;
        slider.style.transform = `translateY(-${currentIndex * 100}%)`;
        updateDots();

        setTimeout(() => {
            isSliderScrolling = false;
        }, 700);
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, isMobile ? autoplayMsMobile : autoplayMsDesktop);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    sliderContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (isSliderScrolling) return;

        if (event.deltaY > 0) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(currentIndex - 1);
        }
        resetAutoPlay();
    }, { passive: false });

    sliderContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        if (!startY || !startX) return;

        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const diffY = startY - endY;
        const diffX = startX - endX;

        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
            if (diffY > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
            resetAutoPlay();
        }

        startY = 0;
        startX = 0;
    }, { passive: true });

    createDots();
    goToSlide(0);
    startAutoPlay();
}

// Initialize sliders once DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initVerticalSlider({
        containerSelector: '.slider-container',
        sliderSelector: '.slider',
        slideSelector: '.service-slide',
        dotsContainerSelector: '.dots-container',
        dotClass: 'dot',
        autoplayMsMobile: 3000,
        autoplayMsDesktop: 2000
    });

    initVerticalSlider({
        containerSelector: '.what-we-do-container',
        sliderSelector: '#wwdSlider',
        slideSelector: '.wwd-slide',
        dotsContainerSelector: '.wwd-dots-container',
        dotClass: 'wwd-dot',
        autoplayMsMobile: 3500,
        autoplayMsDesktop: 2000
    });
});

// Form submission handling with better mobile experience
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Reset button after 3 seconds (assuming form submission)
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 3000);
    });

    // Better mobile input focus handling
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            if (isMobile) {
                // Scroll to input on mobile to ensure visibility
                setTimeout(() => {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            }
        });
    });
}
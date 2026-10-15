
import * as THREE from 'three';
import { gsap } from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';

// 1. Start scroll animations
AOS.init({
  duration: 800,
  once: true,
  offset: 80
});

// 2. Create the Three.js scene
const container = document.querySelector('#planet-container');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);

container.appendChild(renderer.domElement);

// 3. Create a 3D planet
const geometry = new THREE.SphereGeometry(1.35, 64, 64);

const material = new THREE.MeshStandardMaterial({
  color: 0x7956e8,
  roughness: 0.65,
  metalness: 0.15
});

const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// 4. Add lights so we can see the planet
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const light = new THREE.PointLight(0x8a75ff, 45);
light.position.set(3, 3, 4);
scene.add(light);

// 5. Create a star field
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < 500; i++) {
  starPositions.push(
    (Math.random() - 0.5) * 18,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 10
  );
}

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.025
  })
);

scene.add(stars);

// 6. GSAP animates the planet and heading
gsap.from(planet.scale, {
  x: 0.1,
  y: 0.1,
  z: 0.1,
  duration: 1.5,
  ease: 'back.out(1.7)'
});

gsap.from('.hero-text > *', {
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power2.out'
});

gsap.to(planet.rotation, {
  y: Math.PI * 2,
  duration: 12,
  repeat: -1,
  ease: 'none'
});

gsap.to(stars.rotation, {
  y: 0.15,
  duration: 15,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});

// 7. Keep the 3D scene rendering
function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// 8. Adjust the canvas when its container changes size
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

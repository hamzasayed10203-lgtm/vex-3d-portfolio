// VEX 3D hero — Three.js scene
// Interactive: drag to rotate, pointer parallax, subtle scroll drift.
// Falls back to a static CSS gradient when WebGL is unavailable.

import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const canvas = document.getElementById("scene");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

if (!webglAvailable()) {
  document.body.classList.add("no-webgl");
  const hint = document.getElementById("drag-hint");
  if (hint) hint.style.display = "none";
} else {
  init();
}

function init() {
  const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07070d, 0.055);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  // Lights
  scene.add(new THREE.AmbientLight(0x8b5cf6, 0.35));
  const key = new THREE.PointLight(0xa78bfa, 60, 60);
  key.position.set(5, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xd946ef, 45, 60);
  rim.position.set(-6, -4, 4);
  scene.add(rim);

  // Particle field
  const particleCount = isMobile ? 450 : 1400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.045, transparent: true, opacity: 0.7 })
  );
  scene.add(particles);

  // Reel frames cluster (three rounded film frames)
  const cluster = new THREE.Group();
  scene.add(cluster);

  function roundedRectShape(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  function makeReelFrame() {
    const outer = roundedRectShape(1.9, 3.2, 0.28);
    const hole = roundedRectShape(1.55, 2.85, 0.2);
    outer.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(outer, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
      curveSegments: 10,
    });
    geo.center();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x17142a,
      metalness: 0.65,
      roughness: 0.3,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.22,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 24),
      new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.55 })
    );
    mesh.add(edges);
    return mesh;
  }

  cluster.position.z = isMobile ? -3.2 : -2;
  cluster.position.y = -0.6;

  const frames = [];
  for (let i = 0; i < 3; i++) {
    const f = makeReelFrame();
    const angle = (i / 3) * Math.PI * 2;
    f.userData = { angle, radius: isMobile ? 4.4 : 3.9, spin: 0.4 + i * 0.12, bobOffset: i * 2.1 };
    if (isMobile) f.scale.setScalar(0.65);
    cluster.add(f);
    frames.push(f);
  }

  // 3D "VEX" text (loads a font; skipped quietly if it fails)
  let vexText = null;
  new FontLoader().load(
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json",
    (font) => {
      const geo = new TextGeometry("VEX", {
        font,
        size: isMobile ? 0.9 : 1.1,
        height: 0.35,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelSegments: 3,
      });
      geo.center();
      vexText = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: 0x1c1833,
          metalness: 0.8,
          roughness: 0.25,
          emissive: 0x8b5cf6,
          emissiveIntensity: 0.18,
        })
      );
      vexText.position.set(0, 3.1, isMobile ? -4.5 : -3.5);
      vexText.userData.baseY = 3.1;
      cluster.add(vexText);
    },
    undefined,
    () => {}
  );

  // Interaction state
  const pointer = { x: 0, y: 0 };
  let dragging = false;
  let lastX = 0;
  let rotY = 0;
  let rotVelocity = 0;

  window.addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (dragging) {
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rotVelocity = dx * 0.004;
      rotY += rotVelocity;
    }
  });
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
  });
  window.addEventListener("pointerup", () => { dragging = false; });
  window.addEventListener("pointercancel", () => { dragging = false; });

  let scrollProgress = 0;
  window.addEventListener("scroll", () => {
    const max = document.body.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  }, { passive: true });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Orbit + bob for the frames
    for (const f of frames) {
      const a = f.userData.angle + t * 0.18;
      f.position.set(
        Math.cos(a) * f.userData.radius,
        Math.sin(t * 0.7 + f.userData.bobOffset) * 0.35,
        Math.sin(a) * f.userData.radius
      );
      f.rotation.y = -a + Math.PI / 2;
      f.rotation.z = Math.sin(t * 0.5 + f.userData.bobOffset) * 0.08;
    }

    if (vexText) {
      vexText.rotation.y = Math.sin(t * 0.3) * 0.15;
      vexText.position.y = vexText.userData.baseY + Math.sin(t * 0.6) * 0.15;
    }

    particles.rotation.y = t * 0.015;

    // Drag rotation with inertia
    if (!dragging) {
      rotVelocity *= 0.95;
      rotY += rotVelocity;
    }
    cluster.rotation.y = rotY + Math.sin(t * 0.1) * 0.05;

    // Pointer parallax + scroll drift
    const targetCamX = pointer.x * 0.9;
    const targetCamY = pointer.y * 0.5 - scrollProgress * 1.2;
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.lookAt(0, -scrollProgress * 1.2, 0);

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    renderer.render(scene, camera);
    const hint = document.getElementById("drag-hint");
    if (hint) hint.style.display = "none";
  } else {
    animate();
  }
}

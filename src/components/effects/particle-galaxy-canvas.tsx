"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function ParticleGalaxyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 3, 16);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Logarithmic Spiral Galaxy Particles Setup
    const particleCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);

    // Color Palette: Deep Space Indigo, Violet, Electric Cyan, Emerald Core
    const colorInside = isDark ? new THREE.Color("#10b981") : new THREE.Color("#059669"); // Emerald
    const colorMid = isDark ? new THREE.Color("#38bdf8") : new THREE.Color("#0284c7");    // Cyan
    const colorOutside = isDark ? new THREE.Color("#818cf8") : new THREE.Color("#6366f1");// Violet
    const colorDeep = isDark ? new THREE.Color("#4f46e5") : new THREE.Color("#4338ca");   // Indigo

    const branches = 3;
    const radius = 12;
    const spin = 1.2;
    const randomness = 0.45;
    const randomnessPower = 3.5;

    for (let i = 0; i < particleCount; i++) {
      // Coordinate along spiral branch
      const i3 = i * 3;
      const r = Math.random() * radius;
      const spinAngle = r * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      const x = Math.cos(branchAngle + spinAngle) * r + randomX;
      const y = randomY * 0.7;
      const z = Math.sin(branchAngle + spinAngle) * r + randomZ;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // Color Interpolation based on radius from core
      const mixedColor = colorInside.clone();
      if (r < radius * 0.35) {
        mixedColor.lerp(colorMid, r / (radius * 0.35));
      } else if (r < radius * 0.75) {
        mixedColor.lerp(colorOutside, (r - radius * 0.35) / (radius * 0.4));
      } else {
        mixedColor.lerp(colorDeep, (r - radius * 0.75) / (radius * 0.25));
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Random particle scale
      scales[i] = (Math.random() * 0.8 + 0.3) * (1 - r / (radius * 1.5) + 0.3);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // 3. Custom Circular Glow Particle Texture
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(0.55, "rgba(255, 255, 255, 0.2)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 0.28,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: createParticleTexture(),
      transparent: true,
      opacity: isDark ? 0.88 : 0.65,
    });

    const galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    // 4. Subtle Outer Atmosphere Glow Rings
    const ringGeo = new THREE.RingGeometry(11.8, 12.1, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    // 5. Mouse Interaction & Spring Physics
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollProgress = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Optional click shockwave
    let shockwaveTime = 0;
    const handleClick = () => {
      shockwaveTime = 1.0;
    };
    window.addEventListener("click", handleClick);

    // 6. Animation Loop (60 FPS Smooth Rendering)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Base Galaxy Rotation with inertia
      galaxy.rotation.y = elapsedTime * 0.08 + mouseX * 0.35;
      galaxy.rotation.x = 0.45 + mouseY * 0.25 + scrollProgress * 0.8;
      galaxy.rotation.z = Math.sin(elapsedTime * 0.2) * 0.05;

      orbitRing.rotation.z = -elapsedTime * 0.04;
      orbitRing.rotation.x = Math.PI / 2 + mouseY * 0.2;

      // Scroll-driven camera fly-through
      // Stage transitions based on scrollProgress (0 = Hero, 0.33 = Bento, 0.66 = Sandbox, 1 = Projects)
      const targetCamY = 3.5 - scrollProgress * 4.5;
      const targetCamZ = 16 - scrollProgress * 5;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, -scrollProgress * 1.5, 0);

      // Handle shockwave wave expansion if triggered
      if (shockwaveTime > 0) {
        shockwaveTime -= 0.03;
        const posAttr = geometry.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const origX = originalPositions[i3];
          const origY = originalPositions[i3 + 1];
          const origZ = originalPositions[i3 + 2];
          const dist = Math.sqrt(origX * origX + origZ * origZ);
          const wave = Math.sin(dist * 0.8 - (1 - shockwaveTime) * 10) * shockwaveTime * 0.6;
          posAttr.setY(i, origY + wave);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Resize handling
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

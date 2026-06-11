"use client";

import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

/* ──────────────────────────────────────────────────────────
   Cel-shade gradient map (3-tone: shadow / mid / highlight)
   ────────────────────────────────────────────────────────── */
function useToonGradient() {
  return useMemo(() => {
    const colors = new Uint8Array([60, 140, 255]); // 3-tone steps
    const tex = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* ──────────────────────────────────────────────────────────
   Anime Character (cel-shaded, cursor-tracking)
   ────────────────────────────────────────────────────────── */
function AnimeCharacter({ theme }: { theme?: string }) {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { pointer } = useThree();
  const gradientMap = useToonGradient();
  const isDark = theme === "dark";

  // Skin toon material
  const skinMat = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: new THREE.Color("#f5c6a0"),
        gradientMap,
      }),
    [gradientMap]
  );

  // Hair toon material (cobalt blue)
  const hairMat = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: new THREE.Color("#3b82f6"),
        gradientMap,
      }),
    [gradientMap]
  );

  // Outfit toon material (zinc dark in light mode, zinc medium-dark in dark mode)
  const outfitMat = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: new THREE.Color(isDark ? "#2d2d30" : "#18181b"),
        gradientMap,
      }),
    [isDark, gradientMap]
  );

  // Collar toon material (contrasting)
  const collarMat = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: new THREE.Color(isDark ? "#18181b" : "#e4e4e7"),
        gradientMap,
      }),
    [isDark, gradientMap]
  );

  // Eye glow material (emissive cobalt blue)
  const eyeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3b82f6",
        emissive: "#3b82f6",
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0,
      }),
    []
  );

  // Eye highlight (white glint)
  const eyeHighlightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 1.0,
      }),
    []
  );

  // Mouth material
  const mouthMat = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: new THREE.Color("#e88a96"),
        gradientMap,
      }),
    [gradientMap]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Head tracks mouse
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        pointer.x * 0.5,
        0.08
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -pointer.y * 0.3,
        0.08
      );
    }

    // Eyes additionally track (shift position toward pointer)
    const eyeOffsetX = pointer.x * 0.02;
    const eyeOffsetY = pointer.y * 0.015;
    if (leftEyeRef.current) {
      leftEyeRef.current.position.x = THREE.MathUtils.lerp(
        leftEyeRef.current.position.x,
        -0.1 + eyeOffsetX,
        0.1
      );
      leftEyeRef.current.position.y = THREE.MathUtils.lerp(
        leftEyeRef.current.position.y,
        0.05 + eyeOffsetY,
        0.1
      );
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.position.x = THREE.MathUtils.lerp(
        rightEyeRef.current.position.x,
        0.1 + eyeOffsetX,
        0.1
      );
      rightEyeRef.current.position.y = THREE.MathUtils.lerp(
        rightEyeRef.current.position.y,
        0.05 + eyeOffsetY,
        0.1
      );
    }

    // Floating bob
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Body / Torso ── */}
      <group position={[0, -0.45, 0]}>
        {/* Main torso */}
        <mesh position={[0, 0, 0]} material={outfitMat}>
          <cylinderGeometry args={[0.22, 0.18, 0.55, 16]} />
        </mesh>

        {/* Collar / neckline accent */}
        <mesh position={[0, 0.26, 0.05]} material={collarMat}>
          <sphereGeometry args={[0.06, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Left shoulder */}
        <mesh position={[-0.28, 0.18, 0]} material={outfitMat}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>

        {/* Right shoulder */}
        <mesh position={[0.28, 0.18, 0]} material={outfitMat}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>

        {/* Left arm */}
        <mesh position={[-0.32, -0.02, 0]} rotation={[0, 0, 0.15]} material={outfitMat}>
          <cylinderGeometry args={[0.055, 0.045, 0.35, 10]} />
        </mesh>

        {/* Right arm */}
        <mesh position={[0.32, -0.02, 0]} rotation={[0, 0, -0.15]} material={outfitMat}>
          <cylinderGeometry args={[0.055, 0.045, 0.35, 10]} />
        </mesh>

        {/* Neck (skin) */}
        <mesh position={[0, 0.32, 0]} material={skinMat}>
          <cylinderGeometry args={[0.07, 0.08, 0.1, 12]} />
        </mesh>
      </group>

      {/* ── Head Group (tracks cursor) ── */}
      <group ref={headRef} position={[0, 0.15, 0]}>
        {/* Main head sphere (skin) */}
        <mesh material={skinMat}>
          <sphereGeometry args={[0.32, 24, 24]} />
        </mesh>

        {/* ── Hair ── */}
        {/* Top hair volume */}
        <mesh position={[0, 0.12, -0.02]} material={hairMat}>
          <sphereGeometry args={[0.33, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        </mesh>

        {/* Hair bangs (front fringe) */}
        <mesh position={[0, 0.18, 0.18]} rotation={[0.5, 0, 0]} material={hairMat}>
          <boxGeometry args={[0.52, 0.12, 0.12]} />
        </mesh>

        {/* Left hair side strand */}
        <mesh position={[-0.28, -0.05, 0.02]} rotation={[0, 0, 0.2]} material={hairMat}>
          <capsuleGeometry args={[0.06, 0.2, 4, 10]} />
        </mesh>

        {/* Right hair side strand */}
        <mesh position={[0.28, -0.05, 0.02]} rotation={[0, 0, -0.2]} material={hairMat}>
          <capsuleGeometry args={[0.06, 0.2, 4, 10]} />
        </mesh>

        {/* Back hair */}
        <mesh position={[0, -0.08, -0.14]} material={hairMat}>
          <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, Math.PI / 4, Math.PI / 1.5]} />
        </mesh>

        {/* ── Face features ── */}

        {/* Left eye (Cobalt Blue glow) */}
        <mesh ref={leftEyeRef} position={[-0.1, 0.05, 0.28]} material={eyeMat}>
          <sphereGeometry args={[0.065, 16, 16]} />
        </mesh>

        {/* Left eye highlight (white glint) */}
        <mesh position={[-0.08, 0.07, 0.33]} material={eyeHighlightMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>

        {/* Right eye (Cobalt Blue glow) */}
        <mesh ref={rightEyeRef} position={[0.1, 0.05, 0.28]} material={eyeMat}>
          <sphereGeometry args={[0.065, 16, 16]} />
        </mesh>

        {/* Right eye highlight (white glint) */}
        <mesh position={[0.12, 0.07, 0.33]} material={eyeHighlightMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>

        {/* Nose hint */}
        <mesh position={[0, -0.03, 0.31]} material={skinMat}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>

        {/* Small smile */}
        <mesh position={[0, -0.1, 0.3]} rotation={[0.1, 0, 0]} material={mouthMat}>
          <torusGeometry args={[0.04, 0.008, 8, 16, Math.PI]} />
        </mesh>

        {/* Blush marks – left cheek */}
        <mesh position={[-0.16, -0.04, 0.24]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>

        {/* Blush marks – right cheek */}
        <mesh position={[0.16, -0.04, 0.24]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Scene (lights + character)
   ────────────────────────────────────────────────────────── */
function Scene({ theme }: { theme?: string }) {
  const isDark = theme === "dark";
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={isDark ? 0.6 : 0.7} color={isDark ? "#dbeafe" : "#e0e4ff"} />

      {/* Key light — neutral */}
      <directionalLight position={[3, 4, 5]} intensity={isDark ? 1.2 : 1.1} color="#ffffff" />

      {/* Rim light — Cobalt Blue (right) */}
      <pointLight position={[4, 2, -2]} intensity={isDark ? 2.0 : 1.5} color="#3b82f6" distance={12} />

      {/* Rim light — Cobalt Blue (left) */}
      <pointLight position={[-4, 2, -2]} intensity={isDark ? 1.6 : 1.2} color="#2563eb" distance={12} />

      {/* Shoulder level rim lights to pop the torso/arms out of dark background */}
      <pointLight position={[-2, -0.3, -1]} intensity={isDark ? 2.5 : 1.2} color="#3b82f6" distance={5} />
      <pointLight position={[2, -0.3, -1]} intensity={isDark ? 2.5 : 1.2} color="#2563eb" distance={5} />

      {/* Under-fill — soft grey */}
      <pointLight position={[0, -3, 3]} intensity={0.4} color={isDark ? "#3f3f46" : "#a1a1aa"} distance={10} />

      <AnimeCharacter theme={theme} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Loading fallback
   ────────────────────────────────────────────────────────── */
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-dashed border-primary/40 border-t-primary animate-spin" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Exported component — same name & API
   ────────────────────────────────────────────────────────── */
export function Hero3DLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted ? resolvedTheme : "dark";

  return (
    <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene theme={theme} />
        </Canvas>
      </Suspense>
    </div>
  );
}

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function GlowingGlobe() {
  const globeRef = useRef();
  const ringsRef = useRef();
  const particlesRef = useRef();

  // Generate globe surface points representing continents/data nodes
  const { points, colors } = useMemo(() => {
    const pts = [];
    const cols = [];
    const count = 1200;
    const colorPalette = [
      new THREE.Color('#00f2fe'),
      new THREE.Color('#4facfe'),
      new THREE.Color('#f093fb'),
      new THREE.Color('#f5576c'),
      new THREE.Color('#00ff87'),
      new THREE.Color('#ff0844'),
      new THREE.Color('#ffb199'),
    ];

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.35;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      pts.push(x, y, z);
      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols.push(col.r, col.g, col.b);
    }
    return {
      points: new Float32Array(pts),
      colors: new Float32Array(cols),
    };
  }, []);

  // Generate connection network lines
  const linePositions = useMemo(() => {
    const lines = [];
    const numPoints = points.length / 3;
    for (let i = 0; i < 180; i++) {
      const idx1 = Math.floor(Math.random() * numPoints) * 3;
      const idx2 = Math.floor(Math.random() * numPoints) * 3;

      const p1 = new THREE.Vector3(points[idx1], points[idx1 + 1], points[idx1 + 2]);
      const p2 = new THREE.Vector3(points[idx2], points[idx2 + 1], points[idx2 + 2]);

      if (p1.distanceTo(p2) < 0.9 && p1.distanceTo(p2) > 0.2) {
        lines.push(p1.x, p1.y, p1.z);
        lines.push(p2.x, p2.y, p2.z);
      }
    }
    return new Float32Array(lines);
  }, [points]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.15;
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, idx) => {
        ring.rotation.z = t * (0.2 + idx * 0.1);
        ring.rotation.x = Math.sin(t * 0.3 + idx) * 0.2;
      });
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -t * 0.08;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Central Inner Glow Sphere */}
      <mesh>
        <sphereGeometry args={[1.28, 48, 48]} />
        <meshStandardMaterial
          color="#060c24"
          emissive="#120738"
          emissiveIntensity={0.8}
          roughness={0.4}
          metalness={0.9}
        />
      </mesh>

      {/* Atmospheric Outer Glow */}
      <mesh>
        <sphereGeometry args={[1.36, 32, 32]} />
        <meshBasicMaterial
          color="#4facfe"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rotating Data Points / Continents */}
      <group ref={globeRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length / 3}
              array={points}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={colors.length / 3}
              array={colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            vertexColors
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Network Neural Lines */}
        {linePositions.length > 0 && (
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={linePositions.length / 3}
                array={linePositions}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#00f2fe"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        )}
      </group>

      {/* Orbiting Laser Neon Rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 3, 0.4, 0]}>
          <ringGeometry args={[1.7, 1.73, 80]} />
          <meshBasicMaterial
            color="#ff007f"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 4, -0.3, 0]}>
          <ringGeometry args={[1.9, 1.925, 80]} />
          <meshBasicMaterial
            color="#00f2fe"
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[Math.PI / 6, 0.8, 0]}>
          <ringGeometry args={[2.1, 2.12, 80]} />
          <meshBasicMaterial
            color="#ffaa00"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Floating Dust / Ambient Data Particles */}
      <group ref={particlesRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={200}
              array={new Float32Array(
                Array.from({ length: 600 }, () => (Math.random() - 0.5) * 5)
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#f093fb"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

export default function HoloGlobe() {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} color="#00f2fe" intensity={2} />
        <pointLight position={[-5, -5, 5]} color="#ff007f" intensity={2} />
        <pointLight position={[0, -4, 2]} color="#7928ca" intensity={1.5} />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <GlowingGlobe />
        </Float>
      </Canvas>
    </div>
  );
}

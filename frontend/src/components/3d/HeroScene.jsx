import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function CyberGlobe() {
  const globeRef = useRef();
  const ringsRef = useRef();

  // Generate glowing data points on globe surface
  const { points, colors } = useMemo(() => {
    const pts = [];
    const cols = [];
    const count = 900;
    const colorPalette = [
      new THREE.Color('#00f2fe'),
      new THREE.Color('#4facfe'),
      new THREE.Color('#f093fb'),
      new THREE.Color('#ff007f'),
      new THREE.Color('#00ff87'),
    ];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.15; // Scaled down so nothing gets cut

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

  // Neural network connecting lines
  const linePositions = useMemo(() => {
    const lines = [];
    const numPoints = points.length / 3;
    for (let i = 0; i < 120; i++) {
      const idx1 = Math.floor(Math.random() * numPoints) * 3;
      const idx2 = Math.floor(Math.random() * numPoints) * 3;

      const p1 = new THREE.Vector3(points[idx1], points[idx1 + 1], points[idx1 + 2]);
      const p2 = new THREE.Vector3(points[idx2], points[idx2 + 1], points[idx2 + 2]);

      if (p1.distanceTo(p2) < 0.75 && p1.distanceTo(p2) > 0.2) {
        lines.push(p1.x, p1.y, p1.z);
        lines.push(p2.x, p2.y, p2.z);
      }
    }
    return new Float32Array(lines);
  }, [points]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.12;
      globeRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, idx) => {
        ring.rotation.z = t * (0.15 + idx * 0.08);
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[1.08, 36, 36]} />
        <meshStandardMaterial
          color="#030718"
          emissive="#110729"
          emissiveIntensity={0.9}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Atmospheric Halo */}
      <mesh>
        <sphereGeometry args={[1.18, 32, 32]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rotating Nodes & Wireframe */}
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
            size={0.038}
            vertexColors
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </points>

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

      {/* Orbital Laser Rings (Properly scaled so they never clip) */}
      <group ref={ringsRef}>
        {/* Ring 1 */}
        <mesh rotation={[Math.PI / 3, 0.3, 0]}>
          <ringGeometry args={[1.45, 1.48, 64]} />
          <meshBasicMaterial
            color="#ff007f"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Ring 2 */}
        <mesh rotation={[-Math.PI / 4, -0.4, 0]}>
          <ringGeometry args={[1.65, 1.675, 64]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Ring 3 */}
        <mesh rotation={[Math.PI / 6, 0.6, 0]}>
          <ringGeometry args={[1.82, 1.84, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[6, 6, 6]} color="#00f2fe" intensity={1.8} />
        <pointLight position={[-6, -6, 6]} color="#ff007f" intensity={1.8} />
        <Stars radius={60} depth={30} count={120} factor={3} saturation={0} fade speed={1} />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
          <CyberGlobe />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}

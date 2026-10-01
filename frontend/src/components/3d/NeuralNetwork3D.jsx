import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';

function MiniNetwork() {
  const group = useRef();
  
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  const nodes = [
    [1, 1, 0], [-1, 1, 0], [0, -1, 1], [0, -1, -1],
    [1.5, -0.5, 0], [-1.5, -0.5, 0], [0, 0.5, 1.5], [0, 0.5, -1.5]
  ];

  const connections = [
    [0,1], [0,2], [0,4], [1,3], [1,5], [2,3], [2,6], [3,7], [4,6], [5,7]
  ];

  return (
    <group ref={group} scale={0.8}>
      {nodes.map((pos, i) => (
        <Sphere key={`node-${i}`} position={pos} args={[0.08, 16, 16]}>
          <meshBasicMaterial color="#22d3ee" />
        </Sphere>
      ))}
      {connections.map(([a, b], i) => (
        <Line 
          key={`line-${i}`} 
          points={[nodes[a], nodes[b]]} 
          color="#8b5cf6" 
          transparent 
          opacity={0.4} 
          lineWidth={1} 
        />
      ))}
    </group>
  );
}

export default function NeuralNetwork3D() {
  return (
    <div className="relative glass rounded-xl border border-electric-blue/20 flex flex-col items-center justify-center overflow-hidden" style={{ height: '250px' }}>
      <div className="absolute top-3 left-4 z-10">
        <h3 className="text-sm font-semibold text-gray-300">Prediction Network</h3>
      </div>
      <Canvas camera={{ position: [0, 0, 4] }} gl={{ alpha: true }}>
        <MiniNetwork />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}

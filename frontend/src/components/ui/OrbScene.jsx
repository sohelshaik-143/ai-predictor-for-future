import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Float } from '@react-three/drei';

function AnimatedOrb() {
  const sphereRef = useRef();

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
        />
      </Sphere>
    </Float>
  );
}

export function OrbScene({ className }) {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#10b981" />
        <AnimatedOrb />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

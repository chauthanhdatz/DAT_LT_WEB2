import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';

function FloatingPaw() {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time * 2) * 0.2;
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <group ref={meshRef}>
      {/* Abstract floating shapes representing energy/love */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} scale={1.2}>
          <MeshDistortMaterial
            color="#ec4899"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
          />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={[2, 1, -1]}>
         <Sphere args={[0.5, 32, 32]}>
          <MeshDistortMaterial color="#6366f1" distort={0.5} speed={3} />
        </Sphere>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2} position={[-2, -1, -0.5]}>
         <Sphere args={[0.3, 32, 32]}>
          <MeshDistortMaterial color="#14b8a6" distort={0.6} speed={4} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-60" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ec4899" />
        <FloatingPaw />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}

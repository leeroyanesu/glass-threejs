import { 
  Center, 
  Html, 
  OrbitControls, 
  useGLTF, 
  useTexture,
  Environment,
  Lightformer,
  PerformanceMonitor,
  MeshTransmissionMaterial
} from "@react-three/drei";
import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

export const Experience = () => {
  const [currentTexture, setCurrentTexture] = useState("/models/Bottle.png");
  const bottleRef = useRef();
  const controlsRef = useRef();

  // Optionally lock camera position and look at bottle
  useFrame(({ camera }) => {
    if (bottleRef.current && controlsRef.current) {
      controlsRef.current.target.copy(bottleRef.current.position);
    }
  });

  return (
    <>
      <OrbitControls 
        ref={controlsRef} 
        enableDamping 
        dampingFactor={0.05} 
        autoRotate={true}
        autoRotateSpeed={2}
        enablePan={false}
        enableZoom={false}
        minDistance={12}
        maxDistance={12}
      />
      
      <PerformanceMonitor />
      
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 5, -9]} scale={[10, 5, 1]} />
        <Lightformer intensity={2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
        <Lightformer intensity={2} position={[10, 1, 0]} scale={[10, 2, 1]} />
      </Environment>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} />
      <Center>
        <GlassBottle texturePath={currentTexture} ref={bottleRef} />
        <Html>
          <ImageUploader onImageUpload={setCurrentTexture} />
        </Html>
      </Center>
    </>
  );
};

const GlassBottle = ({ texturePath }, ref) => {
  const { nodes, materials } = useGLTF("/models/Rick Coleman.glb");
  const texture = useTexture(texturePath);

  let glassPropsFinal = {
    opacity: 1,
    roughness: 0.28,
    thickness: 0.5,
    transmission: 0.16,
    clearcoat: 0,
    clearcoatRoughness: 0,
    metalness: 0.1,
    envMapIntensity: 3,
    ior: 2.5
  };

  // Configure texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.flipY = false;

  return (
    <group ref={ref}>
      {/* Light source behind texture */}
      <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={texture} 
            toneMapped={false}
            color={new THREE.Color(1, 1, 1)}
          />
        </mesh>
      
      {Object.keys(nodes).map((key) => {
        const node = nodes[key];
        if (node.isMesh) {
          return (
            <mesh
              key={key}
              geometry={node.geometry}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            >
              <MeshTransmissionMaterial
                map={texture}
                emissive={new THREE.Color(1, 1, 1)}
                emissiveMap={texture}
                emissiveIntensity={0.5}
                background={new THREE.Color('#ffffff')}
                backside
                samples={10}
                resolution={1024}
                transmission={0.9}
                roughness={0.28}
                thickness={0.5}
                ior={2.5}
                chromaticAberration={0.03}
                anisotropy={0.1}
                distortion={0}
                distortionScale={0.3}
                temporalDistortion={0.1}
              />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};

const ImageUploader = ({ onImageUpload }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  };

  return (
    <div style={{
      position: "absolute",
      top: "20px",
      left: "20px",
      zIndex: 1000,
    }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "2px solid #333",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

// Preload the model
useGLTF.preload("/models/Rick Coleman.glb");

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import InteractiveParticles from './InteractiveParticles';
import DepthLayers from './DepthLayers';
import EntranceAnimations from './EntranceAnimations';
import heroBg from '@/assets/hero-bg.jpg';
import './hero-animations.css';

// Floating geometric shapes component
const FloatingShapes: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create multiple geometric shapes with different properties
  const shapes = useMemo(() => [
    { type: 'octahedron', position: [-8, 4, -2], scale: 0.8, color: '#3b82f6' },
    { type: 'tetrahedron', position: [6, -3, -1], scale: 1.2, color: '#8b5cf6' },
    { type: 'icosahedron', position: [-4, -5, 1], scale: 0.6, color: '#06b6d4' },
    { type: 'dodecahedron', position: [8, 2, -3], scale: 0.9, color: '#3b82f6' },
    { type: 'octahedron', position: [2, 6, 2], scale: 0.7, color: '#8b5cf6' },
    { type: 'tetrahedron', position: [-6, 1, 3], scale: 1.0, color: '#06b6d4' },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Orbit the entire group around the title
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    
    // Individual shape animations
    groupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        const shape = shapes[index];
        const offset = index * 0.5;
        
        // Individual rotation
        child.rotation.x = time * 0.3 + offset;
        child.rotation.y = time * 0.2 + offset;
        child.rotation.z = time * 0.4 + offset;
        
        // Floating motion
        child.position.y = shape.position[1] + Math.sin(time * 0.8 + offset) * 0.5;
        child.position.x = shape.position[0] + Math.cos(time * 0.6 + offset) * 0.3;
        child.position.z = shape.position[2] + Math.sin(time * 0.4 + offset) * 0.2;
      }
    });
  });

  const createGeometry = (type: string) => {
    switch (type) {
      case 'octahedron':
        return <octahedronGeometry args={[1]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <Float
          key={index}
          speed={1.5 + index * 0.2}
          rotationIntensity={0.3}
          floatIntensity={0.2}
        >
          <mesh
            position={shape.position as [number, number, number]}
            scale={shape.scale}
          >
            {createGeometry(shape.type)}
            <MeshDistortMaterial
              color={shape.color}
              transparent
              opacity={0.7}
              distort={0.2}
              speed={2}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// 3D Text component with proper styling
const Hero3DText: React.FC = () => {
  const textGroupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!textGroupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Subtle floating animation for the entire text group
    textGroupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    textGroupRef.current.rotation.y = Math.sin(time * 0.2) * 0.02;
  });

  return (
    <group ref={textGroupRef}>
      <Center>
        <group>
          {/* "IN" part with gradient effect */}
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={1.2}
            height={0.3}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[-4.5, 0, 0]}
          >
            IN
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.3}
              roughness={0.2}
              emissive="#1e40af"
              emissiveIntensity={0.1}
            />
          </Text3D>

          {/* "TEMS" part in blue without glow as specified */}
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={1.2}
            height={0.3}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[-2.8, 0, 0]}
          >
            TEMS
            <meshStandardMaterial
              color="#3b82f6"
              metalness={0.2}
              roughness={0.3}
              emissive="#000000"
              emissiveIntensity={0}
            />
          </Text3D>

          {/* "TELLAR" part with gradient effect */}
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={1.2}
            height={0.3}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[0.5, 0, 0]}
          >
            TELLAR
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.3}
              roughness={0.2}
              emissive="#1e40af"
              emissiveIntensity={0.1}
            />
          </Text3D>
        </group>
      </Center>
    </group>
  );
};

// 3D Scene Content Component (to be used inside Canvas from Scene3D)
export const Hero3DScene: React.FC = () => {
  return (
    <group>
      {/* Enhanced lighting for 3D text */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={0.8}
        color="#4f46e5"
      />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#3b82f6"
      />
      
      {/* Depth Layers with Multiple Parallax Speeds - Reduced for performance */}
      <DepthLayers
        layerCount={4}
        particlesPerLayer={40}
        maxDepth={20}
        scrollMultiplier={0.3}
      />
      
      {/* Interactive Mouse-Following Particles - Reduced for performance */}
      <EntranceAnimations delay={0.5} duration={2.5} intensity="medium">
        <InteractiveParticles
          count={80}
          trailLength={6}
          burstIntensity={20}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#ffffff', '#f59e0b']}
          size={0.04}
          speed={1.5}
        />
      </EntranceAnimations>
      
      {/* 3D Text with Spectacular Entrance */}
      <EntranceAnimations delay={1.0} duration={3.0} intensity="heavy">
        <Hero3DText />
      </EntranceAnimations>
      
      {/* Floating Geometric Shapes with Staggered Entrance */}
      <EntranceAnimations delay={1.8} duration={2.0} intensity="medium">
        <FloatingShapes />
      </EntranceAnimations>
    </group>
  );
};

// Main Hero3D component - HTML overlay only
const Hero3D: React.FC = () => {
  // Smooth scroll handler with offset for fixed header
  const handleExploreClick = () => {
    const targetElement = document.getElementById('events');
    
    if (targetElement) {
      // Calculate absolute position from top of document
      let offsetTop = 0;
      let element: HTMLElement | null = targetElement;
      
      while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent as HTMLElement | null;
      }
      
      // Get header height (80px default)
      const headerHeight = 80;
      
      // Scroll to position with header offset and padding
      window.scrollTo({
        top: offsetTop - headerHeight - 20,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden pb-0"
      style={{ height: '50vh', minHeight: '400px' }}
    >
      
      {/* Content Overlay with Spectacular Entrance */}
      <div className="container mx-auto px-6 text-center z-10 mt-20 hardware-accelerated">
        {/* Main Title - Line 1 */}
        <h1 
          className="text-3xl md:text-5xl font-bold mb-4 opacity-0 hardware-accelerated"
          style={{ 
            animation: "spectacularFadeInUp 0.8s ease-out 0.2s forwards",
          }}
        >
          WELCOME TO
        </h1>
        
        {/* Main Title - Line 2 */}
        <h2 
          className="text-3xl md:text-5xl font-bold mb-8 opacity-0 hardware-accelerated inline-block" 
          style={{ 
            animation: "spectacularFadeInUp 0.7s ease-out 0.3s forwards",
          }}
        >
          <div>IN<span className="text-primary">TEMS</span>TELLAR</div>
          <div className="text-right text-sm md:text-lg">CHAPTER 1</div>
        </h2>
        
        {/* Description with dramatic entrance */}
        <p 
          className="text-xl md:text-2xl font-semibold text-foreground/80 mb-10 max-w-3xl mx-auto opacity-0 transform translate-y-10 hover:text-foreground transition-colors duration-500 hardware-accelerated leading-relaxed" 
          style={{ 
            animation: "spectacularFadeInUp 0.7s ease-out 0.4s forwards",
          }}
        >
          AN IEEE TEMS SYMPOSIUM EXPERIENCE
        </p>
        
        {/* Action Buttons with same entrance as text */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 transform translate-y-10 hardware-accelerated" 
          style={{ 
            animation: "spectacularFadeInUp 0.7s ease-out 0.8s forwards",
          }}
        >
          <Button
            size="lg"
            className="interactive btn-interactive click-ripple bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-xl transition-all duration-500 hardware-accelerated"
            onClick={handleExploreClick}
          >
            Explore Events
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="interactive btn-interactive click-ripple border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-lg px-8 py-6 transition-all duration-500 hardware-accelerated"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn More
          </Button>
        </div>
      </div>

    </section>
  );
};

export default Hero3D;
import { Suspense, lazy } from "react";
import Header3D from "@/components/3d/Header3D";
import Hero3D, { Hero3DScene } from "@/components/3d/Hero3D";
import CardSlider from "@/components/CardSlider";
import Events3D from "@/components/3d/Events3D";
import AnimatedSection from "@/components/3d/AnimatedSection";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Scene3D from "@/components/3d/Scene3D";

// Import web series images
import allOfUsAreDead from "@/assets/All of us are dead.jpg";
import gameOfThrones from "@/assets/Game of Thrones.jpg";
import squidGame from "@/assets/Squid Game.jpg";
import dark from "@/assets/Dark.jpg";

// Lazy load Contact component for better performance
const Contact = lazy(() => import("@/components/Contact"));

const Index = () => {
  return (
    <div 
      className="min-h-screen text-foreground relative"
      style={{
        background: 'linear-gradient(to bottom, rgba(0, 7, 45, 0.75), rgba(0, 7, 45, 0.86))',
      }}
    >
      {/* Global 3D Scene with Hero 3D content - Reduced particle count for better performance */}
      <Scene3D enableParticles={true} particleCount={200} showStats={false}>
        {/* Hero 3D Scene with all complex 3D elements */}
        <Hero3DScene />
      </Scene3D>
      
      {/* Page Content */}
      <Header3D />
      <Hero3D />
      <CardSlider 
        images={[
          allOfUsAreDead,
          gameOfThrones,
          squidGame,
          dark
        ]}
        autoScrollSpeed={8}
      />
      <AnimatedSection animationType="slide" intensity="light">
        <About />
      </AnimatedSection>
      <AnimatedSection animationType="slide" intensity="medium">
        <Events3D />
      </AnimatedSection>
      <AnimatedSection animationType="slide" intensity="light">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
          <Contact />
        </Suspense>
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;

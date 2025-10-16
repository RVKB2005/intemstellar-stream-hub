import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import EventCard3D from './EventCard3D';
import FadeInSection from '@/components/FadeInSection';
import brandoVationImg from "@/assets/brand-o-vation.jpg";
import paradoxProtocolImg from "@/assets/paradox-protocol.jpg";
import venturaImg from "@/assets/ventura.jpg";
import capitalyzeImg from "@/assets/capitalyze.jpg";

const Events3D: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [focusedCard, setFocusedCard] = useState<number | null>(null);
  const [globalParticles, setGlobalParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, color: string}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const globalParticleIdRef = useRef(0);
  
  // Mouse tracking for connecting lines
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  
  // Transform hooks must be called unconditionally
  const transformedX = useTransform(springX, x => x);
  const transformedY = useTransform(springY, y => y);

  const events = [
    {
      id: 0,
      title: "Brand-o-Vation",
      subtitle: "The Last Ad-pocalypse",
      theme: "All of Us Are Dead",
      tagline: "Go Viral or Go Dead!",
      coordinators: [
        { name: "Lalith J", phone: "9791382086", year: "2nd Year" },
        { name: "Kamalika N M", phone: "9042887720", year: "2nd Year" },
        { name: "Akshitha Jyothi D", phone: "6382982045", year: "3rd Year" },
      ],
      image: brandoVationImg,
      accentColor: "hsl(0 80% 50%)",
      position: { x: 0, y: 0 }
    },
    {
      id: 1,
      title: "The Paradox Protocol",
      subtitle: "",
      theme: "Dark",
      tagline: "Reimagine. Rebuild. Redefine Reality.",
      coordinators: [
        { name: "Varshini", phone: "8667801807", year: "2nd Year" },
        { name: "Harsha Nandhini", phone: "9840335963", year: "2nd Year" },
        { name: "Surya", phone: "7904461620", year: "3rd Year" },
      ],
      image: paradoxProtocolImg,
      accentColor: "hsl(45 100% 55%)",
      position: { x: 1, y: 0 }
    },
    {
      id: 2,
      title: "Ventura",
      subtitle: "",
      theme: "Squid Game",
      tagline: "Play. Survive. Conquer.",
      coordinators: [
        { name: "Sanjay V", phone: "8610315770", year: "2nd Year" },
        { name: "Vetrichelva RS", phone: "9344016363", year: "2nd Year" },
        { name: "Shaheen", phone: "+91 78455 88146", year: "3rd Year" },
      ],
      image: venturaImg,
      accentColor: "hsl(330 100% 65%)",
      position: { x: 0, y: 1 }
    },
    {
      id: 3,
      title: "Capitalyze",
      subtitle: "",
      theme: "Game of Thrones",
      tagline: "Strategize the Business, Seize the Throne.",
      coordinators: [
        { name: "Manodharani", phone: "8438616965", year: "2nd Year" },
        { name: "Bhagavadgitan", phone: "9047900060", year: "2nd Year" },
        { name: "Keerthana", phone: "9047563090", year: "3rd Year" },
      ],
      image: capitalyzeImg,
      accentColor: "hsl(210 80% 50%)",
      position: { x: 1, y: 1 }
    },
  ];

  // Handle mouse movement for connecting lines and global effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        
        // Create ambient particles on mouse movement when cards are hovered
        if ((hoveredCard !== null || focusedCard !== null) && Math.random() > 0.8) {
          createGlobalParticle(e.clientX - rect.left, e.clientY - rect.top);
        }
      }
    };

    if (hoveredCard !== null || focusedCard !== null) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredCard, focusedCard, mouseX, mouseY]);

  // Animate global particles
  useEffect(() => {
    const animateGlobalParticles = () => {
      setGlobalParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravity
        })).filter(particle => 
          particle.y < window.innerHeight && particle.x > -100 && particle.x < window.innerWidth + 100
        )
      );
    };

    const interval = setInterval(animateGlobalParticles, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  const createGlobalParticle = (x: number, y: number) => {
    const activeCard = hoveredCard !== null ? events[hoveredCard] : focusedCard !== null ? events[focusedCard] : null;
    const color = activeCard ? activeCard.accentColor : 'hsl(210 100% 60%)';
    
    const newParticle = {
      id: globalParticleIdRef.current++,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2 - 1,
      color,
    };
    
    setGlobalParticles(prev => [...prev, newParticle].slice(-30)); // Limit particles
  };

  // Calculate connecting lines between related events
  const getConnectingLines = () => {
    if (hoveredCard === null) return [];
    
    const lines = [];
    const hoveredEvent = events[hoveredCard];
    
    // Connect to adjacent events (simple grid-based logic)
    events.forEach((event, index) => {
      if (index !== hoveredCard) {
        const distance = Math.abs(event.position.x - hoveredEvent.position.x) + 
                        Math.abs(event.position.y - hoveredEvent.position.y);
        
        // Connect to adjacent cards (distance of 1 in grid)
        if (distance === 1) {
          lines.push({
            from: hoveredCard,
            to: index,
            color: hoveredEvent.accentColor
          });
        }
      }
    });
    
    return lines;
  };

  const connectingLines = getConnectingLines();

  return (
    <section 
      id="events" 
      className="pt-24 pb-24 relative overflow-hidden perspective-1000" 
      style={{ 
        scrollMarginTop: '80px',
      }}
    >
      
      {/* Background Pattern with 3D depth */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          transform: "translateZ(-100px) scale(1.2)"
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        <FadeInSection>
        <motion.div 
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              transform: "translateZ(50px)"
            }}
          >
            Featured <span className="text-primary">Events</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            style={{
              transform: "translateZ(25px)"
            }}
          >
            Four epic events inspired by the most captivating web series
          </motion.p>
        </motion.div>

        {/* 3D Grid Container */}
        <div className="relative preserve-3d max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 md:gap-20 relative">
            {events.map((event, index) => (
              <EventCard3D
                key={event.title}
                {...event}
                index={index}
                isHovered={hoveredCard === index}
                onHover={() => {
                  setHoveredCard(index);
                  // Create celebration particles when hovering
                  for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                      createGlobalParticle(
                        (event.position.x * 432) + 200 + Math.random() * 200,
                        (event.position.y * 532) + 250 + Math.random() * 200
                      );
                    }, i * 100);
                  }
                }}
                onLeave={() => {
                  setHoveredCard(null);
                  setGlobalParticles([]); // Clear global particles
                }}
                delay={index * 0.15}
              />
            ))}
          </div>


        </div>
        </FadeInSection>
      </div>

      {/* Enhanced 3D Environment Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {(hoveredCard !== null || focusedCard !== null) && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at ${events[hoveredCard || focusedCard || 0].position.x * 50 + 25}% ${events[hoveredCard || focusedCard || 0].position.y * 50 + 25}%, ${events[hoveredCard || focusedCard || 0].accentColor}20, transparent 60%)`,
            }}
          />
        )}
        
        {/* Ambient lighting for multiple cards */}
        {hoveredCard !== null && focusedCard !== null && hoveredCard !== focusedCard && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at ${events[focusedCard].position.x * 50 + 25}% ${events[focusedCard].position.y * 50 + 25}%, ${events[focusedCard].accentColor}15, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* Global Particle System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {globalParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle, ${particle.color}, transparent)`,
              left: particle.x,
              top: particle.y,
              boxShadow: `0 0 12px ${particle.color}`,
            }}
            animate={{
              opacity: [1, 0.8, 0],
              scale: [0.3, 1.2, 0],
            }}
            transition={{
              duration: 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Interactive Background Distortion */}
      {(hoveredCard !== null || focusedCard !== null) && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg at ${events[hoveredCard || focusedCard || 0].position.x * 50 + 25}% ${events[hoveredCard || focusedCard || 0].position.y * 50 + 25}%, transparent, ${events[hoveredCard || focusedCard || 0].accentColor}10, transparent)`,
          }}
          animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      )}
    </section>
  );
};

export default Events3D;
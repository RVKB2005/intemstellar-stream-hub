import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimation } from "framer-motion";

interface Coordinator {
  name: string;
  phone: string;
  year: string;
}

interface EventCard3DProps {
  id: number;
  title: string;
  theme: string;
  tagline: string;
  coordinators: Coordinator[];
  image: string;
  accentColor: string;
  delay: number;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  position: { x: number; y: number };
}

const EventCard3D: React.FC<EventCard3DProps> = ({
  title,
  theme,
  tagline,
  coordinators,
  image,
  accentColor,
  delay,
  index,
  isHovered,
  onHover,
  onLeave,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();
  
  // Animation controls for complex sequences
  const controls = useAnimation();

  // Mouse tracking for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smooth movement
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  
  // Transform mouse position to rotation values - more dramatic for impressive effects
  const rotateX = useTransform(springY, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  
  // Enhanced levitation effect with depth changes
  const levitateY = useTransform(springY, [-0.5, 0.5], [-30, -60]);
  const levitateZ = useTransform(springX, [-0.5, 0.5], [20, 80]);
  
  // Depth-changing scale effect
  const depthScale = useTransform(springY, [-0.5, 0.5], [1.02, 1.15]);
  
  // Particle system for interaction effects
  useEffect(() => {
    if (isHovered || isFocused) {
      const interval = setInterval(() => {
        createParticleBurst();
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isHovered, isFocused]);
  
  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.2, // gravity
        })).filter(particle => 
          particle.y < 600 && particle.x > -50 && particle.x < 450
        )
      );
      
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };
    
    if (particles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length]);
  
  const createParticleBurst = () => {
    const newParticles = Array.from({ length: 3 }, () => ({
      id: particleIdRef.current++,
      x: Math.random() * 400,
      y: Math.random() * 300 + 100,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2 - 1,
    }));
    
    setParticles(prev => [...prev, ...newParticles].slice(-20)); // Limit particles
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseXPercent = (e.clientX - centerX) / (rect.width / 2);
    const mouseYPercent = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(mouseXPercent);
    mouseY.set(mouseYPercent);
    
    // Trigger particle burst on mouse movement when hovered
    if (isHovered && Math.random() > 0.95) {
      createParticleBurst();
    }
  };

  const handleMouseEnter = () => {
    onHover();
    // Trigger impressive entrance animation sequence
    controls.start({
      scale: [1, 1.1, 1.05],
      rotateZ: [0, 2, 0],
      transition: { duration: 0.6, ease: "easeOut" }
    });
    
    // Create initial particle burst
    createParticleBurst();
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setParticles([]); // Clear particles
    onLeave();
    
    // Reset animation
    controls.start({
      scale: 1,
      rotateZ: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipping(true);
    setIsFlipped(!isFlipped);
    
    // Reset mouse position to prevent tilt during flip
    mouseX.set(0);
    mouseY.set(0);
    
    // Reset flipping state after animation completes (0.8s)
    setTimeout(() => {
      setIsFlipping(false);
    }, 800);
    
    // Create explosion effect
    const explosionParticles = Array.from({ length: 15 }, () => ({
      id: particleIdRef.current++,
      x: 200 + (Math.random() - 0.5) * 100,
      y: 300 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 6 - 3,
    }));
    
    setParticles(prev => [...prev, ...explosionParticles]);
  };

  const handleFocus = () => {
    setIsFocused(true);
    
    // Depth-changing focus animation
    controls.start({
      z: [0, 100, 80],
      scale: [1, 1.15, 1.1],
      rotateX: [0, -5, -3],
      transition: { duration: 0.8, ease: "easeOut" }
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    controls.start({
      z: 0,
      scale: 1,
      rotateX: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative preserve-3d cursor-pointer overflow-visible"
      style={{
        perspective: "1000px",
      }}
      initial={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        scale: 1
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        scale: 1
      }}
      transition={{ 
        duration: 0.5, 
        delay: 0,
        ease: "easeOut"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      animate={controls}
    >
      {/* Card Container with 3D transforms */}
      <motion.div
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
        }}
        initial={false}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Inner container for hover effects */}
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: (!isFlipped && (isHovered || isFocused)) ? (rotateX as any) : 0,
            y: (!isFlipped && (isHovered || isFocused)) ? (levitateY as any) : 0,
            z: !isFlipped && isHovered ? 60 : !isFlipped && isFocused ? 100 : 0,
            scale: !isFlipped && isHovered ? 1.08 : !isFlipped && isFocused ? 1.12 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
        {/* Front Face */}
        <motion.div
          className="relative w-full backface-hidden rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "translateZ(0px)",
            boxShadow: isHovered 
              ? `0 0 20px ${accentColor}60, 0 0 40px ${accentColor}30, inset 0 0 30px ${accentColor}15`
              : `0 0 10px ${accentColor}30, inset 0 0 15px ${accentColor}10`,
          }}
          animate={{
            boxShadow: isHovered 
              ? `0 0 20px ${accentColor}60, 0 0 40px ${accentColor}30, inset 0 0 30px ${accentColor}15`
              : `0 0 10px ${accentColor}30, inset 0 0 15px ${accentColor}10`,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Card Image Background */}
          <div className="relative w-full">
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-contain block"
            />
            
            {/* Flip Indicator */}
            <motion.div
              className="absolute bottom-4 right-4 text-xs text-white bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm"
              animate={{
                opacity: isHovered ? 1 : 0.7,
              }}
              transition={{ duration: 0.3 }}
            >
              Click to flip for details →
            </motion.div>
          </div>
        </motion.div>

        {/* Back Face - Coordinators Details */}
        <motion.div
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden min-h-[500px]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)",
            background: `linear-gradient(135deg, ${accentColor}20, transparent 50%, ${accentColor}10)`,
          }}
        >
          <div className="relative h-full p-4 sm:p-6 md:p-8 flex flex-col justify-center bg-card/90 backdrop-blur-md">
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-3 text-center"
              style={{ color: accentColor }}
            >
              {title}
            </motion.h3>
            
            <motion.p 
              className="text-center font-bold mb-2 text-base"
              style={{ color: accentColor }}
            >
              {tagline}
            </motion.p>
            
            <motion.p className="text-center text-muted-foreground mb-6 text-sm leading-relaxed px-2">
              {title === "Brand-o-Vation" && "In a world where brands collapse and ads go extinct, only creative marketing can cure the chaos. Brand-o-Vation: The Last Ad-pocalypse is your final showdown—pitch the impossible, survive with imagination."}
              {title === "The Paradox Protocol" && "Reality fractures. Time rebels. Only brilliance can rewrite destiny in The Paradox Protocol."}
              {title === "Ventura" && "Hundreds enter. Only a few escape. In Ventura's ruthless investment arena, fake money seals real fates — SOLD is survival, UNSOLD is oblivion. Play. Survive. Conquer."}
              {title === "Capitalyze" && "Build your empire, conquer crises, and outsmart every rival who dares to challenge your throne. Every move counts — one brilliant strategy could crown you king, one mistake could crumble your empire."}
            </motion.p>
            
            <motion.p className="text-center text-muted-foreground mb-4 uppercase tracking-widest text-xs font-semibold">
              Event Coordinators
            </motion.p>
            
            <div className="space-y-2">
              {coordinators.map((coord, idx) => (
                <motion.div 
                  key={idx}
                  className="bg-card/80 backdrop-blur-sm p-3 rounded-lg border border-primary/30 hover:border-primary transition-all duration-300"
                  style={{ 
                    boxShadow: `0 0 20px ${accentColor}30`,
                  }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 0 30px ${accentColor}50`,
                  }}
                >
                  <p className="font-semibold text-foreground text-sm">{coord.name}</p>
                  <p className="text-xs text-muted-foreground">{coord.phone}</p>
                  <p className="text-xs font-medium" style={{ color: accentColor }}>{coord.year}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              className="mt-4 w-full py-2.5 px-6 rounded-lg font-semibold text-white transition-all duration-300"
              style={{ 
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${accentColor}40`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: coordinators.length * 0.1 + 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 30px ${accentColor}60`,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                
                let eventUrl = "";
                
                // Route to appropriate event site
                if (title === "Brand-o-Vation") {
                  eventUrl = "https://brand-o-vation.vercel.app/";
                } else if (title === "Ventura") {
                  eventUrl = "https://ventura-zeta.vercel.app/";
                } else if (title === "The Paradox Protocol") {
                  eventUrl = "https://paradox-protocol-theta.vercel.app/";
                } else if (title === "Capitalyze") {
                  eventUrl = "https://capitalyze.vercel.app/";
                } else {
                  // Handle registration for other events
                  alert(`Registration for ${title} coming soon!`);
                  return;
                }
                
                const newWindow = window.open(eventUrl, "_blank", "noopener,noreferrer");
                if (newWindow) newWindow.opener = null;
              }}
            >
              Register Now
            </motion.button>
            
            <motion.div
              className="text-xs text-muted-foreground opacity-60 text-center mt-4"
            >
              Click to flip back ←
            </motion.div>
          </div>
        </motion.div>

        {/* 3D Depth Shadow - hidden during flip and hover */}
        {!isFlipped && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              transform: "translateZ(-10px)",
              background: "rgba(0,0,0,0.3)",
              filter: "blur(10px)",
            }}
            initial={false}
            animate={{
              opacity: (isFlipping || isHovered) ? 0 : 0.3,
              scale: 1,
            }}
            transition={{ 
              opacity: { duration: 0.4, ease: "easeInOut" },
              scale: { duration: 0.7 }
            }}
          />
        )}
        </motion.div>
      </motion.div>

      {/* Enhanced Edge Sparks Effect */}
      {isHovered && (
        <div className="absolute -inset-8 pointer-events-none z-50 overflow-visible">
          {/* Top edge sparks */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`top-${i}`}
              className="absolute w-4 h-4 rounded-full"
              style={{ 
                background: `radial-gradient(circle, #fff, #fff, ${accentColor}, ${accentColor}80)`,
                left: `${i * 4}%`,
                top: '-4px',
                boxShadow: `0 0 30px ${accentColor}, 0 0 50px ${accentColor}, 0 0 70px ${accentColor}, 0 0 100px ${accentColor}60`,
                filter: 'brightness(2)',
              }}
              animate={{
                x: [-15, 15, -15],
                opacity: [0.9, 1, 0.9],
                scale: [1.2, 2.5, 1.2],
              }}
              transition={{
                duration: 0.8 + i * 0.05,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.03,
              }}
            />
          ))}
          {/* Bottom edge sparks */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`bottom-${i}`}
              className="absolute w-4 h-4 rounded-full"
              style={{ 
                background: `radial-gradient(circle, #fff, #fff, ${accentColor}, ${accentColor}80)`,
                left: `${i * 4}%`,
                bottom: '-4px',
                boxShadow: `0 0 30px ${accentColor}, 0 0 50px ${accentColor}, 0 0 70px ${accentColor}, 0 0 100px ${accentColor}60`,
                filter: 'brightness(2)',
              }}
              animate={{
                x: [15, -15, 15],
                opacity: [0.9, 1, 0.9],
                scale: [1.2, 2.5, 1.2],
              }}
              transition={{
                duration: 0.8 + i * 0.05,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.03 + 0.2,
              }}
            />
          ))}
          {/* Left edge sparks */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`left-${i}`}
              className="absolute w-4 h-4 rounded-full"
              style={{ 
                background: `radial-gradient(circle, #fff, #fff, ${accentColor}, ${accentColor}80)`,
                left: '-4px',
                top: `${i * 5}%`,
                boxShadow: `0 0 30px ${accentColor}, 0 0 50px ${accentColor}, 0 0 70px ${accentColor}, 0 0 100px ${accentColor}60`,
                filter: 'brightness(2)',
              }}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.9, 1, 0.9],
                scale: [1.2, 2.5, 1.2],
              }}
              transition={{
                duration: 0.9 + i * 0.05,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.04,
              }}
            />
          ))}
          {/* Right edge sparks */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`right-${i}`}
              className="absolute w-4 h-4 rounded-full"
              style={{ 
                background: `radial-gradient(circle, #fff, #fff, ${accentColor}, ${accentColor}80)`,
                right: '-4px',
                top: `${i * 5}%`,
                boxShadow: `0 0 30px ${accentColor}, 0 0 50px ${accentColor}, 0 0 70px ${accentColor}, 0 0 100px ${accentColor}60`,
                filter: 'brightness(2)',
              }}
              animate={{
                y: [15, -15, 15],
                opacity: [0.9, 1, 0.9],
                scale: [1.2, 2.5, 1.2],
              }}
              transition={{
                duration: 0.9 + i * 0.05,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.04 + 0.15,
              }}
            />
          ))}
        </div>
      )}

      {/* Dynamic Particle System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: `radial-gradient(circle, ${accentColor}80, transparent)`,
              left: particle.x,
              top: particle.y,
              boxShadow: `0 0 4px ${accentColor}40`,
            }}
            animate={{
              opacity: [0.6, 0],
              scale: [0.3, 1, 0],
            }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Depth Focus Ring Effect */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${accentColor}40, inset 0 0 20px ${accentColor}10`,
          }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Corner Sparks - Appears on hover */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: '-8px',
            zIndex: 100,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {/* Top-left corner sparks */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`corner-tl-${i}`}
              className="absolute"
              style={{ 
                width: '12px',
                height: '12px',
                background: `radial-gradient(circle, #fff, ${accentColor}, transparent)`,
                left: '5%',
                top: '5%',
                boxShadow: `0 0 35px ${accentColor}, 0 0 60px ${accentColor}`,
                filter: 'brightness(2.5)',
                borderRadius: '50%',
              }}
              animate={{
                x: [-8 - i * 5, -12 - i * 8],
                y: [10, 80 + i * 30],
                scale: [1, 0.5],
                opacity: [1, 0.7, 0],
              }}
              transition={{
                duration: 1.4,
                ease: [0.3, 0.9, 0.5, 1],
                delay: i * 0.15,
              }}
            />
          ))}
          
          {/* Top-right corner sparks */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`corner-tr-${i}`}
              className="absolute"
              style={{ 
                width: '12px',
                height: '12px',
                background: `radial-gradient(circle, #fff, ${accentColor}, transparent)`,
                right: '5%',
                top: '5%',
                boxShadow: `0 0 35px ${accentColor}, 0 0 60px ${accentColor}`,
                filter: 'brightness(2.5)',
                borderRadius: '50%',
              }}
              animate={{
                x: [8 + i * 5, 12 + i * 8],
                y: [10, 80 + i * 30],
                scale: [1, 0.5],
                opacity: [1, 0.7, 0],
              }}
              transition={{
                duration: 1.4,
                ease: [0.3, 0.9, 0.5, 1],
                delay: i * 0.15 + 0.1,
              }}
            />
          ))}
          
          {/* Bottom-left corner sparks */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`corner-bl-${i}`}
              className="absolute"
              style={{ 
                width: '12px',
                height: '12px',
                background: `radial-gradient(circle, #fff, ${accentColor}, transparent)`,
                left: '5%',
                bottom: '5%',
                boxShadow: `0 0 35px ${accentColor}, 0 0 60px ${accentColor}`,
                filter: 'brightness(2.5)',
                borderRadius: '50%',
              }}
              animate={{
                x: [-8 - i * 5, -12 - i * 8],
                y: [10, 80 + i * 30],
                scale: [1, 0.5],
                opacity: [1, 0.7, 0],
              }}
              transition={{
                duration: 1.4,
                ease: [0.3, 0.9, 0.5, 1],
                delay: i * 0.15 + 0.2,
              }}
            />
          ))}
          
          {/* Bottom-right corner sparks */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`corner-br-${i}`}
              className="absolute"
              style={{ 
                width: '12px',
                height: '12px',
                background: `radial-gradient(circle, #fff, ${accentColor}, transparent)`,
                right: '5%',
                bottom: '5%',
                boxShadow: `0 0 35px ${accentColor}, 0 0 60px ${accentColor}`,
                filter: 'brightness(2.5)',
                borderRadius: '50%',
              }}
              animate={{
                x: [8 + i * 5, 12 + i * 8],
                y: [10, 80 + i * 30],
                scale: [1, 0.5],
                opacity: [1, 0.7, 0],
              }}
              transition={{
                duration: 1.4,
                ease: [0.3, 0.9, 0.5, 1],
                delay: i * 0.15 + 0.3,
              }}
            />
          ))}
        </motion.div>
      )}

    </motion.div>
  );
};

export default EventCard3D;
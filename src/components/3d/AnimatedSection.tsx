import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animationType: 'slide' | 'rotate' | 'scale' | 'morph' | 'explode';
  triggerOffset?: number;
  duration?: number;
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  enableParticles?: boolean;
  enable3D?: boolean;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animationType = 'slide',
  triggerOffset = 0.1,
  duration = 1,
  intensity = 'medium',
  className = '',
  enableParticles = false,
  enable3D = true,
  onAnimationStart,
  onAnimationComplete,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, {
    once: true,
    margin: `${-(1 - triggerOffset) * 100}% 0px 0px 0px`
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Enhanced Intersection Observer for more precise control - START ANIMATIONS EARLIER
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            onAnimationStart?.();
            // Use requestAnimationFrame to ensure smooth animation start
            requestAnimationFrame(() => {
              controls.start('visible');
            });
          }
        });
      },
      {
        threshold: 0.01, // Start immediately - as soon as 1% is visible
        rootMargin: `200px 0px 0px 0px`, // Start 200px BEFORE element enters viewport
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [triggerOffset, hasAnimated, controls, onAnimationStart]);

  // Enhanced animation variants with dramatic 3D effects
  const getAnimationVariants = useCallback(() => {
    const intensityMultiplier = {
      light: 0.5,
      medium: 1,
      heavy: 2,
    }[intensity];

    const baseVariants = {
      slide: {
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: {
            duration: duration * 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: 0.15,
            delayChildren: 0.1,
          }
        },
      },
      rotate: {
        hidden: {
          opacity: 0,
          rotateX: enable3D ? -10 * intensityMultiplier : -5 * intensityMultiplier,
          rotateY: enable3D ? 5 * intensityMultiplier : 0,
          scale: 0.95,
          z: enable3D ? -20 : 0,
        },
        visible: {
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          z: 0,
          transition: {
            duration: duration * 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: 0.05,
          }
        },
      },
      scale: {
        hidden: {
          opacity: 0,
          scale: 0.1 * intensityMultiplier,
          rotateZ: enable3D ? 180 : 90,
          z: enable3D ? -300 : 0,
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotateZ: 0,
          z: 0,
          transition: {
            duration: duration * 1.3,
            ease: [0.175, 0.885, 0.32, 1.275] as const,
            staggerChildren: 0.08,
          }
        },
      },
      morph: {
        hidden: {
          opacity: 0,
          scale: 0.3,
          rotateY: enable3D ? 270 * intensityMultiplier : 180 * intensityMultiplier,
          rotateX: enable3D ? 45 : 0,
          skewX: 25,
          skewY: enable3D ? 15 : 0,
          z: enable3D ? -150 : 0,
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          skewX: 0,
          skewY: 0,
          z: 0,
          transition: {
            duration: duration * 1.8,
            ease: [0.23, 1, 0.32, 1] as const,
            staggerChildren: 0.12,
          }
        },
      },
      explode: {
        hidden: {
          opacity: 0,
          scale: 3 * intensityMultiplier,
          rotate: enable3D ? 720 : 360,
          rotateX: enable3D ? 180 : 0,
          rotateY: enable3D ? 180 : 0,
          z: enable3D ? 500 : 0,
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
          z: 0,
          transition: {
            duration: duration * 1.1,
            ease: [0.19, 1, 0.22, 1] as const,
            staggerChildren: 0.05,
          }
        },
      },
    };

    return baseVariants[animationType];
  }, [animationType, intensity, duration, enable3D]);

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  return (
    <motion.div
      ref={sectionRef}
      className={`${className} ${enable3D ? 'transform-gpu' : ''}`}
      initial="hidden"
      animate={controls}
      variants={getAnimationVariants()}
      onAnimationComplete={handleAnimationComplete}
      style={{
        perspective: enable3D ? '1000px' : 'none',
        transformStyle: enable3D ? 'preserve-3d' : 'flat',
      }}
    >
      {enableParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <ParticleTrail isActive={hasAnimated} intensity={intensity} />
        </div>
      )}
      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            }
          }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Particle trail component for enhanced visual effects
const ParticleTrail: React.FC<{ isActive: boolean; intensity: 'light' | 'medium' | 'heavy' }> = ({
  isActive,
  intensity
}) => {
  const particleCount = {
    light: 5,
    medium: 10,
    heavy: 20,
  }[intensity];

  return (
    <div className="absolute inset-0">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
          initial={{
            x: Math.random() * 100 + '%',
            y: '100%',
            scale: 0,
          }}
          animate={isActive ? {
            y: '-20%',
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          } : {}}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedSection;
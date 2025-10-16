import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';

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

// Detect device performance capability
const getDevicePerformance = (): 'low' | 'medium' | 'high' => {
  if (typeof window === 'undefined') return 'medium';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'low';

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory;

  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (memory && memory < 4) return 'low';
  if (isMobile && cores < 4) return 'low';
  if (cores >= 8 && (!memory || memory >= 8)) return 'high';

  return 'medium';
};

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
  const prefersReducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Force low-end device performance settings for all devices
  const devicePerformance = 'low' as const;

  // Optimize settings for low-end devices (applied to all)
  const optimizedSettings = useMemo(() => {
    return {
      enable3D: false, // Disable 3D transforms
      enableParticles: false, // Disable particles
      duration: duration * 0.5, // 50% faster animations
      useGPU: true, // Still use GPU acceleration where available
    };
  }, [duration]);

  // Optimized Intersection Observer for low-end devices
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      // Skip animation for reduced motion preference
      controls.start('visible');
      return;
    }

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
        threshold: 0.01,
        // Smaller root margin for faster response
        rootMargin: '50px 0px 0px 0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [triggerOffset, hasAnimated, controls, onAnimationStart, prefersReducedMotion]);

  // Simplified animation variants optimized for all devices
  const getAnimationVariants = useCallback(() => {
    // Simplified animations for reduced motion
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.2 }
        }
      };
    }

    const { duration: adjustedDuration } = optimizedSettings;

    // Simplified variants - no 3D transforms, minimal complexity
    const baseVariants = {
      slide: {
        hidden: {
          opacity: 0,
          y: 15, // Minimal transform
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: adjustedDuration * 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: 0.05,
            delayChildren: 0.05,
          }
        },
      },
      rotate: {
        hidden: {
          opacity: 0,
          scale: 0.95,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: adjustedDuration * 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: 0.03,
          }
        },
      },
      scale: {
        hidden: {
          opacity: 0,
          scale: 0.85,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: adjustedDuration * 0.7,
            ease: [0.175, 0.885, 0.32, 1.275] as const,
            staggerChildren: 0.05,
          }
        },
      },
      morph: {
        hidden: {
          opacity: 0,
          scale: 0.9,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: adjustedDuration * 0.9,
            ease: [0.23, 1, 0.32, 1] as const,
            staggerChildren: 0.06,
          }
        },
      },
      explode: {
        hidden: {
          opacity: 0,
          scale: 1.2,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: adjustedDuration * 0.6,
            ease: [0.19, 1, 0.22, 1] as const,
            staggerChildren: 0.03,
          }
        },
      },
    };

    return baseVariants[animationType];
  }, [animationType, optimizedSettings, prefersReducedMotion]);

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  return (
    <motion.div
      ref={sectionRef}
      className={`${className} transform-gpu`}
      initial="hidden"
      animate={controls}
      variants={getAnimationVariants()}
      onAnimationComplete={handleAnimationComplete}
      style={{
        // Minimal GPU hints for best performance
        willChange: 'transform, opacity',
      }}
    >
      {/* Particles disabled for performance */}
      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.03,
              delayChildren: 0.05,
            }
          }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Optimized particle trail component
const ParticleTrail: React.FC<{
  isActive: boolean;
  intensity: 'light' | 'medium' | 'heavy';
  devicePerformance: 'low' | 'medium' | 'high';
}> = ({
  isActive,
  intensity,
  devicePerformance
}) => {
    // Adjust particle count based on device performance
    const baseCount = {
      light: 5,
      medium: 10,
      heavy: 20,
    }[intensity];

    const particleCount = devicePerformance === 'low'
      ? Math.ceil(baseCount * 0.3) // 30% of particles on low-end
      : devicePerformance === 'medium'
        ? Math.ceil(baseCount * 0.6) // 60% on medium
        : baseCount;

    // Memoize particle positions to avoid recalculation
    const particles = useMemo(() =>
      Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1,
        duration: 2 + Math.random() * 2,
        repeatDelay: Math.random() * 3,
      })),
      [particleCount]
    );

    return (
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              // Use transform instead of top/bottom for better performance
              transform: 'translateZ(0)', // Force GPU acceleration
            }}
            initial={{
              y: '100vh',
              scale: 0,
            }}
            animate={isActive ? {
              y: '-20vh',
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            } : {}}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: particle.repeatDelay,
              ease: 'linear', // Linear is more performant than complex easing
            }}
          />
        ))}
      </div>
    );
  };

export default AnimatedSection;
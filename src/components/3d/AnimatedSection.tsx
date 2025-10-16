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

  // Memoize device performance check
  const devicePerformance = useMemo(() => getDevicePerformance(), []);

  // Adjust settings based on device performance
  const optimizedSettings = useMemo(() => {
    const shouldEnable3D = enable3D && devicePerformance !== 'low';
    const shouldEnableParticles = enableParticles && devicePerformance === 'high';
    const adjustedDuration = devicePerformance === 'low' ? duration * 0.6 : duration;

    return {
      enable3D: shouldEnable3D,
      enableParticles: shouldEnableParticles,
      duration: adjustedDuration,
      useGPU: devicePerformance !== 'low',
    };
  }, [enable3D, enableParticles, duration, devicePerformance]);

  // Optimized Intersection Observer with performance considerations
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
        // Adjust root margin based on device performance
        rootMargin: devicePerformance === 'low' ? '100px 0px 0px 0px' : '200px 0px 0px 0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [triggerOffset, hasAnimated, controls, onAnimationStart, devicePerformance, prefersReducedMotion]);

  // Optimized animation variants with performance-based adjustments
  const getAnimationVariants = useCallback(() => {
    // Simplified animations for reduced motion
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.3 }
        }
      };
    }

    const intensityMultiplier = {
      light: 0.5,
      medium: 1,
      heavy: devicePerformance === 'low' ? 1 : 2, // Reduce heavy intensity on low-end devices
    }[intensity];

    const { enable3D: use3D, duration: adjustedDuration } = optimizedSettings;

    const baseVariants = {
      slide: {
        hidden: {
          opacity: 0,
          y: devicePerformance === 'low' ? 20 : 30, // Simpler transform on low-end
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: adjustedDuration * 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: devicePerformance === 'low' ? 0.08 : 0.15,
            delayChildren: 0.1,
          }
        },
      },
      rotate: {
        hidden: {
          opacity: 0,
          rotateX: use3D ? -10 * intensityMultiplier : 0,
          rotateY: use3D ? 5 * intensityMultiplier : 0,
          scale: 0.95,
          ...(use3D && { z: -20 }),
        },
        visible: {
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ...(use3D && { z: 0 }),
          transition: {
            duration: adjustedDuration * 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: 0.05,
          }
        },
      },
      scale: {
        hidden: {
          opacity: 0,
          scale: devicePerformance === 'low' ? 0.8 : 0.1 * intensityMultiplier,
          rotateZ: use3D ? (devicePerformance === 'low' ? 45 : 180) : 0,
          ...(use3D && { z: devicePerformance === 'low' ? -50 : -300 }),
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotateZ: 0,
          ...(use3D && { z: 0 }),
          transition: {
            duration: adjustedDuration * 1.3,
            ease: [0.175, 0.885, 0.32, 1.275] as const,
            staggerChildren: 0.08,
          }
        },
      },
      morph: {
        hidden: {
          opacity: 0,
          scale: 0.3,
          rotateY: use3D ? (devicePerformance === 'low' ? 90 : 270) * intensityMultiplier : 0,
          rotateX: use3D && devicePerformance !== 'low' ? 45 : 0,
          skewX: devicePerformance === 'low' ? 10 : 25,
          ...(use3D && devicePerformance !== 'low' && { skewY: 15 }),
          ...(use3D && { z: devicePerformance === 'low' ? -50 : -150 }),
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          skewX: 0,
          skewY: 0,
          ...(use3D && { z: 0 }),
          transition: {
            duration: adjustedDuration * 1.8,
            ease: [0.23, 1, 0.32, 1] as const,
            staggerChildren: 0.12,
          }
        },
      },
      explode: {
        hidden: {
          opacity: 0,
          scale: devicePerformance === 'low' ? 1.5 : 3 * intensityMultiplier,
          rotate: use3D ? (devicePerformance === 'low' ? 180 : 720) : 0,
          ...(use3D && devicePerformance !== 'low' && { rotateX: 180, rotateY: 180 }),
          ...(use3D && { z: devicePerformance === 'low' ? 100 : 500 }),
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
          ...(use3D && { z: 0 }),
          transition: {
            duration: adjustedDuration * 1.1,
            ease: [0.19, 1, 0.22, 1] as const,
            staggerChildren: 0.05,
          }
        },
      },
    };

    return baseVariants[animationType];
  }, [animationType, intensity, optimizedSettings, devicePerformance, prefersReducedMotion]);

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  return (
    <motion.div
      ref={sectionRef}
      className={`${className} ${optimizedSettings.useGPU ? 'transform-gpu' : ''}`}
      initial="hidden"
      animate={controls}
      variants={getAnimationVariants()}
      onAnimationComplete={handleAnimationComplete}
      style={{
        perspective: optimizedSettings.enable3D ? '1000px' : 'none',
        transformStyle: optimizedSettings.enable3D ? 'preserve-3d' : 'flat',
        // Force GPU acceleration on capable devices
        ...(optimizedSettings.useGPU && {
          willChange: 'transform, opacity',
        }),
      }}
    >
      {optimizedSettings.enableParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <ParticleTrail
            isActive={hasAnimated}
            intensity={intensity}
            devicePerformance={devicePerformance}
          />
        </div>
      )}
      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: devicePerformance === 'low' ? 0.05 : 0.1,
              delayChildren: devicePerformance === 'low' ? 0.1 : 0.2,
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
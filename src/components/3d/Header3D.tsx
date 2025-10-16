import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

interface NavItem {
  name: string;
  href: string;
}

const Header3D: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navLinks: NavItem[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Contact", href: "#contact" },
  ];

  // Smooth scroll handler with offset for fixed header - PROPERLY FIXED
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Use offsetTop for consistent absolute position
      let offsetTop = 0;
      let element: HTMLElement | null = targetElement;
      
      // Calculate absolute position from top of document
      while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent as HTMLElement | null;
      }
      
      // Get actual header height
      const headerHeight = headerRef.current?.offsetHeight || 80;
      
      // Scroll to position with header offset and padding
      window.scrollTo({
        top: offsetTop - headerHeight - 20,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      setMobileMenuOpen(false);
    }
  };

  // Enhanced scroll effects with advanced 3D transformations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      
      // Apply scroll-responsive transformations
      if (headerRef.current) {
        const scrollProgress = Math.min(scrollY / 300, 1);
        const maxScroll = 1000;
        const normalizedScroll = Math.min(scrollY / maxScroll, 1);
        
        // Advanced header transformations
        gsap.to(headerRef.current, {
          duration: 0.4,
          ease: "power2.out",
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'blur(0px)',
          backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0)',
          borderBottom: scrolled ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.3)' : 'none',
        });

        // Advanced logo transformations with depth and perspective
        if (logoRef.current) {
          gsap.to(logoRef.current, {
            duration: 0.4,
            ease: "power2.out",
            scale: 1 - scrollProgress * 0.15,
            rotationY: scrollProgress * 15 + Math.sin(scrollY * 0.01) * 3,
            rotationX: Math.cos(scrollY * 0.008) * 2,
            z: scrollProgress * -20,
            transformOrigin: "center center",
          });
        }

        // Transform navigation items based on scroll
        navItemsRef.current.forEach((item, index) => {
          if (item) {
            gsap.to(item, {
              duration: 0.3,
              ease: "power2.out",
              y: scrollProgress * -5,
              rotationX: scrollProgress * 5,
              opacity: 1 - scrollProgress * 0.3,
              delay: index * 0.02,
            });
          }
        });
      }
    };

    // Smooth scroll listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [scrolled]);

  // 3D hover effects for navigation items
  const handleNavHover = (index: number, isHovering: boolean) => {
    const navItem = navItemsRef.current[index];
    if (!navItem) return;

    if (isHovering) {
      gsap.to(navItem, {
        duration: 0.4,
        ease: "back.out(1.7)",
        scale: 1.1,
        rotationX: 10,
        rotationY: 5,
        z: 20,
        transformOrigin: "center center",
      });
    } else {
      gsap.to(navItem, {
        duration: 0.3,
        ease: "power2.out",
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        z: 0,
      });
    }
  };

  // Logo animation on mount
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, 
        {
          opacity: 0,
          scale: 0.8,
          rotationY: -180,
        },
        {
          duration: 1.2,
          ease: "back.out(1.7)",
          opacity: 1,
          scale: 1,
          rotationY: 0,
          delay: 0.2,
        }
      );
    }

    // Animate navigation items on mount
    navItemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(item,
          {
            opacity: 0,
            y: -30,
            rotationX: -90,
          },
          {
            duration: 0.8,
            ease: "back.out(1.7)",
            opacity: 1,
            y: 0,
            rotationX: 0,
            delay: 0.4 + index * 0.1,
          }
        );
      }
    });
  }, []);

  // Advanced scroll-responsive header transformations
  useEffect(() => {
    const handleAdvancedScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      if (headerRef.current) {
        // Create depth and perspective effects based on scroll
        const perspective = 1000 + scrollProgress * 500;
        const rotateX = scrollProgress * 2;
        const translateZ = scrollProgress * -10;
        
        headerRef.current.style.perspective = `${perspective}px`;
        headerRef.current.style.transform = `rotateX(${rotateX}deg) translateZ(${translateZ}px)`;
      }
    };

    window.addEventListener('scroll', handleAdvancedScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleAdvancedScroll);
  }, []);

  return (
    <motion.header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-0 border-b border-transparent"
      initial={{ y: -100, opacity: 0, rotateX: -15 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ duration: 1, ease: "backOut" }}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Main Header */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Advanced 3D Logo with complex rotating elements */}
          <motion.a
            ref={logoRef}
            href="#home"
            className="text-xl md:text-2xl font-bold tracking-tight relative group"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1200px",
            }}
            whileHover={{
              scale: 1.08,
              rotationY: 12,
              rotationX: 3,
              z: 15,
              transition: { duration: 0.4, ease: "backOut" }
            }}
          >
            {/* "IN" with subtle animation */}
            <motion.span 
              className="inline-block"
              animate={{
                rotateZ: [0, 1, 0, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              IN
            </motion.span>
            
            {/* "TEMS" - blue with slight 3D effect */}
            <span className="text-primary inline-block relative">
              TEMS
              
              {/* Slight 3D depth layer */}
              <motion.span
                className="absolute inset-0 text-primary/40 -z-10"
                style={{
                  transform: "translateZ(-1px) translateX(1px) translateY(1px)",
                }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                TEMS
              </motion.span>
            </span>
            
            {/* "TELLAR" with wave animation */}
            <motion.span 
              className="inline-block"
              animate={{
                rotateZ: [0, -1, 0, 1, 0],
                y: [0, -1, 0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              TELLAR
            </motion.span>
            
            {/* Complex floating geometric shapes with 3D movement */}
            <motion.div
              className="absolute -top-3 -right-3 w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg"
              animate={{
                y: [-8, 8, -8],
                x: [-4, 4, -4],
                scale: [1, 1.3, 1],
                rotateZ: [0, 180, 360],
                rotateY: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                transformStyle: "preserve-3d",
                filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))",
              }}
            />
            
            <motion.div
              className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg"
              animate={{
                y: [6, -6, 6],
                x: [3, -3, 3],
                scale: [1, 0.7, 1],
                rotateZ: [360, 180, 0],
                rotateX: [0, 180, 360],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7
              }}
              style={{
                transformStyle: "preserve-3d",
                filter: "drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))",
              }}
            />
            
            <motion.div
              className="absolute top-1 -left-4 w-1.5 h-1.5 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg"
              animate={{
                y: [-3, 3, -3],
                x: [-2, 2, -2],
                scale: [1, 1.5, 1],
                rotateY: [0, 360],
                rotateZ: [0, -180, -360],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2
              }}
              style={{
                transformStyle: "preserve-3d",
                filter: "drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))",
              }}
            />
            
            {/* Orbital ring around logo on hover */}
            <motion.div
              className="absolute inset-0 border border-blue-400/30 rounded-full pointer-events-none"
              style={{
                width: "120%",
                height: "120%",
                left: "-10%",
                top: "-10%",
              }}
              animate={{
                rotateZ: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
            
            {/* Particle burst effect on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 8) * 30,
                    y: Math.sin((i * Math.PI * 2) / 8) * 30,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.a>

          {/* Desktop Navigation with 3D effects */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                ref={(el) => (navItemsRef.current[index] = el)}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium relative"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
                onMouseEnter={() => {
                  setHoveredItem(link.name);
                  handleNavHover(index, true);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  handleNavHover(index, false);
                }}
                whileTap={{
                  scale: 0.95,
                  rotationX: 15,
                  transition: { duration: 0.1 }
                }}
              >
                {link.name}
                
                {/* 3D underline effect */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0, scaleY: 1 }}
                  animate={{
                    width: hoveredItem === link.name ? "100%" : 0,
                    scaleY: hoveredItem === link.name ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    transformOrigin: "left center",
                    boxShadow: hoveredItem === link.name ? "0 0 10px rgba(59, 130, 246, 0.8)" : "none",
                  }}
                />
                
                {/* Floating particles on hover */}
                <AnimatePresence>
                  {hoveredItem === link.name && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none"
                          initial={{
                            opacity: 0,
                            scale: 0,
                            x: 0,
                            y: 0,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: (Math.random() - 0.5) * 40,
                            y: (Math.random() - 0.5) * 40,
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
            
            {/* 3D Register Button */}
            <motion.div
              whileHover={{
                scale: 1.05,
                rotationX: 5,
                rotationY: 5,
                z: 10,
              }}
              whileTap={{
                scale: 0.95,
                rotationX: 10,
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg transition-all relative overflow-hidden"
                onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="relative z-10">Register Now</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button with 3D effect */}
          <motion.button
            className="md:hidden text-foreground relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            whileHover={{
              scale: 1.1,
              rotationZ: 5,
            }}
            whileTap={{
              scale: 0.9,
              rotationZ: -5,
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotationZ: -90, opacity: 0 }}
                  animate={{ rotationZ: 0, opacity: 1 }}
                  exit={{ rotationZ: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={28} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotationZ: 90, opacity: 0 }}
                  animate={{ rotationZ: 0, opacity: 1 }}
                  exit={{ rotationZ: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu with 3D animations */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className="md:hidden mt-6 pb-4 flex flex-col gap-4"
              initial={{ opacity: 0, height: 0, rotationX: -90 }}
              animate={{ opacity: 1, height: "auto", rotationX: 0 }}
              exit={{ opacity: 0, height: 0, rotationX: -90 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "top center",
              }}
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium py-2 relative"
                  initial={{ opacity: 0, x: -50, rotationY: -45 }}
                  animate={{ opacity: 1, x: 0, rotationY: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "backOut"
                  }}
                  whileHover={{
                    x: 10,
                    scale: 1.05,
                    color: "#3b82f6",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.1 }}
              >
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Register Now
                </Button>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header3D;
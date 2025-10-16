import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, User } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const coordinators = [
  {
    name: "Akshitha Jyothi D",
    phone: "63829 82045",
    year: "3rd Year"
  },
  {
    name: "Lalith J",
    phone: "97913 82086",
    year: "2nd Year"
  },
  {
    name: "Kamalika N M",
    phone: "90428 87720",
    year: "2nd Year"
  }
];

const Coordinators = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.coordinator-card');

    if (cards) {
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 px-4 md:px-6 bg-card">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-12 md:mb-16 text-chromatic px-4">
          STUDENT COORDINATORS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {coordinators.map((coordinator, index) => (
            <a
              key={index}
              href={`tel:${coordinator.phone.replace(/\s/g, '')}`}
              className="coordinator-card cctv-flicker bg-muted/50 border-2 border-accent/30 rounded-lg p-5 md:p-6 hover:border-accent hover:bg-muted transition-all duration-300 group"
              aria-label={`Call ${coordinator.name}`}
            >
              <div className="mb-3 md:mb-4 inline-block p-3 md:p-4 bg-accent/20 rounded-full">
                <User className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                {coordinator.name}
              </h3>

              <div className="flex items-center gap-2 text-primary mb-2">
                <Phone className="w-4 h-4" />
                <span className="text-base md:text-lg">{coordinator.phone}</span>
              </div>

              <div className="inline-block px-3 py-1 bg-background rounded-md">
                <span className="text-xs md:text-sm text-muted-foreground">{coordinator.year}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Coordinators;

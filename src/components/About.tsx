import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="space-y-8">
          {/* Text Content */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-8">
              About IEEE <span className="text-primary">TEMS</span> Sairam Chapter
            </h2>
            
            <div className="glass rounded-2xl p-8 sm:p-12 shadow-card" style={{ backgroundColor: 'rgba(0, 7, 45, 0.8)' }}>
              <div className="space-y-6 text-muted-foreground">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Our Story</h3>
                
                <p className="text-base sm:text-lg leading-relaxed">
                  The IEEE Technology and Engineering Management Society provides information and services to practitioners and researchers engaged in management sciences.
                </p>
                
                <p className="text-base sm:text-lg leading-relaxed">
                  IEEE TEMS helps members maintain vital engineering management skills, ensuring they stay current in an evolving field. The society supports the leadership career paths of IEEE members by providing resources and development opportunities.
                </p>
                
                <p className="text-base sm:text-lg leading-relaxed">
                  It also fosters active knowledge transfer between academia and industry, promoting collaboration and innovation across both communities.
                </p>
              </div>
              
              <div className="mt-8 flex justify-center md:justify-start">
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <a
                    href="https://edu.ieee.org/in-sairamtems"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    View TEMS
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

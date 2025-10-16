import { useState } from "react";

interface Coordinator {
  name: string;
  phone: string;
  year: string;
}

interface EventCardProps {
  title: string;
  theme: string;
  tagline: string;
  coordinators: Coordinator[];
  image: string;
  accentColor: string;
  delay: number;
}

const EventCard = ({ title, theme, tagline, coordinators, image, accentColor, delay }: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Image Background */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-2 group-hover:blur-sm"
          style={{ willChange: 'transform, filter' }}
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-700"
        />
        
        {/* Accent Glow - Multiple Layers */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 30% 70%, ${accentColor}, transparent 60%)`,
          }}
        />
        
        {/* Animated Border Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="transform transition-all duration-700 group-hover:-translate-y-6 group-hover:scale-105">
          <p className="text-sm font-semibold text-muted-foreground mb-2 tracking-wider uppercase transform transition-all duration-500 group-hover:tracking-widest animate-float">
            Theme: {theme}
          </p>
          <h3 className="text-3xl md:text-4xl font-bold mb-3 text-foreground transition-all duration-500 group-hover:scale-110 origin-left">
            {title}
          </h3>
          <p className="text-lg md:text-xl font-semibold mb-6 transition-all duration-500 group-hover:scale-105 origin-left" style={{ color: accentColor }}>
            {tagline}
          </p>

          {/* Coordinators - Show on Hover */}
          <div
            className={`transition-all duration-700 ${
              isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-widest">
              Coordinators
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coordinators.map((coord, idx) => (
                <div 
                  key={idx} 
                  className="bg-card/60 backdrop-blur-md p-3 rounded-lg border border-primary/30 hover:border-primary hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 animate-fade-in-up cursor-pointer"
                  style={{ 
                    animationDelay: `${idx * 0.1}s`,
                    boxShadow: isHovered ? `0 0 20px ${accentColor}30` : 'none'
                  }}
                >
                  <p className="font-semibold text-foreground text-sm">{coord.name}</p>
                  <p className="text-xs text-muted-foreground">{coord.phone}</p>
                  <p className="text-xs font-medium" style={{ color: accentColor }}>{coord.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Border Glow on Hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
        style={{
          boxShadow: `0 0 60px ${accentColor}, 0 0 100px ${accentColor}80, inset 0 0 40px ${accentColor}20`,
        }}
      />
      
      {/* Floating Particles Effect */}
      {isHovered && (
        <>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-float opacity-60" style={{ background: accentColor }} />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full animate-float opacity-40" style={{ background: accentColor, animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full animate-float opacity-50" style={{ background: accentColor, animationDelay: '2s' }} />
        </>
      )}
    </div>
  );
};

export default EventCard;

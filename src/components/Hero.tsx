import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-coffee.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-fade-in-up">
          It's not just coffee.
          <br />
          <span className="text-warm-cream">It's Dream Latte.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-warm-cream mb-8 font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Crafted with passion. Brewed with stories.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            className="bg-white text-coffee-brown hover:bg-warm-cream border-2 border-white hover:border-warm-cream transition-all duration-300 px-8 py-3 text-lg font-medium"
          >
            See Our Menu
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-white text-coffee-brown bg-white hover:bg-warm-cream hover:border-warm-cream transition-all duration-300 px-8 py-3 text-lg font-medium"
          >
            Visit Us Today
          </Button>
        </div>
      </div>
      
      {/* Steam Animation Elements */}
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-steam-rise" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-white/15 rounded-full animate-steam-rise" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/2 w-2 h-2 bg-white/20 rounded-full animate-steam-rise" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default Hero;
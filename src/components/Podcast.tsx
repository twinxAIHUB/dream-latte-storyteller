import { Button } from "@/components/ui/button";
import { Mic, Play, Coffee } from "lucide-react";

const Podcast = () => {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Header */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <Coffee className="w-8 h-8 text-coffee-brown" />
            <Mic className="w-10 h-10 text-coffee-light" />
            <Coffee className="w-8 h-8 text-coffee-brown" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-brown mb-4">
            Dream Latte Coffee Talks
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join us for intimate conversations about coffee culture, entrepreneurship, 
            and the stories behind every cup. Listen while you sip.
          </p>
          
          {/* Podcast Player Mockup */}
          <div className="coffee-card max-w-2xl mx-auto mb-8">
            <div className="bg-coffee-brown text-white rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-warm-cream rounded-xl flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-coffee-brown" />
                </div>
                
                <div className="text-left">
                  <h3 className="text-xl font-serif font-semibold">
                    Latest Episode: "The Art of Latte Making"
                  </h3>
                  <p className="text-cream/80">
                    Featuring our head barista sharing secrets of perfect latte art
                  </p>
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button 
                  size="lg"
                  className="bg-warm-cream text-coffee-brown hover:bg-white rounded-full w-16 h-16 p-0"
                >
                  <Play className="w-6 h-6" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-coffee-light/30 rounded-full h-2 mb-4">
                <div className="bg-warm-cream h-2 rounded-full w-1/3"></div>
              </div>
              
              <div className="flex justify-between text-sm text-cream/80">
                <span>8:32</span>
                <span>25:45</span>
              </div>
            </div>
          </div>
          
          {/* Episode List */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "From Bean to Cup: Our Sourcing Journey",
                duration: "32 min",
                description: "Exploring our direct trade relationships with coffee farmers"
              },
              {
                title: "Building Community Through Coffee",
                duration: "28 min", 
                description: "How Dream Latte became the heart of Sta. Rosa"
              },
              {
                title: "The Science of Perfect Brewing",
                duration: "35 min",
                description: "Temperature, timing, and technique with our coffee experts"
              },
              {
                title: "Local Stories, Global Flavors",
                duration: "40 min",
                description: "Featuring local customers and their coffee memories"
              }
            ].map((episode, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-warm text-left">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-serif font-semibold text-coffee-brown">
                    {episode.title}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {episode.duration}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {episode.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Listen Now
                </Button>
              </div>
            ))}
          </div>
          
          {/* Subscribe CTA */}
          <div className="bg-coffee-brown text-white rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-bold mb-4">
              Never Miss an Episode
            </h3>
            <p className="text-cream/80 mb-6">
              Subscribe to Dream Latte Coffee Talks on your favorite podcast platform
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline"
                className="border-warm-cream text-warm-cream hover:bg-warm-cream hover:text-coffee-brown"
              >
                Spotify
              </Button>
              <Button 
                variant="outline"
                className="border-warm-cream text-warm-cream hover:bg-warm-cream hover:text-coffee-brown"
              >
                Apple Podcasts
              </Button>
              <Button 
                variant="outline"
                className="border-warm-cream text-warm-cream hover:bg-warm-cream hover:text-coffee-brown"
              >
                Google Podcasts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;
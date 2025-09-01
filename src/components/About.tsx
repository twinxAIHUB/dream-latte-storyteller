import baristaImage from "@/assets/barista-at-work.jpg";

const About = () => {
  return (
    <section className="section-padding bg-warm-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-brown">
              More than a Cafe,
              <br />
              <span className="text-coffee-light">a Place to Dream.</span>
            </h2>
            
            <div className="space-y-4 text-lg text-dark-grey/80 leading-relaxed">
              <p>
                Since 2019, Dream Latte Cafe has been more than just a coffee shop. 
                We're a community hub where every cup tells a story, every brew carries 
                passion, and every customer becomes part of our extended family.
              </p>
              
              <p>
                Located in the heart of Sta. Rosa, Pilar, Bataan, we believe that 
                great coffee isn't just about the beans—it's about the experience, 
                the craftsmanship, and the dreams we share over every perfectly 
                brewed cup.
              </p>
              
              <p>
                From our carefully sourced global and local coffee selections to 
                our artisan approach to every drink, we're committed to creating 
                moments that matter. Because here at Dream Latte, we don't just 
                serve coffee—we brew hope, dreams, and connections.
              </p>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="coffee-card overflow-hidden">
              <img 
                src={baristaImage} 
                alt="Skilled barista crafting coffee with passion at Dream Latte Cafe"
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Floating element */}
            <div className="absolute -bottom-4 -right-4 coffee-card bg-coffee-brown text-white p-6 animate-float">
              <div className="text-center">
                <div className="text-3xl font-serif font-bold">5+</div>
                <div className="text-sm font-medium">Years of Craftsmanship</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
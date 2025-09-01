import latteArt from "@/assets/latte-art.jpg";
import baristaImage from "@/assets/barista-at-work.jpg";
import coffeeBeansImage from "@/assets/coffee-beans.jpg";
import heroImage from "@/assets/hero-coffee.jpg";

const Gallery = () => {
  const galleryImages = [
    {
      src: latteArt,
      alt: "Beautiful latte art showcasing our barista's skill",
      caption: "Every cup, a work of art"
    },
    {
      src: baristaImage,
      alt: "Our passionate barista crafting the perfect cup",
      caption: "Craftsmanship in every pour"
    },
    {
      src: coffeeBeansImage,
      alt: "Premium coffee beans from around the world",
      caption: "Quality starts with the bean"
    },
    {
      src: heroImage,
      alt: "The perfect coffee moment at Dream Latte",
      caption: "More than coffee, it's an experience"
    },
    {
      src: latteArt,
      alt: "Cozy interior of Dream Latte Cafe",
      caption: "Your home away from home"
    },
    {
      src: baristaImage,
      alt: "Happy customers enjoying their coffee",
      caption: "Building community, one cup at a time"
    }
  ];

  return (
    <section className="section-padding bg-warm-cream">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-brown mb-4">
            Gallery
          </h2>
          <p className="text-xl text-muted-foreground italic">
            "Every cup, a story."
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl shadow-warm hover:shadow-coffee transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-coffee-brown/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 text-white">
                  <p className="font-medium text-lg">
                    {image.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Stories */}
        <div className="bg-white rounded-2xl p-8 shadow-warm">
          <h3 className="text-3xl font-serif font-bold text-coffee-brown mb-8 text-center">
            What Our Customers Say
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Dream Latte isn't just a coffee shop—it's where I start every morning and where great ideas are born.",
                author: "Maria S.",
                role: "Regular Customer"
              },
              {
                quote: "The Biscoff Latte is absolutely divine! The atmosphere makes it perfect for work or catching up with friends.",
                author: "John D.",
                role: "Coffee Enthusiast"
              },
              {
                quote: "As a local business owner, I appreciate their commitment to the community and quality. Best coffee in Bataan!",
                author: "Anna L.",
                role: "Local Entrepreneur"
              }
            ].map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl text-coffee-light mb-4">"</div>
                <p className="text-muted-foreground italic mb-4 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div>
                  <div className="font-serif font-semibold text-coffee-brown">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
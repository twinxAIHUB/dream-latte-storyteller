import { Badge } from "@/components/ui/badge";
import coffeeBeansImage from "@/assets/coffee-beans.jpg";

const CoffeeOrigins = () => {
  const origins = [
    {
      country: "Ethiopia",
      region: "Yirgacheffe",
      notes: "Bright, floral, citrusy",
      description: "The birthplace of coffee, offering complex fruity flavors"
    },
    {
      country: "Colombia",
      region: "Huila",
      notes: "Sweet, caramel, nutty",
      description: "High-altitude grown beans with exceptional balance"
    },
    {
      country: "Philippines",
      region: "Benguet",
      notes: "Earthy, full-bodied",
      description: "Supporting local farmers with rich, bold flavors"
    },
    {
      country: "Guatemala",
      region: "Antigua",
      notes: "Chocolatey, spicy, smoky",
      description: "Volcanic soil creates distinctive depth and complexity"
    }
  ];

  return (
    <section className="section-padding bg-coffee-brown text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Coffee Origins
              <br />
              <span className="text-warm-cream">Around the World</span>
            </h2>
            
            <p className="text-xl text-cream mb-8 leading-relaxed">
              We source our beans directly from farmers around the globe, 
              including our beautiful Philippines. Each origin tells a unique 
              story of terroir, tradition, and passion.
            </p>
            
            <div className="space-y-6">
              {origins.map((origin, index) => (
                <div key={index} className="border-l-4 border-warm-cream pl-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-serif font-semibold text-white">
                      {origin.country}
                    </h3>
                    <Badge variant="secondary" className="bg-warm-cream/20 text-cream">
                      {origin.region}
                    </Badge>
                  </div>
                  
                  <p className="text-cream/80 mb-2 text-sm">
                    {origin.description}
                  </p>
                  
                  <div className="text-warm-cream font-medium text-sm">
                    Tasting Notes: {origin.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-coffee">
              <img 
                src={coffeeBeansImage} 
                alt="Premium coffee beans from various origins around the world"
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Floating stats */}
            <div className="absolute -top-4 -left-4 bg-warm-cream text-coffee-brown p-4 rounded-xl shadow-warm animate-float">
              <div className="text-center">
                <div className="text-2xl font-serif font-bold">4+</div>
                <div className="text-xs font-medium">Coffee Origins</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-cream text-coffee-brown p-4 rounded-xl shadow-warm animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-center">
                <div className="text-2xl font-serif font-bold">100%</div>
                <div className="text-xs font-medium">Direct Trade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoffeeOrigins;
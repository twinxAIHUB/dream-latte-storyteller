import { Button } from "@/components/ui/button";
import latteArt from "@/assets/latte-art.jpg";

const Menu = () => {
  const featuredDrinks = [
    {
      name: "Biscoff Latte",
      description: "Creamy espresso blended with rich Biscoff cookie butter and steamed milk",
      price: "₱180",
      image: latteArt
    },
    {
      name: "Dream Signature Brew",
      description: "Our house special blend featuring notes of chocolate and caramel",
      price: "₱160",
      image: latteArt
    },
    {
      name: "Artisan Cold Brew",
      description: "Slow-steeped for 18 hours, served over ice with optional cream",
      price: "₱140",
      image: latteArt
    },
    {
      name: "Caramel Macchiato",
      description: "Espresso layered with vanilla syrup, steamed milk, and caramel drizzle",
      price: "₱170",
      image: latteArt
    }
  ];

  const foodItems = [
    {
      name: "Pesto Sandwich",
      description: "Fresh basil pesto with tomatoes and mozzarella on artisan bread",
      price: "₱220"
    },
    {
      name: "Breakfast Croissant",
      description: "Buttery croissant with scrambled eggs, cheese, and choice of ham or bacon",
      price: "₱250"
    },
    {
      name: "Chocolate Muffin",
      description: "Rich, moist chocolate muffin with dark chocolate chips",
      price: "₱120"
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-brown mb-4">
            Our Featured Menu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each drink crafted with care, every bite made with love. 
            Discover our signature creations.
          </p>
        </div>

        {/* Featured Drinks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featuredDrinks.map((drink, index) => (
            <div key={index} className="coffee-card group">
              <div className="overflow-hidden rounded-lg mb-4">
                <img 
                  src={drink.image} 
                  alt={drink.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-serif font-semibold text-coffee-brown">
                    {drink.name}
                  </h3>
                  <span className="text-lg font-bold text-coffee-light">
                    {drink.price}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {drink.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Food Items */}
        <div className="bg-cream rounded-2xl p-8 mb-12">
          <h3 className="text-3xl font-serif font-bold text-coffee-brown mb-8 text-center">
            Delicious Bites
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {foodItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-warm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-serif font-semibold text-coffee-brown">
                    {item.name}
                  </h4>
                  <span className="text-lg font-bold text-coffee-light">
                    {item.price}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-coffee-brown text-white hover:bg-coffee-light transition-colors duration-300 px-8 py-3"
          >
            Download Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
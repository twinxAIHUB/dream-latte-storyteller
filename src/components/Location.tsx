import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Coffee } from "lucide-react";

const Location = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-coffee-brown mb-4">
                Visit Us Today
              </h2>
              <p className="text-xl text-muted-foreground">
                Come experience the warmth and passion that goes into every cup 
                at our cozy cafe in Sta. Rosa, Pilar, Bataan.
              </p>
            </div>
            
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coffee-brown text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-coffee-brown text-lg mb-1">
                    Our Location
                  </h3>
                  <p className="text-muted-foreground">
                    Sta. Rosa, Pilar, Bataan<br />
                    Philippines
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coffee-brown text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-coffee-brown text-lg mb-1">
                    Opening Hours
                  </h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>Monday - Friday: 6:00 AM - 9:00 PM</p>
                    <p>Saturday - Sunday: 7:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coffee-brown text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-coffee-brown text-lg mb-1">
                    Contact Us
                  </h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>+63 XXX XXX XXXX</p>
                    <p>dreamlatte@cafe.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-coffee-brown text-white hover:bg-coffee-light transition-colors duration-300"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </div>
          </div>
          
          {/* Map Placeholder */}
          <div className="coffee-card p-0 overflow-hidden">
            <div className="w-full h-96 bg-gradient-to-br from-coffee-light to-coffee-brown relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-serif font-bold mb-2">
                    Find Us Here
                  </h3>
                  <p className="text-warm-cream">
                    Sta. Rosa, Pilar, Bataan
                  </p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-warm-cream rounded-full animate-float" />
              <div className="absolute top-12 right-8 w-2 h-2 bg-cream rounded-full animate-float" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-8 left-12 w-4 h-4 bg-warm-cream/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-coffee-brown" />
            </div>
            <h3 className="font-serif font-semibold text-coffee-brown text-lg mb-2">
              Free WiFi
            </h3>
            <p className="text-muted-foreground text-sm">
              Perfect for remote work or catching up with friends online
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-coffee-brown" />
            </div>
            <h3 className="font-serif font-semibold text-coffee-brown text-lg mb-2">
              Easy Parking
            </h3>
            <p className="text-muted-foreground text-sm">
              Convenient parking available for all our valued customers
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-coffee-brown" />
            </div>
            <h3 className="font-serif font-semibold text-coffee-brown text-lg mb-2">
              Events Space
            </h3>
            <p className="text-muted-foreground text-sm">
              Host your meetings or small gatherings in our cozy space
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
import { Coffee, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-coffee-brown text-white">
      {/* Main Footer */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Coffee className="w-8 h-8 text-warm-cream" />
                <h3 className="text-2xl font-serif font-bold text-white">
                  Dream Latte Cafe
                </h3>
              </div>
              
              <p className="text-cream/80 text-lg leading-relaxed mb-6 max-w-md">
                Brewing hope, dreams, and good coffee since 2019. 
                More than a cafe, we're a place where stories come alive 
                and communities gather.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-warm-cream text-warm-cream hover:bg-warm-cream hover:text-coffee-brown rounded-full w-10 h-10 p-0"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-warm-cream text-warm-cream hover:bg-warm-cream hover:text-coffee-brown rounded-full w-10 h-10 p-0"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-warm-cream text-warm-cream hover:bg-warm-cream hover:text-coffee-brown rounded-full w-10 h-10 p-0"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-warm-cream mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3 text-cream/80">
                <li>
                  <a href="#menu" className="hover:text-warm-cream transition-colors duration-200">
                    Our Menu
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-warm-cream transition-colors duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#origins" className="hover:text-warm-cream transition-colors duration-200">
                    Coffee Origins
                  </a>
                </li>
                <li>
                  <a href="#podcast" className="hover:text-warm-cream transition-colors duration-200">
                    Coffee Talks Podcast
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-warm-cream transition-colors duration-200">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-warm-cream mb-4">
                Visit Us
              </h4>
              <div className="space-y-3 text-cream/80">
                <p>
                  Sta. Rosa, Pilar<br />
                  Bataan, Philippines
                </p>
                <p>+63 XXX XXX XXXX</p>
                <p>dreamlatte@cafe.com</p>
                <div className="pt-2">
                  <p className="text-sm">
                    <span className="text-warm-cream">Mon-Fri:</span> 6AM - 9PM<br />
                    <span className="text-warm-cream">Sat-Sun:</span> 7AM - 10PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-coffee-light/20 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-cream/60 text-sm">
              © 2024 Dream Latte Cafe. All rights reserved.
            </div>
            
            <div className="text-center">
              <p className="text-warm-cream font-serif italic">
                "Dream Latte Cafe – Brewing hope, dreams, and good coffee since 2019."
              </p>
            </div>
            
            <div className="flex gap-6 text-cream/60 text-sm">
              <a href="#" className="hover:text-warm-cream transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-warm-cream transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
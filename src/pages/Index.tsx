import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import CoffeeOrigins from "@/components/CoffeeOrigins";
import Podcast from "@/components/Podcast";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Menu />
      <CoffeeOrigins />
      <Podcast />
      <Gallery />
      <Location />
      <Footer />
    </div>
  );
};

export default Index;

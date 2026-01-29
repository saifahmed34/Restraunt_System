import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Fresh food. <br />
            <span className="text-primary">Fast smiles.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Order your favorites from Fetert Mama — delicious, warm, and delivered right to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* <Link to="/menu">
              <Button size="lg" className="text-lg px-8 shadow-warm-glow hover:scale-105 transition-transform">
                Order Now
              </Button>
            </Link> */}
            <Link to="/menu">
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 hover:bg-accent">
                View Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
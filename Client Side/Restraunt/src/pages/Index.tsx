import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
      </main>
      <footer className="bg-muted py-8 mt-20">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2025 Fetert Mama. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
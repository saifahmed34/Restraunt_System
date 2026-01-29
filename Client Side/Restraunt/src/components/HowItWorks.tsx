import { Utensils, MapPin, TruckIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Utensils,
    title: "Pick your dish",
    description: "Browse our menu",
  },
  {
    icon: MapPin,
    title: "Add address & pay ",
    description: "(Comming Soon...)",
  },
  {
    icon: TruckIcon,
    title: "Comming Soon...",
    description: "Track your order and get it hot and ready at your door.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to satisfy your cravings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-8 text-center shadow-card hover:shadow-warm-glow transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
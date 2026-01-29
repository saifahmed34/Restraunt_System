import { CheckCircle2, MapPinned, Clock, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: CheckCircle2,
    title: "Fresh every time",
    description: "Cooked when you order, from quality ingredients.",
  },
  {
    icon: MapPinned,
    title: "Save multiple addresses",
    description: "Home, work, or your friend's place — switch easily at checkout.",
  },
  {
    icon: Clock,
    title: "Real-time order status",
    description: "Know when your meal is accepted, cooked, and out for delivery.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description: "Card, wallet, or cash on delivery — your choice.",
  },
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Put your brand is a neighborhood-first restaurant bringing tasty, made-to-order meals with care. 
            Whether you want a quick lunch or a cozy dinner at home, we make ordering simple, delivery friendly, 
            and every bite worth a smile.(Your about)
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 shadow-card hover:shadow-warm-glow transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 text-secondary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
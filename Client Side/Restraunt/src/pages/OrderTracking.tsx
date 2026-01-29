import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, ChefHat, TruckIcon } from "lucide-react";

const orderStatuses = [
  { icon: CheckCircle2, label: "Order Placed", completed: true, time: "2:30 PM" },
  { icon: ChefHat, label: "Cooking", completed: true, time: "2:35 PM" },
  { icon: TruckIcon, label: "Out for Delivery", completed: false, time: "Est. 3:00 PM" },
  { icon: CheckCircle2, label: "Delivered", completed: false, time: "Est. 3:05 PM" },
];

const OrderTracking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Track My Meal</h1>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <ChefHat className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Great news — the kitchen accepted your order!
              </h2>
              <p className="text-muted-foreground">ETA: 25–35 mins</p>
            </div>

            {/* Status Timeline */}
            <div className="space-y-6">
              {orderStatuses.map((status, index) => {
                const Icon = status.icon;
                const isLast = index === orderStatuses.length - 1;
                return (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                        status.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className={`font-semibold ${status.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {status.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">{status.time}</p>
                      </div>
                    </div>
                    {!isLast && (
                      <div className={`absolute left-6 top-12 w-0.5 h-6 -translate-x-1/2 ${
                        status.completed ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            <Card className="mt-8 p-4 bg-accent">
              <h3 className="font-semibold text-foreground mb-2">Order Details</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Order #12345</p>
                <p>Classic Burger × 2, Crispy Fries × 1</p>
                <p>Delivery to: 123 Main St, Apt 4B</p>
              </div>
            </Card>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
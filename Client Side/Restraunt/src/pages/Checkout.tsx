import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MapPin, CreditCard, Wallet } from "lucide-react";

const savedAddresses = [
  { id: "1", label: "Home", address: "123 Main St, Apt 4B, New York, NY 10001", phone: "555-0123" },
  { id: "2", label: "Work", address: "456 Office Plaza, Suite 200, New York, NY 10002", phone: "555-0124" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const handlePlaceOrder = () => {
    toast({
      title: "Thanks — your order is confirmed!",
      description: "We'll start cooking soon. ETA: 25–35 mins.",
    });
    navigate("/order-tracking");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Delivery Address</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a saved address or tap "Add new address."
              </p>
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                <div className="space-y-3">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className="flex items-start space-x-2 p-4 border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value={addr.id} id={addr.id} />
                      <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                        <span className="font-semibold text-foreground block">{addr.label}</span>
                        <span className="text-sm text-muted-foreground block">{addr.address}</span>
                        <span className="text-sm text-muted-foreground">Phone: {addr.phone}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <Button variant="outline" className="mt-4 w-full">Add New Address</Button>
            </Card>

            {/* Delivery Notes */}
            <Card className="p-6">
              <Label htmlFor="notes" className="text-lg font-semibold text-foreground mb-2 block">
                Add delivery notes
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                e.g. "Ring bell twice" or "Leave at the gate."
              </p>
              <Textarea
                id="notes"
                placeholder="Special instructions..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Payment</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Secure checkout — we never store raw card numbers.
              </p>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <CreditCard className="h-5 w-5" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <Wallet className="h-5 w-5" />
                      <span className="font-medium">Digital Wallet</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <span className="font-medium">Cash on Delivery</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-4">Confirm Order</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Review items, delivery address, and total before placing your order.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>$30.97</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>$33.96</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                Confirm & cook!
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
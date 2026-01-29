import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, ShoppingBag, Plus, Pencil, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface Order {
  id: string;
  date: string;
  items: string;
  total: string;
  status: string;
}

interface Address {
  id: string;
  label: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

const Account = () => {
  const { toast } = useToast();

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // ------------------------ FETCH PROFILE ------------------------
  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5265/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
      setEditForm(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5005/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(await res.json());
    } catch {}
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`http://localhost:5005/api/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(await res.json());
    } catch {}
  };

  useEffect(() => {
    if (!token) return; // no token no fetch

    setLoading(true);
    Promise.all([fetchProfile(), fetchOrders(), fetchAddresses()]).finally(() =>
      setLoading(false)
    );
  }, [token]);

  // ------------------------ EDIT PROFILE ------------------------
  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editForm) return;

    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast({
        title: "Missing fields",
        description: "Name and Email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5265/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setProfile(updated);
      setIsEditing(false);

      toast({ title: "Profile updated successfully!" });
    } catch (err) {
      toast({ title: "Error updating profile", variant: "destructive" });
    }
  };

  // ------------------------ LOGOUT ------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Comming Soon...
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {profile?.name?.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">Ready to order something yummy?</p>
              </div>
            </div>

            {token && (
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            )}
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="profile" className="flex gap-2 items-center">
                <User size={18} /> Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex gap-2 items-center">
                <ShoppingBag size={18} /> Orders
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex gap-2 items-center">
                <MapPin size={18} /> Addresses
              </TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              <Card className="p-6 space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editForm?.name || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev!, name: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        value={editForm?.email || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev!, email: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        value={editForm?.phoneNumber || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev!, phoneNumber: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Address</Label>
                      <Input
                        value={editForm?.address || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev!, address: e.target.value }))
                        }
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button onClick={handleSave} className="flex gap-2 items-center">
                        <Save size={16} /> Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleCancel}
                        className="flex gap-2 items-center"
                      >
                        <X size={16} /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {profile?.name}</p>
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <p><strong>Phone:</strong> {profile?.phoneNumber}</p>
                    <p><strong>Address:</strong> {profile?.address}</p>

                    {token && (
                      <Button
                        onClick={handleEdit}
                        className="mt-4 flex gap-2 items-center"
                      >
                        <Pencil size={16} /> Edit Profile
                      </Button>
                    )}
                  </>
                )}
              </Card>
            </TabsContent>

            {/* ORDERS TAB */}
            <TabsContent value="orders">
              <Card className="p-6 space-y-4">
                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="border p-4 rounded-lg">
                      <p><strong>Date:</strong> {o.date}</p>
                      <p><strong>Items:</strong> {o.items}</p>
                      <p><strong>Total:</strong> {o.total}</p>
                      <p><strong>Status:</strong> {o.status}</p>
                    </div>
                  ))
                )}
              </Card>
            </TabsContent>

            {/* ADDRESSES TAB */}
            <TabsContent value="addresses">
              <Card className="p-6 space-y-4">
                {addresses.length === 0 ? (
                  <p>No addresses found.</p>
                ) : (
                  addresses.map((a) => (
                    <div
                      key={a.id}
                      className="border p-4 rounded-lg flex justify-between"
                    >
                      <div>
                        <p><strong>{a.label}</strong></p>
                        <p>{a.address}</p>
                        <p>{a.phone}</p>
                        {a.isDefault && (
                          <span className="text-xs text-green-600 font-semibold">Default</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Account;
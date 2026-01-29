"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

const AddProduct = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [role, setRole] = useState<string | null>(null);

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5265/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5005/api/categories"); // MenuService endpoint
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (role !== "Admin") return <p className="text-center mt-10 text-lg text-red-500">Access denied. Only admins can add products.</p>;

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || !categoryId) {
      toast({
        title: "Missing fields",
        description: "Name, Price, and Category are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5005/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          categoryId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      toast({
        title: "Product added successfully!",
      });

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setCategoryId("");
    } catch (err) {
      toast({
        title: "Error adding product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <Card className="p-6 space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div>
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Button className="mt-4" onClick={handleSubmit}>Add Product</Button>
        </Card>
      </main>
    </div>
  );
};

export default AddProduct;

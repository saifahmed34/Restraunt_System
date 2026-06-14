import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// const apiUrl = "http://localhost:5005"
const Menu = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  // --------------------------
  // FETCH FROM BACKEND
  // --------------------------
  const fetchMenu = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/menu`); // Gateway URL
      const data = await res.json();
      console.log(data)
      setMenuItems(data);
    } catch (error) {
      console.error("Error loading menu:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/category`);
      const data = await res.json(); // CategoryDto[]

      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading menu...</p>;

  //const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.name)))];

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(
        item => item.categoryId === selectedCategory
      );
  // const addToCart = (itemName: string) => {
  //   toast({
  //     title: "Yum — added to cart!",
  //     description: `${itemName} has been added to your cart.`,
  //   });
  // };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Our Menu</h1>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-card hover:shadow-warm-glow transition-all duration-300">
              <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden">
                {item.imageurl ? (
                  <img
                    src={`${item.imageurl}`}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-4xl text-muted-foreground">🍕</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.categoryName}</p>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">${item.price}</span>
                  {/* <Button size="sm" onClick={() => addToCart(item.name)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button> */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Menu;

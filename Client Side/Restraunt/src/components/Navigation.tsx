import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
        burger 
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/menu" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Menu
          </Link>
          {/* <Link to="/cart" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart
          </Link> */}
          {/* <Link to="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link> */}
          {/* {!isLoggedIn && (
            <>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </>
          )} */}

        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <Link to="/menu" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Menu
              </Link>
              {/* <Link to="/cart" className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </Link>
              <Link to="/account" className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                <User className="h-5 w-5" />
                Account
              </Link> */}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navigation;
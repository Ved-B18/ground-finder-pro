import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, MapPin } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold italic text-gradient">SportUp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors font-medium">
              Explore
            </Link>
            <Link to="/auth" className="text-foreground hover:text-primary transition-colors font-medium">
              Log In
            </Link>
            <Button variant="hero" size="default" asChild>
              <Link to="/auth?signup=true">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 animate-fade-in">
            <Link
              to="/explore"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/auth"
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Button variant="hero" size="default" asChild className="w-full">
              <Link to="/auth?signup=true" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

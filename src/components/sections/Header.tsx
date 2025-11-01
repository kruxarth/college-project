import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

export function Header({ mobileMenuOpen, setMobileMenuOpen, scrollToSection }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <span className="bg-gradient-to-r from-raspberry-red to-mango-orange bg-clip-text text-transparent">
              Nourish
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('stats')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Our Achievements
            </button>
            <button 
              onClick={() => scrollToSection('dream')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Our Dream
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact Us
            </button>
            <Button variant="outline" asChild className="hover:bg-primary/10">
              <Link to="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col gap-4 pt-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-foreground hover:text-primary transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('stats')}
                className="text-left text-foreground hover:text-primary transition-colors font-medium"
              >
                Our Achievements
              </button>
              <button 
                onClick={() => scrollToSection('dream')}
                className="text-left text-foreground hover:text-primary transition-colors font-medium"
              >
                Our Dream
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-foreground hover:text-primary transition-colors font-medium"
              >
                Contact Us
              </button>
              <Button variant="outline" asChild className="w-fit">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
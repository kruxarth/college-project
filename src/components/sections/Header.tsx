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
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Nourish
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('stats')}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Impact
            </button>
            <button 
              onClick={() => scrollToSection('dream')}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Vision
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Contact
            </button>
            <Button variant="outline" asChild className="border-orange-200 text-orange-600 hover:bg-orange-50">
              <Link to="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-600"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-4 pt-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('stats')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Impact
              </button>
              <button 
                onClick={() => scrollToSection('dream')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Vision
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Contact
              </button>
              <Button variant="outline" asChild className="w-fit border-orange-200 text-orange-600 hover:bg-orange-50">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
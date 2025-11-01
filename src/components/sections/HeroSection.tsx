import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="home" className="container mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
          Reduce Food Waste,
          <br />
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Feed Communities
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Connect food donors with NGOs to create a sustainable impact. 
          Join our platform to share surplus food and help those in need.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg h-16 px-10 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all" asChild>
            <Link to="/signup?role=donor">
              <Package className="mr-3 h-6 w-6" />
              Sign up as Donor
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg h-16 px-10 border-2 border-orange-500 text-orange-600 hover:bg-orange-50" asChild>
            <Link to="/signup?role=ngo">
              <Users className="mr-3 h-6 w-6" />
              Sign up as NGO
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
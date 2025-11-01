import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Target, Leaf } from 'lucide-react';

export function DreamSection() {
  return (
    <section id="dream" className="bg-gradient-to-br from-peach via-banana-cream to-peach py-20 text-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Towards Our Dream</h2>
          <p className="text-xl opacity-90 mb-8 max-w-4xl mx-auto leading-relaxed">
            We envision a world where no edible food goes to waste while people go hungry. 
            Our platform is building a sustainable ecosystem that connects surplus food with those who need it most.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/30 transition-all duration-300 border border-white/30">
            <div className="h-16 w-16 mx-auto mb-6 bg-raspberry-red/20 rounded-xl flex items-center justify-center">
              <Globe className="h-8 w-8 text-raspberry-red" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Zero Food Waste</h3>
            <p className="opacity-90 leading-relaxed">
              Creating a circular food economy where every piece of surplus food finds its way to someone in need, 
              eliminating waste at every level.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/30 transition-all duration-300 border border-white/30">
            <div className="h-16 w-16 mx-auto mb-6 bg-mango-orange/20 rounded-xl flex items-center justify-center">
              <Target className="h-8 w-8 text-mango-orange" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Community Connection</h3>
            <p className="opacity-90 leading-relaxed">
              Strengthening communities by fostering meaningful relationships between donors, NGOs, and beneficiaries 
              through shared purpose.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/30 transition-all duration-300 border border-white/30">
            <div className="h-16 w-16 mx-auto mb-6 bg-plum-purple/20 rounded-xl flex items-center justify-center">
              <Leaf className="h-8 w-8 text-plum-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Sustainable Future</h3>
            <p className="opacity-90 leading-relaxed">
              Building a technology-driven solution that scales globally to end hunger and food waste, 
              creating lasting environmental impact.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Join Our Movement</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Together, we can transform how the world thinks about food waste and community support
            </p>
          </div>
          
          <Button size="lg" className="bg-raspberry-red hover:bg-raspberry-red/90 text-white text-lg h-16 px-10 shadow-medium hover:shadow-strong" asChild>
            <Link to="/signup">Join Our Mission</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Users, TrendingUp, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Landing() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <Heart className="h-7 w-7 text-primary fill-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FoodShare
            </span>
          </div>
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Reduce Food Waste,
            <br />
            Feed Communities
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect food donors with NGOs to create a sustainable impact. 
            Join our platform to share surplus food and help those in need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg h-14 px-8 bg-gradient-warm hover:opacity-90" asChild>
              <Link to="/signup?role=donor">
                <Package className="mr-2 h-5 w-5" />
                Sign up as Donor
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-2" asChild>
              <Link to="/signup?role=ngo">
                <Users className="mr-2 h-5 w-5" />
                Sign up as NGO
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Donations</h3>
            <p className="text-muted-foreground">
              List your surplus food in minutes. Add photos, set pickup times, and track donations in real-time.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Users className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Verified NGOs</h3>
            <p className="text-muted-foreground">
              Connect with trusted NGO partners. Browse available food and coordinate pickups seamlessly.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Impact</h3>
            <p className="text-muted-foreground">
              View your contribution stats. See how many meals you've saved and communities you've helped.
            </p>
          </div>
        </section>

        <section className="bg-gradient-hero rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of donors and NGOs working together to eliminate food waste 
            and hunger in our communities.
          </p>
          <Button size="lg" variant="secondary" className="text-lg h-14 px-8" asChild>
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2025 FoodShare. Making every meal count.</p>
      </footer>
    </div>
  );
}

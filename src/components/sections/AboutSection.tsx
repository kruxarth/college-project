import { Users, TrendingUp, Utensils } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">About Nourish</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Our platform bridges the gap between food surplus and food insecurity
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-16 w-16 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <Utensils className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Easy Donations</h3>
            <p className="text-gray-600 leading-relaxed">
              List your surplus food in minutes. Add photos, set pickup times, and track donations in real-time.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-16 w-16 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Verified NGOs</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with trusted NGO partners. Browse available food and coordinate pickups seamlessly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-16 w-16 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Track Impact</h3>
            <p className="text-gray-600 leading-relaxed">
              View your contribution stats. See how many meals you've saved and communities you've helped.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
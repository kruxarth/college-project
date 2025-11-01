import { Mail, Phone, MapPin } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Contact Us</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get in touch with us to learn more about our mission or to discuss partnerships
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center group">
          <div className="h-16 w-16 mx-auto mb-4 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <Mail className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Email Us</h3>
          <p className="text-gray-600 mb-2">Get in touch via email</p>
          <a href="mailto:contact@nourish.com" className="text-orange-600 hover:underline font-medium">
            contact@nourish.com
          </a>
        </div>

        <div className="text-center group">
          <div className="h-16 w-16 mx-auto mb-4 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <Phone className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Call Us</h3>
          <p className="text-gray-600 mb-2">Speak with our team</p>
          <a href="tel:+1234567890" className="text-orange-600 hover:underline font-medium">
            +1 (234) 567-890
          </a>
        </div>

        <div className="text-center group">
          <div className="h-16 w-16 mx-auto mb-4 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Visit Us</h3>
          <p className="text-gray-600 mb-2">Come to our office</p>
          <p className="text-gray-700 font-medium">
            123 Innovation Street<br />
            Tech City, TC 12345
          </p>
        </div>
      </div>
    </section>
  );
}
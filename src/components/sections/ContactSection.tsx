import { Mail, Phone, MapPin, Users, Building2, HelpCircle, Clock } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to make a difference? Connect with our team to learn more about our platform, 
            discuss partnerships, or get support for your food donation initiatives.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Email Support</h3>
                  <p className="text-gray-600">Reach out to our team directly</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Krutarth Fulare</p>
                      <p className="text-sm text-gray-600">Technical Lead & Co-Founder</p>
                    </div>
                    <a 
                      href="mailto:kruxarth@gmail.com" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Email
                    </a>
                  </div>
                  <p className="text-orange-600 mt-2 font-mono text-sm">kruxarth@gmail.com</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Prabhat Jha</p>
                      <p className="text-sm text-gray-600">Project Lead & Co-Founder</p>
                    </div>
                    <a 
                      href="mailto:jhaprabhat.anand@gmail.com" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Email
                    </a>
                  </div>
                  <p className="text-orange-600 mt-2 font-mono text-sm">jhaprabhat.anand@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Phone Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Phone Support</h3>
                  <p className="text-gray-600">Speak with us directly</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Prabhat Jha</p>
                    <p className="text-sm text-gray-600">Available Mon-Fri, 9 AM - 6 PM IST</p>
                  </div>
                  <a 
                    href="tel:+917768069224" 
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Call
                  </a>
                </div>
                <p className="text-orange-600 mt-2 font-mono text-lg">+91 7768069224</p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Best time to call:</strong> Weekdays between 10 AM - 5 PM IST for immediate assistance
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">How We Can Help</h3>
              <p className="text-gray-600">Our team is here to support your food donation journey</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Platform Support</h4>
                <p className="text-sm text-gray-600">
                  Getting started, account setup, and platform navigation assistance
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Partnerships</h4>
                <p className="text-sm text-gray-600">
                  Institutional partnerships, bulk donations, and collaboration opportunities
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">General Inquiries</h4>
                <p className="text-sm text-gray-600">
                  Questions about our mission, impact reports, and community initiatives
                </p>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <p className="text-sm text-orange-800">
                <strong>Response Time:</strong> We typically respond to emails within 24 hours and phone calls are answered during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
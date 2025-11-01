import { Mail, Phone, MapPin } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-foreground">Contact Us</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get in touch with us to learn more about our mission or to discuss partnerships
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center group">
          <div className="h-16 w-16 mx-auto mb-4 bg-raspberry-red/10 rounded-xl flex items-center justify-center group-hover:bg-raspberry-red/20 transition-colors">
            <Mail className="h-8 w-8 text-raspberry-red" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email Us</h3>
          <p className="text-muted-foreground mb-2">Get in touch via email</p>
          <a href="mailto:contact@nourish.com" className="text-raspberry-red hover:underline font-medium">
            contact@nourish.com
          </a>
        </div>

        <div className="text-center group">
          <div className="h-16 w-16 mx-auto mb-4 bg-mango-orange/10 rounded-xl flex items-center justify-center group-hover:bg-mango-orange/20 transition-colors">
            <Phone className="h-8 w-8 text-mango-orange" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-muted-foreground mb-2">Speak with our team</p>
          <a href="tel:+1234567890" className="text-mango-orange hover:underline font-medium">
            +1 (234) 567-890
          </a>
        </div>

        <div className="text-center group">
          <div className="h-16 w-16 mx-auto mb-4 bg-plum-purple/10 rounded-xl flex items-center justify-center group-hover:bg-plum-purple/20 transition-colors">
            <MapPin className="h-8 w-8 text-plum-purple" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
          <p className="text-muted-foreground mb-2">Come to our office</p>
          <p className="text-foreground font-medium">
            123 Innovation Street<br />
            Tech City, TC 12345
          </p>
        </div>
      </div>
    </section>
  );
}
import { MapPin, Phone, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
            Reach <span className="text-primary">Us</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-6 sm:p-8 shadow-card" style={{ backgroundColor: 'rgba(0, 7, 45, 0.8)' }}>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    Sai Leo Nagar, West Tambaram,<br />
                    Chennai – 600 044.<br />
                    Tamil Nadu, India.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8 shadow-card" style={{ backgroundColor: 'rgba(0, 7, 45, 0.8)' }}>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Contact</h3>
                  <p className="text-muted-foreground">
                    Chairperson: Sathish Kumar<br />
                    <a href="tel:+919344805365" className="text-primary hover:underline">
                      +91 93448 05365
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8 shadow-card" style={{ backgroundColor: 'rgba(0, 7, 45, 0.8)' }}>
              <div className="flex items-start gap-4">
                <Instagram className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Social Media</h3>
                  <Button
                    asChild
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                  >
                    <a
                      href="https://www.instagram.com/intemstellar/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @intemstellar
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="glass rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'rgba(0, 7, 45, 0.8)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d248847.9142688746!2d80.090366!3d12.955934!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f596c7fb72c9%3A0x8e7a30529f9ef227!2sSri%20Sairam%20Engineering%20College!5e0!3m2!1sen!2sus!4v1760532783108!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '450px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sri Sairam Engineering College Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import { Phone, MapPin, Clock, Mail } from "lucide-react";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mt-3">
            ¿Necesitas un envío?
          </h2>
          <p className="text-muted-foreground mt-4">
            Contáctanos y te ofrecemos presupuesto sin compromiso.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Dirección</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Polígono Industrial El Mayorazgo<br />
                  Carretera Hoya Fría nº 5 (Bajo)<br />
                  38110 Santa Cruz de Tenerife, España
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Teléfono</h3>
                <a href="tel:+34922619077" className="text-accent hover:underline text-sm mt-1 block">
                  922 61 90 77
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Email</h3>
                <a href="mailto:admin.transportesbaritto@gmail.com" className="text-accent hover:underline text-sm mt-1 block">
                  admin.transportesbaritto@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Horario</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Lunes a Viernes: 8:00 – 18:00<br />
                  Sábados: 9:00 – 13:00
                </p>
              </div>
            </div>
          </motion.div>

          {/* Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="rounded-xl overflow-hidden border border-border shadow-[var(--shadow-card)] h-[400px]"
          >
            <iframe
              title="Ubicación de Transportes Insulares Baritto"
              src="https://maps.google.com/maps?q=Transportes+Insulares+Baritto+Santa+Cruz+de+Tenerife&t=&z=17&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

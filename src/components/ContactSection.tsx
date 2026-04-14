import { Phone, MapPin, Clock, Mail, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const locations = [
  {
    name: "Sede Central – Tenerife",
    address: "Polígono Industrial El Mayorazgo\nCarretera Hoya Fría nº 5 (Bajo)\n38110 Santa Cruz de Tenerife",
    phone: "922 61 90 77",
    phoneHref: "+34922619077",
    mapQuery: "Transportes+Insulares+Baritto+Santa+Cruz+de+Tenerife",
  },
  {
    name: "Delegación La Palma",
    address: "Ctra. San Nicolás, esquina Avda. Venezuela, nave 1\n38750 El Paso, La Palma",
    phone: "922 41 63 10",
    phoneHref: "+34922416310",
    mapQuery: "Ctra+San+Nicolas+Avda+Venezuela+El+Paso+La+Palma",
  },
  {
    name: "Delegación El Hierro",
    address: "Los Barriales S/N\n38900 Valverde, El Hierro",
    phone: "922 55 06 59",
    phoneHref: "+34922550659",
    mapQuery: "Los+Barriales+Valverde+El+Hierro",
  },
];

const ContactSection = () => {
  const [activeLocation, setActiveLocation] = useState(0);

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
            Contáctanos y te ofrecemos presupuesto sin compromiso. Estamos en tres islas.
          </p>
        </motion.div>

        {/* Location Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3 mb-12 max-w-3xl mx-auto"
        >
          {locations.map((loc, i) => (
            <button
              key={i}
              onClick={() => setActiveLocation(i)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeLocation === i
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Building2 className="w-4 h-4" />
              {loc.name}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            key={activeLocation}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Dirección</h3>
                <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">
                  {locations[activeLocation].address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Teléfono</h3>
                <a href={`tel:${locations[activeLocation].phoneHref}`} className="text-accent hover:underline text-sm mt-1 block">
                  {locations[activeLocation].phone}
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
            key={`map-${activeLocation}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-xl overflow-hidden border border-border shadow-[var(--shadow-card)] h-[400px]"
          >
            <iframe
              title={`Ubicación de ${locations[activeLocation].name}`}
              src={`https://maps.google.com/maps?q=${locations[activeLocation].mapQuery}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
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

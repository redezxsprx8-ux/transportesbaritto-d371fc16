import { Truck, Package, Clock, Shield, Anchor, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Truck,
    title: "Transporte terrestre",
    description: "Recogida y entrega puerta a puerta en toda la isla de Tenerife.",
  },
  {
    icon: Anchor,
    title: "Transporte marítimo",
    description: "Envíos interinsulares entre todas las Islas Canarias con total seguridad.",
  },
  {
    icon: Package,
    title: "Paquetería y mercancías",
    description: "Gestión de paquetes de cualquier tamaño, desde sobres hasta palés completos.",
  },
  {
    icon: Clock,
    title: "Envíos urgentes",
    description: "Servicio express para entregas en el menor tiempo posible.",
  },
  {
    icon: Shield,
    title: "Seguro de mercancías",
    description: "Tus envíos protegidos con cobertura completa durante todo el trayecto.",
  },
  {
    icon: BarChart3,
    title: "Mudanzas interinsulares",
    description: "Trasladamos tus pertenencias entre islas con cuidado y profesionalidad.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Nuestros servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mt-3">
            Soluciones de transporte a tu medida
          </h2>
          <p className="text-muted-foreground mt-4">
            Más de 20 años conectando las Islas Canarias con un servicio fiable, rápido y económico.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <service.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-heading font-bold text-card-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

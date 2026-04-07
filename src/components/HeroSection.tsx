import { Ship, Phone, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-ship.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Barco de transporte de mercancías navegando cerca de las Islas Canarias"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-secondary font-medium text-sm backdrop-blur-sm border border-secondary/30">
            <Ship className="w-4 h-4" />
            Transporte de mercancías interinsular
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-primary-foreground leading-tight tracking-tight">
            Transportes Insulares{" "}
            <span className="text-secondary">Baritto</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg font-body">
            Tu socio de confianza en el transporte de mercancías en las Islas
            Canarias. Rapidez, eficiencia y seguridad en cada envío.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="tel:+34922000000"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-semibold text-sm transition-all duration-300 bg-secondary text-secondary-foreground hover:brightness-110 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Llamar ahora
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-semibold text-sm transition-all duration-300 border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4" />
              Cómo llegar
            </a>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex">
              {[1, 2, 3, 4].map((i) => (
                <svg key={i} className="w-5 h-5 text-secondary fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <svg className="w-5 h-5 text-secondary" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  fill="url(#half)"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <span className="text-primary-foreground font-bold text-lg">4,1</span>
            <span className="text-primary-foreground/60 text-sm">· 125 reseñas en Google</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

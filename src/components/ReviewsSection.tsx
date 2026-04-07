import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "María G.",
    rating: 5,
    text: "Amables, eficientes, rápidos y económicos. Sin duda los mejores para transporte interinsular.",
  },
  {
    name: "Carlos R.",
    rating: 5,
    text: "Siempre atentos y siempre puntuales sus envíos, muy contento con el servicio.",
  },
  {
    name: "Ana P.",
    rating: 5,
    text: "Buen trato y rapidez, le doy las 5 estrellas. Recomendados al 100%.",
  },
  {
    name: "Pedro M.",
    rating: 4,
    text: "Muy buen servicio de transporte. Envíos seguros y personal muy amable.",
  },
  {
    name: "Laura S.",
    rating: 5,
    text: "Los utilizo para mi negocio semanalmente. Siempre cumplen con los plazos.",
  },
  {
    name: "Juan D.",
    rating: 4,
    text: "Precios competitivos y buen servicio al cliente. Los recomiendo.",
  },
];

const ReviewsSection = () => {
  return (
    <section id="resenas" className="py-24 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Reseñas
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mt-3">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-5xl font-heading font-extrabold text-foreground">4,1</span>
            <div>
              <div className="flex">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                ))}
                <Star className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-muted-foreground text-sm mt-1">125 reseñas en Google</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-xl bg-card border border-border p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-secondary/30 mb-4" />
              <p className="text-card-foreground leading-relaxed mb-6">"{review.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <span className="font-medium text-card-foreground">{review.name}</span>
                </div>
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

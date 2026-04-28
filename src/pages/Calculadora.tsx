import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Ship, Package, Truck, Zap, Info, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Island = "tenerife" | "la-palma" | "el-hierro" | "gran-canaria" | "lanzarote" | "fuerteventura";
type ServiceType = "paqueteria" | "carga" | "mudanza" | "urgente";

const ISLANDS: { value: Island; label: string }[] = [
  { value: "tenerife", label: "Tenerife" },
  { value: "la-palma", label: "La Palma" },
  { value: "el-hierro", label: "El Hierro" },
  { value: "gran-canaria", label: "Gran Canaria" },
  { value: "lanzarote", label: "Lanzarote" },
  { value: "fuerteventura", label: "Fuerteventura" },
];

const SERVICES: { value: ServiceType; label: string; icon: typeof Package; multiplier: number; base: number }[] = [
  { value: "paqueteria", label: "Paquetería", icon: Package, multiplier: 1, base: 12 },
  { value: "carga", label: "Carga general", icon: Truck, multiplier: 0.85, base: 25 },
  { value: "mudanza", label: "Mudanza inter-islas", icon: Ship, multiplier: 1.15, base: 60 },
  { value: "urgente", label: "Envío urgente 24h", icon: Zap, multiplier: 1.6, base: 35 },
];

// Distancia relativa entre islas (factor)
const ISLAND_FACTOR: Record<Island, number> = {
  tenerife: 1.0,
  "la-palma": 1.15,
  "el-hierro": 1.25,
  "gran-canaria": 1.1,
  lanzarote: 1.3,
  fuerteventura: 1.3,
};

const Calculadora = () => {
  const [origin, setOrigin] = useState<Island | "">("");
  const [destination, setDestination] = useState<Island | "">("");
  const [service, setService] = useState<ServiceType>("paqueteria");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const estimate = useMemo(() => {
    if (!origin || !destination || origin === destination) return null;
    const w = parseFloat(weight) || 0;
    const v = parseFloat(volume) || 0;
    if (w <= 0 && v <= 0) return null;

    const svc = SERVICES.find((s) => s.value === service)!;
    // Peso volumétrico: 1 m³ ≈ 250 kg
    const volumetricWeight = v * 250;
    const billableWeight = Math.max(w, volumetricWeight);

    const distanceFactor = (ISLAND_FACTOR[origin] + ISLAND_FACTOR[destination]) / 2;
    const pricePerKg = 0.45 * svc.multiplier;
    const subtotal = svc.base + billableWeight * pricePerKg * distanceFactor;
    const total = Math.round(subtotal * 100) / 100;

    return {
      total,
      min: Math.round(total * 0.9 * 100) / 100,
      max: Math.round(total * 1.15 * 100) / 100,
      billableWeight: Math.round(billableWeight * 10) / 10,
      transitDays: service === "urgente" ? "24h" : "2-4 días laborables",
    };
  }, [origin, destination, service, weight, volume]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!origin) newErrors.origin = "Selecciona una isla de origen";
    if (!destination) newErrors.destination = "Selecciona una isla de destino";
    if (origin && destination && origin === destination) {
      newErrors.destination = "Origen y destino deben ser distintos";
    }
    const w = parseFloat(weight);
    const v = parseFloat(volume);
    if ((!w || w <= 0) && (!v || v <= 0)) {
      newErrors.weight = "Introduce peso o volumen";
    }
    if (w && (w < 0 || w > 10000)) newErrors.weight = "Peso entre 0 y 10.000 kg";
    if (v && (v < 0 || v > 200)) newErrors.volume = "Volumen entre 0 y 200 m³";

    setErrors(newErrors);
    setSubmitted(Object.keys(newErrors).length === 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 bg-background">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-secondary uppercase mb-3">
              Presupuesto online
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Calcula tu envío al instante
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Estimación orientativa para envíos entre islas. Recibirás un presupuesto definitivo tras confirmar los detalles con nuestro equipo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Formulario */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="md:col-span-3 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Isla de origen</Label>
                  <Select value={origin} onValueChange={(v) => setOrigin(v as Island)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona origen" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISLANDS.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.origin && <p className="text-xs text-destructive mt-1">{errors.origin}</p>}
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Isla de destino</Label>
                  <Select value={destination} onValueChange={(v) => setDestination(v as Island)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISLANDS.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.destination && <p className="text-xs text-destructive mt-1">{errors.destination}</p>}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Tipo de servicio</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES.map((s) => {
                    const Icon = s.icon;
                    const active = service === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setService(s.value)}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                          active
                            ? "border-secondary bg-secondary/10 text-primary"
                            : "border-border hover:border-secondary/50 text-foreground"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? "text-secondary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Peso (kg)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10000"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ej: 25"
                    className="h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Volumen (m³)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="200"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="Ej: 0.5"
                    className="h-11"
                  />
                </div>
              </div>
              {(errors.weight || errors.volume) && (
                <p className="text-xs text-destructive">{errors.weight || errors.volume}</p>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                <span>Se factura el mayor entre peso real y peso volumétrico (1 m³ ≈ 250 kg).</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-secondary text-secondary-foreground hover:brightness-110"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular presupuesto
              </Button>
            </motion.form>

            {/* Resultado */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="md:col-span-2"
            >
              <div className="sticky top-24 bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 shadow-[var(--shadow-elevated)]">
                <p className="text-xs uppercase tracking-widest text-secondary font-semibold mb-2">
                  Estimación
                </p>

                {submitted && estimate ? (
                  <motion.div
                    key={estimate.total}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xs text-primary-foreground/60 mb-1">Desde</p>
                    <p className="font-heading text-5xl font-bold text-secondary mb-1">
                      {estimate.min.toFixed(2)}€
                    </p>
                    <p className="text-sm text-primary-foreground/70 mb-6">
                      Rango: {estimate.min.toFixed(2)}€ – {estimate.max.toFixed(2)}€
                    </p>

                    <div className="space-y-3 pb-6 mb-6 border-b border-primary-foreground/15">
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-foreground/70">Peso facturable</span>
                        <span className="font-semibold">{estimate.billableWeight} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-foreground/70">Tiempo de tránsito</span>
                        <span className="font-semibold">{estimate.transitDays}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-foreground/70">Servicio</span>
                        <span className="font-semibold">
                          {SERVICES.find((s) => s.value === service)?.label}
                        </span>
                      </div>
                    </div>

                    <a
                      href="/#contacto"
                      className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground rounded-lg py-3 font-semibold hover:brightness-110 transition-all"
                    >
                      Solicitar presupuesto en firme
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-xs text-primary-foreground/50 mt-4 text-center">
                      Precio orientativo. IVA no incluido.
                    </p>
                  </motion.div>
                ) : (
                  <div className="py-12 text-center">
                    <Calculator className="w-12 h-12 text-secondary/40 mx-auto mb-4" />
                    <p className="text-primary-foreground/60 text-sm">
                      Completa el formulario para ver tu estimación al instante.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculadora;

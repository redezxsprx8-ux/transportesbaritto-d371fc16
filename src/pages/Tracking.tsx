import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, CheckCircle2, Truck, Ship, MapPin, Clock, Circle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = {
  icon: typeof Package;
  title: string;
  location: string;
  date: string;
  completed: boolean;
};

const DEMO_CODE = "BAR-EH-2026-7842";

const demoStatuses: Status[] = [
  {
    icon: Package,
    title: "Escaneo en origen",
    location: "Delegación El Hierro · Valverde",
    date: "24 abr 2026 · 09:14",
    completed: true,
  },
  {
    icon: CheckCircle2,
    title: "Mercancía preparada",
    location: "Centro logístico El Hierro",
    date: "24 abr 2026 · 11:42",
    completed: true,
  },
  {
    icon: Truck,
    title: "Salida del envío",
    location: "Puerto de La Estaca",
    date: "24 abr 2026 · 16:30",
    completed: true,
  },
  {
    icon: Ship,
    title: "En tránsito marítimo",
    location: "El Hierro → Tenerife",
    date: "25 abr 2026 · 02:10",
    completed: true,
  },
  {
    icon: MapPin,
    title: "Recepción en destino",
    location: "Puerto de Santa Cruz de Tenerife",
    date: "25 abr 2026 · 08:45",
    completed: true,
  },
  {
    icon: Truck,
    title: "En reparto",
    location: "Delegación Tenerife · Granadilla",
    date: "Estimado: 25 abr 2026 · 14:00",
    completed: false,
  },
  {
    icon: CheckCircle2,
    title: "Entregado",
    location: "Pendiente",
    date: "—",
    completed: false,
  },
];

const Tracking = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Status[] | null>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Introduce un código de seguimiento");
      setResult(null);
      return;
    }
    if (trimmed === DEMO_CODE) {
      setError("");
      setResult(demoStatuses);
    } else {
      setError(`No se ha encontrado el código "${trimmed}". Prueba con: ${DEMO_CODE}`);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 bg-background">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-secondary uppercase mb-3">
              Seguimiento de envíos
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Sigue tu pedido en tiempo real
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Introduce el código de seguimiento que te facilitamos para conocer el estado de tu envío entre islas.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] mb-8"
          >
            <label className="block text-sm font-semibold text-foreground mb-2">
              Código de seguimiento
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: BAR-EH-2026-7842"
                className="flex-1 h-12 text-base"
              />
              <Button type="submit" size="lg" className="h-12 bg-secondary text-secondary-foreground hover:brightness-110">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Código de prueba: <span className="font-mono font-semibold text-primary">{DEMO_CODE}</span>
            </p>
            {error && <p className="text-sm text-destructive mt-3">{error}</p>}
          </motion.form>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-[var(--shadow-elevated)]"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-border">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Código
                  </p>
                  <p className="font-mono font-bold text-lg text-primary">{DEMO_CODE}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Ruta
                  </p>
                  <p className="font-semibold text-foreground">El Hierro → Tenerife</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Estado
                  </p>
                  <span className="inline-flex items-center gap-2 bg-secondary/15 text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    En tránsito
                  </span>
                </div>
              </div>

              <ol className="relative">
                {result.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === result.length - 1;
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="relative pl-14 pb-8"
                    >
                      {!isLast && (
                        <span
                          className={`absolute left-[22px] top-11 bottom-0 w-px ${
                            step.completed ? "bg-secondary" : "bg-border"
                          }`}
                        />
                      )}
                      <span
                        className={`absolute left-0 top-0 w-11 h-11 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? <Icon className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </span>
                      <div>
                        <h3
                          className={`font-heading font-semibold text-base mb-1 ${
                            step.completed ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm text-foreground/80">{step.location}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;

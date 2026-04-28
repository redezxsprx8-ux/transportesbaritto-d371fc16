import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Package, Truck, Flower2, Info, ArrowRight, Phone } from "lucide-react";
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

type Island = "tenerife" | "la-palma" | "el-hierro" | "la-gomera";
type ServiceType = "paqueteria" | "carga" | "flores";

const ISLANDS: { value: Island; label: string }[] = [
  { value: "tenerife", label: "Tenerife" },
  { value: "la-palma", label: "La Palma" },
  { value: "el-hierro", label: "El Hierro" },
  { value: "la-gomera", label: "La Gomera (bajo encargo)" },
];

const SERVICES: { value: ServiceType; label: string; icon: typeof Package; description: string }[] = [
  { value: "paqueteria", label: "Paquetería (por bulto)", icon: Package, description: "Envío estándar por número de bultos" },
  { value: "carga", label: "Cargo", icon: Truck, description: "Carga por kg, m³ o palet. Incluye mudanzas inter-islas" },
  { value: "flores", label: "Flores", icon: Flower2, description: "Tarifa especial pequeñas o grandes" },
];

// Tarifas por bulto (paquetería estándar)
const RATE_PER_PACKAGE: Record<Exclude<Island, "tenerife" | "la-gomera">, number> = {
  "la-palma": 9.18,
  "el-hierro": 10.70,
};

// Flores grandes (precio por los dos, mínimo 1 bulto)
const FLOWERS_LARGE_PRICE = 12; // El Hierro y La Palma


// Carga general
const RATE_PER_KG = 0.15; // a partir de 400kg
const KG_THRESHOLD = 400;
const RATE_PER_M3 = 55;
const RATE_OUT_OF_PALLET = 75; // fuera de medida palet americano/europeo

const Calculadora = () => {
  const [origin, setOrigin] = useState<Island | "">("");
  const [destination, setDestination] = useState<Island | "">("");
  const [service, setService] = useState<ServiceType>("paqueteria");

  // Paquetería / flores / baúl
  const [packages, setPackages] = useState("1");
  const [flowerSize, setFlowerSize] = useState<"pequenas" | "grandes">("pequenas");

  // Carga general
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [outOfPallet, setOutOfPallet] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const isOnRequest = destination === "la-gomera" || origin === "la-gomera";

  const estimate = useMemo(() => {
    if (!origin || !destination || origin === destination) return null;
    if (isOnRequest) return null;

    // Solo trabajamos rutas que incluyan Tenerife como hub o entre La Palma/El Hierro y Tenerife.
    // Determinamos la isla "remota" (la que no es Tenerife) para aplicar tarifas.
    const remote: Island | null =
      origin === "tenerife" ? destination
      : destination === "tenerife" ? origin
      : null;

    if (remote !== "la-palma" && remote !== "el-hierro") return null;

    const remoteKey = remote;

    if (service === "paqueteria") {
      const manualPackages = Math.max(1, parseInt(packages) || 1);
      const w = parseFloat(weight) || 0;
      // Hasta 20 kg = 1 bulto. Después, 1 bulto cada 20 kg (redondeo arriba).
      const packagesByWeight = w > 0 ? Math.max(1, Math.ceil(w / 20)) : 0;
      const n = Math.max(manualPackages, packagesByWeight);
      const total = RATE_PER_PACKAGE[remoteKey] * n;
      const breakdown: { label: string; value: string }[] = [];
      if (w > 0) {
        breakdown.push({ label: `Peso ${w} kg (1 bulto/20 kg)`, value: `${packagesByWeight} bulto${packagesByWeight > 1 ? "s" : ""}` });
      }
      breakdown.push({ label: `${n} bulto${n > 1 ? "s" : ""} × ${RATE_PER_PACKAGE[remoteKey].toFixed(2)}€`, value: `${total.toFixed(2)}€` });
      return {
        total: Math.round(total * 100) / 100,
        breakdown,
        transit: "Hoy laborable → entrega mañana",
      };
    }

    if (service === "flores") {
      if (flowerSize === "pequenas") {
        // Pequeñas: mínimo 1 bulto, tarifa estándar por bulto
        const n = Math.max(1, parseInt(packages) || 1);
        const total = RATE_PER_PACKAGE[remoteKey] * n;
        return {
          total: Math.round(total * 100) / 100,
          breakdown: [
            { label: "Flores pequeñas (mín. 1 bulto)", value: `${n} bulto${n > 1 ? "s" : ""}` },
            { label: `${n} × ${RATE_PER_PACKAGE[remoteKey].toFixed(2)}€`, value: `${total.toFixed(2)}€` },
          ],
          transit: "Hoy laborable → entrega mañana",
        };
      } else {
        // Grandes: 12€ los dos (El Hierro y La Palma)
        return {
          total: FLOWERS_LARGE_PRICE,
          breakdown: [
            { label: "Flores grandes (los dos)", value: `${FLOWERS_LARGE_PRICE.toFixed(2)}€` },
          ],
          transit: "Hoy laborable → entrega mañana",
        };
      }
    }

    // Carga / mudanza

    const w = parseFloat(weight) || 0;
    const v = parseFloat(volume) || 0;
    if (w <= 0 && v <= 0 && !outOfPallet) return null;

    const lines: { label: string; value: string }[] = [];
    let total = 0;

    if (w >= KG_THRESHOLD) {
      const kgCost = w * RATE_PER_KG;
      total += kgCost;
      lines.push({ label: `${w} kg × ${RATE_PER_KG.toFixed(2)}€`, value: `${kgCost.toFixed(2)}€` });
    } else if (w > 0) {
      lines.push({ label: `Peso ${w} kg`, value: `< ${KG_THRESHOLD} kg (consultar)` });
    }

    if (v > 0) {
      const m3Cost = v * RATE_PER_M3;
      total += m3Cost;
      lines.push({ label: `${v} m³ × ${RATE_PER_M3}€`, value: `${m3Cost.toFixed(2)}€` });
    }

    if (outOfPallet) {
      total += RATE_OUT_OF_PALLET;
      lines.push({ label: "Fuera de medida palet (americano/europeo)", value: `${RATE_OUT_OF_PALLET.toFixed(2)}€` });
    }

    if (total <= 0) return null;

    return {
      total: Math.round(total * 100) / 100,
      breakdown: lines,
      transit: "Hoy laborable → entrega mañana",
    };
  }, [origin, destination, isOnRequest, service, packages, flowerSize, weight, volume, outOfPallet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!origin) newErrors.origin = "Selecciona una isla de origen";
    if (!destination) newErrors.destination = "Selecciona una isla de destino";
    if (origin && destination && origin === destination) {
      newErrors.destination = "Origen y destino deben ser distintos";
    }
    if (origin && destination && origin !== destination && !isOnRequest) {
      // Debe haber Tenerife en uno de los extremos
      if (origin !== "tenerife" && destination !== "tenerife") {
        newErrors.destination = "Las rutas operan con Tenerife como origen o destino";
      }
    }

    if (service === "carga" && !isOnRequest) {
      const w = parseFloat(weight);
      const v = parseFloat(volume);
      if ((!w || w <= 0) && (!v || v <= 0) && !outOfPallet) {
        newErrors.weight = "Introduce peso, volumen o marca fuera de medida";
      }
    }

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
              Tarifas orientativas para envíos entre Tenerife, La Palma y El Hierro. Se envía hoy laborable y se entrega al día siguiente.
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
                        className={`flex items-start gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                          active
                            ? "border-secondary bg-secondary/10 text-primary"
                            : "border-border hover:border-secondary/50 text-foreground"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${active ? "text-secondary" : "text-muted-foreground"}`} />
                        <div>
                          <div className="text-sm font-medium leading-tight">{s.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{s.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campos dinámicos según servicio */}
              {(service === "paqueteria" || (service === "flores" && flowerSize === "pequenas")) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Número de bultos</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={packages}
                      onChange={(e) => setPackages(e.target.value)}
                      placeholder="Ej: 2"
                      className="h-11"
                    />
                  </div>
                  {service === "paqueteria" && (
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Peso total (kg)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Ej: 25"
                        className="h-11"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">Hasta 20 kg = 1 bulto. Después se suma 1 bulto cada 20 kg.</p>
                    </div>
                  )}
                </div>
              )}

              {service === "flores" && (
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Tamaño</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["pequenas", "grandes"] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFlowerSize(size)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          flowerSize === size
                            ? "border-secondary bg-secondary/10 text-primary"
                            : "border-border hover:border-secondary/50 text-foreground"
                        }`}
                      >
                        {size === "pequenas" ? "Pequeñas (mín. 1 bulto)" : "Grandes (los dos)"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {service === "carga" && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Peso (kg)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Ej: 500"
                        className="h-11"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">0,15€/kg a partir de 400 kg</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Volumen (m³)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        placeholder="Ej: 1.5"
                        className="h-11"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">55€/m³</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={outOfPallet}
                      onChange={(e) => setOutOfPallet(e.target.checked)}
                      className="w-4 h-4 accent-[hsl(var(--secondary))]"
                    />
                    <div>
                      <div className="text-sm font-medium">Fuera de medida de palet</div>
                      <div className="text-[11px] text-muted-foreground">Excede palet americano o europeo (+75€)</div>
                    </div>
                  </label>
                </>
              )}

              {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                <span>Operamos entre Tenerife, La Palma y El Hierro. La Gomera es bajo encargo (consulta directa).</span>
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

                {submitted && isOnRequest ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-6"
                  >
                    <p className="font-heading text-3xl font-bold text-secondary mb-3">
                      Bajo encargo
                    </p>
                    <p className="text-sm text-primary-foreground/80 mb-6">
                      Los envíos hacia o desde La Gomera se gestionan bajo encargo. Contáctanos para un presupuesto personalizado.
                    </p>
                    <a
                      href="/#contacto"
                      className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground rounded-lg py-3 font-semibold hover:brightness-110 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Contactar
                    </a>
                  </motion.div>
                ) : submitted && estimate ? (
                  <motion.div
                    key={estimate.total}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xs text-primary-foreground/60 mb-1">Total estimado</p>
                    <p className="font-heading text-5xl font-bold text-secondary mb-6">
                      {estimate.total.toFixed(2)}€
                    </p>

                    <div className="space-y-2 pb-6 mb-6 border-b border-primary-foreground/15">
                      {estimate.breakdown.map((line, idx) => (
                        <div key={idx} className="flex justify-between text-sm gap-3">
                          <span className="text-primary-foreground/70">{line.label}</span>
                          <span className="font-semibold text-right">{line.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm pt-2">
                        <span className="text-primary-foreground/70">Plazo</span>
                        <span className="font-semibold text-right">{estimate.transit}</span>
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

import { useState } from "react";
import { motion } from "framer-motion";
import { PackagePlus, Building2, MapPin, Phone, Mail, Info, CheckCircle2, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ZONES = [
  "La Cuesta",
  "La Laguna",
  "Santa Cruz",
  "Los Majuelos",
  "Taco",
  "Costa Sur",
  "El Mayorazgo",
  "Güímar",
];

const Recogidas = () => {
  const [form, setForm] = useState({
    company: "",
    cif: "",
    contact: "",
    phone: "",
    email: "",
    zone: "",
    address: "",
    packages: "1",
    weight: "",
    details: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.company.trim()) err.company = "Introduce el nombre de la empresa";
    if (!form.contact.trim()) err.contact = "Introduce una persona de contacto";
    if (!form.phone.trim()) err.phone = "Introduce un teléfono de contacto";
    if (!form.zone) err.zone = "Selecciona una zona de recogida";
    if (!form.address.trim()) err.address = "Indica la dirección de recogida";

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    // Componer mensaje para WhatsApp/llamada alternativa
    const subject = `Solicitud de recogida - ${form.company}`;
    const body =
      `Empresa: ${form.company}\n` +
      `CIF: ${form.cif}\n` +
      `Contacto: ${form.contact}\n` +
      `Teléfono: ${form.phone}\n` +
      `Email: ${form.email}\n` +
      `Zona: ${form.zone}\n` +
      `Dirección: ${form.address}\n` +
      `Bultos: ${form.packages}\n` +
      `Peso total (kg): ${form.weight}\n` +
      `Detalles: ${form.details}`;

    window.location.href = `mailto:info@transportesbaritto.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
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
              Servicio a empresas
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Solicitar recogida
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Servicio de recogida disponible para empresas en Tenerife. Confirma tu
              solicitud y pasaremos a recoger tu mercancía.
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
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                <span>
                  El servicio de recogida está disponible únicamente para{" "}
                  <strong>empresas</strong>. Los particulares pueden entregar sus
                  envíos directamente en nuestras instalaciones.
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Empresa *</Label>
                  <Input
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Nombre de la empresa"
                    className="h-11"
                  />
                  {errors.company && <p className="text-xs text-destructive mt-1">{errors.company}</p>}
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">CIF</Label>
                  <Input
                    value={form.cif}
                    onChange={(e) => update("cif", e.target.value)}
                    placeholder="B12345678"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Persona de contacto *</Label>
                  <Input
                    value={form.contact}
                    onChange={(e) => update("contact", e.target.value)}
                    placeholder="Nombre y apellidos"
                    className="h-11"
                  />
                  {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Teléfono *</Label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+34 600 000 000"
                    className="h-11"
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="empresa@ejemplo.com"
                  className="h-11"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Zona de recogida *</Label>
                  <Select value={form.zone} onValueChange={(v) => update("zone", v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONES.map((z) => (
                        <SelectItem key={z} value={z}>
                          {z}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.zone && <p className="text-xs text-destructive mt-1">{errors.zone}</p>}
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Dirección *</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Calle, número, nave..."
                    className="h-11"
                  />
                  {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Nº de bultos</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.packages}
                    onChange={(e) => update("packages", e.target.value)}
                    placeholder="Ej: 3"
                    className="h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Peso total (kg)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                    placeholder="Ej: 45"
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Detalles adicionales</Label>
                <Textarea
                  value={form.details}
                  onChange={(e) => update("details", e.target.value)}
                  placeholder="Destino del envío, horario de recogida preferido, mercancía, etc."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-secondary text-secondary-foreground hover:brightness-110"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar solicitud
              </Button>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-sm text-primary bg-secondary/15 border border-secondary/30 p-3 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>
                    Solicitud preparada. Se abrirá tu cliente de correo para finalizar el envío.
                    También puedes llamarnos directamente.
                  </span>
                </motion.div>
              )}
            </motion.form>

            {/* Panel lateral */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="md:col-span-2"
            >
              <div className="sticky top-24 space-y-4">
                <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-[var(--shadow-elevated)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-secondary" />
                    <p className="text-xs uppercase tracking-widest text-secondary font-semibold">
                      Para empresas
                    </p>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3">
                    Recogida incluida en tu envío
                  </h3>
                  <p className="text-sm text-primary-foreground/80 mb-5">
                    Pasamos a recoger tu mercancía directamente en tus instalaciones.
                    Se aplica la misma tarifa que en nuestra calculadora de presupuesto.
                  </p>

                  <div className="space-y-2 text-sm">
                    <a
                      href="tel:+34922619077"
                      className="flex items-center gap-2 text-primary-foreground/90 hover:text-secondary transition-colors"
                    >
                      <Phone className="w-4 h-4 text-secondary" />
                      +34 922 619 077
                    </a>
                    <a
                      href="mailto:info@transportesbaritto.com"
                      className="flex items-center gap-2 text-primary-foreground/90 hover:text-secondary transition-colors"
                    >
                      <Mail className="w-4 h-4 text-secondary" />
                      info@transportesbaritto.com
                    </a>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <p className="text-xs uppercase tracking-widest text-secondary font-semibold">
                      Zonas de recogida
                    </p>
                  </div>
                  <ul className="grid grid-cols-2 gap-y-1.5 text-sm text-foreground">
                    {ZONES.map((z) => (
                      <li key={z} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-secondary" />
                        {z}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recogidas;

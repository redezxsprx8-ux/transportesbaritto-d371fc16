import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { Ship, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Email no válido" }).max(255),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }).max(72),
});

const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(2, { message: "Nombre demasiado corto" }).max(100),
  phone: z.string().trim().max(30).optional(),
  company_name: z.string().trim().max(150).optional(),
  cif: z.string().trim().max(20).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    company_name: "",
    cif: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/panel", { replace: true });
    });
  }, [navigate]);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          setError(
            error.message.includes("Invalid login")
              ? "Email o contraseña incorrectos"
              : error.message,
          );
          return;
        }
        toast({ title: "Sesión iniciada", description: "Bienvenido de nuevo." });
        navigate("/panel", { replace: true });
      } else {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/panel`,
            data: {
              full_name: parsed.data.full_name,
              phone: parsed.data.phone ?? "",
              company_name: parsed.data.company_name ?? "",
              cif: parsed.data.cif ?? "",
            },
          },
        });
        if (error) {
          setError(
            error.message.includes("already registered")
              ? "Este email ya está registrado"
              : error.message,
          );
          return;
        }
        toast({ title: "Cuenta creada", description: "Ya puedes acceder al panel." });
        navigate("/panel", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 bg-background">
        <div className="container max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-secondary/15 flex items-center justify-center">
                <Ship className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-secondary font-semibold">
                  Área privada
                </p>
                <h1 className="font-heading text-2xl font-bold text-primary">
                  {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
                </h1>
              </div>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === "signin" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === "signup" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Nombre completo *</Label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => update("full_name", e.target.value)}
                      placeholder="Juan García"
                      className="h-11"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Empresa</Label>
                      <Input
                        value={form.company_name}
                        onChange={(e) => update("company_name", e.target.value)}
                        placeholder="Opcional"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">CIF</Label>
                      <Input
                        value={form.cif}
                        onChange={(e) => update("cif", e.target.value)}
                        placeholder="Opcional"
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Teléfono</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+34 600 000 000"
                      className="h-11"
                    />
                  </div>
                </>
              )}

              <div>
                <Label className="text-sm font-semibold mb-2 block">Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="tu@email.com"
                  className="h-11"
                  autoComplete="email"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Contraseña *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  className="h-11"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-12 bg-secondary text-secondary-foreground hover:brightness-110"
              >
                {mode === "signin" ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    {loading ? "Entrando..." : "Entrar"}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {loading ? "Creando..." : "Crear cuenta"}
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              <Link to="/" className="hover:text-secondary">
                Volver al inicio
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { ShieldCheck, LogIn, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});

const StaffLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/panel", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      setError("Credenciales incorrectas");
      return;
    }
    toast({ title: "Acceso concedido" });
    navigate("/panel", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-elevated)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-secondary/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-secondary font-semibold">
              Personal interno
            </p>
            <h1 className="font-heading text-xl font-bold text-primary">Acceso trabajadores</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-11"
              autoComplete="email"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold mb-2 block">Contraseña</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-11"
              autoComplete="current-password"
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
            disabled={loading}
            className="w-full h-12 bg-secondary text-secondary-foreground hover:brightness-110"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Accediendo..." : "Acceder"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          <Link to="/" className="hover:text-secondary">Volver al inicio</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StaffLogin;

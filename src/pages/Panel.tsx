import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  PackagePlus,
  Calculator,
  LogOut,
  Ship,
  Loader2,
  User,
  Briefcase,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

type Shipment = {
  id: string;
  origin: string;
  destination: string;
  packages: number | null;
  price: number | null;
  status: string;
  scheduled_date: string | null;
  client_name: string | null;
  notes: string | null;
  created_at: string;
};

type Pickup = {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string | null;
  zone: string;
  address: string;
  packages: number | null;
  weight: number | null;
  details: string | null;
  status: string;
  created_at: string;
};

type Quote = {
  id: string;
  origin: string;
  destination: string;
  service: string;
  estimated_total: number | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const Panel = () => {
  const navigate = useNavigate();
  const { user, isTrabajador, loading: authLoading, signOut } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [s, p, q] = await Promise.all([
        supabase.from("shipments").select("*").order("created_at", { ascending: false }),
        supabase.from("pickup_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
      ]);
      setShipments((s.data as Shipment[]) ?? []);
      setPickups((p.data as Pickup[]) ?? []);
      setQuotes((q.data as Quote[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground border-b border-primary-foreground/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Ship className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-heading font-bold text-lg leading-none">Panel Baritto</p>
              <p className="text-[11px] text-primary-foreground/60 mt-0.5">
                {isTrabajador ? "Vista trabajador" : "Vista cliente"} · {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isTrabajador ? (
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
                <Briefcase className="w-3 h-3 mr-1" /> Trabajador
              </Badge>
            ) : (
              <Badge variant="secondary">
                <User className="w-3 h-3 mr-1" /> Cliente
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Tabs defaultValue="envios" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-grid mb-6">
              <TabsTrigger value="envios" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Envíos</span>
              </TabsTrigger>
              <TabsTrigger value="recogidas" className="gap-2">
                <PackagePlus className="w-4 h-4" />
                <span className="hidden sm:inline">Recogidas</span>
              </TabsTrigger>
              <TabsTrigger value="presupuestos" className="gap-2">
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Presupuestos</span>
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              </div>
            ) : (
              <>
                <TabsContent value="envios" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl font-bold text-primary">
                      Envíos programados
                    </h2>
                    <Badge variant="outline">{shipments.length} total</Badge>
                  </div>
                  {shipments.length === 0 ? (
                    <EmptyState label="No hay envíos programados." />
                  ) : (
                    <div className="grid gap-3">
                      {shipments.map((s) => (
                        <Card key={s.id}>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-heading text-lg font-bold text-primary">
                                {s.origin} → {s.destination}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {s.client_name ?? "Sin cliente asignado"} ·{" "}
                                {s.packages ?? 1} bulto{(s.packages ?? 1) > 1 ? "s" : ""}
                              </p>
                              {s.notes && (
                                <p className="text-xs text-muted-foreground mt-2">{s.notes}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-heading text-2xl font-bold text-secondary">
                                {s.price != null ? `${Number(s.price).toFixed(2)}€` : "—"}
                              </p>
                              <StatusBadge status={s.status} />
                              <p className="text-[11px] text-muted-foreground mt-1">
                                {fmtDate(s.created_at)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recogidas" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl font-bold text-primary">
                      Recogidas solicitadas
                    </h2>
                    <Badge variant="outline">{pickups.length} total</Badge>
                  </div>
                  {pickups.length === 0 ? (
                    <EmptyState label="Aún no hay solicitudes de recogida." />
                  ) : (
                    <div className="grid gap-3">
                      {pickups.map((p) => (
                        <Card key={p.id}>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1 min-w-[240px]">
                              <p className="font-heading text-lg font-bold text-primary">
                                {p.company}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {p.contact} · {p.phone}
                              </p>
                              <p className="text-sm text-foreground mt-1">
                                <span className="font-semibold">{p.zone}:</span> {p.address}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {p.packages ?? 0} bultos
                                {p.weight ? ` · ${p.weight} kg` : ""}
                              </p>
                              {p.details && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  "{p.details}"
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <StatusBadge status={p.status} />
                              <p className="text-[11px] text-muted-foreground mt-1">
                                {fmtDate(p.created_at)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="presupuestos" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl font-bold text-primary">
                      Presupuestos solicitados
                    </h2>
                    <Badge variant="outline">{quotes.length} total</Badge>
                  </div>
                  {quotes.length === 0 ? (
                    <EmptyState label="Aún no hay presupuestos solicitados." />
                  ) : (
                    <div className="grid gap-3">
                      {quotes.map((q) => (
                        <Card key={q.id}>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1 min-w-[240px]">
                              <p className="font-heading text-lg font-bold text-primary">
                                {q.origin} → {q.destination}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 capitalize">
                                Servicio: {q.service}
                              </p>
                              {(q.contact_name || q.contact_phone) && (
                                <p className="text-sm text-foreground mt-1">
                                  {q.contact_name} · {q.contact_phone}
                                </p>
                              )}
                              {q.notes && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  "{q.notes}"
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-heading text-xl font-bold text-secondary">
                                {q.estimated_total != null
                                  ? `${Number(q.estimated_total).toFixed(2)}€`
                                  : "—"}
                              </p>
                              <StatusBadge status={q.status} />
                              <p className="text-[11px] text-muted-foreground mt-1">
                                {fmtDate(q.created_at)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)]">
    {children}
  </div>
);

const EmptyState = ({ label }: { label: string }) => (
  <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pendiente: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    programado: "bg-secondary/15 text-secondary border-secondary/30",
    completado: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    cancelado: "bg-destructive/15 text-destructive border-destructive/30",
  };
  const cls = map[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${cls}`}>
      {status}
    </span>
  );
};

export default Panel;

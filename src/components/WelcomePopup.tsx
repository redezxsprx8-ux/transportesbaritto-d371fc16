import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, X, Info } from "lucide-react";

const STORAGE_KEY = "baritto_welcome_seen_v1";

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-popup-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-[var(--shadow-elevated)] overflow-hidden"
          >
            <button
              onClick={close}
              aria-label="Cerrar aviso"
              className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-primary text-primary-foreground px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Ship className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-secondary font-semibold">
                  Aviso importante
                </p>
                <h2 id="welcome-popup-title" className="font-heading text-lg font-bold">
                  Rutas disponibles
                </h2>
              </div>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  Operamos envíos en ambos sentidos entre{" "}
                  <span className="font-semibold text-primary">Tenerife</span>,{" "}
                  <span className="font-semibold text-primary">La Palma</span> y{" "}
                  <span className="font-semibold text-primary">El Hierro</span>.{" "}
                  <span className="font-semibold text-primary">La Gomera</span> está disponible bajo encargo.
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Gracias por confiar en Transportes Baritto. Si tiene cualquier duda,
                no dude en contactar con nosotros.
              </p>

              <button
                onClick={close}
                className="w-full h-11 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:brightness-110 transition-all"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;

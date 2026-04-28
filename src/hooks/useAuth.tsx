import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "trabajador" | "cliente";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Defer role fetch to avoid deadlock
        setTimeout(() => {
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", newSession.user.id)
            .then(({ data }) => {
              setRoles((data ?? []).map((r) => r.role as AppRole));
            });
        }, 0);
      } else {
        setRoles([]);
      }
    });

    // THEN get session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", s.user.id)
          .then(({ data }) => {
            setRoles((data ?? []).map((r) => r.role as AppRole));
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isTrabajador = roles.includes("trabajador");
  const isCliente = roles.includes("cliente");

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, roles, isTrabajador, isCliente, loading, signOut };
};

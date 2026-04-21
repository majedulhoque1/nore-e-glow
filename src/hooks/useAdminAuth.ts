import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export type AdminAuthState = {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
};

export const useAdminAuth = (): AdminAuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async (uid: string | undefined) => {
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', uid)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Defer role lookup to avoid deadlock
      setTimeout(() => checkRole(newSession?.user?.id), 0);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      checkRole(s?.user?.id).finally(() => setLoading(false));
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { loading, session, isAdmin };
};

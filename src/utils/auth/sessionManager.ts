
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { debounce } from 'lodash';

// Интервал проверки валидности токена (5 минут)
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000;

export class SessionManager {
  private static instance: SessionManager;
  private currentSession: Session | null = null;
  private refreshInProgress = false;

  private constructor() {
    this.setupSessionListener();
    this.startTokenCheck();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private setupSessionListener = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', { event, session: session?.user?.id });
      
      switch (event) {
        case 'SIGNED_IN':
          this.currentSession = session;
          this.logAuthEvent('User signed in successfully', { userId: session?.user?.id });
          break;
        case 'SIGNED_OUT':
          this.currentSession = null;
          this.logAuthEvent('User signed out');
          break;
        case 'TOKEN_REFRESHED':
          this.currentSession = session;
          this.logAuthEvent('Token refreshed successfully');
          break;
      }
    });
  };

  private startTokenCheck = () => {
    setInterval(() => {
      void this.checkAndRefreshToken();
    }, TOKEN_CHECK_INTERVAL);
  };

  private checkAndRefreshToken = debounce(async () => {
    if (!this.currentSession || this.refreshInProgress) return;

    try {
      this.refreshInProgress = true;
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        this.logAuthEvent('Token refresh failed', { error: error.message });
        return;
      }

      if (session) {
        this.currentSession = session;
        this.logAuthEvent('Token refreshed successfully');
      }
    } catch (error) {
      this.logAuthEvent('Token refresh error', { error });
    } finally {
      this.refreshInProgress = false;
    }
  }, 1000);

  private logAuthEvent = (message: string, data?: Record<string, any>) => {
    console.log(`[Auth] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data
    });
  };

  public getCurrentSession = () => this.currentSession;
}

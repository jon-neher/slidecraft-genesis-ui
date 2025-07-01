import React, { useEffect } from 'react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useUser } from '@clerk/clerk-react';

interface SecurityEvent {
  event_type: string;
  event_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export const SecurityAuditLogger: React.FC = () => {
  const supabase = useSupabaseClient();
  const { user } = useUser();

  const logSecurityEvent = async (event: SecurityEvent) => {
    if (!user) return;

    try {
      await supabase.from('security_events').insert({
        user_id: user.id,
        event_type: event.event_type,
        event_data: event.event_data || {},
        ip_address: event.ip_address,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Log login event
    logSecurityEvent({
      event_type: 'user_login',
      event_data: { timestamp: new Date().toISOString() },
    });

    // Listen for security-relevant events
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logSecurityEvent({
          event_type: 'session_background',
          event_data: { timestamp: new Date().toISOString() },
        });
      }
    };

    const handleBeforeUnload = () => {
      logSecurityEvent({
        event_type: 'session_end',
        event_data: { timestamp: new Date().toISOString() },
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  return null; // This is a utility component with no UI
};
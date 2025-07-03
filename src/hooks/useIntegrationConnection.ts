import { useState, useEffect } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { useUser } from '@clerk/clerk-react';

export type IntegrationName = 'hubspot';

interface IntegrationConfig {
  table: string;
  portalField: string;
  accessTokenField: string;
  expiresAtField: string;
}

const integrationConfigs: Record<IntegrationName, IntegrationConfig> = {
  hubspot: {
    table: 'hubspot_tokens',
    portalField: 'portal_id',
    accessTokenField: 'access_token',
    expiresAtField: 'expires_at'
  }
};

export const useIntegrationConnection = (integration: IntegrationName) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const supabase = useSupabaseClient();
  const { user } = useUser();

  const checkConnectionStatus = async () => {
    const config = integrationConfigs[integration];
    if (!config || !user) {
      setIsConnected(false);
      setIsChecking(false);
      return false;
    }

    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .from(config.table)
        .select(`${config.accessTokenField}, ${config.expiresAtField}`)
        .eq(config.portalField, user.id)
        .maybeSingle();

      if (error || !data) {
        setIsConnected(false);
        return false;
      }

      const token = (data as any)[config.accessTokenField] as string | null;
      const expiresAt = (data as any)[config.expiresAtField] as string | null;
      const expired = expiresAt
        ? new Date(expiresAt).getTime() <= Date.now()
        : false;
      const connected = !!token && !expired;
      setIsConnected(connected);
      return connected;
    } catch (err) {
      console.error('Error checking integration connection:', err);
      setIsConnected(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integration, user, supabase]);

  return { isConnected, isChecking, checkConnectionStatus };
};

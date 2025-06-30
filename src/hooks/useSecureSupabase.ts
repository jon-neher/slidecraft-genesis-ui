
import { useSupabaseClient } from './useSupabaseClient';
import { useUser } from '@clerk/clerk-react';
import { useState, useCallback } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import { SecurityValidator, AuditLogger } from '@/server/security';

export const useSecureSupabase = () => {
  const supabase = useSupabaseClient();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secureQuery = useCallback(async <T>(
    operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
    operationType: string,
    validation?: (data: T) => boolean

  ) => {
    if (!user) {
      const errorMessage = 'Authentication required for this operation';
      await AuditLogger.logSecurityEvent('permission_denied', null, {
        operation: operationType,
        reason: 'no_user'
      });
      throw new Error(errorMessage);
    }

    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      
      if (result.error) {
        await AuditLogger.logSecurityEvent('data_access', user.id, {
          operation: operationType,
          error: result.error.message,
          success: false
        });
        throw new Error(result.error.message);
      }

      // Optional validation of returned data
      if (validation && result.data && !validation(result.data)) {
        await AuditLogger.logSecurityEvent('data_access', user.id, {
          operation: operationType,
          error: 'data_validation_failed',
          success: false
        });
        throw new Error('Data validation failed');
      }

      await AuditLogger.logSecurityEvent('data_access', user.id, {
        operation: operationType,
        success: true
      });

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  const validateAndSanitizeInput = useCallback((input: string, fieldName: string): string => {
    const validation = SecurityValidator.validateInput(input, fieldName);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    return SecurityValidator.sanitizeString(input);
  }, []);

  return {
    supabase,
    secureQuery,
    validateAndSanitizeInput,
    loading,
    error,
    user
  };
};

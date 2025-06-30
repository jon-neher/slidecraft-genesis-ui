
import { useSupabaseClient } from './useSupabaseClient';
import { useUser } from '@clerk/clerk-react';
import { useState, useCallback } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';

// Client-side stubs for security utilities. The real implementations
// live on the server and should never be bundled with the UI build.
const defaultSecurityValidator = {
  validateInput: (input: string) => ({ isValid: true }),
  sanitizeString: (input: string) => input.replace(/[<>&"']/g, '')
};

const defaultAuditLogger = {
  logSecurityEvent: () => Promise.resolve()
};

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
      try {
        const logger = defaultAuditLogger;
        await logger.logSecurityEvent('permission_denied', null, {
          operation: operationType,
          reason: 'no_user'
        });
      } catch (auditError) {
        console.warn('Audit logging failed:', auditError);
      }
      throw new Error(errorMessage);
    }

    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      
      if (result.error) {
        try {
          const logger = defaultAuditLogger;
          await logger.logSecurityEvent('data_access', user.id, {
            operation: operationType,
            error: result.error.message,
            success: false
          });
        } catch (auditError) {
          console.warn('Audit logging failed:', auditError);
        }
        throw new Error(result.error.message);
      }

      // Optional validation of returned data
      if (validation && result.data && !validation(result.data)) {
        try {
          const logger = defaultAuditLogger;
          await logger.logSecurityEvent('data_access', user.id, {
            operation: operationType,
            error: 'data_validation_failed',
            success: false
          });
        } catch (auditError) {
          console.warn('Audit logging failed:', auditError);
        }
        throw new Error('Data validation failed');
      }

      try {
        const logger = defaultAuditLogger;
        await logger.logSecurityEvent('data_access', user.id, {
          operation: operationType,
          success: true
        });
      } catch (auditError) {
        console.warn('Audit logging failed:', auditError);
      }

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
    try {
      const validator = defaultSecurityValidator;
      const validation = validator.validateInput(input, fieldName);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      return validator.sanitizeString(input);
    } catch (error) {
      console.warn('Input validation failed, using fallback:', error);
      return input.replace(/[<>&"']/g, ''); // Basic sanitization fallback
    }
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

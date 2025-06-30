
import type { Database } from '../integrations/supabase/types'
import { getSupabaseClient } from './supabaseClient'

// Security utilities for server-side operations
export class SecurityValidator {
  private static readonly MAX_STRING_LENGTH = 1000;
  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /(;|\||\||&&|<|>)/,
    /(\bscript\b)/i,
    /(\bon\w+\s*=)/i
  ];

  static validateInput(input: string, fieldName: string): { isValid: boolean; error?: string } {
    if (typeof input !== 'string') {
      return { isValid: false, error: `${fieldName} must be a string` };
    }
    
    if (input.length > this.MAX_STRING_LENGTH) {
      return { isValid: false, error: `${fieldName} exceeds maximum length` };
    }
    
    // Check for SQL injection patterns
    for (const pattern of this.SQL_INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        return { isValid: false, error: `${fieldName} contains invalid characters` };
      }
    }
    
    return { isValid: true };
  }

  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    return { isValid: true };
  }

  static validateUUID(uuid: string): { isValid: boolean; error?: string } {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      return { isValid: false, error: 'Invalid UUID format' };
    }
    return { isValid: true };
  }

  static sanitizeString(input: string): string {
    return input
      .replace(/[<>&"']/g, (match) => {
        const escapeMap: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return escapeMap[match] || match;
      });
  }
}

export class SecurityHeaders {
  static getSecureHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  static getCORSHeaders(origin?: string): Record<string, string> {
    const allowedOrigins = [
      'https://igspkppkbqbbxffhdqlq.supabase.co',
      'http://localhost:5173',
      'https://localhost:5173'
    ];
    
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);
    
    return {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Max-Age': '3600',
    };
  }
}

export class AuditLogger {
  private static supabase = getSupabaseClient();

  static async logSecurityEvent(
    eventType: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'data_access' | 'permission_denied',
    userId: string | null,
    details: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    try {
      // For now, just console log. In production, you'd want to store this in a dedicated audit table
      console.log('[SECURITY_EVENT]', {
        timestamp: new Date().toISOString(),
        eventType,
        userId,
        details,
        ipAddress,
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}

export default { SecurityValidator, SecurityHeaders, AuditLogger };

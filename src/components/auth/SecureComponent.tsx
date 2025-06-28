
import React, { ReactNode } from 'react';
import { useSecurityContext } from './SecurityProvider';

interface SecureComponentProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireTemplateAccess?: boolean;
  requireHubSpotAccess?: boolean;
  fallback?: ReactNode;
}

export const SecureComponent: React.FC<SecureComponentProps> = ({
  children,
  requireAdmin = false,
  requireTemplateAccess = false,
  requireHubSpotAccess = false,
  fallback = null,
}) => {
  const { isAdmin, canManageTemplates, canAccessHubSpotData } = useSecurityContext();

  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  if (requireTemplateAccess && !canManageTemplates) {
    return <>{fallback}</>;
  }

  if (requireHubSpotAccess && !canAccessHubSpotData) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

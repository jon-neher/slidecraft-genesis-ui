
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';

interface SecurityContextType {
  isAdmin: boolean;
  canManageTemplates: boolean;
  canAccessHubSpotData: boolean;
}

const SecurityContext = createContext<SecurityContextType>({
  isAdmin: false,
  canManageTemplates: false,
  canAccessHubSpotData: false,
});

export const useSecurityContext = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useUser();
  
  // For now, basic security context - this would be enhanced with actual role checking
  const securityContext: SecurityContextType = {
    isAdmin: user?.publicMetadata?.role === 'admin',
    canManageTemplates: user?.publicMetadata?.role === 'admin',
    canAccessHubSpotData: !!user,
  };

  return (
    <SecurityContext.Provider value={securityContext}>
      {children}
    </SecurityContext.Provider>
  );
};

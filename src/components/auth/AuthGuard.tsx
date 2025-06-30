
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/' 
}) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in a build/static environment to avoid navigation issues
  const isStaticBuild = typeof window === 'undefined' || !window.location;

  useEffect(() => {
    // Skip auth checks during static builds or server-side rendering
    if (isStaticBuild || !isLoaded) return;

    if (requireAuth && !user) {
      // User should be authenticated but isn't
      console.warn('Unauthorized access attempt to:', location.pathname);
      navigate(redirectTo, { replace: true });
    } else if (!requireAuth && user) {
      // User shouldn't be on this page if authenticated
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoaded, requireAuth, navigate, location.pathname, redirectTo, isStaticBuild]);

  // Show loading while auth is being determined
  if (!isLoaded || isStaticBuild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-indigo"></div>
      </div>
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;

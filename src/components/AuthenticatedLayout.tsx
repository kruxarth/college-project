import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Don't show banner on login, signup, or landing pages
  const hideOnPages = ['/', '/login', '/signup'];
  const shouldShowBanner = currentUser && !hideOnPages.includes(location.pathname);

  return (
    <>
      {shouldShowBanner && <EmailVerificationBanner />}
      {children}
    </>
  );
}

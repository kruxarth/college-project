import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser && <EmailVerificationBanner />}
      {children}
    </>
  );
}

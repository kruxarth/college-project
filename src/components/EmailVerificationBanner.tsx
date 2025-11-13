import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailVerificationBanner() {
  const { isEmailVerified, sendVerificationEmail, checkEmailVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [lastSendTime, setLastSendTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Update cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(Math.max(0, cooldownRemaining - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  // Don't show if email is verified or user dismissed
  if (isEmailVerified || dismissed) {
    return null;
  }

  const handleSendVerification = async () => {
    // Check cooldown (60 seconds between sends)
    const now = Date.now();
    const timeSinceLastSend = now - lastSendTime;
    const cooldownPeriod = 60000; // 60 seconds

    if (timeSinceLastSend < cooldownPeriod) {
      const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceLastSend) / 1000);
      toast.error(`Please wait ${remainingSeconds} seconds before requesting another email.`);
      setCooldownRemaining(remainingSeconds);
      return;
    }

    setLoading(true);
    const result = await sendVerificationEmail();
    setLoading(false);

    if (result.success) {
      toast.success('Verification email sent! Please check your inbox.');
      setLastSendTime(now);
      setCooldownRemaining(60); // Start 60 second cooldown
    } else {
      toast.error(result.error || 'Failed to send verification email');
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    const verified = await checkEmailVerification();
    setChecking(false);

    if (verified) {
      toast.success('Email verified successfully! 🎉');
    } else {
      toast.info('Email not yet verified. Please check your inbox and click the verification link.');
    }
  };

  return (
    <div className="sticky top-0 z-50 border-b bg-yellow-50 dark:bg-yellow-900/20">
      <div className="container mx-auto px-4">
        <Alert className="border-0 bg-transparent rounded-none py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200 m-0">
                <strong>Verify your email</strong> to unlock all features and receive important notifications.
              </AlertDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCheckVerification}
                disabled={checking}
                className="bg-white dark:bg-gray-800"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {checking ? 'Checking...' : 'I Verified'}
              </Button>
              
              <Button
                size="sm"
                onClick={handleSendVerification}
                disabled={loading || cooldownRemaining > 0}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Mail className="h-4 w-4 mr-1" />
                {loading 
                  ? 'Sending...' 
                  : cooldownRemaining > 0 
                  ? `Wait ${cooldownRemaining}s` 
                  : 'Resend Email'}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissed(true)}
                className="text-yellow-800 dark:text-yellow-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
}

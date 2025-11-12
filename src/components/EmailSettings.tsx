import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailSettings() {
  const { user, isEmailVerified, sendVerificationEmail, checkEmailVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  // Email preferences (you can store these in Firestore)
  const [preferences, setPreferences] = useState({
    donationUpdates: true,
    claimNotifications: true,
    weeklyDigest: true,
    promotions: false,
  });

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendVerification = async () => {
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before sending another email`);
      return;
    }

    setLoading(true);
    const result = await sendVerificationEmail();
    setLoading(false);

    if (result.success) {
      toast.success('Verification email sent! Please check your inbox.');
      setCooldown(60); // 60 second cooldown
    } else {
      toast.error(result.error || 'Failed to send verification email');
      // If error message contains "wait", extract the wait time and set cooldown
      if (result.error?.includes('wait') && result.error?.includes('seconds')) {
        const match = result.error.match(/(\d+)\s+seconds/);
        if (match) {
          setCooldown(parseInt(match[1]));
        }
      }
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    const verified = await checkEmailVerification();
    setChecking(false);

    if (verified) {
      toast.success('Email verified successfully! 🎉');
    } else {
      toast.info('Email not yet verified. Please check your inbox.');
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: Save to Firestore
    toast.success('Preference updated');
  };

  return (
    <div className="space-y-6">
      {/* Email Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification
          </CardTitle>
          <CardDescription>
            Verify your email to receive important notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEmailVerified ? (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Your email <strong>{user?.email}</strong> is verified
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  Your email <strong>{user?.email}</strong> is not verified yet
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleSendVerification}
                  disabled={loading || cooldown > 0}
                  className="relative"
                >
                  {loading ? (
                    'Sending...'
                  ) : cooldown > 0 ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Wait {cooldown}s
                    </>
                  ) : (
                    'Send Verification Email'
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleCheckVerification}
                  disabled={checking}
                >
                  {checking ? 'Checking...' : 'I Verified - Refresh Status'}
                </Button>
              </div>
              
              {cooldown > 0 && (
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Please wait {cooldown} seconds before requesting another email. This prevents spam and protects your account.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Email Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose which emails you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="donation-updates" className="text-base">
                Donation Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone claims your donation or when status changes
              </p>
            </div>
            <Switch
              id="donation-updates"
              checked={preferences.donationUpdates}
              onCheckedChange={() => handlePreferenceChange('donationUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="claim-notifications" className="text-base">
                Claim Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about new donations available in your area (NGOs)
              </p>
            </div>
            <Switch
              id="claim-notifications"
              checked={preferences.claimNotifications}
              onCheckedChange={() => handlePreferenceChange('claimNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest" className="text-base">
                Weekly Digest
              </Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly summary of your impact and activity
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={preferences.weeklyDigest}
              onCheckedChange={() => handlePreferenceChange('weeklyDigest')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promotions" className="text-base">
                Promotions & Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive news about new features and platform updates
              </p>
            </div>
            <Switch
              id="promotions"
              checked={preferences.promotions}
              onCheckedChange={() => handlePreferenceChange('promotions')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Information */}
      <Card>
        <CardHeader>
          <CardTitle>Email Information</CardTitle>
          <CardDescription>
            How we use your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>📧 <strong>Authentication</strong>: Login and password recovery</p>
          <p>🔔 <strong>Notifications</strong>: Updates about your donations and claims</p>
          <p>🔒 <strong>Security</strong>: Account security alerts</p>
          <p>📊 <strong>Analytics</strong>: Impact reports and statistics</p>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-xs">
              <strong>Privacy Note:</strong> We never share your email with third parties. 
              You can unsubscribe from promotional emails at any time. 
              Essential notifications (like password resets) cannot be disabled for security reasons.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

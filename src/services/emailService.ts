import { auth } from '@/firebase/config';
import { sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';

/**
 * Email Service for handling all email notifications
 * Uses Firebase Auth for authentication emails and can be extended with
 * a backend service (like SendGrid, Nodemailer, etc.) for transactional emails
 */

interface EmailNotificationData {
  to: string;
  subject: string;
  body: string;
  type: 'donation_created' | 'donation_claimed' | 'donation_completed' | 'donation_cancelled' | 'ngo_verified' | 'general';
}

interface RateLimitEntry {
  timestamp: number;
  count: number;
}

class EmailService {
  // Rate limiting: Track email sends per email address
  private rateLimitMap: Map<string, RateLimitEntry> = new Map();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_ATTEMPTS = 3; // Max 3 emails per minute per address
  private readonly COOLDOWN_PERIOD = 300000; // 5 minutes cooldown after hitting limit
  
  /**
   * Check if email sending is rate limited
   */
  private isRateLimited(email: string): { limited: boolean; waitTime?: number } {
    const now = Date.now();
    const entry = this.rateLimitMap.get(email);

    if (!entry) {
      return { limited: false };
    }

    // Check if we're in cooldown period
    if (entry.count >= this.MAX_ATTEMPTS) {
      const timeSinceCooldown = now - entry.timestamp;
      if (timeSinceCooldown < this.COOLDOWN_PERIOD) {
        const waitTime = Math.ceil((this.COOLDOWN_PERIOD - timeSinceCooldown) / 1000);
        return { limited: true, waitTime };
      } else {
        // Cooldown expired, reset
        this.rateLimitMap.delete(email);
        return { limited: false };
      }
    }

    // Check if we're within rate limit window
    const timeSinceFirst = now - entry.timestamp;
    if (timeSinceFirst < this.RATE_LIMIT_WINDOW) {
      if (entry.count >= this.MAX_ATTEMPTS) {
        const waitTime = Math.ceil((this.RATE_LIMIT_WINDOW - timeSinceFirst) / 1000);
        return { limited: true, waitTime };
      }
    } else {
      // Window expired, reset counter
      this.rateLimitMap.delete(email);
      return { limited: false };
    }

    return { limited: false };
  }

  /**
   * Record email send attempt
   */
  private recordEmailSend(email: string): void {
    const now = Date.now();
    const entry = this.rateLimitMap.get(email);

    if (!entry || now - entry.timestamp > this.RATE_LIMIT_WINDOW) {
      this.rateLimitMap.set(email, { timestamp: now, count: 1 });
    } else {
      entry.count += 1;
      entry.timestamp = now;
    }
  }

  /**
   * Parse Firebase Auth error codes into user-friendly messages
   */
  private parseFirebaseError(error: any): string {
    const errorCode = error?.code || '';
    
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again in a few minutes.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/requires-recent-login':
        return 'Please log out and log back in to perform this action.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Please contact support.';
      case 'auth/unauthorized-domain':
      case 'auth/unauthorized-continue-uri':
        return 'This domain is not authorized. Please contact the administrator to add this domain to Firebase authorized domains.';
      default:
        return error?.message || 'An error occurred. Please try again.';
    }
  }

  /**
   * Send password reset email using Firebase Auth
   */
  async sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check rate limiting
      const rateLimitCheck = this.isRateLimited(email);
      if (rateLimitCheck.limited) {
        return {
          success: false,
          error: `Too many requests. Please wait ${rateLimitCheck.waitTime} seconds before trying again.`
        };
      }

      // Record this attempt
      this.recordEmailSend(email);

      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Password reset email error:', error);
      
      // Provide user-friendly error message
      const errorMessage = this.parseFirebaseError(error);
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  /**
   * Send email verification to newly registered user
   */
  async sendVerificationEmail(): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No authenticated user found. Please log in.' };
      }

      if (user.emailVerified) {
        return { success: false, error: 'Email already verified' };
      }

      const email = user.email || 'unknown';

      // Check rate limiting
      const rateLimitCheck = this.isRateLimited(email);
      if (rateLimitCheck.limited) {
        return {
          success: false,
          error: `Please wait ${rateLimitCheck.waitTime} seconds before requesting another verification email.`
        };
      }

      // Record this attempt
      this.recordEmailSend(email);

      await sendEmailVerification(user, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Verification email error:', error);
      
      // Provide user-friendly error message
      const errorMessage = this.parseFirebaseError(error);
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  /**
   * Check if current user's email is verified
   */
  isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified || false;
  }

  /**
   * Reload user to check latest email verification status
   */
  async refreshEmailVerificationStatus(): Promise<boolean> {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        return auth.currentUser.emailVerified;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing email status:', error);
      return false;
    }
  }

  /**
   * Send notification email (requires backend implementation)
   * This is a placeholder that logs to console. 
   * In production, implement a backend API endpoint to send emails via SendGrid, AWS SES, etc.
   */
  async sendNotificationEmail(data: EmailNotificationData): Promise<{ success: boolean; error?: string }> {
    try {
      // For now, we'll log the email that would be sent
      console.log('📧 Email Notification (Mock):', {
        to: data.to,
        subject: data.subject,
        type: data.type,
        timestamp: new Date().toISOString(),
      });

      // TODO: Implement actual email sending through backend API
      // Example:
      // const response = await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      // For development, we'll simulate success
      if (process.env.NODE_ENV === 'development') {
        console.log('Email body:', data.body);
        return { success: true };
      }

      // In production, this would call your backend email service
      return { 
        success: false, 
        error: 'Backend email service not configured. Please set up email API endpoint.' 
      };
    } catch (error: any) {
      console.error('Email notification error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email notification' 
      };
    }
  }

  /**
   * Send donation created notification to donor
   */
  async notifyDonationCreated(donorEmail: string, donorName: string, donationTitle: string): Promise<void> {
    const subject = '✅ Your Food Donation Has Been Listed';
    const body = `
      Hi ${donorName},

      Your donation "${donationTitle}" has been successfully created and is now visible to NGOs in your area.

      We'll notify you when an NGO claims your donation.

      Thank you for making a difference!

      Best regards,
      The FoodShare Team
    `;

    await this.sendNotificationEmail({
      to: donorEmail,
      subject,
      body,
      type: 'donation_created',
    });
  }

  /**
   * Send donation claimed notification to donor
   */
  async notifyDonationClaimed(
    donorEmail: string, 
    donorName: string, 
    donationTitle: string, 
    ngoName: string,
    pickupTime: string
  ): Promise<void> {
    const subject = '🎉 Your Donation Has Been Claimed!';
    const body = `
      Hi ${donorName},

      Great news! ${ngoName} has claimed your donation "${donationTitle}".

      Pickup Time: ${pickupTime}

      Please ensure the food is ready for pickup at the scheduled time.

      Thank you for your generosity!

      Best regards,
      The FoodShare Team
    `;

    await this.sendNotificationEmail({
      to: donorEmail,
      subject,
      body,
      type: 'donation_claimed',
    });
  }

  /**
   * Send new donation notification to NGO
   */
  async notifyNewDonationAvailable(
    ngoEmail: string, 
    ngoName: string, 
    donationTitle: string,
    category: string,
    distance: string
  ): Promise<void> {
    const subject = '🍲 New Food Donation Available Near You';
    const body = `
      Hi ${ngoName},

      A new donation is available in your area:

      Donation: ${donationTitle}
      Category: ${category}
      Distance: ${distance}

      Login to your dashboard to view details and claim this donation.

      Best regards,
      The FoodShare Team
    `;

    await this.sendNotificationEmail({
      to: ngoEmail,
      subject,
      body,
      type: 'donation_created',
    });
  }

  /**
   * Send donation completed notification
   */
  async notifyDonationCompleted(
    email: string,
    name: string,
    donationTitle: string,
    isNGO: boolean
  ): Promise<void> {
    const subject = '✅ Donation Completed Successfully';
    const role = isNGO ? 'claimed' : 'shared';
    const body = `
      Hi ${name},

      The donation "${donationTitle}" has been marked as completed.

      ${isNGO 
        ? 'Thank you for helping fight food waste and hunger in your community!' 
        : 'Your contribution has made a real difference. Thank you for your generosity!'}

      Best regards,
      The FoodShare Team
    `;

    await this.sendNotificationEmail({
      to: email,
      subject,
      body,
      type: 'donation_completed',
    });
  }

  /**
   * Send donation cancelled notification
   */
  async notifyDonationCancelled(
    email: string,
    name: string,
    donationTitle: string,
    reason?: string
  ): Promise<void> {
    const subject = '❌ Donation Cancelled';
    const body = `
      Hi ${name},

      The donation "${donationTitle}" has been cancelled.

      ${reason ? `Reason: ${reason}` : ''}

      If you have any questions, please contact us.

      Best regards,
      The FoodShare Team
    `;

    await this.sendNotificationEmail({
      to: email,
      subject,
      body,
      type: 'donation_cancelled',
    });
  }

  /**
   * Send NGO verification notification
   */
  async notifyNGOVerified(ngoEmail: string, ngoName: string): Promise<void> {
    const subject = '✅ Your NGO Account Has Been Verified';
    const body = `
      Hi ${ngoName},

      Congratulations! Your NGO account has been verified.

      You can now start claiming food donations and help fight hunger in your community.

      Best regards,
      The FoodShare Team
    `;

    await this.sendNotificationEmail({
      to: ngoEmail,
      subject,
      body,
      type: 'ngo_verified',
    });
  }

  /**
   * Send custom notification email
   */
  async sendCustomEmail(to: string, subject: string, body: string): Promise<void> {
    await this.sendNotificationEmail({
      to,
      subject,
      body,
      type: 'general',
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;

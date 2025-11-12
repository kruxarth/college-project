/**
 * Email Templates for FoodShare Platform
 * These templates provide consistent, professional email formatting
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Base HTML template with styling
const getBaseTemplate = (content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FoodShare</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo {
      font-size: 32px;
      color: #e63946;
      margin-bottom: 10px;
    }
    .content {
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #e63946;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #ffc107;
      margin: 20px 0;
    }
    .success {
      background-color: #d4edda;
      border-left-color: #28a745;
    }
    .info {
      background-color: #d1ecf1;
      border-left-color: #17a2b8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">❤️ FoodShare</div>
      <p style="margin: 0; color: #666;">Fighting Food Waste, Feeding Communities</p>
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} FoodShare. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  /**
   * Welcome email for new users
   */
  welcome: (name: string, role: 'donor' | 'ngo'): EmailTemplate => {
    const isDonor = role === 'donor';
    const html = getBaseTemplate(`
      <div class="content">
        <h2>Welcome to FoodShare, ${name}! 🎉</h2>
        <p>Thank you for joining our mission to reduce food waste and help those in need.</p>
        
        <div class="highlight success">
          <p><strong>Your account has been created successfully!</strong></p>
          ${isDonor 
            ? '<p>You can now start donating surplus food to NGOs in your area.</p>' 
            : '<p>You can now start claiming food donations to help your community.</p>'}
        </div>

        <h3>Getting Started:</h3>
        <ul>
          ${isDonor 
            ? `
            <li>📝 Create your first donation listing</li>
            <li>📍 NGOs near you will be able to see and claim your donation</li>
            <li>📞 Coordinate pickup with the NGO</li>
            <li>✅ Mark as completed once food is picked up</li>
            `
            : `
            <li>🔍 Browse available donations in your area</li>
            <li>🎯 Claim donations that match your needs</li>
            <li>📞 Coordinate pickup with donors</li>
            <li>✅ Mark as completed after successful pickup</li>
            `}
        </ul>

        <div style="text-align: center;">
          <a href="${window.location.origin}/${role}/dashboard" class="button">Go to Dashboard</a>
        </div>

        <p>If you have any questions, feel free to reach out to our support team.</p>
      </div>
    `);

    const text = `
Welcome to FoodShare, ${name}!

Thank you for joining our mission to reduce food waste and help those in need.

Your account has been created successfully!

${isDonor 
  ? 'You can now start donating surplus food to NGOs in your area.' 
  : 'You can now start claiming food donations to help your community.'}

Visit your dashboard: ${window.location.origin}/${role}/dashboard

Best regards,
The FoodShare Team
    `;

    return {
      subject: '🎉 Welcome to FoodShare!',
      html,
      text,
    };
  },

  /**
   * Email verification reminder
   */
  verifyEmail: (name: string, verificationLink: string): EmailTemplate => {
    const html = getBaseTemplate(`
      <div class="content">
        <h2>Please Verify Your Email Address</h2>
        <p>Hi ${name},</p>
        <p>To complete your registration and start using FoodShare, please verify your email address.</p>
        
        <div class="highlight info">
          <p><strong>Why verify?</strong></p>
          <ul>
            <li>Secure your account</li>
            <li>Receive important notifications</li>
            <li>Enable full platform features</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="${verificationLink}" class="button">Verify Email Address</a>
        </div>

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationLink}">${verificationLink}</a>
        </p>

        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `);

    const text = `
Please Verify Your Email Address

Hi ${name},

To complete your registration and start using FoodShare, please verify your email address.

Click here to verify: ${verificationLink}

This link will expire in 24 hours.

Best regards,
The FoodShare Team
    `;

    return {
      subject: '✉️ Verify Your Email - FoodShare',
      html,
      text,
    };
  },

  /**
   * Donation created notification
   */
  donationCreated: (donorName: string, donationTitle: string, donationId: string): EmailTemplate => {
    const html = getBaseTemplate(`
      <div class="content">
        <h2>Your Donation is Now Live! 🍲</h2>
        <p>Hi ${donorName},</p>
        
        <div class="highlight success">
          <p><strong>${donationTitle}</strong> has been successfully listed.</p>
          <p>NGOs in your area can now view and claim this donation.</p>
        </div>

        <h3>What happens next?</h3>
        <ol>
          <li>NGOs near you can see your donation</li>
          <li>You'll receive a notification when it's claimed</li>
          <li>Coordinate pickup with the claiming NGO</li>
          <li>Mark as completed after successful handover</li>
        </ol>

        <div style="text-align: center;">
          <a href="${window.location.origin}/donation/${donationId}" class="button">View Donation</a>
        </div>

        <p>Thank you for making a difference in your community! 🙏</p>
      </div>
    `);

    const text = `
Your Donation is Now Live!

Hi ${donorName},

"${donationTitle}" has been successfully listed.

NGOs in your area can now view and claim this donation. You'll receive a notification when it's claimed.

View donation: ${window.location.origin}/donation/${donationId}

Thank you for making a difference!

Best regards,
The FoodShare Team
    `;

    return {
      subject: '✅ Your Donation Has Been Listed - FoodShare',
      html,
      text,
    };
  },

  /**
   * Donation claimed notification (to donor)
   */
  donationClaimed: (
    donorName: string,
    donationTitle: string,
    ngoName: string,
    pickupTime: string,
    ngoPhone: string,
    donationId: string
  ): EmailTemplate => {
    const html = getBaseTemplate(`
      <div class="content">
        <h2>Great News! Your Donation Has Been Claimed! 🎉</h2>
        <p>Hi ${donorName},</p>
        
        <div class="highlight success">
          <p><strong>${ngoName}</strong> has claimed your donation:</p>
          <p style="font-size: 18px; margin: 10px 0;"><strong>${donationTitle}</strong></p>
        </div>

        <h3>Pickup Details:</h3>
        <ul>
          <li><strong>NGO:</strong> ${ngoName}</li>
          <li><strong>Pickup Time:</strong> ${pickupTime}</li>
          <li><strong>Contact:</strong> ${ngoPhone}</li>
        </ul>

        <div class="highlight">
          <p><strong>Action Required:</strong></p>
          <p>Please ensure the food is ready for pickup at the scheduled time. The NGO may contact you to confirm details.</p>
        </div>

        <div style="text-align: center;">
          <a href="${window.location.origin}/donation/${donationId}" class="button">View Donation Details</a>
        </div>

        <p>After the food is picked up, don't forget to mark the donation as completed!</p>
      </div>
    `);

    const text = `
Great News! Your Donation Has Been Claimed!

Hi ${donorName},

${ngoName} has claimed your donation: "${donationTitle}"

Pickup Details:
- NGO: ${ngoName}
- Pickup Time: ${pickupTime}
- Contact: ${ngoPhone}

Please ensure the food is ready for pickup at the scheduled time.

View details: ${window.location.origin}/donation/${donationId}

Best regards,
The FoodShare Team
    `;

    return {
      subject: '🎉 Your Donation Has Been Claimed - FoodShare',
      html,
      text,
    };
  },

  /**
   * New donation available (to NGOs)
   */
  newDonationAvailable: (
    ngoName: string,
    donationTitle: string,
    category: string,
    quantity: number,
    distance: string,
    expiryDate: string,
    donationId: string
  ): EmailTemplate => {
    const html = getBaseTemplate(`
      <div class="content">
        <h2>New Donation Available Near You! 🍲</h2>
        <p>Hi ${ngoName},</p>
        
        <p>A new food donation matching your area is now available:</p>

        <div class="highlight info">
          <h3 style="margin-top: 0;">${donationTitle}</h3>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Quantity:</strong> ${quantity} servings</p>
          <p><strong>Distance:</strong> ${distance}</p>
          <p><strong>Best Before:</strong> ${expiryDate}</p>
        </div>

        <div style="text-align: center;">
          <a href="${window.location.origin}/donation/${donationId}" class="button">View & Claim Donation</a>
        </div>

        <p><strong>Act fast!</strong> Donations are claimed on a first-come, first-served basis.</p>
      </div>
    `);

    const text = `
New Donation Available Near You!

Hi ${ngoName},

A new food donation is available:

${donationTitle}
- Category: ${category}
- Quantity: ${quantity} servings
- Distance: ${distance}
- Best Before: ${expiryDate}

View and claim: ${window.location.origin}/donation/${donationId}

Act fast! First come, first served.

Best regards,
The FoodShare Team
    `;

    return {
      subject: '🍲 New Food Donation Available - FoodShare',
      html,
      text,
    };
  },

  /**
   * Donation completed notification
   */
  donationCompleted: (
    name: string,
    donationTitle: string,
    isNGO: boolean,
    mealsImpact: number
  ): EmailTemplate => {
    const html = getBaseTemplate(`
      <div class="content">
        <h2>Donation Completed Successfully! ✅</h2>
        <p>Hi ${name},</p>
        
        <div class="highlight success">
          <p><strong>${donationTitle}</strong> has been marked as completed.</p>
          <p style="font-size: 24px; margin: 15px 0;">🎉 ${mealsImpact} meals ${isNGO ? 'received' : 'shared'}!</p>
        </div>

        ${isNGO 
          ? `
          <p>Thank you for your dedication to fighting hunger in your community. Every meal counts!</p>
          <p>The food you've claimed will help feed those in need.</p>
          `
          : `
          <p>Thank you for your generous contribution! Your kindness is making a real difference.</p>
          <p>The food you donated will help feed families in need.</p>
          `}

        <h3>Your Impact:</h3>
        <ul>
          <li>✅ ${mealsImpact} meals ${isNGO ? 'secured' : 'donated'}</li>
          <li>🌍 Reduced food waste</li>
          <li>❤️ Helped your community</li>
        </ul>

        <div style="text-align: center;">
          <a href="${window.location.origin}/${isNGO ? 'ngo' : 'donor'}/dashboard" class="button">View Your Impact</a>
        </div>

        <p>Together, we're making a difference! 🙏</p>
      </div>
    `);

    const text = `
Donation Completed Successfully!

Hi ${name},

"${donationTitle}" has been marked as completed.

🎉 ${mealsImpact} meals ${isNGO ? 'received' : 'shared'}!

${isNGO 
  ? 'Thank you for your dedication to fighting hunger in your community.'
  : 'Thank you for your generous contribution!'}

View your impact: ${window.location.origin}/${isNGO ? 'ngo' : 'donor'}/dashboard

Best regards,
The FoodShare Team
    `;

    return {
      subject: '✅ Donation Completed - FoodShare',
      html,
      text,
    };
  },

  /**
   * Password reset email
   */
  passwordReset: (name: string, resetLink: string): EmailTemplate => {
    const html = getBaseTemplate(`
      <div class="content">
        <h2>Password Reset Request</h2>
        <p>Hi ${name},</p>
        
        <p>We received a request to reset your password for your FoodShare account.</p>

        <div class="highlight">
          <p><strong>Reset your password:</strong></p>
          <p>Click the button below to create a new password.</p>
        </div>

        <div style="text-align: center;">
          <a href="${resetLink}" class="button">Reset Password</a>
        </div>

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link:<br>
          <a href="${resetLink}">${resetLink}</a>
        </p>

        <p style="color: #e63946; font-size: 14px;">
          <strong>Security Notice:</strong><br>
          • This link expires in 1 hour<br>
          • If you didn't request this, please ignore this email<br>
          • Your password won't change unless you click the link above
        </p>
      </div>
    `);

    const text = `
Password Reset Request

Hi ${name},

We received a request to reset your password.

Click here to reset: ${resetLink}

This link expires in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
The FoodShare Team
    `;

    return {
      subject: '🔒 Reset Your Password - FoodShare',
      html,
      text,
    };
  },

  /**
   * NGO verification approved
   */
  ngoVerified: (ngoName: string): EmailTemplate => {
    const html = getBaseTemplate(`
      <div class="content">
        <h2>Your NGO Has Been Verified! ✅</h2>
        <p>Hi ${ngoName},</p>
        
        <div class="highlight success">
          <p style="font-size: 18px;"><strong>Congratulations!</strong></p>
          <p>Your NGO account has been verified and approved.</p>
        </div>

        <h3>What's Next?</h3>
        <ul>
          <li>🔍 Browse available food donations in your area</li>
          <li>🎯 Claim donations that match your organization's needs</li>
          <li>📞 Coordinate pickups with generous donors</li>
          <li>📊 Track your impact on the dashboard</li>
        </ul>

        <div style="text-align: center;">
          <a href="${window.location.origin}/ngo/dashboard" class="button">Start Claiming Donations</a>
        </div>

        <p>Thank you for joining FoodShare! Together, we can fight food waste and hunger.</p>
      </div>
    `);

    const text = `
Your NGO Has Been Verified!

Hi ${ngoName},

Congratulations! Your NGO account has been verified and approved.

You can now:
- Browse available food donations
- Claim donations for your organization
- Coordinate pickups with donors
- Track your impact

Start claiming: ${window.location.origin}/ngo/dashboard

Best regards,
The FoodShare Team
    `;

    return {
      subject: '✅ NGO Verification Approved - FoodShare',
      html,
      text,
    };
  },
};

export default emailTemplates;

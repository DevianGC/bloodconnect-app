// Notification System - Email & SMS Infrastructure
import type { Alert, Donor } from '@/types/api';

// Notification types
export type NotificationType = 'email' | 'sms' | 'push' | 'in-app';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationPayload {
  type: NotificationType;
  priority: NotificationPriority;
  recipient: {
    id: number | string;
    email?: string;
    phone?: string;
    name: string;
  };
  subject: string;
  message: string;
  data?: Record<string, any>;
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  error?: string;
  sentAt?: string;
}

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  BLOOD_REQUEST_ALERT: {
    subject: '🩸 Urgent Blood Request - {bloodType} needed at {hospital}',
    message: `
Dear {donorName},

There is an urgent need for {bloodType} blood at {hospital}.

Details:
- Blood Type: {bloodType}
- Units Needed: {quantity}
- Urgency: {urgency}
- Hospital: {hospital}

If you are eligible and available to donate, please respond as soon as possible.

Thank you for being a lifesaver!

Best regards,
BloodConnect Olongapo Team
    `.trim(),
  },
  
  APPOINTMENT_CONFIRMATION: {
    subject: '✅ Donation Appointment Confirmed - {date}',
    message: `
Dear {donorName},

Your blood donation appointment has been confirmed!

Appointment Details:
- Date: {date}
- Time: {timeSlot}
- Hospital: {hospital}
- Address: {address}

Please remember to:
- Eat a healthy meal before donating
- Drink plenty of water
- Bring a valid ID
- Get adequate sleep the night before

Need to reschedule? Contact us or manage your appointment in the app.

See you there!

Best regards,
BloodConnect Olongapo Team
    `.trim(),
  },
  
  APPOINTMENT_REMINDER: {
    subject: '⏰ Reminder: Blood Donation Tomorrow - {date}',
    message: `
Dear {donorName},

This is a friendly reminder about your blood donation appointment tomorrow.

Appointment Details:
- Date: {date}
- Time: {timeSlot}
- Hospital: {hospital}

Quick Tips:
- Avoid fatty foods today
- Stay hydrated
- Get a good night's sleep

We appreciate your commitment to saving lives!

Best regards,
BloodConnect Olongapo Team
    `.trim(),
  },
  
  DONATION_THANK_YOU: {
    subject: '❤️ Thank You for Donating Blood!',
    message: `
Dear {donorName},

Thank you for your generous blood donation today at {hospital}!

Your Impact:
- Lives potentially saved: 3
- Total donations: {totalDonations}
- Total lives impacted: {livesSaved}

{newBadges}

Your next eligible donation date: {nextEligibleDate}

You are a true hero. Thank you for making a difference!

Best regards,
BloodConnect Olongapo Team
    `.trim(),
  },
  
  ELIGIBILITY_REMINDER: {
    subject: '🩸 You Can Donate Blood Again!',
    message: `
Dear {donorName},

Great news! You are now eligible to donate blood again.

Your last donation was on {lastDonation}, and the 56-day waiting period has passed.

Ready to save more lives? Schedule your next donation appointment now!

Best regards,
BloodConnect Olongapo Team
    `.trim(),
  },
};

/**
 * Parse template with data
 */
function parseTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  }
  return result;
}

/**
 * Send email notification (mock implementation)
 */
export async function sendEmail(payload: NotificationPayload): Promise<NotificationResult> {
  console.log('📧 Sending email:', {
    to: payload.recipient.email,
    subject: payload.subject,
  });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In production, integrate with:
  // - Nodemailer + SMTP
  // - SendGrid
  // - AWS SES
  // - Resend
  
  return {
    success: true,
    notificationId: `email_${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
}

/**
 * Send SMS notification (mock implementation)
 */
export async function sendSMS(payload: NotificationPayload): Promise<NotificationResult> {
  console.log('📱 Sending SMS:', {
    to: payload.recipient.phone,
    message: payload.message.substring(0, 160),
  });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In production, integrate with:
  // - Twilio
  // - Semaphore (Philippines)
  // - Vonage (Nexmo)
  
  return {
    success: true,
    notificationId: `sms_${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
}

/**
 * Send blood request alert to matching donors
 */
export async function sendBloodRequestAlert(
  alert: Alert,
  donors: Donor[]
): Promise<{ sent: number; failed: number; results: NotificationResult[] }> {
  const results: NotificationResult[] = [];
  let sent = 0;
  let failed = 0;
  
  for (const donor of donors) {
    if (!donor.emailAlerts) continue;
    
    const templateData = {
      donorName: donor.name,
      bloodType: alert.bloodType,
      hospital: alert.hospitalName,
      quantity: alert.quantity,
      urgency: alert.status === 'sent' ? 'URGENT' : 'Normal',
    };
    
    const payload: NotificationPayload = {
      type: 'email',
      priority: 'urgent',
      recipient: {
        id: donor.id,
        email: donor.email,
        phone: donor.contact,
        name: donor.name,
      },
      subject: parseTemplate(NOTIFICATION_TEMPLATES.BLOOD_REQUEST_ALERT.subject, templateData),
      message: parseTemplate(NOTIFICATION_TEMPLATES.BLOOD_REQUEST_ALERT.message, templateData),
      data: { alertId: alert.id, bloodType: alert.bloodType },
    };
    
    const result = await sendEmail(payload);
    results.push(result);
    
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }
  
  return { sent, failed, results };
}

/**
 * Send appointment confirmation
 */
export async function sendAppointmentConfirmation(
  donor: { id: number | string; name: string; email: string },
  appointment: { date: string; timeSlot: string; hospitalName: string; address?: string }
): Promise<NotificationResult> {
  const templateData = {
    donorName: donor.name,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    hospital: appointment.hospitalName,
    address: appointment.address || 'See hospital details',
  };
  
  const payload: NotificationPayload = {
    type: 'email',
    priority: 'normal',
    recipient: {
      id: donor.id,
      email: donor.email,
      name: donor.name,
    },
    subject: parseTemplate(NOTIFICATION_TEMPLATES.APPOINTMENT_CONFIRMATION.subject, templateData),
    message: parseTemplate(NOTIFICATION_TEMPLATES.APPOINTMENT_CONFIRMATION.message, templateData),
  };
  
  return sendEmail(payload);
}

/**
 * Send donation thank you with stats
 */
export async function sendDonationThankYou(
  donor: { id: number | string; name: string; email: string },
  stats: { totalDonations: number; livesSaved: number; nextEligibleDate: string },
  newBadges: { name: string; icon: string }[] = []
): Promise<NotificationResult> {
  const badgesText = newBadges.length > 0
    ? `\n🎉 New Badges Earned:\n${newBadges.map(b => `  ${b.icon} ${b.name}`).join('\n')}\n`
    : '';
  
  const templateData = {
    donorName: donor.name,
    hospital: 'the donation center',
    totalDonations: stats.totalDonations,
    livesSaved: stats.livesSaved,
    nextEligibleDate: stats.nextEligibleDate,
    newBadges: badgesText,
  };
  
  const payload: NotificationPayload = {
    type: 'email',
    priority: 'normal',
    recipient: {
      id: donor.id,
      email: donor.email,
      name: donor.name,
    },
    subject: NOTIFICATION_TEMPLATES.DONATION_THANK_YOU.subject,
    message: parseTemplate(NOTIFICATION_TEMPLATES.DONATION_THANK_YOU.message, templateData),
  };
  
  return sendEmail(payload);
}

// SMS Service using Twilio
// This is a frontend service - for production, SMS should be sent from backend

interface SMSService {
  sendVerificationCode(phone: string): Promise<{ success: boolean; message?: string }>;
  verifyCode(phone: string, code: string): Promise<boolean>;
}

class TwilioSMSService implements SMSService {
  private accountSid: string;

  constructor() {
    const env = import.meta.env as { VITE_TWILIO_ACCOUNT_SID?: string };
    this.accountSid = env.VITE_TWILIO_ACCOUNT_SID || '';
  }

  async sendVerificationCode(phone: string): Promise<{ success: boolean; message?: string }> {
    if (!this.accountSid) {
      // Demo mode - simulate SMS sending
      console.log('📱 Demo SMS Service');
      console.log(`Sending verification code to: ${phone}`);
      const demoCode = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem(`verification_code_${phone}`, demoCode.toString());
      localStorage.setItem(`verification_time_${phone}`, Date.now().toString());

      return {
        success: true,
        message: `Demo mode: Verification code is ${demoCode}`
      };
    }

    try {
      // Production mode with actual Twilio API
      // Note: This should be done from backend for security
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      // In production, make API call to your backend which then calls Twilio
      // const response = await fetch('/api/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ to: phone, code: verificationCode })
      // });

      // For now, store locally (demo)
      localStorage.setItem(`verification_code_${phone}`, verificationCode.toString());
      localStorage.setItem(`verification_time_${phone}`, Date.now().toString());

      return { success: true };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, message: 'Failed to send SMS' };
    }
  }

  async verifyCode(phone: string, code: string): Promise<boolean> {
    const storedCode = localStorage.getItem(`verification_code_${phone}`);
    const storedTime = localStorage.getItem(`verification_time_${phone}`);

    if (!storedCode || !storedTime) {
      return false;
    }

    // Check if code is expired (10 minutes)
    const timeDiff = Date.now() - parseInt(storedTime);
    if (timeDiff > 10 * 60 * 1000) {
      localStorage.removeItem(`verification_code_${phone}`);
      localStorage.removeItem(`verification_time_${phone}`);
      return false;
    }

    return storedCode === code;
  }
}

// Export singleton instance
export const smsService = new TwilioSMSService();

// Helper function to format phone numbers
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Add Hong Kong country code if missing
  if (cleaned.length === 8 && !cleaned.startsWith('852')) {
    return `+852${cleaned}`;
  }

  // Add + if missing
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }

  return cleaned;
}

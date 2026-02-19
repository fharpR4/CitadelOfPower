const nodemailer = require('nodemailer');

// Create transporter with email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error.message);
  } else {
    console.log('Email service is ready to send messages');
  }
});

// Send contact notification to admin
const sendContactNotification = async (contact) => {
  try {
    // If email credentials aren't set, log and return
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not configured. Skipping notification.');
      console.log('Contact received:', {
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      });
      return true;
    }

    const mailOptions = {
      from: `"Citadel Of Power" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; background: #f3f4f6; font-weight: bold; width: 100px;">Name:</td>
              <td style="padding: 8px;">${contact.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f3f4f6; font-weight: bold;">Email:</td>
              <td style="padding: 8px;">${contact.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f3f4f6; font-weight: bold;">Subject:</td>
              <td style="padding: 8px;">${contact.subject}</td>
            </tr>
          </table>
          
          <h3 style="color: #374151; margin: 20px 0 10px;">Message:</h3>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            ${contact.message.replace(/\n/g, '<br>')}
          </div>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Received on: ${new Date(contact.createdAt).toLocaleString()}<br>
            IP Address: ${contact.ipAddress || 'N/A'}<br>
            User Agent: ${contact.userAgent || 'N/A'}
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error.message);
    // Don't throw - just log the error
    return false;
  }
};

// Send auto-reply to person who contacted
const sendAutoReply = async (contact) => {
  try {
    // If email credentials aren't set, log and return
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not configured. Skipping auto-reply.');
      return true;
    }

    const mailOptions = {
      from: `"Citadel Of Power" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: 'Thank You for Contacting Citadel Of Power',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Thank You for Reaching Out!</h2>
          
          <p>Dear ${contact.name},</p>
          
          <p>Thank you for contacting <strong>Citadel Of Power</strong>. We have received your message and will get back to you as soon as possible (usually within 24-48 hours).</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Message:</h3>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p style="white-space: pre-line;">${contact.message}</p>
          </div>
          
          <h3 style="color: #374151;">In the meantime, you can:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;">ÌµäÔ∏è <a href="http://localhost:5173/sermons" style="color: #2563eb; text-decoration: none;">Watch our latest sermons</a></li>
            <li style="margin: 10px 0;">Ì≥Ö <a href="http://localhost:5173/events" style="color: #2563eb; text-decoration: none;">Check upcoming events</a></li>
            <li style="margin: 10px 0;">Ì±• <a href="http://localhost:5173/workers" style="color: #2563eb; text-decoration: none;">Meet our workers</a></li>
          </ul>
          
          <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; border-radius: 8px;">
            <p style="margin: 0; font-size: 18px;">"For where two or three gather in my name, there am I with them."</p>
            <p style="margin: 10px 0 0;">- Matthew 18:20</p>
          </div>
          
          <p style="margin-top: 30px;">God bless you,<br>
          <strong>The Citadel Of Power Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Watford North, Library St Albans RD, Hertfordshire WD24 7RW<br>
            +(44) 7386-894093
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Auto-reply sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Auto-reply error:', error.message);
    // Don't throw - just log the error
    return false;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('‚ö†Ô∏è Email not configured. Contact form will work but emails won't be sent.');
      console.log('To enable emails, add to .env:');
      console.log('EMAIL_USER=your-email@gmail.com');
      console.log('EMAIL_PASSWORD=your-app-password');
      return false;
    }
    
    await transporter.verify();
    console.log('‚úÖ Email configuration is valid');
    return true;
  } catch (error) {
    console.log('‚ùå Email configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendContactNotification,
  sendAutoReply,
  testEmailConfig
};

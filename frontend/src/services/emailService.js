const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('Email service ready to send messages');
  }
});

// Send contact notification to admin
const sendContactNotification = async (contact) => {
  try {
    const mailOptions = {
      from: `"Citadel of Power" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            ${contact.message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            Received on: ${new Date(contact.createdAt).toLocaleString()}<br>
            IP: ${contact.ipAddress || 'N/A'}
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send auto-reply to contact
const sendAutoReply = async (contact) => {
  try {
    const mailOptions = {
      from: `"Citadel of Power" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: 'Thank You for Contacting Citadel of Power',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Reaching Out!</h2>
          <p>Dear ${contact.name},</p>
          <p>Thank you for contacting Citadel of Power. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Message:</h3>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p>${contact.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Visit our website: <a href="https://citadelofpower.org">citadelofpower.org</a></li>
            <li>Check our <a href="https://citadelofpower.org/events">upcoming events</a></li>
            <li>Watch our <a href="https://citadelofpower.org/sermons">latest sermons</a></li>
          </ul>
          
          <p>God bless you,<br>
          <strong>Citadel of Power Team</strong></p>
          
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
    console.error('Auto-reply error:', error);
    return false;
  }
};

module.exports = {
  sendContactNotification,
  sendAutoReply
};

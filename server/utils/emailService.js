import nodemailer from 'nodemailer';

// Generate a 6-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASS || 'test'
      }
    });
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email, verificationCode, type = 'signup') => {
  try {
    const transporter = createTransporter();
    
    const subject = type === 'signup' 
      ? 'Verify Your Basha Lagbe Account' 
      : 'Sign In Verification Code';
    
    const message = type === 'signup'
      ? `Welcome to Basha Lagbe! Your verification code is: ${verificationCode}`
      : `Your sign in verification code is: ${verificationCode}`;
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@bashalagbe.com',
      to: email,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #3b82f6;">${subject}</h2>
            <p style="font-size: 16px; line-height: 1.5;">Your verification code is:</p>
            <div style="background-color: #dbeafe; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${verificationCode}
            </div>
            <p style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes.</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; text-align: center;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl, fullName) => {
  try {
    const transporter = createTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Basha Lagbe</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Password Reset</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Secure your account with a new password</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Hello ${fullName}!</h2>
          
          <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin-bottom: 25px;">
            We received a request to reset your password for your Basha Lagbe account. If you made this request, 
            click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4); transition: all 0.3s ease;">
              Reset My Password
            </a>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; padding: 20px; margin: 30px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Security Information</h4>
            <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 20px;">
              <li>This link expires in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
            If you're having trouble clicking the button, copy and paste the following link into your browser:
          </p>
          <p style="color: #4f46e5; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          
          <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Need help? Contact us at 
              <a href="mailto:support@bashalagbe.com" style="color: #4f46e5; text-decoration: none;">support@bashalagbe.com</a>
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
              © 2025 Basha Lagbe. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Basha Lagbe Security" <${process.env.EMAIL_USER || 'noreply@bashalagbe.com'}>`,
      to: email,
      subject: '🔐 Password Reset Request - Basha Lagbe',
      html: html,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV MODE] Password reset email would be sent:');
      console.log('📧 To:', email);
      console.log('📧 Reset URL:', resetUrl);
      console.log('📧 Subject:', mailOptions.subject);
      return { messageId: `dev-${Date.now()}` };
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

// Send password change confirmation email
export const sendPasswordChangeConfirmationEmail = async (email, fullName) => {
  try {
    const transporter = createTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
        <style>
          body { 
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #3b82f6;
            padding: 20px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e2e8f0;
            border-top: none;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Changed Successfully</h2>
          </div>
          <div class="content">
            <p>Hello${fullName ? ' ' + fullName : ''},</p>
            <p>Your password for Basha Lagbe has been changed successfully.</p>
            <p>If you did not initiate this change, please contact our support team immediately.</p>
            <p>Thank you for using Basha Lagbe!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Basha Lagbe. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@bashalagbe.com',
      to: email,
      subject: 'Password Changed Successfully',
      html: html
    });
    
    console.log('Password change confirmation email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password change confirmation email:', error);
    return false;
  }
};

// Send property approval email
export const sendPropertyApprovalEmail = async (email, propertyDetails, isApproved) => {
  try {
    const transporter = createTransporter();
    
    const subject = isApproved 
      ? 'Your Property Listing Has Been Approved' 
      : 'Your Property Listing Requires Changes';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { 
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: ${isApproved ? '#10b981' : '#f59e0b'};
            padding: 20px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e2e8f0;
            border-top: none;
          }
          .property-details {
            margin: 20px 0;
            padding: 15px;
            background-color: #f1f5f9;
            border-radius: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #64748b;
          }
          .btn {
            display: inline-block;
            padding: 12px 20px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${subject}</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            ${isApproved ? 
              `<p>Good news! Your property listing has been approved and is now visible on Basha Lagbe.</p>` : 
              `<p>Thank you for submitting your property listing. Our team has reviewed your submission and some changes are required before we can publish it.</p>`
            }
            
            <div class="property-details">
              <h3>Property Details:</h3>
              <p><strong>Title:</strong> ${propertyDetails.title}</p>
              <p><strong>Location:</strong> ${propertyDetails.location}</p>
              <p><strong>Type:</strong> ${propertyDetails.type}</p>
              <p><strong>Price:</strong> ৳${propertyDetails.price}</p>
            </div>
            
            ${isApproved ?
              `<p>Your property is now visible to potential tenants. You can check your listing and manage inquiries through your dashboard.</p>` :
              `<p>Please log in to your account and make the necessary changes to your listing. Our team has left specific feedback in your dashboard.</p>`
            }
            
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="btn">
              Go to Dashboard
            </a>
            
            <p>Thank you for choosing Basha Lagbe for your property listing needs!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Basha Lagbe. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@bashalagbe.com',
      to: email,
      subject: subject,
      html: html
    });
    
    console.log('Property approval email sent: %s', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending property approval email:', error);
    return { success: false, error: error.message };
  }
};

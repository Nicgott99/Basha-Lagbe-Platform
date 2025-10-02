import User from "../models/user.model.js";
import EmailVerification from "../models/emailVerification.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, generateVerificationCode, sendPasswordResetEmail, sendPasswordChangeConfirmationEmail } from "../utils/emailService.js";
import { displayVerificationCode, displayAdminLogin, displayUserSignup, displaySuccess, displayError } from "../utils/terminalLogger.js";
import crypto from "crypto";

// Send Verification Code
export const sendVerificationCode = async (req, res, next) => {
  try {
    const { email, type = 'signup' } = req.body;

    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    console.log(`🔍 DEBUG: sendVerificationCode called with email: ${email}, type: ${type}`);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(errorHandler(400, "Invalid email format"));
    }

    const verificationCode = generateVerificationCode();

    // Clean up old verification codes for this email
    await EmailVerification.deleteMany({ 
      email: email.toLowerCase(), 
      type 
    });

    // Save verification code
    await EmailVerification.create({
      email: email.toLowerCase(),
      verificationCode,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isUsed: false,
      attempts: 0,
    });

    // Send email (don't let email errors crash the process)
    try {
      await sendVerificationEmail(email.toLowerCase(), verificationCode, type);
    } catch (emailError) {
      console.error('Email service error (non-critical):', emailError.message);
      // Continue without failing - the code is still valid
    }

    // Display verification code in terminal based on type
    console.log(`🔍 DEBUG: About to display code in terminal - Type: ${type}, Email: ${email.toLowerCase()}, Code: ${verificationCode}`);
    
    if (type === 'admin-signin') {
      console.log('🔍 DEBUG: Calling displayAdminLogin');
      displayAdminLogin(email.toLowerCase(), verificationCode);
    } else if (type === 'signup') {
      console.log('🔍 DEBUG: Calling displayUserSignup');
      displayUserSignup(email.toLowerCase(), verificationCode);
    } else {
      console.log('🔍 DEBUG: Calling displayVerificationCode');
      displayVerificationCode(type, email.toLowerCase(), verificationCode);
    }

    res.status(200).json({ 
      success: true,
      message: "Verification code sent to your email",
      email: email.toLowerCase()
    });
  } catch (error) {
    console.error("Send verification code error:", error);
    next(error);
  }
};

// Verify Email Code
export const verifyEmailCode = async (req, res, next) => {
  try {
    const { email, verificationCode, type = 'signup' } = req.body;

    if (!email || !verificationCode) {
      return next(errorHandler(400, "Email and verification code are required"));
    }

    // Find verification record
    const verification = await EmailVerification.findOne({
      email: email.toLowerCase(),
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return next(errorHandler(400, "Invalid or expired verification code"));
    }

    // Check if too many attempts
    if (verification.attempts >= 5) {
      return next(errorHandler(400, "Too many verification attempts. Request a new code."));
    }

    // Verify code
    if (verification.verificationCode !== verificationCode) {
      verification.attempts += 1;
      await verification.save();
      return next(errorHandler(400, "Incorrect verification code"));
    }

    // Mark as used
    verification.isUsed = true;
    await verification.save();

    res.status(200).json({
      success: true,
      message: "Email verification successful",
      email: email.toLowerCase(),
      type
    });
  } catch (error) {
    console.error("Verify email code error:", error);
    next(error);
  }
};

// Sign Up (Step 1 - Send Verification Code)
export const signup = async (req, res, next) => {
  const { fullName, email, password, mobileNumber } = req.body;

  try {
    // Validation
    if (!fullName || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(errorHandler(409, "Email already in use"));
    }

    // Check if mobile number already exists
    if (mobileNumber) {
      const existingMobile = await User.findOne({ mobileNumber });
      if (existingMobile) {
        return next(errorHandler(409, "Mobile number already in use"));
      }
    }

    // Generate and save verification code
    const verificationCode = generateVerificationCode();
    
    // Clean up old verification codes
    await EmailVerification.deleteMany({ 
      email: email.toLowerCase(), 
      type: 'signup' 
    });

    // Save verification code
    await EmailVerification.create({
      email: email.toLowerCase(),
      verificationCode,
      type: 'signup',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isUsed: false,
      attempts: 0,
    });

    // Send verification email (don't let email errors crash the process)
    try {
      await sendVerificationEmail(email.toLowerCase(), verificationCode, 'signup');
    } catch (emailError) {
      console.error('Email service error (non-critical):', emailError.message);
      // Continue without failing - the code is still valid
    }

    // Display verification code in terminal
    console.log(`🔍 DEBUG: Signup verification - Email: ${email.toLowerCase()}, Code: ${verificationCode}`);
    displayUserSignup(email.toLowerCase(), verificationCode);

    // Store signup data temporarily (we'll need it for step 2)
    // In production, you might want to use Redis or a temporary collection
    // For now, we'll pass it back to frontend
    
    res.status(200).json({
      success: true,
      message: "Verification code sent. Check terminal for the code.",
      requiresVerification: true,
      email: email.toLowerCase(),
      // Don't send sensitive data, frontend will resend it
    });
  } catch (error) {
    console.error("Signup error:", error);
    next(error);
  }
};

// Complete Sign Up (Step 2 - Verify Code and Create User)
export const completeSignup = async (req, res, next) => {
  const { fullName, email, password, mobileNumber, verificationCode } = req.body;

  try {
    if (!fullName || !email || !password || !verificationCode) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Verify the verification code
    console.log(`🔍 DEBUG: Completing signup - Email: ${email.toLowerCase()}, Code: ${verificationCode}`);
    
    const verification = await EmailVerification.findOne({
      email: email.toLowerCase(),
      type: 'signup',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    console.log(`🔍 DEBUG: Signup verification found:`, verification ? {
      email: verification.email,
      type: verification.type,
      code: verification.verificationCode,
      isUsed: verification.isUsed,
      attempts: verification.attempts,
      expiresAt: verification.expiresAt
    } : 'No verification found');

    if (!verification) {
      return next(errorHandler(400, "Invalid or expired verification code"));
    }

    // Check if too many attempts
    if (verification.attempts >= 5) {
      return next(errorHandler(400, "Too many verification attempts. Request a new code."));
    }

    // Verify code
    console.log(`🔍 DEBUG: Signup code comparison - Stored: "${verification.verificationCode}", Submitted: "${verificationCode}", Match: ${verification.verificationCode === verificationCode}`);
    
    if (verification.verificationCode !== verificationCode) {
      verification.attempts += 1;
      await verification.save();
      console.log(`🔍 DEBUG: Signup code mismatch, attempts now: ${verification.attempts}`);
      return next(errorHandler(400, "Incorrect verification code"));
    }

    // Mark verification as used
    verification.isUsed = true;
    await verification.save();

    // Final validation before creating user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(errorHandler(409, "Email already in use"));
    }

    if (mobileNumber) {
      const existingMobile = await User.findOne({ mobileNumber });
      if (existingMobile) {
        return next(errorHandler(409, "Mobile number already in use"));
      }
    }

    // Hash password and create user
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobileNumber,
      isEmailVerified: true, // They verified their email
      role: 'user'
    });

    await newUser.save();

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      }, 
      process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: pass, ...userWithoutPassword } = newUser._doc;

    res
      .cookie("access_token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(201)
      .json({
        success: true,
        message: "Account created successfully! You are now logged in.",
        user: userWithoutPassword,
        token
      });
  } catch (error) {
    console.error("Complete signup error:", error);
    next(error);
  }
};

// Sign In
export const signin = async (req, res, next) => {
  try {
    console.log('🔍 DEBUG: signin called with email:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('🔍 DEBUG: Missing email or password');
      return next(errorHandler(400, "All fields are required"));
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('🔍 DEBUG: User found:', !!user);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if this is admin login
    const isAdminLogin = email.toLowerCase() === "hasibullah.khan.alvie@g.bracu.ac.bd";
    
    // Admin accounts always require verification
    if (isAdminLogin || user.twoFactorEnabled) {
      // Generate and send verification code
      const verificationCode = generateVerificationCode();
      const verificationType = isAdminLogin ? 'admin-signin' : 'signin';
      
      // Clean up old verification codes
      await EmailVerification.deleteMany({ 
        email: email.toLowerCase(), 
        type: verificationType 
      });

      // Save verification code
      await EmailVerification.create({
        email: email.toLowerCase(),
        verificationCode,
        type: verificationType,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        isUsed: false,
        attempts: 0,
      });

      // Send verification email (don't let email errors crash the process)
      try {
        await sendVerificationEmail(email.toLowerCase(), verificationCode, verificationType);
      } catch (emailError) {
        console.error('Email service error (non-critical):', emailError.message);
        // Continue without failing - the code is still valid
      }

      // Display in terminal
      console.log(`🔍 DEBUG: Signin verification - IsAdmin: ${isAdminLogin}, Email: ${email.toLowerCase()}, Code: ${verificationCode}`);
      
      if (isAdminLogin) {
        console.log('🔍 DEBUG: Displaying admin login code');
        displayAdminLogin(email.toLowerCase(), verificationCode);
      } else {
        console.log('🔍 DEBUG: Displaying signin verification code');
        displayVerificationCode('signin', email.toLowerCase(), verificationCode);
      }

      // Return pending verification response
      return res.status(200).json({
        success: true,
        message: "Verification code sent to your email",
        requiresTwoFactor: true,
        isAdmin: isAdminLogin,
        email: email.toLowerCase()
      });
    }

    // Complete normal signin if 2FA not enabled
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: pass, ...userWithoutPassword } = user._doc;

    res
      .cookie("access_token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "Signed in successfully",
        user: userWithoutPassword,
        token
      });
  } catch (error) {
    console.error("Signin error:", error);
    next(error);
  }
};

// Complete Sign In (with 2FA)
export const completeSignin = async (req, res, next) => {
  try {
    const { email, password, verificationCode } = req.body;

    if (!email || !password || !verificationCode) {
      return next(errorHandler(400, "All fields are required"));
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if password is valid
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Check if this is admin login
    const isAdminLogin = email.toLowerCase() === "hasibullah.khan.alvie@g.bracu.ac.bd";
    const verificationType = isAdminLogin ? 'admin-signin' : 'signin';

    // Verify the verification code
    console.log(`🔍 DEBUG: Looking for verification - Email: ${email.toLowerCase()}, Type: ${verificationType}, Code submitted: ${verificationCode}`);
    
    const verification = await EmailVerification.findOne({
      email: email.toLowerCase(),
      type: verificationType,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    console.log(`🔍 DEBUG: Found verification:`, verification ? {
      email: verification.email,
      type: verification.type,
      code: verification.verificationCode,
      isUsed: verification.isUsed,
      attempts: verification.attempts,
      expiresAt: verification.expiresAt
    } : 'No verification found');

    if (!verification) {
      return next(errorHandler(400, "Invalid or expired verification code"));
    }

    // Check if too many attempts
    if (verification.attempts >= 5) {
      return next(errorHandler(400, "Too many verification attempts. Request a new code."));
    }

    // Verify code
    console.log(`🔍 DEBUG: Code comparison - Stored: "${verification.verificationCode}", Submitted: "${verificationCode}", Match: ${verification.verificationCode === verificationCode}`);
    
    if (verification.verificationCode !== verificationCode) {
      verification.attempts += 1;
      await verification.save();
      console.log(`🔍 DEBUG: Code mismatch, attempts now: ${verification.attempts}`);
      return next(errorHandler(400, "Incorrect verification code"));
    }

    // Mark as used
    verification.isUsed = true;
    await verification.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: pass, ...userWithoutPassword } = user._doc;

    res
      .cookie("access_token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "Signed in successfully",
        user: userWithoutPassword,
        token
      });
  } catch (error) {
    console.error("Complete signin error:", error);
    next(error);
  }
};

// Password Reset Request
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save reset token to user (expires in 1 hour)
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(errorHandler(400, "All fields are required"));
    }

    if (newPassword.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(errorHandler(400, "Invalid or expired reset token"));
    }

    // Hash new password
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    
    // Update user password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Send password change confirmation email
    await sendPasswordChangeConfirmationEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};

// Google OAuth
export const google = async (req, res, next) => {
  try {
    const { email, name, photoURL } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      // User exists, log them in
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          role: user.role 
        }, 
        process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
        { expiresIn: '7d' }
      );

      const { password, ...userWithoutPassword } = user._doc;

      res
        .cookie("access_token", token, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .status(200)
        .json({
          success: true,
          message: "Signed in with Google successfully",
          user: userWithoutPassword,
          token
        });
    } else {
      // Create new user
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        fullName: name,
        email,
        password: hashedPassword,
        avatar: photoURL,
        isGoogleAccount: true
      });

      await newUser.save();

      const token = jwt.sign(
        { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      }, 
      process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = newUser._doc;      res
        .cookie("access_token", token, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .status(200)
        .json({
          success: true,
          message: "Signed in with Google successfully",
          user: userWithoutPassword,
          token
        });
    }
  } catch (error) {
    console.error("Google OAuth error:", error);
    next(error);
  }
};

// GitHub OAuth
export const github = async (req, res, next) => {
  try {
    const { email, name, photoURL, login } = req.body;

    // Validate required fields
    if (!email) {
      return next(errorHandler(400, "Email is required for GitHub OAuth"));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists, log them in
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          role: user.role 
        }, 
        process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
        { expiresIn: '7d' }
      );

      const { password, ...userWithoutPassword } = user._doc;

      res
        .cookie("access_token", token, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .status(200)
        .json({
          success: true,
          message: "Signed in with GitHub successfully",
          user: userWithoutPassword,
          token
        });
    } else {
      // Create new user
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        fullName: name || login || email.split('@')[0],
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: photoURL,
        isGitHubAccount: true,
        isEmailVerified: true, // GitHub emails are pre-verified
      });

      await newUser.save();

      const token = jwt.sign(
        { 
          id: newUser._id, 
          email: newUser.email, 
          role: newUser.role 
        }, 
        process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
        { expiresIn: '7d' }
      );

      const { password, ...userWithoutPassword } = newUser._doc;
      
      res
        .cookie("access_token", token, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .status(201)
        .json({
          success: true,
          message: "Account created and signed in with GitHub successfully",
          user: userWithoutPassword,
          token
        });
    }
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    next(error);
  }
};

// Check User (for signup validation)
export const checkUser = async (req, res, next) => {
  try {
    const { email, mobileNumber } = req.body;

    if (!email && !mobileNumber) {
      return next(errorHandler(400, "Email or mobile number is required"));
    }

    const query = {};
    if (email) query.email = email.toLowerCase();
    if (mobileNumber) query.mobileNumber = mobileNumber;

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(mobileNumber ? [{ mobileNumber }] : [])
      ]
    }).select('email mobileNumber');

    let conflicts = [];
    if (existingUser) {
      if (email && existingUser.email === email.toLowerCase()) {
        conflicts.push('email');
      }
      if (mobileNumber && existingUser.mobileNumber === mobileNumber) {
        conflicts.push('mobile');
      }
    }

    res.status(200).json({
      success: true,
      available: conflicts.length === 0,
      conflicts,
      message: conflicts.length === 0 ? "Available" : `${conflicts.join(' and ')} already taken`
    });
  } catch (error) {
    console.error("Check user error:", error);
    next(error);
  }
};

// Sign Out
export const signOut = (req, res) => {
  try {
    res.clearCookie("access_token");
    
    res.status(200).json({
      success: true,
      message: "User has been signed out"
    });
  } catch (error) {
    console.error("Sign out error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sign out"
    });
  }
};

// Verify token - used for checking authentication status
export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ 
      success: true, 
      data: { user } 
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
}
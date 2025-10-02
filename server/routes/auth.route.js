import express from 'express';
import { 
  signup, 
  signin, 
  completeSignin,
  completeSignup,
  google,
  github, 
  signOut, 
  sendVerificationCode, 
  verifyEmailCode,
  forgotPassword,
  resetPassword,
  verifyToken,
  checkUser
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/check-user', checkUser);
router.post('/signup', signup);
router.post('/complete-signup', completeSignup);
router.post('/signin', signin);
router.post('/complete-signin', completeSignin);
router.post('/google', google);
router.post('/github', github);
router.get('/signout', signOut);
router.post('/signout', signOut); // Support both GET and POST for signout
router.post('/send-verification', sendVerificationCode);
router.post('/verify-email', verifyEmailCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify', verifyToken);
router.get('/verify-token', verifyToken); // Add explicit verify-token route for App.jsx

export default router;

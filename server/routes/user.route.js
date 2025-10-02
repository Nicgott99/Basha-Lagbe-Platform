import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
  updateUserProfile, 
  getUserProfile, 
  uploadAvatar, 
  deleteUserAccount,
  changeEmail,
  changePassword,
  upload
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile/:id', verifyToken, getUserProfile);
router.post('/update/:id', verifyToken, updateUserProfile);
router.post('/upload-avatar', verifyToken, upload.single('avatar'), uploadAvatar);
router.post('/change-email/:id', verifyToken, changeEmail);
router.post('/change-password/:id', verifyToken, changePassword);
router.delete('/delete/:id', verifyToken, deleteUserAccount);

export default router;

import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otp.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/send', sendOTP);
router.post('/verify', verifyOTP);

export default router;
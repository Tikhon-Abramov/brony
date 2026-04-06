import { Router } from 'express';
import {
    getBookings,
    patchApproveBooking,
    patchRejectBooking,
    postBooking,
} from '../controllers/bookings.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getBookings);
router.post('/', postBooking);

router.patch('/:id/approve', requireAuth, requireAdmin, patchApproveBooking);
router.patch('/:id/reject', requireAuth, requireAdmin, patchRejectBooking);

export default router;
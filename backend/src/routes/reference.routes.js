import { Router } from 'express';
import {
    getDepartments,
    getEmployees,
} from '../controllers/reference.controller.js';

const router = Router();

router.get('/departments', getDepartments);
router.get('/employees', getEmployees);

export default router;
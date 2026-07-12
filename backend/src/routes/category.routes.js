import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint accessible by all authenticated users
router.get('/', authenticate, categoryController.getCategories);

// Endpoint accessible by ADMIN only
router.post('/', authenticate, authorize('ADMIN'), categoryController.createCategory);

export default router;

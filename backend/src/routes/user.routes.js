import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all routes in user management to ADMIN tier only
router.use(authenticate, authorize('ADMIN'));

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id/role', userController.changeRole);
router.put('/:id/status', userController.changeStatus);

export default router;

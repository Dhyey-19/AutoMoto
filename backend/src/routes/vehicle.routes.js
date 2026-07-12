import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route
router.get('/featured', vehicleController.getFeaturedVehicles);

// Routes accessible by USER and ADMIN
router.get('/', authenticate, vehicleController.getVehicles);
router.get('/search', authenticate, vehicleController.searchVehicles);
router.get('/transactions', authenticate, vehicleController.getTransactions);
router.get('/:id', authenticate, vehicleController.getVehicleById);
router.post('/:id/purchase', authenticate, vehicleController.purchaseVehicle);

// Routes accessible by ADMIN only
router.post('/', authenticate, authorize('ADMIN'), vehicleController.createVehicle);
router.put('/:id', authenticate, authorize('ADMIN'), vehicleController.updateVehicle);
router.delete('/:id', authenticate, authorize('ADMIN'), vehicleController.deleteVehicle);
router.post('/:id/restock', authenticate, authorize('ADMIN'), vehicleController.restockVehicle);

export default router;

import { z } from 'zod';
import * as vehicleService from '../services/vehicle.service.js';
import { ApiError } from '../utils/ApiError.js';

const vehicleSchema = z.object({
  Make: z.string().min(1, 'Make is required'),
  Model: z.string().min(1, 'Model is required'),
  CategoryId: z.number().int().positive('Category is required'),
  ManufactureYear: z.number().int().min(1886, 'Invalid year').max(new Date().getFullYear() + 1),
  Color: z.string().optional().nullable(),
  Description: z.string().optional().nullable(),
  Price: z.number().min(0, 'Price must be greater than or equal to 0'),
  Quantity: z.number().int().min(0, 'Quantity must be greater than or equal to 0'),
  ImageUrl: z.string().url('Invalid Image URL').optional().nullable().or(z.literal('')),
});

const transactionSchema = z.object({
  Quantity: z.number().int().positive('Quantity must be greater than 0'),
  Remarks: z.string().optional().nullable(),
});

export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const searchVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.searchVehicles(req.query);
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req, res, next) => {
  try {
    const validatedData = vehicleSchema.parse(req.body);
    const vehicle = await vehicleService.createVehicle(validatedData);
    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    if (!vehicleId) throw new ApiError(400, 'Vehicle ID is required');

    const validatedData = vehicleSchema.parse(req.body);
    const vehicle = await vehicleService.updateVehicle(vehicleId, validatedData);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    if (!vehicleId) throw new ApiError(400, 'Vehicle ID is required');

    await vehicleService.softDeleteVehicle(vehicleId);
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user.id; // from auth middleware
    if (!vehicleId) throw new ApiError(400, 'Vehicle ID is required');

    const validatedData = transactionSchema.parse(req.body);
    const transaction = await vehicleService.purchaseVehicle(vehicleId, userId, validatedData.Quantity, validatedData.Remarks);
    
    res.status(201).json({
      success: true,
      message: 'Vehicle purchased successfully',
      data: transaction,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};

export const restockVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user.id; // from auth middleware
    if (!vehicleId) throw new ApiError(400, 'Vehicle ID is required');

    const validatedData = transactionSchema.parse(req.body);
    const transaction = await vehicleService.restockVehicle(vehicleId, userId, validatedData.Quantity, validatedData.Remarks);
    
    res.status(201).json({
      success: true,
      message: 'Vehicle restocked successfully',
      data: transaction,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};

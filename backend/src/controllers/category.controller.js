import * as categoryService from '../services/category.service.js';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

const categorySchema = z.object({
  CategoryName: z.string().min(1, 'Category name is required').max(30, 'Category name must be less than 30 characters'),
});

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const validated = categorySchema.parse(req.body);
    const category = await categoryService.createCategory(validated.CategoryName);
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};

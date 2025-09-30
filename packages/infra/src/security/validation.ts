import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Input validation middleware
export const validateInput = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
          timestamp: new Date().toISOString(),
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

// Query parameter validation middleware
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
          timestamp: new Date().toISOString(),
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

// Common validation schemas
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
  }),

  // ID parameter
  id: z.object({
    id: z.string().min(1, 'ID is required'),
  }),

  // Email
  email: z.string().email('Invalid email format'),

  // Password
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  // Phone number
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),

  // URL
  url: z.string().url('Invalid URL format'),

  // Date
  date: z.string().datetime('Invalid date format'),

  // Currency amount
  amount: z.number().positive('Amount must be positive').multipleOf(0.01, 'Amount must have at most 2 decimal places'),

  // Product data
  product: z.object({
    name: z.string().min(1, 'Product name is required').max(255, 'Product name too long'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    categoryId: z.string().min(1, 'Category ID is required'),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),

  // Order data
  order: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
      price: z.number().positive('Price must be positive'),
    })).min(1, 'At least one item is required'),
    shippingAddress: z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      address1: z.string().min(1, 'Address is required'),
      address2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().optional(),
      postalCode: z.string().min(1, 'Postal code is required'),
      country: z.string().min(1, 'Country is required'),
      phone: z.string().optional(),
    }),
  }),

  // User registration
  userRegistration: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    role: z.enum(['CUSTOMER', 'SELLER', 'ADMIN']).optional(),
  }),

  // User login
  userLogin: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),

  // Search query
  search: z.object({
    q: z.string().min(1, 'Search query is required').max(255, 'Search query too long'),
    category: z.string().optional(),
    minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'oldest']).optional(),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  }),
};

// Sanitize input middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove potentially dangerous characters
  const sanitizeString = (str: string): string => {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim();
  };

  // Sanitize string fields in body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }

  // Sanitize string fields in query
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  next();
};

// File upload validation middleware
export const validateFileUpload = (options: {
  maxSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
} = {}) => {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxFiles = 5 } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded',
        timestamp: new Date().toISOString(),
      });
    }

    if (req.files.length > maxFiles) {
      return res.status(400).json({
        success: false,
        error: `Too many files. Maximum ${maxFiles} files allowed`,
        timestamp: new Date().toISOString(),
      });
    }

    for (const file of req.files) {
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: `File ${file.originalname} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
          timestamp: new Date().toISOString(),
        });
      }

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: `File ${file.originalname} has invalid type. Allowed types: ${allowedTypes.join(', ')}`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    next();
  };
};


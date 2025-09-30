import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@tdc/config';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// JWT token verification middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    console.warn(`[Auth] Invalid token from ${req.ip}: ${error}`);
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
      timestamp: new Date().toISOString(),
    });
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString(),
      });
    }

    if (!roles.includes(req.user.role)) {
      console.warn(`[Auth] Unauthorized access attempt by ${req.user.email} (${req.user.role}) to ${req.path}`);
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

// Tenant isolation middleware
export const tenantIsolation = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      timestamp: new Date().toISOString(),
    });
  }

  // Add tenant ID to request for database queries
  (req as any).tenantId = req.user.tenantId;
  next();
};

// API key authentication middleware
export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      timestamp: new Date().toISOString(),
    });
  }

  // In a real implementation, you would validate the API key against a database
  // For now, we'll use a simple check
  if (apiKey !== env.API_KEY) {
    console.warn(`[Auth] Invalid API key from ${req.ip}`);
    return res.status(403).json({
      success: false,
      error: 'Invalid API key',
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

// Generate JWT token
export const generateToken = (user: AuthUser): string => {
  return jwt.sign(user, env.JWT_SECRET, { expiresIn: '24h' });
};

// Generate refresh token
export const generateRefreshToken = (user: AuthUser): string => {
  return jwt.sign({ id: user.id, type: 'refresh' }, env.JWT_SECRET, { expiresIn: '7d' });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { id: string; type: string } | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; type: string };
    if (decoded.type !== 'refresh') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
};


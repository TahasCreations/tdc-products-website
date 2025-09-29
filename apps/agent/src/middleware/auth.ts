import { Request, Response, NextFunction } from 'express'
import { logger } from '../lib/logger'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['x-sync-token'] as string
  const expectedToken = process.env.SYNC_TOKEN

  if (!expectedToken) {
    logger.error('SYNC_TOKEN not configured')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  if (!token) {
    logger.warn('Missing sync token', { ip: req.ip })
    res.status(401).json({ error: 'Missing sync token' })
    return
  }

  if (token !== expectedToken) {
    logger.warn('Invalid sync token', { ip: req.ip })
    res.status(401).json({ error: 'Invalid sync token' })
    return
  }

  next()
}

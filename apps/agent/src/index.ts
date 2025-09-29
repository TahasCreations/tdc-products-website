import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { syncRouter } from './routes/sync'
import { healthRouter } from './routes/health'
import { errorHandler } from './middleware/error-handler'
import { authMiddleware } from './middleware/auth'
import { logger } from './lib/logger'
import { WatcherService } from './services/watcher-service'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  next()
})

// Routes
app.use('/health', healthRouter)
app.use('/sync', authMiddleware, syncRouter)

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' })
})

// Start server
app.listen(PORT, async () => {
  logger.info(`Local sync agent started on port ${PORT}`)
  console.log(`🚀 Local sync agent running on http://localhost:${PORT}`)
  
  // Start file watcher
  const watcher = new WatcherService()
  try {
    await watcher.start()
    console.log(`👀 File watcher started`)
  } catch (error) {
    logger.error('Failed to start watcher', { error })
  }
})

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully')
  process.exit(0)
})

export default app

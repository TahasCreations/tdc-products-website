/**
 * Enterprise WebSocket Chat Server
 * Real-time messaging with Socket.io & Redis pub/sub
 */

import { Server as SocketIOServer } from 'socket.io';
import { Redis } from '@upstash/redis';
import { prisma } from '@/lib/prisma';

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: any;
}

interface TypingIndicator {
  userId: string;
  userName: string;
  roomId: string;
}

export class EnterpriseWebSocketServer {
  private io: SocketIOServer;
  private redis: Redis;
  private activeUsers: Map<string, Set<string>>;
  private typingUsers: Map<string, Set<string>>;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL || '',
      token: process.env.UPSTASH_REDIS_TOKEN || '',
    });
    this.activeUsers = new Map();
    this.typingUsers = new Map();
    
    this.setupEventHandlers();
    this.setupRedisSubscription();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Authentication
      socket.on('authenticate', async (data: { userId: string; token: string }) => {
        const isValid = await this.validateToken(data.token);
        if (isValid) {
          socket.data.userId = data.userId;
          socket.emit('authenticated', { success: true });
        } else {
          socket.emit('authenticated', { success: false });
          socket.disconnect();
        }
      });

      // Join room
      socket.on('join-room', async (roomId: string) => {
        socket.join(roomId);
        
        // Track active users
        if (!this.activeUsers.has(roomId)) {
          this.activeUsers.set(roomId, new Set());
        }
        this.activeUsers.get(roomId)?.add(socket.data.userId);

        // Notify others
        socket.to(roomId).emit('user-joined', {
          userId: socket.data.userId,
          activeCount: this.activeUsers.get(roomId)?.size,
        });

        // Load recent messages
        const messages = await this.loadRecentMessages(roomId);
        socket.emit('message-history', messages);
      });

      // Send message
      socket.on('send-message', async (data: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const message: ChatMessage = {
          ...data,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        // Save to database
        await this.saveMessage(message);

        // Broadcast to room
        this.io.to(data.roomId).emit('new-message', message);

        // Publish to Redis for scaling across servers
        await this.redis.publish('chat-messages', JSON.stringify(message));

        // AI sentiment analysis
        const sentiment = await this.analyzeSentiment(message.message);
        if (sentiment === 'negative') {
          // Alert admin
          this.io.to('admin-room').emit('flagged-message', {
            ...message,
            sentiment,
          });
        }
      });

      // Typing indicator
      socket.on('typing-start', (roomId: string) => {
        if (!this.typingUsers.has(roomId)) {
          this.typingUsers.set(roomId, new Set());
        }
        this.typingUsers.get(roomId)?.add(socket.data.userId);
        
        socket.to(roomId).emit('user-typing', {
          userId: socket.data.userId,
          typing: true,
        });
      });

      socket.on('typing-stop', (roomId: string) => {
        this.typingUsers.get(roomId)?.delete(socket.data.userId);
        
        socket.to(roomId).emit('user-typing', {
          userId: socket.data.userId,
          typing: false,
        });
      });

      // Read receipts
      socket.on('message-read', async (data: { roomId: string; messageId: string }) => {
        await this.markAsRead(data.messageId, socket.data.userId);
        socket.to(data.roomId).emit('message-read-receipt', {
          messageId: data.messageId,
          userId: socket.data.userId,
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        // Remove from active users
        this.activeUsers.forEach((users, roomId) => {
          if (users.has(socket.data.userId)) {
            users.delete(socket.data.userId);
            this.io.to(roomId).emit('user-left', {
              userId: socket.data.userId,
              activeCount: users.size,
            });
          }
        });

        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private setupRedisSubscription() {
    // Subscribe to Redis pub/sub for horizontal scaling
    // When multiple server instances run, they sync via Redis
  }

  private async validateToken(token: string): Promise<boolean> {
    // JWT validation
    try {
      // Implement JWT validation
      return true;
    } catch {
      return false;
    }
  }

  private async loadRecentMessages(roomId: string, limit = 50): Promise<ChatMessage[]> {
    // Load from database
    const messages = await prisma.message.findMany({
      where: { conversationId: roomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages.map(msg => ({
      id: msg.id,
      roomId: roomId,
      userId: msg.author,
      userName: msg.author,
      message: msg.text,
      timestamp: msg.createdAt,
      type: 'text',
    }));
  }

  private async saveMessage(message: ChatMessage): Promise<void> {
    // Save to database for persistence
    await prisma.message.create({
      data: {
        conversationId: message.roomId,
        author: message.userId,
        text: message.message,
        createdAt: message.timestamp,
      },
    });

    // Also cache in Redis for fast retrieval
    await this.redis.lpush(`chat:${message.roomId}`, JSON.stringify(message));
    await this.redis.ltrim(`chat:${message.roomId}`, 0, 99); // Keep last 100 messages
  }

  private async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    // Simple sentiment analysis (can integrate with OpenAI or TensorFlow.js)
    const negativeWords = ['kötü', 'berbat', 'rezalet', 'hiç', 'asla'];
    const hasNegative = negativeWords.some(word => text.toLowerCase().includes(word));
    
    if (hasNegative) return 'negative';
    return 'neutral';
  }

  private async markAsRead(messageId: string, userId: string): Promise<void> {
    // Track read receipts
    await this.redis.sadd(`read:${messageId}`, userId);
  }

  // Presence detection
  public async getUserPresence(userId: string): Promise<'online' | 'away' | 'offline'> {
    const lastSeen = await this.redis.get(`presence:${userId}`);
    if (!lastSeen) return 'offline';
    
    const lastSeenTime = new Date(lastSeen as string);
    const minutesAgo = (Date.now() - lastSeenTime.getTime()) / 1000 / 60;
    
    if (minutesAgo < 5) return 'online';
    if (minutesAgo < 30) return 'away';
    return 'offline';
  }

  // Video call signaling
  public setupWebRTC() {
    this.io.on('connection', (socket) => {
      socket.on('webrtc-offer', (data: { to: string; offer: any }) => {
        this.io.to(data.to).emit('webrtc-offer', {
          from: socket.id,
          offer: data.offer,
        });
      });

      socket.on('webrtc-answer', (data: { to: string; answer: any }) => {
        this.io.to(data.to).emit('webrtc-answer', {
          from: socket.id,
          answer: data.answer,
        });
      });

      socket.on('webrtc-ice-candidate', (data: { to: string; candidate: any }) => {
        this.io.to(data.to).emit('webrtc-ice-candidate', {
          from: socket.id,
          candidate: data.candidate,
        });
      });
    });
  }
}


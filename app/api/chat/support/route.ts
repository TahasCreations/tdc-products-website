import { NextRequest, NextResponse } from 'next/server';
import { generateChatbotResponse, detectIntent, analyzeSentiment } from '@/lib/chatbot';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, userId } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Detect intent and sentiment
    const intent = detectIntent(message);
    const sentiment = analyzeSentiment(message);

    // Generate response
    const response = generateChatbotResponse(message);

    // Save chat message to database (optional)
    try {
      if (userId) {
        await prisma.chatMessage.create({
          data: {
            userId,
            message: message.trim(),
            response: response.reply,
            intent,
            sentiment,
            sessionId: sessionId || `guest-${Date.now()}`,
          },
        });
      }
    } catch (dbError) {
      // Log error but don't fail the request
      console.error('Failed to save chat message:', dbError);
    }

    // Check if needs human support (negative sentiment or multiple failed attempts)
    const needsHumanSupport = sentiment === 'negative' || intent === 'general';

    return NextResponse.json({
      reply: response.reply,
      suggestedActions: response.suggestedActions,
      intent,
      sentiment,
      needsHumanSupport,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat support error:', error);
    return NextResponse.json(
      { 
        reply: 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin veya canlı destek ekibimize ulaşın.',
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get chat history
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'userId or sessionId is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: userId
        ? { userId }
        : { sessionId: sessionId! },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}


export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Create or get chat room
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId, sellerId, influencerId, proposalMessage } = await req.json();

    // Check if room already exists
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        influencerId,
        sellerId,
      },
    });

    if (existingRoom) {
      return Response.json({ success: true, room: existingRoom });
    }

    // Create proposal first
    const proposal = await prisma.campaignProposal.create({
      data: {
        campaignId,
        sellerId,
        message: proposalMessage,
        status: 'pending',
      },
    });

    // Create chat room
    const room = await prisma.chatRoom.create({
      data: {
        influencerId,
        sellerId,
        status: 'active',
      },
    });

    // Update proposal with room ID
    await prisma.campaignProposal.update({
      where: { id: proposal.id },
      data: { chatRoomId: room.id },
    });

    // Create initial system message
    await prisma.chatMessage.create({
      data: {
        roomId: room.id,
        senderId: sellerId,
        senderType: 'SELLER',
        content: proposalMessage,
        messageType: 'text',
      },
    });

    return Response.json({ success: true, room });
  } catch (error) {
    console.error('Create room error:', error);
    return Response.json({ error: 'Failed to create room' }, { status: 500 });
  }
}

// Get user's chat rooms
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    const { searchParams } = new URL(req.url);
    const userType = searchParams.get('userType'); // SELLER or INFLUENCER
    const userId = searchParams.get('userId');

    let rooms;

    if (userType === 'SELLER') {
      rooms = await prisma.chatRoom.findMany({
        where: { sellerId: userId! },
        include: {
          influencer: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });
    } else {
      rooms = await prisma.chatRoom.findMany({
        where: { influencerId: userId! },
        include: {
          seller: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });
    }

    return Response.json({ success: true, rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    return Response.json({ error: 'Failed to get rooms' }, { status: 500 });
  }
}



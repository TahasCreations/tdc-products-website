import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ChatInterface from '@/components/partner/chat/ChatInterface';

export const dynamic = 'force-dynamic';

export default async function ChatRoomPage({ params }: { params: { roomId: string } }) {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/giris');
  }

  const user = session.user as any;

  // Get chat room with participants
  const room = await prisma.chatRoom.findUnique({
    where: { id: params.roomId },
    include: {
      influencer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      seller: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    redirect('/partner');
  }

  // Determine user type and other participant
  const isSeller = room.seller.userId === user.id;
  const isInfluencer = room.influencer.userId === user.id;
  const isAdmin = user.role === 'ADMIN';

  if (!isSeller && !isInfluencer && !isAdmin) {
    redirect('/403');
  }

  const currentUserType = isSeller ? 'SELLER' : isInfluencer ? 'INFLUENCER' : 'ADMIN';
  const otherParticipant = isSeller ? room.influencer.user : room.seller.user;

  return (
    <div className="h-[calc(100vh-5rem)]">
      <ChatInterface
        roomId={room.id}
        currentUserId={user.id}
        currentUserType={currentUserType}
        otherParticipant={otherParticipant}
        isAdmin={isAdmin}
      />
    </div>
  );
}



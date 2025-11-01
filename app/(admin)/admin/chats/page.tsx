import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminChatMonitor from '@/components/admin/AdminChatMonitor';

export const dynamic = 'force-dynamic';

export default async function AdminChatsPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/giris');
  }

  const user = session.user as any;
  
  if (user.role !== 'ADMIN') {
    redirect('/403');
  }

  // Get all chat rooms with details
  const rooms = await prisma.chatRoom.findMany({
    include: {
      influencer: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      seller: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
  });

  const flaggedCount = rooms.filter(room => room.isFlagged).length;
  const activeCount = rooms.filter(room => room.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Chat İzleme Paneli
        </h1>
        <p className="text-gray-600">
          Tüm influencer-satıcı sohbetlerini izleyin ve yönetin
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <p className="text-sm text-gray-600 mb-1">Toplam Sohbet</p>
          <p className="text-3xl font-black text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <p className="text-sm text-gray-600 mb-1">Aktif Sohbet</p>
          <p className="text-3xl font-black text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <p className="text-sm text-gray-600 mb-1">Flaglenen</p>
          <p className="text-3xl font-black text-red-600">{flaggedCount}</p>
        </div>
      </div>

      <AdminChatMonitor rooms={rooms} />
    </div>
  );
}



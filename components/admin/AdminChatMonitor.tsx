"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Flag, Eye, MessageSquare, Clock,
  AlertTriangle, CheckCircle2, X, Save
} from 'lucide-react';
import Link from 'next/link';

interface Room {
  id: string;
  status: string;
  isFlagged: boolean;
  flagReason: string | null;
  adminNotes: string | null;
  lastMessageAt: Date | null;
  influencer: {
    user: {
      name: string;
      email: string;
    };
  };
  seller: {
    user: {
      name: string;
      email: string;
    };
  };
  messages: any[];
  _count: {
    messages: number;
  };
}

export default function AdminChatMonitor({ rooms: initialRooms }: { rooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [filter, setFilter] = useState<'all' | 'active' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [flagReason, setFlagReason] = useState('');

  const filteredRooms = rooms.filter(room => {
    // Filter by status
    if (filter === 'flagged' && !room.isFlagged) return false;
    if (filter === 'active' && room.status !== 'active') return false;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        room.influencer.user.name.toLowerCase().includes(query) ||
        room.seller.user.name.toLowerCase().includes(query) ||
        room.influencer.user.email.toLowerCase().includes(query) ||
        room.seller.user.email.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleFlagRoom = async (roomId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/chats/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, reason }),
      });

      if (response.ok) {
        setRooms(prev =>
          prev.map(room =>
            room.id === roomId
              ? { ...room, isFlagged: true, flagReason: reason }
              : room
          )
        );
        setFlagReason('');
      }
    } catch (error) {
      console.error('Flag error:', error);
    }
  };

  const handleSaveNotes = async (roomId: string, notes: string) => {
    try {
      const response = await fetch('/api/admin/chats/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, notes }),
      });

      if (response.ok) {
        setRooms(prev =>
          prev.map(room =>
            room.id === roomId ? { ...room, adminNotes: notes } : room
          )
        );
        alert('Notlar kaydedildi');
      }
    } catch (error) {
      console.error('Save notes error:', error);
    }
  };

  const handleCloseChat = async (roomId: string) => {
    if (!confirm('Sohbeti kapatmak istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/admin/chats/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });

      if (response.ok) {
        setRooms(prev =>
          prev.map(room =>
            room.id === roomId ? { ...room, status: 'closed' } : room
          )
        );
      }
    } catch (error) {
      console.error('Close chat error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kullanıcı ara..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({rooms.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                filter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                filter === 'flagged'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Flaglenen
            </button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-3">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
            <p className="text-gray-600">Sohbet bulunamadı</p>
          </div>
        ) : (
          filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all ${
                room.isFlagged ? 'border-red-200 bg-red-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-gray-900">
                      {room.seller.user.name} ↔ {room.influencer.user.name}
                    </h3>
                    {room.isFlagged && (
                      <Flag className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Satıcı: {room.seller.user.email}</span>
                    <span>Influencer: {room.influencer.user.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {room.status}
                  </span>
                </div>
              </div>

              {/* Last Message */}
              {room.messages[0] && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {room.messages[0].content}
                  </p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {room.lastMessageAt
                        ? new Date(room.lastMessageAt).toLocaleString('tr-TR')
                        : 'Mesaj yok'}
                    </span>
                  </div>
                </div>
              )}

              {/* Flag Reason */}
              {room.isFlagged && room.flagReason && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900">Flag Nedeni:</p>
                      <p className="text-sm text-red-700">{room.flagReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link
                  href={`/partner/chat/${room.id}`}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Sohbeti Görüntüle</span>
                </Link>

                {!room.isFlagged && (
                  <button
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowDetails(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold flex items-center space-x-2"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Flag</span>
                  </button>
                )}

                {room.status === 'active' && (
                  <button
                    onClick={() => handleCloseChat(room.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold"
                  >
                    Kapat
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{room._count.messages} mesaj</span>
                </div>
                {room.adminNotes && (
                  <span className="text-xs text-green-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Not var</span>
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Flag Modal */}
      {showDetails && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sohbet Yönetimi</h2>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRoom(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flag Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Flag Nedeni
              </label>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 outline-none transition-all"
                placeholder="Spam, Uygunsuz içerik, vs..."
              />
              <button
                onClick={() => {
                  if (flagReason.trim()) {
                    handleFlagRoom(selectedRoom.id, flagReason);
                    setShowDetails(false);
                  }
                }}
                className="mt-2 w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
              >
                Flag Et
              </button>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Notları
              </label>
              <textarea
                value={adminNotes || selectedRoom.adminNotes || ''}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all"
                placeholder="İç notlar..."
              />
              <button
                onClick={() => {
                  handleSaveNotes(selectedRoom.id, adminNotes || selectedRoom.adminNotes || '');
                }}
                className="mt-2 w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Notları Kaydet</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}



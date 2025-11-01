"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Paperclip, Smile, MoreVertical, Edit2, Trash2,
  Check, CheckCheck, Clock
} from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: string;
  createdAt: string;
  isEdited: boolean;
  editedAt: string | null;
  isRead: boolean;
  messageType: string;
}

interface ChatInterfaceProps {
  roomId: string;
  currentUserId: string;
  currentUserType: string;
  otherParticipant: {
    id: string;
    name: string;
    image: string | null;
  };
  isAdmin: boolean;
}

export default function ChatInterface({
  roomId,
  currentUserId,
  currentUserType,
  otherParticipant,
  isAdmin,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Polling for new messages (every 3 seconds)
  useEffect(() => {
    loadMessages();
    
    const interval = setInterval(() => {
      pollNewMessages();
    }, 3000); // 3 saniye

    return () => clearInterval(interval);
  }, [roomId]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const pollNewMessages = async () => {
    if (messages.length === 0) return;

    const lastMessageTime = messages[messages.length - 1].createdAt;

    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}&since=${lastMessageTime}`);
      const data = await response.json();
      
      if (data.success && data.messages.length > 0) {
        setMessages(prev => [...prev, ...data.messages]);
      }
    } catch (error) {
      console.error('Poll messages error:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          content: newMessage,
          senderId: currentUserId,
          senderType: currentUserType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = async (messageId: string, content: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev =>
          prev.map(msg => (msg.id === messageId ? data.message : msg))
        );
        setEditingMessageId(null);
        setEditContent('');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Edit message error:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Delete message error:', error);
    }
  };

  const canEditMessage = (message: Message) => {
    if (message.senderId !== currentUserId && !isAdmin) return false;

    const now = new Date();
    const createdAt = new Date(message.createdAt);
    const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    return diffMinutes <= 15;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {otherParticipant.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{otherParticipant.name}</h2>
            <p className="text-xs text-gray-600">
              {currentUserType === 'SELLER' ? 'Influencer' : 'Satıcı'}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-white rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === currentUserId}
            canEdit={canEditMessage(message)}
            onEdit={(content) => {
              setEditingMessageId(message.id);
              setEditContent(content);
            }}
            onDelete={() => handleDeleteMessage(message.id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Edit Mode */}
      {editingMessageId && (
        <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-yellow-800">Mesajı Düzenle</span>
            <button
              onClick={() => {
                setEditingMessageId(null);
                setEditContent('');
              }}
              className="text-xs text-yellow-600 hover:text-yellow-800"
            >
              İptal
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border-2 border-yellow-300 outline-none"
              autoFocus
            />
            <button
              onClick={() => handleEditMessage(editingMessageId, editContent)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="px-6 py-4 border-t">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}



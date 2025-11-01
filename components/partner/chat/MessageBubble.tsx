"use client";

import { Edit2, Trash2, Check, CheckCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    createdAt: string;
    isEdited: boolean;
    editedAt: string | null;
    isRead: boolean;
    senderType: string;
  };
  isOwnMessage: boolean;
  canEdit: boolean;
  onEdit: (content: string) => void;
  onDelete: () => void;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  canEdit,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getEditTimeLeft = () => {
    const now = new Date();
    const createdAt = new Date(message.createdAt);
    const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
    const timeLeft = Math.max(0, 15 - diffMinutes);
    return Math.floor(timeLeft);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            isOwnMessage
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
          
          <div className="flex items-center justify-between mt-1 space-x-2">
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${isOwnMessage ? 'text-white/80' : 'text-gray-500'}`}>
                {formatTime(message.createdAt)}
              </span>
              
              {message.isEdited && (
                <span className={`text-xs ${isOwnMessage ? 'text-white/70' : 'text-gray-400'}`}>
                  (düzenlendi)
                </span>
              )}
            </div>

            {isOwnMessage && (
              <div>
                {message.isRead ? (
                  <CheckCheck className="w-4 h-4 text-blue-300" />
                ) : (
                  <Check className="w-4 h-4 text-white/60" />
                )}
              </div>
            )}
          </div>

          {/* Edit/Delete buttons */}
          {isOwnMessage && canEdit && (
            <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-1 bg-white rounded-lg shadow-lg p-1">
                <button
                  onClick={() => onEdit(message.content)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  title={`${getEditTimeLeft()} dakika kaldı`}
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit timer indicator */}
        {isOwnMessage && canEdit && (
          <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{getEditTimeLeft()} dk düzenleme hakkı</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}



"use client";

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  author: string;
  text: string;
  attachments: string[];
  createdAt: string;
}

interface ThreadProps {
  collabId: string;
}

export default function Thread({ collabId }: ThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [collabId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/thread?collabId=${collabId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collabId,
          text: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Mesajları yenile
      } else {
        alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAuthorColor = (author: string) => {
    switch (author) {
      case 'SELLER': return 'bg-blue-100 text-blue-800';
      case 'INFLUENCER': return 'bg-green-100 text-green-800';
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuthorLabel = (author: string) => {
    switch (author) {
      case 'SELLER': return 'Satıcı';
      case 'INFLUENCER': return 'Influencer';
      case 'ADMIN': return 'Admin';
      default: return author;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 border border-gray-200 rounded-lg">
      {/* Mesaj Listesi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Henüz mesaj yok. İlk mesajı siz gönderin!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAuthorColor(message.author)}`}>
                  {getAuthorLabel(message.author)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-900">{message.text}</p>
                {message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-700 block"
                      >
                        📎 Ek dosya {index + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mesaj Gönderme Formu */}
      <form onSubmit={sendMessage} className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </form>
    </div>
  );
}

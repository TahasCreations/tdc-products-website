"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Paperclip, User, Bot, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'ai' | 'agent';
  timestamp: Date;
  avatar?: string;
  attachments?: string[];
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! 👋 Ben AI asistanınızım. Size nasıl yardımcı olabilirim?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isHumanAgent, setIsHumanAgent] = useState(false);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (isHumanAgent && ticketId) {
        // Send to human agent (ticket system)
        const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content: inputValue,
            senderType: 'user'
          }),
        });

        const data = await response.json();
        
        // Show "Agent is typing..." and wait for real response
        // In production, use WebSocket for real-time
        setTimeout(() => {
          const agentMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'Mesajınız alındı. Bir temsilcimiz en kısa sürede yanıt verecek.',
            sender: 'agent',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, agentMessage]);
          setIsTyping(false);
        }, 1500);
      } else {
        // Send to AI bot
        const response = await fetch('/api/chat/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: inputValue,
            sessionId,
          }),
        });

        const data = await response.json();
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.response || 'Üzgünüm, anlayamadım. Lütfen tekrar dener misiniz?',
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
          
          // Check if needs human support
          if (data.needsHumanSupport) {
            setTimeout(() => {
              const escalationMessage: Message = {
                id: (Date.now() + 2).toString(),
                text: '🎧 Bu konuda bir temsilcimiz size daha iyi yardımcı olabilir. İnsan desteğine bağlanmak ister misiniz?',
                sender: 'ai',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, escalationMessage]);
            }, 1000);
          }
          
          setIsTyping(false);
        }, 1200);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setIsTyping(false);
    }
  };

  const handleEscalateToHuman = async () => {
    try {
      const response = await fetch('/api/support/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: messages[messages.length - 1]?.text || 'Destek talebi',
          intent: 'human_support',
          sentiment: 'neutral'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTicketId(data.ticket.id);
        setIsHumanAgent(true);
        
        const systemMessage: Message = {
          id: (Date.now() + 3).toString(),
          text: `✅ ${data.message}\n\nTicket No: ${data.ticket.ticketNumber}\n\nBir temsilcimiz en kısa sürede size dönüş yapacak.`,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    } catch (error) {
      console.error('Escalation error:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ticketId', ticketId || '');

      const response = await fetch('/api/support/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const fileMessage: Message = {
          id: Date.now().toString(),
          text: `📎 Dosya gönderildi: ${file.name}`,
          sender: 'user',
          timestamp: new Date(),
          attachments: [data.url]
        };
        setMessages(prev => [...prev, fileMessage]);
      }
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const QUICK_ACTIONS = [
    { text: '📦 Sipariş Durumu', action: 'Sipariş durumu nasıl öğrenirim?' },
    { text: '↩️ İade İşlemi', action: 'İade işlemi nasıl yapılır?' },
    { text: '💳 Ödeme Sorunu', action: 'Ödeme yaparken sorun yaşıyorum' },
    { text: '🎧 Temsilci Bağla', action: 'escalate' },
  ];

  const handleQuickAction = (action: string) => {
    if (action === 'escalate') {
      handleEscalateToHuman();
    } else {
      setInputValue(action);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all group"
          >
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
            
            {/* Unread badge */}
            {messages.filter(m => m.sender !== 'user').length > 1 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {messages.filter(m => m.sender !== 'user').length - 1}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    {isHumanAgent ? (
                      <User className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <Bot className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="font-semibold">
                    {isHumanAgent ? (agentInfo?.name || 'Destek Temsilcisi') : 'AI Asistan'}
                  </div>
                  <div className="text-xs opacity-90">
                    {isHumanAgent ? 'Canlı Destek' : 'Çevrimiçi • Hızlı yanıt'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ticket Info (if escalated) */}
            {ticketId && (
              <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-800">
                  Ticket açıldı • Bir temsilci en kısa sürede yanıt verecek
                </span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : message.sender === 'agent'
                          ? 'bg-white border-2 border-green-200'
                          : 'bg-white border-2 border-gray-200'
                      }`}
                    >
                      {message.sender !== 'user' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            message.sender === 'agent' ? 'bg-green-100' : 'bg-indigo-100'
                          }`}>
                            {message.sender === 'agent' ? (
                              <User className="w-4 h-4 text-green-600" />
                            ) : (
                              <Bot className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {message.sender === 'agent' ? 'Destek Temsilcisi' : 'AI Asistan'}
                          </span>
                        </div>
                      )}
                      <p className={`text-sm whitespace-pre-line ${
                        message.sender === 'user' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {message.text}
                      </p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs underline"
                            >
                              📎 Ek dosya {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {!isHumanAgent && messages.length < 3 && (
              <div className="px-4 py-2 border-t bg-white">
                <p className="text-xs text-gray-600 mb-2">Hızlı Eylemler:</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      className="px-3 py-2 text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors text-left font-medium"
                    >
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Dosya ekle"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={uploading ? 'Dosya yükleniyor...' : 'Mesajınızı yazın...'}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || uploading}
                  className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t text-center">
              <p className="text-xs text-gray-500">
                {isHumanAgent ? (
                  <>🎧 Canlı destek aktif</>
                ) : (
                  <>🤖 AI destekli • <button onClick={handleEscalateToHuman} className="text-indigo-600 hover:underline">Temsilciye bağlan</button></>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

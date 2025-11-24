"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Clock, User, Tag, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  assignedTo?: string;
  assignedAgent?: {
    name: string;
    email: string;
  };
  userId?: string;
  user?: {
    name: string;
    email: string;
  };
  messageCount: number;
  lastMessage?: string;
  rating?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export default function TicketsManagementPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, selectedPriority, selectedCategory, search]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/support/tickets?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Ticket yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedTicket(data.ticket);
        setTicketMessages(data.ticket.messages || []);
      }
    } catch (error) {
      console.error('Ticket detay hatası:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const response = await fetch(`/api/admin/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setReplyMessage('');
        fetchTicketDetails(selectedTicket.id);
        fetchTickets();
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('Mesaj gönderilemedi');
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTickets();
        if (selectedTicket?.id === ticketId) {
          fetchTicketDetails(ticketId);
        }
      }
    } catch (error) {
      console.error('Status güncelleme hatası:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'WAITING_CUSTOMER': return 'bg-orange-100 text-orange-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    const categories: Record<string, string> = {
      order: 'Sipariş',
      product: 'Ürün',
      payment: 'Ödeme',
      technical: 'Teknik',
      other: 'Diğer',
    };
    return categories[category] || category;
  };

  const stats = {
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    waiting: tickets.filter(t => t.status === 'WAITING_CUSTOMER').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Destek Ticket Yönetimi</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-lg font-semibold text-blue-600">{stats.open}</div>
          <div className="text-sm text-gray-600">Açık</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-lg font-semibold text-yellow-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">İşlemde</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-lg font-semibold text-orange-600">{stats.waiting}</div>
          <div className="text-sm text-gray-600">Müşteri Bekliyor</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-lg font-semibold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Çözüldü</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ticket numarası veya konu ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="OPEN">Açık</option>
            <option value="IN_PROGRESS">İşlemde</option>
            <option value="WAITING_CUSTOMER">Müşteri Bekliyor</option>
            <option value="RESOLVED">Çözüldü</option>
            <option value="CLOSED">Kapalı</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="URGENT">Acil</option>
            <option value="HIGH">Yüksek</option>
            <option value="MEDIUM">Orta</option>
            <option value="LOW">Düşük</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="order">Sipariş</option>
            <option value="product">Ürün</option>
            <option value="payment">Ödeme</option>
            <option value="technical">Teknik</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Ticket'lar ({tickets.length})</h2>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Ticket bulunamadı</div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => fetchTicketDetails(ticket.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-sm text-gray-600">{ticket.ticketNumber}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                      <p className="text-sm text-gray-500 mt-1">{ticket.lastMessage || 'Mesaj yok'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{getCategoryText(ticket.category)}</span>
                      <span className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {ticket.messageCount}
                      </span>
                      {ticket.user && (
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {ticket.user.name}
                        </span>
                      )}
                    </div>
                    <span>{new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="bg-white rounded-lg border">
          {selectedTicket ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">{selectedTicket.ticketNumber}</h2>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    <option value="OPEN">Açık</option>
                    <option value="IN_PROGRESS">İşlemde</option>
                    <option value="WAITING_CUSTOMER">Müşteri Bekliyor</option>
                    <option value="RESOLVED">Çözüldü</option>
                    <option value="CLOSED">Kapalı</option>
                  </select>
                </div>
                <p className="text-sm text-gray-600">{selectedTicket.subject}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {ticketMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.senderType === 'user'
                        ? 'bg-gray-100 ml-0'
                        : msg.senderType === 'admin_internal'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-indigo-100 mr-0'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {msg.senderType === 'user' ? 'Müşteri' : msg.senderType === 'admin_internal' ? 'İç Not' : 'Admin'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleReply()}
                    placeholder="Yanıt yazın..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyMessage.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gönder</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Bir ticket seçin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

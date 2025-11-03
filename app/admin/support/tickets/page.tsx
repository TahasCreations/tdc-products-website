'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  assignedTo?: string;
  user?: {
    name: string;
    email: string;
  };
  messages: Array<{
    content: string;
    senderType: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function TicketsManagementPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, selectedPriority]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Mock data - gerçekte API'den gelecek
      setTickets([]);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      OPEN: { label: 'Açık', color: 'bg-blue-100 text-blue-800' },
      IN_PROGRESS: { label: 'İşlemde', color: 'bg-yellow-100 text-yellow-800' },
      WAITING_CUSTOMER: { label: 'Müşteri Bekliyor', color: 'bg-purple-100 text-purple-800' },
      RESOLVED: { label: 'Çözüldü', color: 'bg-green-100 text-green-800' },
      CLOSED: { label: 'Kapalı', color: 'bg-gray-100 text-gray-800' }
    };
    
    const { label, color } = config[status] || config.OPEN;
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { label: string; color: string; icon: string }> = {
      LOW: { label: 'Düşük', color: 'text-gray-600', icon: '⬇️' },
      MEDIUM: { label: 'Orta', color: 'text-blue-600', icon: '➖' },
      HIGH: { label: 'Yüksek', color: 'text-orange-600', icon: '⬆️' },
      URGENT: { label: 'Acil', color: 'text-red-600', icon: '🚨' }
    };
    
    const { label, color, icon } = config[priority] || config.MEDIUM;
    return <span className={`text-sm font-medium ${color}`}>{icon} {label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Destek Ticket'ları</h1>
          <p className="text-gray-600">Müşteri destek taleplerini yönetin</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Açık Ticket', value: tickets.filter(t => t.status === 'OPEN').length, color: 'from-blue-500 to-cyan-500' },
            { label: 'İşlemde', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'from-yellow-500 to-orange-500' },
            { label: 'Müşteri Bekliyor', value: tickets.filter(t => t.status === 'WAITING_CUSTOMER').length, color: 'from-purple-500 to-pink-500' },
            { label: 'Çözüldü', value: tickets.filter(t => t.status === 'RESOLVED').length, color: 'from-green-500 to-emerald-500' },
            { label: 'Toplam', value: tickets.length, color: 'from-gray-500 to-gray-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center space-x-4">
          <div className="flex-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="OPEN">Açık</option>
              <option value="IN_PROGRESS">İşlemde</option>
              <option value="WAITING_CUSTOMER">Müşteri Bekliyor</option>
              <option value="RESOLVED">Çözüldü</option>
              <option value="CLOSED">Kapalı</option>
            </select>
          </div>
          <div className="flex-1">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="URGENT">🚨 Acil</option>
              <option value="HIGH">⬆️ Yüksek</option>
              <option value="MEDIUM">➖ Orta</option>
              <option value="LOW">⬇️ Düşük</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Ticket Yok</h3>
            <p className="text-gray-600">Müşteriler destek talebi oluşturduğunda burada görünecek</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Konu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Öncelik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-medium text-indigo-600">
                        {ticket.ticketNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ticket.user?.name || 'Misafir'}</div>
                      <div className="text-xs text-gray-500">{ticket.user?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{ticket.subject}</div>
                      <div className="text-xs text-gray-500">{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                      >
                        Görüntüle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  customer: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignedAgent: {
    id: string;
    name: string;
    email: string;
  } | null;
  messageCount: number;
  lastMessage: {
    content: string;
    senderType: string;
    createdAt: string;
  } | null;
  tags: string[];
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

interface TicketStats {
  open: number;
  inProgress: number;
  waitingCustomer: number;
  resolved: number;
  closed: number;
  total: number;
}

export default function SellerSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    open: 0,
    inProgress: 0,
    waitingCustomer: 0,
    resolved: 0,
    closed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (priorityFilter !== 'all') {
        params.append('priority', priorityFilter);
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      
      const response = await fetch(`/api/seller/support-tickets?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.tickets);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Destek talepleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'WAITING_CUSTOMER': return 'bg-purple-100 text-purple-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      OPEN: 'Açık',
      IN_PROGRESS: 'İşleniyor',
      WAITING_CUSTOMER: 'Müşteri Bekleniyor',
      RESOLVED: 'Çözüldü',
      CLOSED: 'Kapatıldı',
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      URGENT: 'Acil',
      HIGH: 'Yüksek',
      MEDIUM: 'Orta',
      LOW: 'Düşük',
    };
    return labels[priority] || priority;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      order: 'Sipariş',
      product: 'Ürün',
      payment: 'Ödeme',
      technical: 'Teknik',
      other: 'Diğer',
    };
    return labels[category] || category;
  };

  const filteredTickets = tickets.filter(t => {
    if (searchTerm) {
      return (
        t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.customer && t.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Destek Talepleri</h1>
          <p className="text-gray-600">Satıcıya ait destek taleplerini görüntüleyin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Açık</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">İşleniyor</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Çözüldü</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ticket no, konu veya müşteri adı ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="OPEN">Açık</option>
                <option value="IN_PROGRESS">İşleniyor</option>
                <option value="WAITING_CUSTOMER">Müşteri Bekleniyor</option>
                <option value="RESOLVED">Çözüldü</option>
                <option value="CLOSED">Kapatıldı</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tüm Öncelikler</option>
                <option value="URGENT">Acil</option>
                <option value="HIGH">Yüksek</option>
                <option value="MEDIUM">Orta</option>
                <option value="LOW">Düşük</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Destek talebi bulunamadı</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.ticketNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ticket.subject}</div>
                      <div className="text-sm text-gray-500">
                        {getCategoryLabel(ticket.category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.customer ? (
                        <>
                          <div className="text-sm text-gray-900">{ticket.customer.name}</div>
                          <div className="text-sm text-gray-500">{ticket.customer.email}</div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Misafir</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityLabel(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Destek Talebi Detayı</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ticket No</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedTicket.ticketNumber}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Konu</h3>
                  <p className="text-gray-900">{selectedTicket.subject}</p>
                </div>

                {selectedTicket.customer && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Müşteri</h3>
                    <p className="text-gray-900">{selectedTicket.customer.name}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.customer.email}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusLabel(selectedTicket.status)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Öncelik</h3>
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {getPriorityLabel(selectedTicket.priority)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Kategori</h3>
                  <p className="text-gray-900">{getCategoryLabel(selectedTicket.category)}</p>
                </div>

                {selectedTicket.assignedAgent && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Atanan Ajan</h3>
                    <p className="text-gray-900">{selectedTicket.assignedAgent.name}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.assignedAgent.email}</p>
                  </div>
                )}

                {selectedTicket.lastMessage && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Son Mesaj</h3>
                    <p className="text-gray-900">{selectedTicket.lastMessage.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(selectedTicket.lastMessage.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mesaj Sayısı</h3>
                  <p className="text-gray-900">{selectedTicket.messageCount}</p>
                </div>

                {selectedTicket.rating && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Değerlendirme</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < selectedTicket.rating! ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</h3>
                  <p className="text-gray-900">
                    {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}


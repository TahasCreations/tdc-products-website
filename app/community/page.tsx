"use client";

// Client components are dynamic by default

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Image as ImageIcon, Calendar, TrendingUp, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';

const TABS = ['Forum', 'Galeri', 'Etkinlikler'];

const FORUM_TOPICS = [
  { id: '1', title: 'En sevdiğiniz anime figürü?', author: 'Ahmet Y.', replies: 42, likes: 18, category: 'Genel' },
  { id: '2', title: 'Figür temizleme ipuçları', author: 'Elif K.', replies: 28, likes: 35, category: 'Rehber' },
  { id: '3', title: 'Yeni çıkan limited edition hakkında', author: 'Mehmet S.', replies: 15, likes: 22, category: 'Tartışma' },
];

const GALLERY_ITEMS = [
  { id: '1', user: 'Collector123', image: '/images/gallery-1.jpg', likes: 156, comments: 12, title: 'Benim koleksiyonum' },
  { id: '2', user: 'AnimeFan', image: '/images/gallery-2.jpg', likes: 203, comments: 24, title: 'Yeni aldığım figürler' },
  { id: '3', user: 'FigureKing', image: '/images/gallery-3.jpg', likes: 89, comments: 8, title: 'Display setup' },
];

const EVENTS = [
  { id: '1', title: 'Anime & Manga Festivali', date: '15 Aralık 2024', location: 'İstanbul', attendees: 234 },
  { id: '2', title: 'Figür Takas Etkinliği', date: '22 Aralık 2024', location: 'Ankara', attendees: 89 },
  { id: '3', title: 'Collector Meetup', date: '5 Ocak 2025', location: 'İzmir', attendees: 156 },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Forum');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Topluluk
          </h1>
          <p className="text-lg text-gray-600">
            Koleksiyoncularla tanışın, deneyimlerinizi paylaşın
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {activeTab === 'Forum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tartışmalar</h2>
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                  Yeni Konu Aç
                </button>
              </div>

              {FORUM_TOPICS.map((topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border-2 border-gray-100 rounded-xl hover:border-indigo-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                          {topic.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Yazan: <span className="font-semibold">{topic.author}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{topic.replies}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{topic.likes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'Galeri' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Koleksiyon Galerisi</h2>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                  Fotoğraf Ekle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {GALLERY_ITEMS.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-24 h-24 text-gray-300" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-semibold">{item.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{item.user}</span>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{item.comments}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Etkinlikler' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Yaklaşan Etkinlikler</h2>
                <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                  Etkinlik Oluştur
                </button>
              </div>

              {EVENTS.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 border-2 border-gray-100 rounded-xl hover:border-pink-200 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📅 {event.date}</p>
                          <p>📍 {event.location}</p>
                          <p className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} kişi katılıyor</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors">
                      Katıl
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">2,547</p>
            <p className="text-gray-600">Aktif Üye</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
            <p className="text-gray-600">Tartışma</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">8,912</p>
            <p className="text-gray-600">Galeri Fotoğrafı</p>
          </div>
        </div>
      </div>
    </div>
  );
}


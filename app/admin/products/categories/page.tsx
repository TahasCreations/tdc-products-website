'use client';

import { motion } from 'framer-motion';

export default function ProductCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategori Yönetimi</h1>
          <p className="text-gray-600">Ürün kategorilerini yönetin</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 text-2xl">📂</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Kategori Yönetimi</h2>
            <p className="text-gray-600">Bu sayfa yakında aktif olacak</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RotateCcw, Eye, Download, Trash2 } from 'lucide-react';
import { PageData } from '@/lib/site-builder/types';

interface Version {
  id: string;
  pageId: string;
  version: number;
  components: string;
  rootComponentIds: string;
  createdAt: string;
  createdBy?: string;
  note?: string;
}

interface VersionHistoryProps {
  pageId: string;
  onRestore: (version: Version) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ pageId, onRestore }) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, [pageId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/site-builder/pages/${pageId}/versions`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version: Version) => {
    if (!confirm(`v${version.version} sürümüne geri dönmek istediğinizden emin misiniz?`)) return;
    onRestore(version);
  };

  const handleDelete = async (versionId: string) => {
    if (!confirm('Bu versiyonu silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/site-builder/versions/${versionId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchVersions();
      }
    } catch (error) {
      console.error('Error deleting version:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Version History
        </h3>
        <p className="text-xs text-gray-600 mt-1">{versions.length} kayıtlı versiyon</p>
      </div>

      {/* Versions List */}
      <div className="flex-1 overflow-y-auto">
        {versions.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Henüz kayıtlı versiyon yok</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {versions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-gray-900">v{version.version}</div>
                    <div className="text-xs text-gray-500">{formatDate(version.createdAt)}</div>
                  </div>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>

                {version.note && (
                  <p className="text-sm text-gray-600 mb-3">{version.note}</p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestore(version)}
                    disabled={index === 0}
                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Geri Dön
                  </button>
                  <button className="p-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(version.id)}
                    className="p-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Export All Versions
        </button>
      </div>
    </div>
  );
};


'use client';

import { useState, useEffect } from 'react';
import { 
  CloudIcon, 
  ComputerDesktopIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface SyncStatus {
  lastSync: string;
  localCount: number;
  cloudCount: number;
  pendingSync: number;
  syncErrors: string[];
}

interface HybridStatusProps {
  className?: string;
}

export default function HybridStatusIndicator({ className = '' }: HybridStatusProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isHybrid, setIsHybrid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchSyncStatus();
    // Her 30 saniyede bir sync durumunu kontrol et
    const interval = setInterval(fetchSyncStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/hybrid/sync');
      const data = await response.json();
      
      if (data.success) {
        setSyncStatus(data.data.syncStatus);
        setIsHybrid(data.data.capabilities.cloudStorage);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Sync status fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    try {
      const response = await fetch('/api/hybrid/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'force-sync' })
      });
      
      const data = await response.json();
      if (data.success) {
        setSyncStatus(data.syncStatus);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Force sync error:', error);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm">Yükleniyor...</span>
      </div>
    );
  }

  const getSyncStatusColor = () => {
    if (!syncStatus) return 'text-gray-500';
    if (syncStatus.syncErrors.length > 0) return 'text-red-500';
    if (syncStatus.pendingSync > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getSyncStatusIcon = () => {
    if (!syncStatus) return <ExclamationTriangleIcon className="h-4 w-4" />;
    if (syncStatus.syncErrors.length > 0) return <ExclamationTriangleIcon className="h-4 w-4" />;
    if (syncStatus.pendingSync > 0) return <ArrowPathIcon className="h-4 w-4 animate-spin" />;
    return <CheckCircleIcon className="h-4 w-4" />;
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Storage Mode Indicator */}
      <div className="flex items-center space-x-1">
        {isHybrid ? (
          <>
            <CloudIcon className="h-4 w-4 text-blue-500" />
            <ComputerDesktopIcon className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-600">Hibrit</span>
          </>
        ) : (
          <>
            <ComputerDesktopIcon className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-600">Local</span>
          </>
        )}
      </div>

      {/* Sync Status */}
      {isHybrid && syncStatus && (
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getSyncStatusColor()}`}>
            {getSyncStatusIcon()}
            <span className="text-xs">
              {syncStatus.syncErrors.length > 0 
                ? `${syncStatus.syncErrors.length} hata`
                : syncStatus.pendingSync > 0
                ? `${syncStatus.pendingSync} beklemede`
                : 'Senkron'
              }
            </span>
          </div>
          
          {/* Force Sync Button */}
          <button
            onClick={handleForceSync}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
            title="Manuel senkronizasyon"
          >
            Sync
          </button>
        </div>
      )}

      {/* Last Update Time */}
      <div className="text-xs text-gray-400">
        {lastUpdate.toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>

      {/* Sync Errors Tooltip */}
      {isHybrid && syncStatus && syncStatus.syncErrors.length > 0 && (
        <div className="relative group">
          <ExclamationTriangleIcon className="h-4 w-4 text-red-500 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-red-100 border border-red-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            <div className="text-xs text-red-800">
              <div className="font-semibold mb-1">Sync Hataları:</div>
              {syncStatus.syncErrors.slice(0, 3).map((error, index) => (
                <div key={index} className="mb-1">• {error}</div>
              ))}
              {syncStatus.syncErrors.length > 3 && (
                <div className="text-red-600">...ve {syncStatus.syncErrors.length - 3} hata daha</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

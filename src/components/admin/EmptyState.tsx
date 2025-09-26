import React from 'react';
import { 
  ExclamationTriangleIcon, 
  PlusIcon, 
  ArrowPathIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  type?: 'default' | 'error' | 'loading' | 'no-data';
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  products: ShoppingBagIcon,
  users: UserGroupIcon,
  orders: DocumentTextIcon,
  analytics: ChartBarIcon,
  settings: CogIcon,
  default: ExclamationTriangleIcon
};

export default function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  secondaryAction,
  type = 'no-data',
  size = 'md'
}: EmptyStateProps) {
  const IconComponent = Icon || iconMap.default;
  
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  };
  
  const iconSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };
  
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'text-red-400',
          title: 'text-red-900 dark:text-red-100',
          description: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20'
        };
      case 'loading':
        return {
          icon: 'text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          description: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case 'no-data':
        return {
          icon: 'text-gray-400',
          title: 'text-gray-900 dark:text-gray-100',
          description: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-800/50'
        };
      default:
        return {
          icon: 'text-gray-400',
          title: 'text-gray-900 dark:text-gray-100',
          description: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-800/50'
        };
    }
  };
  
  const styles = getTypeStyles();
  
  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} ${styles.bg} rounded-lg border border-gray-200 dark:border-gray-700`}>
      <div className={`${styles.icon} mb-4`}>
        {type === 'loading' ? (
          <ArrowPathIcon className={`${iconSizeClasses[size]} animate-spin`} />
        ) : (
          <IconComponent className={iconSizeClasses[size]} />
        )}
      </div>
      
      <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>
        {title}
      </h3>
      
      <p className={`text-sm ${styles.description} mb-6 max-w-md`}>
        {description}
      </p>
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {action.label}
            </button>
          )}
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Önceden tanımlanmış empty state'ler
export const EmptyStates = {
  Products: () => (
    <EmptyState
      title="Henüz ürün yok"
      description="Mağazanızda henüz ürün bulunmuyor. İlk ürününüzü ekleyerek başlayın."
      icon={iconMap.products}
      action={{
        label: "Ürün Ekle",
        onClick: () => console.log("Add product clicked")
      }}
    />
  ),
  
  Orders: () => (
    <EmptyState
      title="Henüz sipariş yok"
      description="Henüz hiç sipariş alınmamış. İlk siparişinizi bekleyin."
      icon={iconMap.orders}
      secondaryAction={{
        label: "Yenile",
        onClick: () => console.log("Refresh clicked")
      }}
    />
  ),
  
  Customers: () => (
    <EmptyState
      title="Henüz müşteri yok"
      description="Henüz hiç müşteri kaydı bulunmuyor. Müşterileriniz kayıt oldukça burada görünecek."
      icon={iconMap.users}
      secondaryAction={{
        label: "Yenile",
        onClick: () => console.log("Refresh clicked")
      }}
    />
  ),
  
  Analytics: () => (
    <EmptyState
      title="Analitik veri yok"
      description="Henüz yeterli veri toplanmamış. Ziyaretçileriniz siteyi kullandıkça analitik verileri burada görünecek."
      icon={iconMap.analytics}
      secondaryAction={{
        label: "Yenile",
        onClick: () => console.log("Refresh clicked")
      }}
    />
  ),
  
  Loading: ({ title = "Yükleniyor...", description = "Veriler getiriliyor, lütfen bekleyin." }) => (
    <EmptyState
      title={title}
      description={description}
      type="loading"
    />
  ),
  
  Error: ({ title = "Bir hata oluştu", description = "Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin." }) => (
    <EmptyState
      title={title}
      description={description}
      type="error"
      action={{
        label: "Tekrar Dene",
        onClick: () => console.log("Retry clicked")
      }}
    />
  )
};

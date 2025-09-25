'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CpuChipIcon,
  CubeIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  PlayIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  CubeTransparentIcon
} from '@heroicons/react/24/outline';

export default function ThreeDTechnologyPage() {
  const [activeTab, setActiveTab] = useState('fdm');

  const printerTypes = [
    {
      id: 'fdm',
      name: 'FDM (Fused Deposition Modeling)',
      description: 'En yaygın kullanılan 3D baskı teknolojisi',
      icon: <CubeIcon className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Düşük maliyet',
        'Kolay kullanım',
        'Geniş malzeme seçeneği',
        'Dayanıklı parçalar'
      ]
    },
    {
      id: 'sla',
      name: 'SLA (Stereolithography)',
      description: 'Yüksek detay ve pürüzsüz yüzeyler',
      icon: <BeakerIcon className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Mükemmel detay',
        'Pürüzsüz yüzeyler',
        'Hassas prototipleme',
        'Profesyonel kalite'
      ]
    }
  ];

  const printProcesses = [
    {
      step: 1,
      title: 'Tasarım',
      description: '3D model oluşturma ve optimizasyon',
      icon: <PaintBrushIcon className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Hazırlık',
      description: 'Yazıcı ayarları ve dilimleme',
      icon: <Cog6ToothIcon className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Baskı',
      description: 'Katman katman üretim süreci',
      icon: <CubeTransparentIcon className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Son İşlem',
      description: 'Temizleme ve kalite kontrolü',
      icon: <CheckBadgeIcon className="w-6 h-6" />
    }
  ];

  const printableItems = [
    {
      category: 'Figürler & Koleksiyon',
      items: ['Anime karakterleri', 'Oyun figürleri', 'Film karakterleri', 'Orjinal tasarımlar'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop&auto=format&q=80'
    },
    {
      category: 'Fonksiyonel Parçalar',
      items: ['Prototipler', 'Yedek parçalar', 'Ev eşyaları', 'Araç aksesuarları'],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop&auto=format&q=80'
    },
    {
      category: 'Sanat & Dekorasyon',
      items: ['Hediye eşyaları', 'Dekoratif objeler', 'Mücevher kalıpları', 'Sanat eserleri'],
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=300&fit=crop&auto=format&q=80'
    },
    {
      category: 'Eğitim & Araştırma',
      items: ['Eğitim modelleri', 'Bilimsel modeller', 'Tıbbi modeller', 'Mimari maketler'],
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=300&fit=crop&auto=format&q=80'
    }
  ];

  const services = [
    {
      title: 'Özel Tasarım',
      description: 'İstediğiniz tasarımı 3D model haline getiriyoruz',
      icon: <PaintBrushIcon className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
    {
      title: 'Yüksek Kalite Baskı',
      description: 'Profesyonel SLA ve FDM yazıcılarla premium kalite',
      icon: <CubeIcon className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    },
    {
      title: 'Hızlı Teslimat',
      description: '2-5 iş günü içinde kapınızda',
      icon: <SparklesIcon className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      title: 'Renkli Baskı',
      description: 'Çoklu renk ve malzeme seçenekleri',
      icon: <BeakerIcon className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-purple-500 to-violet-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1565024569933-9c8d6e3c8e1c?w=1920&h=1080&fit=crop&auto=format&q=80"
            alt="3D Printer Technology"
            fill
            className="object-cover opacity-20 transition-opacity duration-1000"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8 animate-pulse">
              <CpuChipIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              3D Yazıcı Teknolojisi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Geleceğin üretim teknolojisi ile hayal ettiğiniz her şeyi gerçeğe dönüştürün
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="flex items-center">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Nasıl Çalışır?
                </span>
              </button>
              <Link
                href="/products"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/20"
              >
                <span className="flex items-center">
                  Ürünleri İncele
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Yazıcı Türleri */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              3D Yazıcı Türleri
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı ihtiyaçlarınız için en uygun 3D baskı teknolojisini keşfedin
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-full p-2 flex space-x-2">
              {printerTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === type.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {type.icon}
                  <span>{type.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {printerTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-8 rounded-2xl transition-all duration-500 ${
                    activeTab === type.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl'
                      : 'bg-white border border-gray-200 shadow-lg'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center text-white`}>
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{type.name}</h3>
                      <p className="text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {type.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl overflow-hidden">
                <Image
                  src={activeTab === 'fdm' 
                    ? 'https://images.unsplash.com/photo-1565024569933-9c8d6e3c8e1c?w=800&h=600&fit=crop&auto=format&q=80'
                    : 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&auto=format&q=80'
                  }
                  alt={`${activeTab.toUpperCase()} 3D Yazıcı`}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-all duration-500"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">
                    {activeTab === 'fdm' ? 'FDM 3D Yazıcı' : 'SLA 3D Yazıcı'}
                  </h4>
                  <p className="text-blue-200">
                    {activeTab === 'fdm' 
                      ? 'Katman katman eritme teknolojisi'
                      : 'Lazer ile reçine sertleştirme'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Baskı Süreci */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              3D Baskı Süreci
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tasarımdan teslimata kadar olan sürecimizi keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {printProcesses.map((process, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white mb-6 mx-auto">
                    {process.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{process.step}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{process.title}</h3>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                </div>
                {index < printProcesses.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRightIcon className="w-8 h-8 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basılabilir Ürünler */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Neler Basabiliriz?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hayal gücünüzün sınırlarını zorlayan geniş ürün yelpazesi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {printableItems.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.category}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{category.category}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-700">
                        <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmetlerimiz */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Profesyonel 3D baskı hizmetleri ile ihtiyaçlarınızı karşılıyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-blue-100">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-8">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hayalinizdeki Ürünü Gerçeğe Dönüştürün
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            3D yazıcı teknolojimizle istediğiniz tasarımı hayata geçiriyoruz. Hemen başlayın!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                İletişime Geç
              </span>
            </Link>
            <Link
              href="/products"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/20"
            >
              <span className="flex items-center justify-center">
                Ürünleri İncele
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

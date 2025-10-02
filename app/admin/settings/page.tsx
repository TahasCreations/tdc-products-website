"use client";

import { useState } from 'react';

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState('general');

	const tabs = [
		{ key: 'general', label: 'Genel', icon: '⚙️' },
		{ key: 'payment', label: 'Ödeme', icon: '💳' },
		{ key: 'shipping', label: 'Kargo', icon: '🚚' },
		{ key: 'notifications', label: 'Bildirimler', icon: '🔔' },
		{ key: 'security', label: 'Güvenlik', icon: '🔒' },
		{ key: 'integrations', label: 'Entegrasyonlar', icon: '🔗' }
	];

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Değişiklikleri Kaydet
					</button>
					<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
						Sıfırla
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Sidebar */}
				<div className="lg:col-span-1">
					<nav className="space-y-1">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
									activeTab === tab.key
										? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
										: 'text-gray-700 hover:bg-gray-50'
								}`}
							>
								<span className="text-lg">{tab.icon}</span>
								<span className="font-medium">{tab.label}</span>
							</button>
						))}
					</nav>
				</div>

				{/* Content */}
				<div className="lg:col-span-3">
					{activeTab === 'general' && (
						<div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
							<h3 className="text-lg font-semibold">Genel Ayarlar</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Site Adı
									</label>
									<input
										type="text"
										defaultValue="TDC Market"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Site URL
									</label>
									<input
										type="url"
										defaultValue="https://tdcmarket.com"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Varsayılan Dil
									</label>
									<select className="w-full border rounded-lg px-3 py-2">
										<option>Türkçe</option>
										<option>English</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Para Birimi
									</label>
									<select className="w-full border rounded-lg px-3 py-2">
										<option>TRY (₺)</option>
										<option>USD ($)</option>
										<option>EUR (€)</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Site Açıklaması
								</label>
								<textarea
									rows={3}
									defaultValue="Özel figürlerden elektroniğe, tasarımdan ev yaşamına kadar her şey TDC Market'te."
									className="w-full border rounded-lg px-3 py-2"
								/>
							</div>
						</div>
					)}

					{activeTab === 'payment' && (
						<div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
							<h3 className="text-lg font-semibold">Ödeme Ayarları</h3>
							
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<span className="text-2xl">💳</span>
										<div>
											<div className="font-medium">Kredi Kartı</div>
											<div className="text-sm text-gray-500">Visa, Mastercard, Troy</div>
										</div>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" defaultChecked className="sr-only peer" />
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>

								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<span className="text-2xl">🏦</span>
										<div>
											<div className="font-medium">Banka Transferi</div>
											<div className="text-sm text-gray-500">EFT/Havale</div>
										</div>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" defaultChecked className="sr-only peer" />
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>

								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-3">
										<span className="text-2xl">📱</span>
										<div>
											<div className="font-medium">Dijital Cüzdan</div>
											<div className="text-sm text-gray-500">PayPal, Apple Pay</div>
										</div>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" className="sr-only peer" />
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Minimum Sipariş Tutarı
									</label>
									<input
										type="number"
										defaultValue="50"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Komisyon Oranı (%)
									</label>
									<input
										type="number"
										defaultValue="7"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'shipping' && (
						<div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
							<h3 className="text-lg font-semibold">Kargo Ayarları</h3>
							
							<div className="space-y-4">
								{[
									{ name: 'Aras Kargo', price: '₺15', time: '1-2 gün' },
									{ name: 'Yurtiçi Kargo', price: '₺12', time: '1-3 gün' },
									{ name: 'MNG Kargo', price: '₺18', time: '1-2 gün' }
								].map((carrier, i) => (
									<div key={i} className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex items-center space-x-3">
											<span className="text-2xl">🚚</span>
											<div>
												<div className="font-medium">{carrier.name}</div>
												<div className="text-sm text-gray-500">{carrier.price} • {carrier.time}</div>
											</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input type="checkbox" defaultChecked className="sr-only peer" />
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
										</label>
									</div>
								))}
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Ücretsiz Kargo Limiti
									</label>
									<input
										type="number"
										defaultValue="150"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Hazırlama Süresi (gün)
									</label>
									<input
										type="number"
										defaultValue="1"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'notifications' && (
						<div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
							<h3 className="text-lg font-semibold">Bildirim Ayarları</h3>
							
							<div className="space-y-4">
								{[
									{ title: 'Yeni Sipariş', desc: 'Yeni sipariş geldiğinde bildir' },
									{ title: 'Düşük Stok', desc: 'Stok azaldığında uyar' },
									{ title: 'Ödeme Alındı', desc: 'Ödeme onaylandığında bildir' },
									{ title: 'İade Talebi', desc: 'İade talebi geldiğinde uyar' },
									{ title: 'Yorum Bildirimi', desc: 'Yeni yorum geldiğinde bildir' }
								].map((notif, i) => (
									<div key={i} className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<div className="font-medium">{notif.title}</div>
											<div className="text-sm text-gray-500">{notif.desc}</div>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input type="checkbox" defaultChecked className="sr-only peer" />
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
										</label>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'security' && (
						<div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
							<h3 className="text-lg font-semibold">Güvenlik Ayarları</h3>
							
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										İki Faktörlü Doğrulama
									</label>
									<div className="flex items-center space-x-3">
										<label className="relative inline-flex items-center cursor-pointer">
											<input type="checkbox" className="sr-only peer" />
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
										</label>
										<span className="text-sm text-gray-600">SMS ile doğrulama aktif et</span>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Oturum Zaman Aşımı (dakika)
									</label>
									<select className="w-full border rounded-lg px-3 py-2">
										<option>30</option>
										<option>60</option>
										<option>120</option>
										<option>240</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										IP Kısıtlaması
									</label>
									<textarea
										rows={3}
										placeholder="Güvenilir IP adreslerini girin (her satıra bir tane)"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'integrations' && (
						<div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
							<h3 className="text-lg font-semibold">Entegrasyonlar</h3>
							
							<div className="grid md:grid-cols-2 gap-4">
								{[
									{ name: 'Google Analytics', status: 'Aktif', icon: '📊' },
									{ name: 'Facebook Pixel', status: 'Pasif', icon: '📘' },
									{ name: 'WhatsApp Business', status: 'Aktif', icon: '💬' },
									{ name: 'Mailchimp', status: 'Pasif', icon: '📧' }
								].map((integration, i) => (
									<div key={i} className="p-4 border rounded-lg">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center space-x-3">
												<span className="text-2xl">{integration.icon}</span>
												<div className="font-medium">{integration.name}</div>
											</div>
											<span className={`px-2 py-1 text-xs rounded-full ${
												integration.status === 'Aktif' 
													? 'bg-green-100 text-green-800' 
													: 'bg-gray-100 text-gray-800'
											}`}>
												{integration.status}
											</span>
										</div>
										<button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
											Ayarla
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

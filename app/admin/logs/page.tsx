"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function SystemLogsPage() {
	const [activeTab, setActiveTab] = useState('realtime');
	const [logLevel, setLogLevel] = useState('all');
	const [logSource, setLogSource] = useState('all');

	const logStats = {
		totalLogs: 2847592,
		todayLogs: 45672,
		errorLogs: 234,
		warningLogs: 1567,
		infoLogs: 43871,
		debugLogs: 0,
		avgLogsPerMinute: 32,
		diskUsage: '2.4 GB'
	};

	const realtimeLogs = [
		{
			id: 'LOG001',
			timestamp: '2024-01-15 16:45:23.456',
			level: 'INFO',
			source: 'auth-service',
			message: 'User login successful: user@example.com',
			userId: 'user123',
			ip: '192.168.1.100',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			sessionId: 'sess_abc123',
			details: {
				action: 'login',
				method: 'email_password',
				duration: '245ms'
			}
		},
		{
			id: 'LOG002',
			timestamp: '2024-01-15 16:45:18.123',
			level: 'ERROR',
			source: 'payment-service',
			message: 'Payment processing failed: Insufficient funds',
			userId: 'user456',
			ip: '192.168.1.101',
			userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
			sessionId: 'sess_def456',
			details: {
				action: 'payment_process',
				orderId: 'ORD-12345',
				amount: '₺299.99',
				errorCode: 'INSUFFICIENT_FUNDS'
			}
		},
		{
			id: 'LOG003',
			timestamp: '2024-01-15 16:45:15.789',
			level: 'WARNING',
			source: 'inventory-service',
			message: 'Low stock alert: Product ID 789 has only 2 items left',
			userId: null,
			ip: 'internal',
			userAgent: 'system',
			sessionId: null,
			details: {
				action: 'stock_check',
				productId: '789',
				currentStock: 2,
				threshold: 5
			}
		},
		{
			id: 'LOG004',
			timestamp: '2024-01-15 16:45:12.345',
			level: 'INFO',
			source: 'api-gateway',
			message: 'API request processed successfully',
			userId: 'user789',
			ip: '192.168.1.102',
			userAgent: 'PostmanRuntime/7.29.0',
			sessionId: 'sess_ghi789',
			details: {
				action: 'api_request',
				endpoint: '/api/v1/products',
				method: 'GET',
				responseTime: '89ms',
				statusCode: 200
			}
		},
		{
			id: 'LOG005',
			timestamp: '2024-01-15 16:45:10.567',
			level: 'ERROR',
			source: 'email-service',
			message: 'Failed to send email notification',
			userId: 'user321',
			ip: 'internal',
			userAgent: 'system',
			sessionId: null,
			details: {
				action: 'email_send',
				recipient: 'user@example.com',
				template: 'order_confirmation',
				errorCode: 'SMTP_CONNECTION_FAILED'
			}
		}
	];

	const errorLogs = [
		{
			id: 'ERR001',
			timestamp: '2024-01-15 16:30:45.123',
			level: 'ERROR',
			source: 'database',
			message: 'Database connection timeout',
			count: 15,
			firstOccurrence: '2024-01-15 16:25:12.456',
			lastOccurrence: '2024-01-15 16:30:45.123',
			affectedUsers: 234,
			status: 'investigating'
		},
		{
			id: 'ERR002',
			timestamp: '2024-01-15 15:45:23.789',
			level: 'ERROR',
			source: 'payment-service',
			message: 'Payment gateway API rate limit exceeded',
			count: 8,
			firstOccurrence: '2024-01-15 15:42:10.123',
			lastOccurrence: '2024-01-15 15:45:23.789',
			affectedUsers: 67,
			status: 'resolved'
		},
		{
			id: 'ERR003',
			timestamp: '2024-01-15 14:20:15.456',
			level: 'ERROR',
			source: 'file-upload',
			message: 'File upload failed: File size exceeds limit',
			count: 23,
			firstOccurrence: '2024-01-15 14:15:30.789',
			lastOccurrence: '2024-01-15 14:20:15.456',
			affectedUsers: 12,
			status: 'resolved'
		}
	];

	const auditLogs = [
		{
			id: 'AUD001',
			timestamp: '2024-01-15 16:40:12.345',
			action: 'USER_ROLE_CHANGED',
			actor: 'admin@tdcmarket.com',
			target: 'user@example.com',
			details: 'Role changed from "user" to "premium_user"',
			ip: '192.168.1.50',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			severity: 'medium'
		},
		{
			id: 'AUD002',
			timestamp: '2024-01-15 16:35:45.678',
			action: 'PRODUCT_DELETED',
			actor: 'moderator@tdcmarket.com',
			target: 'Product ID: 12345',
			details: 'Product "Kablosuz Kulaklık" deleted due to policy violation',
			ip: '192.168.1.51',
			userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
			severity: 'high'
		},
		{
			id: 'AUD003',
			timestamp: '2024-01-15 16:30:23.901',
			action: 'SYSTEM_CONFIG_CHANGED',
			actor: 'sysadmin@tdcmarket.com',
			target: 'Payment Gateway Settings',
			details: 'Updated payment gateway timeout from 30s to 60s',
			ip: '192.168.1.52',
			userAgent: 'Mozilla/5.0 (Linux; Ubuntu 20.04)',
			severity: 'high'
		}
	];

	const performanceLogs = [
		{
			id: 'PERF001',
			timestamp: '2024-01-15 16:45:00.000',
			metric: 'API Response Time',
			value: '245ms',
			threshold: '200ms',
			status: 'warning',
			endpoint: '/api/v1/products',
			details: 'Response time exceeded threshold by 45ms'
		},
		{
			id: 'PERF002',
			timestamp: '2024-01-15 16:44:00.000',
			metric: 'Database Query Time',
			value: '1.2s',
			threshold: '500ms',
			status: 'critical',
			endpoint: '/api/v1/orders/search',
			details: 'Complex query without proper indexing detected'
		},
		{
			id: 'PERF003',
			timestamp: '2024-01-15 16:43:00.000',
			metric: 'Memory Usage',
			value: '85%',
			threshold: '80%',
			status: 'warning',
			endpoint: 'auth-service',
			details: 'Memory usage approaching critical levels'
		}
	];

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'ERROR': return 'bg-red-100 text-red-800';
			case 'WARNING': return 'bg-yellow-100 text-yellow-800';
			case 'INFO': return 'bg-blue-100 text-blue-800';
			case 'DEBUG': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'investigating': return 'bg-yellow-100 text-yellow-800';
			case 'resolved': return 'bg-green-100 text-green-800';
			case 'critical': return 'bg-red-100 text-red-800';
			case 'warning': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getSourceIcon = (source: string) => {
		switch (source) {
			case 'auth-service': return '🔐';
			case 'payment-service': return '💳';
			case 'inventory-service': return '📦';
			case 'api-gateway': return '🌐';
			case 'email-service': return '📧';
			case 'database': return '🗄️';
			case 'file-upload': return '📁';
			default: return '⚙️';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Sistem Logları</h1>
					<p className="text-gray-600">Sistem aktiviteleri, hatalar ve performans izleme</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={logLevel} 
						onChange={(e) => setLogLevel(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
					>
						<option value="all">Tüm Seviyeler</option>
						<option value="ERROR">Hatalar</option>
						<option value="WARNING">Uyarılar</option>
						<option value="INFO">Bilgi</option>
						<option value="DEBUG">Debug</option>
					</select>
					<select 
						value={logSource} 
						onChange={(e) => setLogSource(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
					>
						<option value="all">Tüm Kaynaklar</option>
						<option value="auth-service">Auth Service</option>
						<option value="payment-service">Payment Service</option>
						<option value="inventory-service">Inventory Service</option>
						<option value="api-gateway">API Gateway</option>
						<option value="email-service">Email Service</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Log İndir
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-8 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{logStats.totalLogs.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Toplam Log</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{logStats.todayLogs.toLocaleString()}</div>
					<div className="text-sm text-green-600">Bugün</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{logStats.errorLogs}</div>
					<div className="text-sm text-red-600">Hata</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{logStats.warningLogs.toLocaleString()}</div>
					<div className="text-sm text-yellow-600">Uyarı</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{logStats.infoLogs.toLocaleString()}</div>
					<div className="text-sm text-purple-600">Bilgi</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-2xl font-bold text-gray-700">{logStats.debugLogs}</div>
					<div className="text-sm text-gray-600">Debug</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{logStats.avgLogsPerMinute}</div>
					<div className="text-sm text-orange-600">Log/Dakika</div>
				</div>
				<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
					<div className="text-2xl font-bold text-emerald-700">{logStats.diskUsage}</div>
					<div className="text-sm text-emerald-600">Disk Kullanımı</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'realtime', label: 'Canlı Loglar', icon: '🔴' },
							{ key: 'errors', label: 'Hata Logları', icon: '❌' },
							{ key: 'audit', label: 'Denetim Logları', icon: '🔍' },
							{ key: 'performance', label: 'Performans', icon: '📊' }
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
									activeTab === tab.key
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								<span>{tab.icon}</span>
								<span>{tab.label}</span>
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'realtime' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Canlı Sistem Logları</h3>
								<div className="flex items-center space-x-2">
									<div className="flex items-center">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
										<span className="text-sm text-gray-600">Canlı</span>
									</div>
									<button className="text-indigo-600 hover:text-indigo-800 text-sm">
										Otomatik Yenile: Açık
									</button>
								</div>
							</div>

							<div className="space-y-3">
								{realtimeLogs.map((log) => (
									<div key={log.id} className="border rounded-lg p-4 font-mono text-sm">
										<div className="flex items-start justify-between mb-2">
											<div className="flex items-center space-x-3">
												<span className="text-gray-500">{log.timestamp}</span>
												<span className={`px-2 py-1 text-xs font-semibold rounded ${getLevelColor(log.level)}`}>
													{log.level}
												</span>
												<span className="flex items-center space-x-1">
													<span>{getSourceIcon(log.source)}</span>
													<span className="text-gray-700">{log.source}</span>
												</span>
											</div>
										</div>
										
										<div className="mb-2">
											<p className="text-gray-900">{log.message}</p>
										</div>

										<div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600">
											<div className="space-y-1">
												{log.userId && <p><strong>User ID:</strong> {log.userId}</p>}
												{log.sessionId && <p><strong>Session:</strong> {log.sessionId}</p>}
												<p><strong>IP:</strong> {log.ip}</p>
											</div>
											<div className="space-y-1">
												<p><strong>User Agent:</strong> {log.userAgent.substring(0, 50)}...</p>
												{Object.entries(log.details).map(([key, value]) => (
													<p key={key}><strong>{key}:</strong> {value}</p>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'errors' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Hata Logları ve Analizi</h3>
							
							<div className="space-y-4">
								{errorLogs.map((error) => (
									<div key={error.id} className="border rounded-lg p-6 bg-red-50">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getSourceIcon(error.source)}</span>
													<h4 className="font-semibold text-gray-900">{error.message}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(error.status)}`}>
														{error.status === 'investigating' ? 'İnceleniyor' : 'Çözüldü'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Kaynak:</strong> {error.source}</p>
													<p><strong>İlk Oluşum:</strong> {error.firstOccurrence}</p>
													<p><strong>Son Oluşum:</strong> {error.lastOccurrence}</p>
												</div>
											</div>
										</div>

										<div className="grid md:grid-cols-3 gap-4 mb-4">
											<div className="text-center bg-white p-3 rounded border">
												<div className="text-xl font-bold text-red-600">{error.count}</div>
												<div className="text-sm text-red-600">Tekrar Sayısı</div>
											</div>
											<div className="text-center bg-white p-3 rounded border">
												<div className="text-xl font-bold text-orange-600">{error.affectedUsers}</div>
												<div className="text-sm text-orange-600">Etkilenen Kullanıcı</div>
											</div>
											<div className="text-center bg-white p-3 rounded border">
												<div className="text-xl font-bold text-blue-600">{error.level}</div>
												<div className="text-sm text-blue-600">Seviye</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Stack Trace
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Çözüm Öner
											</button>
											{error.status === 'investigating' && (
												<button className="text-yellow-600 hover:text-yellow-900 text-sm">
													Çözüldü Olarak İşaretle
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'audit' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Denetim Logları</h3>
							
							<div className="space-y-4">
								{auditLogs.map((audit) => (
									<div key={audit.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<h4 className="font-semibold text-gray-900">{audit.action}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(audit.severity)}`}>
														{audit.severity === 'high' ? 'Yüksek' : audit.severity === 'medium' ? 'Orta' : 'Düşük'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Zaman:</strong> {audit.timestamp}</p>
													<p><strong>Yapan:</strong> {audit.actor}</p>
													<p><strong>Hedef:</strong> {audit.target}</p>
													<p><strong>IP:</strong> {audit.ip}</p>
												</div>
												<div className="bg-gray-50 p-3 rounded border">
													<p className="text-sm text-gray-700">{audit.details}</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Kullanıcı Geçmişi
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												İlgili Loglar
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'performance' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Performans Logları</h3>
							
							<div className="space-y-4">
								{performanceLogs.map((perf) => (
									<div key={perf.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<h4 className="font-semibold text-gray-900">{perf.metric}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(perf.status)}`}>
														{perf.status === 'critical' ? 'Kritik' : 'Uyarı'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Zaman:</strong> {perf.timestamp}</p>
													<p><strong>Endpoint:</strong> {perf.endpoint}</p>
													<p><strong>Değer:</strong> {perf.value}</p>
													<p><strong>Eşik:</strong> {perf.threshold}</p>
												</div>
												<div className="bg-yellow-50 p-3 rounded border border-yellow-200">
													<p className="text-sm text-yellow-700">{perf.details}</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Trend Analizi
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Optimizasyon Önerileri
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Alarm Kur
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚨</span>
						<h3 className="text-lg font-semibold text-red-900">Kritik Hatalar</h3>
					</div>
					<p className="text-red-700 mb-4">Acil müdahale gereken hataları görüntüle.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Kritik Loglar
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Log Analizi</h3>
					</div>
					<p className="text-blue-700 mb-4">Detaylı log analizi ve raporlama.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-green-900">Log Ayarları</h3>
					</div>
					<p className="text-green-700 mb-4">Log seviyesi ve saklama ayarları.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Ayarları Yönet
					</button>
				</div>
			</div>
		</div>
	);
}

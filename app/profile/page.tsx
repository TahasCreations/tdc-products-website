"use client";

import { useState, useEffect } from 'react';

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState('personal');
	const [isEditing, setIsEditing] = useState(false);

	// URL parametrelerine göre tab'ı ayarla
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const tab = urlParams.get('tab');
		if (tab && ['personal', 'addresses', 'billing', 'author', 'orders', 'reviews'].includes(tab)) {
			setActiveTab(tab);
		}
	}, []);

	const [userProfile, setUserProfile] = useState({
		// Kişisel Bilgiler
		firstName: 'Ahmet',
		lastName: 'Yılmaz',
		email: 'ahmet@example.com',
		phone: '+90 532 123 4567',
		birthDate: '1990-05-15',
		gender: 'Erkek',
		bio: 'Anime ve koleksiyon tutkunu. Blog yazarı ve ürün incelemecisi.',
		avatar: null,
		
		// Adres Bilgileri
		addresses: [
			{
				id: 1,
				type: 'Ev',
				title: 'Ev Adresim',
				firstName: 'Ahmet',
				lastName: 'Yılmaz',
				company: '',
				address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123/5',
				city: 'İstanbul',
				district: 'Kadıköy',
				postalCode: '34710',
				country: 'Türkiye',
				isDefault: true
			},
			{
				id: 2,
				type: 'İş',
				title: 'İş Adresim',
				firstName: 'Ahmet',
				lastName: 'Yılmaz',
				company: 'ABC Teknoloji Ltd.',
				address: 'İş Merkezi, Teknoloji Caddesi No: 45 Kat: 8',
				city: 'İstanbul',
				district: 'Şişli',
				postalCode: '34394',
				country: 'Türkiye',
				isDefault: false
			}
		],

		// Fatura Bilgileri
		billingInfo: {
			type: 'individual', // individual or corporate
			taxNumber: '',
			taxOffice: '',
			companyName: '',
			firstName: 'Ahmet',
			lastName: 'Yılmaz',
			address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123/5',
			city: 'İstanbul',
			district: 'Kadıköy',
			postalCode: '34710',
			country: 'Türkiye'
		},

		// Blog Yazar Profili
		authorProfile: {
			displayName: 'Ahmet Y.',
			slug: 'ahmet-yilmaz',
			bio: 'Anime figürleri ve koleksiyon konularında uzman. 5 yıldır blog yazıyor.',
			expertise: ['Anime', 'Koleksiyon', 'Figürler', 'Pop Culture'],
			socialLinks: {
				twitter: '@ahmetyilmaz',
				instagram: 'ahmet_collections',
				youtube: 'AhmetCollector'
			},
			isPublicAuthor: true,
			authorSince: '2019-03-15'
		}
	});

	const tabs = [
		{ key: 'personal', label: 'Kişisel Bilgiler', icon: '👤' },
		{ key: 'addresses', label: 'Adreslerim', icon: '📍' },
		{ key: 'billing', label: 'Fatura Bilgileri', icon: '🧾' },
		{ key: 'author', label: 'Yazar Profili', icon: '✍️' },
		{ key: 'orders', label: 'Siparişlerim', icon: '📦' },
		{ key: 'reviews', label: 'Değerlendirmelerim', icon: '⭐' }
	];

	const handleSave = () => {
		setIsEditing(false);
		// API call to save profile
		console.log('Profile saved:', userProfile);
	};

	const addNewAddress = () => {
		const newAddress = {
			id: Date.now(),
			type: 'Diğer',
			title: 'Yeni Adres',
			firstName: userProfile.firstName,
			lastName: userProfile.lastName,
			company: '',
			address: '',
			city: '',
			district: '',
			postalCode: '',
			country: 'Türkiye',
			isDefault: false
		};
		setUserProfile(prev => ({
			...prev,
			addresses: [...prev.addresses, newAddress]
		}));
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
								<span className="text-2xl font-bold text-indigo-600">
									{userProfile.firstName[0]}{userProfile.lastName[0]}
								</span>
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									{userProfile.firstName} {userProfile.lastName}
								</h1>
								<p className="text-gray-600">{userProfile.email}</p>
								{userProfile.authorProfile.isPublicAuthor && (
									<span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
										✍️ Blog Yazarı
									</span>
								)}
							</div>
						</div>
						<button
							onClick={() => setIsEditing(!isEditing)}
							className={`px-4 py-2 rounded-lg font-medium ${
								isEditing 
									? 'bg-green-600 text-white hover:bg-green-700' 
									: 'bg-indigo-600 text-white hover:bg-indigo-700'
							}`}
						>
							{isEditing ? 'Kaydet' : 'Düzenle'}
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl shadow-sm border">
							<div className="p-6">
								<nav className="space-y-2">
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
						</div>
					</div>

					{/* Content */}
					<div className="lg:col-span-3">
						<div className="bg-white rounded-xl shadow-sm border">
							<div className="p-6">
								{/* Kişisel Bilgiler */}
								{activeTab === 'personal' && (
									<div className="space-y-6">
										<h2 className="text-xl font-semibold text-gray-900">Kişisel Bilgiler</h2>
										
										<div className="grid md:grid-cols-2 gap-6">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Ad
												</label>
												<input
													type="text"
													value={userProfile.firstName}
													disabled={!isEditing}
													onChange={(e) => setUserProfile(prev => ({...prev, firstName: e.target.value}))}
													className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Soyad
												</label>
												<input
													type="text"
													value={userProfile.lastName}
													disabled={!isEditing}
													onChange={(e) => setUserProfile(prev => ({...prev, lastName: e.target.value}))}
													className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													E-posta
												</label>
												<input
													type="email"
													value={userProfile.email}
													disabled={!isEditing}
													onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
													className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Telefon
												</label>
												<input
													type="tel"
													value={userProfile.phone}
													disabled={!isEditing}
													onChange={(e) => setUserProfile(prev => ({...prev, phone: e.target.value}))}
													className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Doğum Tarihi
												</label>
												<input
													type="date"
													value={userProfile.birthDate}
													disabled={!isEditing}
													onChange={(e) => setUserProfile(prev => ({...prev, birthDate: e.target.value}))}
													className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Cinsiyet
												</label>
												<select
													value={userProfile.gender}
													disabled={!isEditing}
													onChange={(e) => setUserProfile(prev => ({...prev, gender: e.target.value}))}
													className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												>
													<option value="Erkek">Erkek</option>
													<option value="Kadın">Kadın</option>
													<option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
												</select>
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Hakkımda
											</label>
											<textarea
												rows={4}
												value={userProfile.bio}
												disabled={!isEditing}
												onChange={(e) => setUserProfile(prev => ({...prev, bio: e.target.value}))}
												className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
											/>
										</div>
									</div>
								)}

								{/* Adresler */}
								{activeTab === 'addresses' && (
									<div className="space-y-6">
										<div className="flex items-center justify-between">
											<h2 className="text-xl font-semibold text-gray-900">Adreslerim</h2>
											<button
												onClick={addNewAddress}
												className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
											>
												Yeni Adres Ekle
											</button>
										</div>

										<div className="space-y-4">
											{userProfile.addresses.map((address) => (
												<div key={address.id} className="border rounded-lg p-6">
													<div className="flex items-center justify-between mb-4">
														<div className="flex items-center space-x-3">
															<h3 className="font-semibold text-gray-900">{address.title}</h3>
															<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																address.type === 'Ev' ? 'bg-green-100 text-green-800' :
																address.type === 'İş' ? 'bg-blue-100 text-blue-800' :
																'bg-gray-100 text-gray-800'
															}`}>
																{address.type}
															</span>
															{address.isDefault && (
																<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
																	Varsayılan
																</span>
															)}
														</div>
														<div className="flex space-x-2">
															<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
																Düzenle
															</button>
															<button className="text-red-600 hover:text-red-900 text-sm font-medium">
																Sil
															</button>
														</div>
													</div>
													<div className="text-gray-700">
														<p className="font-medium">{address.firstName} {address.lastName}</p>
														{address.company && <p>{address.company}</p>}
														<p>{address.address}</p>
														<p>{address.district}, {address.city} {address.postalCode}</p>
														<p>{address.country}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Fatura Bilgileri */}
								{activeTab === 'billing' && (
									<div className="space-y-6">
										<h2 className="text-xl font-semibold text-gray-900">Fatura Bilgileri</h2>
										
										<div className="space-y-6">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-3">
													Fatura Tipi
												</label>
												<div className="flex space-x-4">
													<label className="flex items-center">
														<input
															type="radio"
															name="billingType"
															value="individual"
															checked={userProfile.billingInfo.type === 'individual'}
															onChange={(e) => setUserProfile(prev => ({
																...prev,
																billingInfo: { ...prev.billingInfo, type: e.target.value }
															}))}
															className="mr-2"
														/>
														Bireysel
													</label>
													<label className="flex items-center">
														<input
															type="radio"
															name="billingType"
															value="corporate"
															checked={userProfile.billingInfo.type === 'corporate'}
															onChange={(e) => setUserProfile(prev => ({
																...prev,
																billingInfo: { ...prev.billingInfo, type: e.target.value }
															}))}
															className="mr-2"
														/>
														Kurumsal
													</label>
												</div>
											</div>

											{userProfile.billingInfo.type === 'corporate' && (
												<div className="grid md:grid-cols-2 gap-6">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Şirket Adı
														</label>
														<input
															type="text"
															value={userProfile.billingInfo.companyName}
															disabled={!isEditing}
															onChange={(e) => setUserProfile(prev => ({
																...prev,
																billingInfo: { ...prev.billingInfo, companyName: e.target.value }
															}))}
															className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
														/>
													</div>
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Vergi Numarası
														</label>
														<input
															type="text"
															value={userProfile.billingInfo.taxNumber}
															disabled={!isEditing}
															onChange={(e) => setUserProfile(prev => ({
																...prev,
																billingInfo: { ...prev.billingInfo, taxNumber: e.target.value }
															}))}
															className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
														/>
													</div>
													<div className="md:col-span-2">
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Vergi Dairesi
														</label>
														<input
															type="text"
															value={userProfile.billingInfo.taxOffice}
															disabled={!isEditing}
															onChange={(e) => setUserProfile(prev => ({
																...prev,
																billingInfo: { ...prev.billingInfo, taxOffice: e.target.value }
															}))}
															className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
														/>
													</div>
												</div>
											)}

											<div className="grid md:grid-cols-2 gap-6">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Ad
													</label>
													<input
														type="text"
														value={userProfile.billingInfo.firstName}
														disabled={!isEditing}
														onChange={(e) => setUserProfile(prev => ({
															...prev,
															billingInfo: { ...prev.billingInfo, firstName: e.target.value }
														}))}
														className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Soyad
													</label>
													<input
														type="text"
														value={userProfile.billingInfo.lastName}
														disabled={!isEditing}
														onChange={(e) => setUserProfile(prev => ({
															...prev,
															billingInfo: { ...prev.billingInfo, lastName: e.target.value }
														}))}
														className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
													/>
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Fatura Adresi
												</label>
												<textarea
													rows={3}
													value={userProfile.billingInfo.address}
													disabled={!isEditing}
													onChange={(e) => setUserProfile(prev => ({
														...prev,
														billingInfo: { ...prev.billingInfo, address: e.target.value }
													}))}
													className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
												/>
											</div>

											<div className="grid md:grid-cols-3 gap-6">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														İl
													</label>
													<input
														type="text"
														value={userProfile.billingInfo.city}
														disabled={!isEditing}
														onChange={(e) => setUserProfile(prev => ({
															...prev,
															billingInfo: { ...prev.billingInfo, city: e.target.value }
														}))}
														className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														İlçe
													</label>
													<input
														type="text"
														value={userProfile.billingInfo.district}
														disabled={!isEditing}
														onChange={(e) => setUserProfile(prev => ({
															...prev,
															billingInfo: { ...prev.billingInfo, district: e.target.value }
														}))}
														className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Posta Kodu
													</label>
													<input
														type="text"
														value={userProfile.billingInfo.postalCode}
														disabled={!isEditing}
														onChange={(e) => setUserProfile(prev => ({
															...prev,
															billingInfo: { ...prev.billingInfo, postalCode: e.target.value }
														}))}
														className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
													/>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Yazar Profili */}
								{activeTab === 'author' && (
									<div className="space-y-6">
										<div className="flex items-center justify-between">
											<h2 className="text-xl font-semibold text-gray-900">Blog Yazar Profili</h2>
											<label className="flex items-center space-x-2">
												<input
													type="checkbox"
													checked={userProfile.authorProfile.isPublicAuthor}
													onChange={(e) => setUserProfile(prev => ({
														...prev,
														authorProfile: { ...prev.authorProfile, isPublicAuthor: e.target.checked }
													}))}
													className="rounded"
												/>
												<span className="text-sm font-medium text-gray-700">Blog yazarı olarak görün</span>
											</label>
										</div>

										{userProfile.authorProfile.isPublicAuthor && (
											<div className="space-y-6">
												<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
													<div className="flex items-center space-x-2 mb-2">
														<span className="text-blue-600">ℹ️</span>
														<span className="font-medium text-blue-900">Blog Yazar Profili</span>
													</div>
													<p className="text-blue-700 text-sm">
														Bu bilgiler blog yazılarınızda yazar bilgisi olarak görünecektir.
													</p>
												</div>

												<div className="grid md:grid-cols-2 gap-6">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Görünen Ad
														</label>
														<input
															type="text"
															value={userProfile.authorProfile.displayName}
															disabled={!isEditing}
															onChange={(e) => setUserProfile(prev => ({
																...prev,
																authorProfile: { ...prev.authorProfile, displayName: e.target.value }
															}))}
															className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
															placeholder="Blog'da görünecek adınız"
														/>
													</div>
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Yazar Slug
														</label>
														<input
															type="text"
															value={userProfile.authorProfile.slug}
															disabled={!isEditing}
															onChange={(e) => setUserProfile(prev => ({
																...prev,
																authorProfile: { ...prev.authorProfile, slug: e.target.value }
															}))}
															className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
															placeholder="URL'de görünecek isim"
														/>
													</div>
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Yazar Biyografisi
													</label>
													<textarea
														rows={4}
														value={userProfile.authorProfile.bio}
														disabled={!isEditing}
														onChange={(e) => setUserProfile(prev => ({
															...prev,
															authorProfile: { ...prev.authorProfile, bio: e.target.value }
														}))}
														className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
														placeholder="Uzmanlık alanlarınız ve deneyiminiz hakkında bilgi verin..."
													/>
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Uzmanlık Alanları
													</label>
													<div className="flex flex-wrap gap-2 mb-3">
														{userProfile.authorProfile.expertise.map((skill, index) => (
															<span key={index} className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
																{skill}
																{isEditing && (
																	<button
																		onClick={() => {
																			const newExpertise = userProfile.authorProfile.expertise.filter((_, i) => i !== index);
																			setUserProfile(prev => ({
																				...prev,
																				authorProfile: { ...prev.authorProfile, expertise: newExpertise }
																			}));
																		}}
																		className="ml-2 text-indigo-600 hover:text-indigo-800"
																	>
																		×
																	</button>
																)}
															</span>
														))}
													</div>
													{isEditing && (
														<input
															type="text"
															placeholder="Yeni uzmanlık alanı ekle ve Enter'a bas"
															className="w-full border rounded-lg px-3 py-2"
															onKeyPress={(e) => {
																if (e.key === 'Enter' && e.target.value.trim()) {
																	const newSkill = e.target.value.trim();
																	if (!userProfile.authorProfile.expertise.includes(newSkill)) {
																		setUserProfile(prev => ({
																			...prev,
																			authorProfile: { 
																				...prev.authorProfile, 
																				expertise: [...prev.authorProfile.expertise, newSkill] 
																			}
																		}));
																	}
																	e.target.value = '';
																}
															}}
														/>
													)}
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-3">
														Sosyal Medya Hesapları
													</label>
													<div className="grid md:grid-cols-3 gap-4">
														<div>
															<label className="block text-xs text-gray-500 mb-1">Twitter</label>
															<input
																type="text"
																value={userProfile.authorProfile.socialLinks.twitter}
																disabled={!isEditing}
																onChange={(e) => setUserProfile(prev => ({
																	...prev,
																	authorProfile: { 
																		...prev.authorProfile, 
																		socialLinks: { ...prev.authorProfile.socialLinks, twitter: e.target.value }
																	}
																}))}
																className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
																placeholder="@kullaniciadi"
															/>
														</div>
														<div>
															<label className="block text-xs text-gray-500 mb-1">Instagram</label>
															<input
																type="text"
																value={userProfile.authorProfile.socialLinks.instagram}
																disabled={!isEditing}
																onChange={(e) => setUserProfile(prev => ({
																	...prev,
																	authorProfile: { 
																		...prev.authorProfile, 
																		socialLinks: { ...prev.authorProfile.socialLinks, instagram: e.target.value }
																	}
																}))}
																className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
																placeholder="kullaniciadi"
															/>
														</div>
														<div>
															<label className="block text-xs text-gray-500 mb-1">YouTube</label>
															<input
																type="text"
																value={userProfile.authorProfile.socialLinks.youtube}
																disabled={!isEditing}
																onChange={(e) => setUserProfile(prev => ({
																	...prev,
																	authorProfile: { 
																		...prev.authorProfile, 
																		socialLinks: { ...prev.authorProfile.socialLinks, youtube: e.target.value }
																	}
																}))}
																className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
																placeholder="Kanal Adı"
															/>
														</div>
													</div>
												</div>

												<div className="bg-gray-50 p-4 rounded-lg">
													<h4 className="font-medium text-gray-900 mb-2">Yazar İstatistikleri</h4>
													<div className="grid md:grid-cols-3 gap-4 text-sm">
														<div>
															<span className="text-gray-600">Yazar Olma Tarihi:</span>
															<div className="font-medium">{new Date(userProfile.authorProfile.authorSince).toLocaleDateString('tr-TR')}</div>
														</div>
														<div>
															<span className="text-gray-600">Toplam Yazı:</span>
															<div className="font-medium">12 yazı</div>
														</div>
														<div>
															<span className="text-gray-600">Toplam Okunma:</span>
															<div className="font-medium">15,680 okuma</div>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								)}

								{/* Siparişlerim */}
								{activeTab === 'orders' && (
									<div className="space-y-6">
										<h2 className="text-xl font-semibold text-gray-900">Siparişlerim</h2>
										<div className="text-center py-12">
											<div className="text-6xl mb-4">📦</div>
											<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz sipariş vermemişsiniz</h3>
											<p className="text-gray-600 mb-6">İlk siparişinizi vermek için ürünlerimize göz atın.</p>
											<button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
												Alışverişe Başla
											</button>
										</div>
									</div>
								)}

								{/* Değerlendirmelerim */}
								{activeTab === 'reviews' && (
									<div className="space-y-6">
										<h2 className="text-xl font-semibold text-gray-900">Değerlendirmelerim</h2>
										<div className="text-center py-12">
											<div className="text-6xl mb-4">⭐</div>
											<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz değerlendirme yapmamışsınız</h3>
											<p className="text-gray-600">Satın aldığınız ürünleri değerlendirerek diğer müşterilere yardımcı olun.</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const dynamic = 'force-static'

function JsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "TDC Market",
		url: "https://tdcmarket.com/about",
		logo: "https://tdcmarket.com/logo.png",
		foundingLocation: "Bornova, İzmir",
		areaServed: "TR",
		sameAs: [
			"https://www.instagram.com/tdcmarket",
			"https://www.linkedin.com/company/tdcmarket"
		],
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.9",
			reviewCount: "120"
		}
	};

	const faq = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "Kargo süresi nedir?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Siparişler 24‑48 saat içerisinde kargoya teslim edilir."
				}
			},
			{
				"@type": "Question",
				name: "İade politikası nasıldır?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "14 gün koşulsuz iade hakkı sunuyoruz."
				}
			}
		]
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
		</>
	)
}

export default function AboutPage() {
	return (
		<div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
			<JsonLd />
			<header>
				<h1 className="text-3xl font-bold">Hakkımızda</h1>
				<p className="mt-3 text-ink-700 leading-7">
					TDC Market, temellerini İzmir Bornova’da kurulan SAS Ajansı’nın reklamcılık ve dijital pazarlama deneyiminden alır.
					Ajans kültüründeki şeffaflık, ölçülebilirlik ve müşteri memnuniyeti yaklaşımını e‑ticaret operasyonlarımıza taşıyoruz.
				</p>
			</header>

			<section className="grid md:grid-cols-3 gap-6">
				<div className="p-5 border rounded-lg">
					<h2 className="font-semibold mb-2">Misyon</h2>
					<p>Üreticiler ve alıcıları güven, hız ve deneyim odağında buluşturmak.</p>
				</div>
				<div className="p-5 border rounded-lg">
					<h2 className="font-semibold mb-2">Vizyon</h2>
					<p>Türkiye’nin en güvenilir pazar yerlerinden biri olmak.</p>
				</div>
				<div className="p-5 border rounded-lg">
					<h2 className="font-semibold mb-2">Değerler</h2>
					<ul className="list-disc pl-5 space-y-1 text-ink-700">
						<li>Şeffaf süreçler, açık fiyatlandırma</li>
						<li>Hızlı kargo, kolay iade</li>
						<li>Güvenli ödeme ve veri gizliliği</li>
					</ul>
				</div>
			</section>

			<section className="grid md:grid-cols-3 gap-6">
				<div className="p-5 border rounded-lg">
					<h2 className="font-semibold mb-3">Ekip</h2>
					<ul className="space-y-2 text-ink-700">
						<li>Strateji & Performans — 8+ yıl deneyim</li>
						<li>Kreatif & Prodüksiyon — 6+ yıl deneyim</li>
						<li>Operasyon & Destek — 7/24 destek</li>
					</ul>
				</div>
				<div className="p-5 border rounded-lg">
					<h2 className="font-semibold mb-3">Rakamlarla</h2>
					<ul className="space-y-2 text-ink-700">
						<li>120+ müşteri değerlendirmesi</li>
						<li>4.9/5 memnuniyet</li>
						<li>48 saat içinde kargolama oranı %95</li>
					</ul>
				</div>
				<div className="p-5 border rounded-lg">
					<h2 className="font-semibold mb-3">Sertifikalar</h2>
					<ul className="space-y-2 text-ink-700">
						<li>KVKK uyumlu süreçler</li>
						<li>3D Secure ödeme</li>
						<li>SSL/TLS koruması</li>
					</ul>
				</div>
			</section>

			<section className="p-5 border rounded-lg">
				<h2 className="font-semibold mb-2">İletişim</h2>
				<p>İzmir / Bornova — SAS Ajansı iş ortaklığıyla.</p>
			</section>
		</div>
	)
}

"use client";

interface AuthorProfileProps {
	author: {
		id: string;
		displayName: string;
		slug: string;
		bio: string;
		expertise: string[];
		socialLinks: {
			twitter?: string;
			instagram?: string;
			youtube?: string;
		};
		authorSince: string;
		avatar?: string;
		stats?: {
			totalPosts: number;
			totalViews: number;
			followers: number;
		};
	};
	size?: 'small' | 'medium' | 'large';
	showStats?: boolean;
	showSocial?: boolean;
}

export default function AuthorProfile({ 
	author, 
	size = 'medium', 
	showStats = true, 
	showSocial = true 
}: AuthorProfileProps) {
	const sizeClasses = {
		small: {
			container: 'p-4',
			avatar: 'w-12 h-12',
			name: 'text-lg',
			bio: 'text-sm',
			expertise: 'text-xs'
		},
		medium: {
			container: 'p-6',
			avatar: 'w-16 h-16',
			name: 'text-xl',
			bio: 'text-base',
			expertise: 'text-sm'
		},
		large: {
			container: 'p-8',
			avatar: 'w-20 h-20',
			name: 'text-2xl',
			bio: 'text-lg',
			expertise: 'text-sm'
		}
	};

	const classes = sizeClasses[size];

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('tr-TR', { 
			year: 'numeric', 
			month: 'long' 
		});
	};

	const getSocialIcon = (platform: string) => {
		switch (platform) {
			case 'twitter': return '🐦';
			case 'instagram': return '📷';
			case 'youtube': return '📺';
			default: return '🔗';
		}
	};

	const getSocialUrl = (platform: string, username: string) => {
		switch (platform) {
			case 'twitter': return `https://twitter.com/${username.replace('@', '')}`;
			case 'instagram': return `https://instagram.com/${username}`;
			case 'youtube': return `https://youtube.com/@${username}`;
			default: return '#';
		}
	};

	return (
		<div className={`bg-white rounded-xl shadow-sm border ${classes.container}`}>
			<div className="flex items-start space-x-4">
				{/* Avatar */}
				<div className={`${classes.avatar} bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0`}>
					{author.avatar ? (
						<img 
							src={author.avatar} 
							alt={author.displayName}
							className={`${classes.avatar} rounded-full object-cover`}
						/>
					) : (
						<span className="text-indigo-600 font-bold text-lg">
							{author.displayName.split(' ').map(n => n[0]).join('')}
						</span>
					)}
				</div>

				{/* Author Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center space-x-2 mb-2">
						<h3 className={`${classes.name} font-bold text-gray-900`}>
							{author.displayName}
						</h3>
						<span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
							✍️ Yazar
						</span>
					</div>

					<p className={`${classes.bio} text-gray-600 mb-3 leading-relaxed`}>
						{author.bio}
					</p>

					{/* Expertise Tags */}
					{author.expertise && author.expertise.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-3">
							{author.expertise.slice(0, size === 'small' ? 3 : 5).map((skill, index) => (
								<span 
									key={index}
									className={`inline-flex items-center px-2 py-1 ${classes.expertise} font-medium rounded-full bg-gray-100 text-gray-700`}
								>
									{skill}
								</span>
							))}
							{author.expertise.length > (size === 'small' ? 3 : 5) && (
								<span className={`${classes.expertise} text-gray-500`}>
									+{author.expertise.length - (size === 'small' ? 3 : 5)} daha
								</span>
							)}
						</div>
					)}

					{/* Author Stats */}
					{showStats && author.stats && size !== 'small' && (
						<div className="flex items-center space-x-6 mb-3 text-sm text-gray-600">
							<div className="flex items-center space-x-1">
								<span>📝</span>
								<span>{author.stats.totalPosts} yazı</span>
							</div>
							<div className="flex items-center space-x-1">
								<span>👁️</span>
								<span>{author.stats.totalViews.toLocaleString()} okunma</span>
							</div>
							{author.stats.followers > 0 && (
								<div className="flex items-center space-x-1">
									<span>👥</span>
									<span>{author.stats.followers} takipçi</span>
								</div>
							)}
						</div>
					)}

					{/* Social Links & Author Since */}
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-500">
							{formatDate(author.authorSince)} tarihinden beri yazar
						</div>

						{showSocial && (
							<div className="flex items-center space-x-3">
								{Object.entries(author.socialLinks).map(([platform, username]) => {
									if (!username) return null;
									return (
										<a
											key={platform}
											href={getSocialUrl(platform, username)}
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-400 hover:text-gray-600 transition-colors"
											title={`${platform}: ${username}`}
										>
											<span className="text-lg">{getSocialIcon(platform)}</span>
										</a>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Follow Button (for large size) */}
			{size === 'large' && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<div className="flex items-center justify-between">
						<button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
							Takip Et
						</button>
						<a 
							href={`/authors/${author.slug}`}
							className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
						>
							Tüm yazılarını gör →
						</a>
					</div>
				</div>
			)}
		</div>
	);
}

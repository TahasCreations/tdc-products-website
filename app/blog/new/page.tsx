"use client";

// Force dynamic rendering to avoid prerendering errors
export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function NewBlogPostPage() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	return (
		<div className="max-w-2xl mx-auto px-4 py-10">
			<h1 className="text-2xl font-bold mb-4">Yeni Blog Yazısı</h1>
			<div className="space-y-4">
				<input
					type="text"
					placeholder="Başlık"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full border border-gray-300 rounded-md px-3 py-2"
				/>
				<textarea
					placeholder="İçerik"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={10}
					className="w-full border border-gray-300 rounded-md px-3 py-2"
				/>
				<button disabled className="px-4 py-2 rounded-md bg-gray-400 text-white text-sm">Yayınla (yakında)</button>
			</div>
		</div>
	)
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';
import { trackEvent, AnalyticsEvent } from '../../lib/analytics/events';

interface BlogTopic {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  topicId: string;
  tags: string[];
  coverUrl?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export default function BlogEditor() {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    topicId: '',
    tags: [],
    status: 'draft',
  });
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 hover:text-indigo-800 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Yazınızı buraya yazın...',
      }),
    ],
    content: post.content,
    onUpdate: ({ editor }) => {
      setPost(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Load topics
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await fetch('/api/blog/topics');
        const data = await response.json();
        setTopics(data.topics || []);
      } catch (error) {
        console.error('Failed to load topics:', error);
      }
    };

    loadTopics();
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (post.title || post.content) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [post.title, post.content, post.topicId, post.tags]);

  const saveDraft = async () => {
    if (!post.title && !post.content) return;

    try {
      setSaving(true);
      const response = await fetch('/api/blog/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(prev => ({ ...prev, id: data.id }));
        trackEvent(AnalyticsEvent.BLOG_DRAFT_AUTOSAVE, { postId: data.id });
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'pending') => {
    if (!post.title.trim()) {
      alert('Başlık gereklidir');
      return;
    }

    if (!post.content.trim()) {
      alert('İçerik gereklidir');
      return;
    }

    if (!post.topicId) {
      alert('Kategori seçmelisiniz');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/blog/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        trackEvent(AnalyticsEvent.BLOG_SUBMIT, { postId: data.id, status });
        
        if (status === 'pending') {
          alert('Yazınız incelemeye gönderildi. Onaylandıktan sonra yayınlanacak.');
          router.push('/blog');
        } else {
          router.push(`/blog/${data.slug}`);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Failed to submit post:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  if (preview) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Önizleme</h2>
          <button
            onClick={() => setPreview(false)}
            className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Düzenlemeye Dön
          </button>
        </div>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yazı Düzenleyici</h2>
          {saving && (
            <p className="text-sm text-gray-500 mt-1">Otomatik kaydediliyor...</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreview(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Önizleme
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Başlık *
          </label>
          <input
            id="title"
            type="text"
            value={post.title}
            onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Yazınızın başlığını girin..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>

        {/* Topic */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Kategori *
          </label>
          <select
            id="topic"
            value={post.topicId}
            onChange={(e) => setPost(prev => ({ ...prev, topicId: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Kategori seçin...</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiketler
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Etiket ekle..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Ekle
            </button>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İçerik *
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-2 bg-gray-50">
              <div className="flex space-x-2">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`px-3 py-1 text-sm rounded ${
                    editor?.isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <strong>B</strong>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`px-3 py-1 text-sm rounded ${
                    editor?.isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <em>I</em>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`px-3 py-1 text-sm rounded ${
                    editor?.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  H1
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`px-3 py-1 text-sm rounded ${
                    editor?.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  H2
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`px-3 py-1 text-sm rounded ${
                    editor?.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  • Liste
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`px-3 py-1 text-sm rounded ${
                    editor?.isActive('blockquote') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  " Alıntı
                </button>
              </div>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="px-6 py-3 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 disabled:opacity-50"
            >
              Taslak Olarak Kaydet
            </button>
            <button
              onClick={() => handleSubmit('pending')}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'İncelemeye Gönder'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Copy,
  Share2
} from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description,
  image
}) => {
  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || '');

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
    };

    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link kopyalandı!');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Paylaş:</span>
      <div className="flex gap-2">
        {[
          { icon: Facebook, name: 'facebook', color: 'blue-600' },
          { icon: Twitter, name: 'twitter', color: 'sky-600' },
          { icon: Linkedin, name: 'linkedin', color: 'blue-700' },
          { icon: MessageCircle, name: 'whatsapp', color: 'green-600' },
          { icon: Mail, name: 'email', color: 'gray-600' },
        ].map(({ icon: Icon, name, color }) => (
          <button
            key={name}
            onClick={() => handleShare(name)}
            className={`w-10 h-10 rounded-full bg-${color} text-white flex items-center justify-center hover:scale-110 transition-transform`}
            title={`${name.charAt(0).toUpperCase() + name.slice(1)}'da paylaş`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
        
        <button
          onClick={handleCopy}
          className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:scale-110 transition-transform"
          title="Linki kopyala"
        >
          <Copy className="w-5 h-5" />
        </button>

        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform"
            title="Paylaş"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

